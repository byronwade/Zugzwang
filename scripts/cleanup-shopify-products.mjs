#!/usr/bin/env node
/**
 * cleanup-shopify-products.mjs
 *
 * Removes all seeded products, collections, pages, and menus from the store.
 * Targets resources created by seed-shopify-products.mjs (tagged with 'seed:test').
 *
 * Usage:
 *   node scripts/cleanup-shopify-products.mjs
 *
 * Required env:
 *   SHOPIFY_STORE_DOMAIN
 *   SHOPIFY_ADMIN_ACCESS_TOKEN
 *
 * Required app scopes:
 *   write_products, write_content, write_online_store_navigation
 */

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
	gql,
	sleep,
	PerformanceTracker,
	pollBulkOperation,
	stagedUpload,
	runBulkMutation,
} from "./utils/shopify-helpers.mjs";

const STORE = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!STORE || !TOKEN) {
	console.error("❌ Missing environment variables:");
	console.error("   SHOPIFY_STORE_DOMAIN (or NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN)");
	console.error("   SHOPIFY_ADMIN_ACCESS_TOKEN");
	process.exit(1);
}

console.log("\n╔════════════════════════════════════════════════════════════╗");
console.log("║           Zugzwang Shopify Cleanup Script                 ║");
console.log("╠════════════════════════════════════════════════════════════╣");
console.log(`║ Store: ${STORE.padEnd(51)}║`);
console.log("╚════════════════════════════════════════════════════════════╝\n");

// ========== Query Functions ==========

async function getSeededProducts() {
	const query = `
    query GetSeededProducts($query: String!, $first: Int!, $after: String) {
      products(first: $first, after: $after, query: $query) {
        edges {
          node {
            id
            title
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `;

	const products = [];
	let hasNextPage = true;
	let cursor = null;

	while (hasNextPage) {
		const data = await gql(STORE, TOKEN, query, {
			query: "tag:seed:test",
			first: 250,
			after: cursor,
		});

		const edges = data.products.edges;
		products.push(...edges.map((e) => e.node));

		hasNextPage = data.products.pageInfo.hasNextPage;
		cursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

		process.stdout.write(`   Found ${products.length} products...\r`);
	}

	process.stdout.write("\n");
	return products;
}

async function getSeededCollections() {
	const query = `
    query GetCollections($first: Int!, $after: String) {
      collections(first: $first, after: $after) {
        edges {
          node {
            id
            handle
            title
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `;

	const collections = [];
	let hasNextPage = true;
	let cursor = null;

	while (hasNextPage) {
		const data = await gql(STORE, TOKEN, query, {
			first: 250,
			after: cursor,
		});

		const edges = data.collections.edges;

		// Filter for seeded collections by handle patterns
		const seededCollections = edges
			.map((e) => e.node)
			.filter(
				(col) =>
					col.handle.includes("electronics") ||
					col.handle.includes("fashion") ||
					col.handle.includes("home") ||
					col.handle.includes("sports") ||
					col.handle.includes("beauty") ||
					col.handle.includes("books") ||
					col.handle.includes("toys") ||
					col.handle.includes("automotive"),
			);

		collections.push(...seededCollections);

		hasNextPage = data.collections.pageInfo.hasNextPage;
		cursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

		process.stdout.write(`   Found ${collections.length} collections...\r`);
	}

	process.stdout.write("\n");
	return collections;
}

async function getSeededPages() {
	const query = `
    query GetPages($first: Int!, $after: String) {
      pages(first: $first, after: $after) {
        edges {
          node {
            id
            handle
            title
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `;

	const pages = [];
	let hasNextPage = true;
	let cursor = null;

	while (hasNextPage) {
		const data = await gql(STORE, TOKEN, query, {
			first: 250,
			after: cursor,
		});

		const edges = data.pages.edges;

		// Filter for seeded pages by handle patterns
		const seededPages = edges
			.map((e) => e.node)
			.filter(
				(page) =>
					page.handle === "about-us" ||
					page.handle === "customer-service" ||
					page.handle === "shipping-returns" ||
					page.handle === "deals" ||
					page.handle === "faq",
			);

		pages.push(...seededPages);

		hasNextPage = data.pages.pageInfo.hasNextPage;
		cursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

		process.stdout.write(`   Found ${pages.length} pages...\r`);
	}

	process.stdout.write("\n");
	return pages;
}

async function getSeededMenus() {
	const query = `
    query GetMenus {
      shop {
        navigationMenus(first: 20) {
          edges {
            node {
              id
              handle
              title
            }
          }
        }
      }
    }
  `;

	const data = await gql(STORE, TOKEN, query);
	const menus = data.shop.navigationMenus.edges.map((e) => e.node);

	// Filter for seeded menus
	const seededMenus = menus.filter((menu) => menu.handle === "zugzwang-main-nav");

	return seededMenus;
}

// ========== Deletion Functions ==========

async function deleteProductsBulk(productIds) {
	if (productIds.length === 0) {
		console.log("   No products to delete\n");
		return;
	}

	console.log(`🗑️  Deleting ${productIds.length} products...`);
	const tracker = new PerformanceTracker("Product Deletion");

	// Build JSONL for bulk deletion
	const lines = productIds.map((id) => JSON.stringify({ id }));
	const jsonl = lines.join("\n") + "\n";

	// Stage upload
	const stagedPath = await stagedUpload(STORE, TOKEN, "delete-products.jsonl", jsonl);
	tracker.incrementApiCalls();

	// Run bulk mutation
	const deleteMutation = `
    mutation BulkDelete($id: ID!) {
      productDelete(input: { id: $id }) {
        deletedProductId
        userErrors { field message }
      }
    }
  `;

	await runBulkMutation(STORE, TOKEN, deleteMutation, stagedPath);
	tracker.incrementApiCalls();

	// Poll until complete
	const result = await pollBulkOperation(STORE, TOKEN, "MUTATION");

	if (result.status !== "COMPLETED") {
		throw new Error(`Bulk delete failed: ${result.status} ${result.errorCode || ""}`);
	}

	tracker.report();
	console.log(`   ✓ Deleted ${result.objectCount} products\n`);
}

async function deleteCollections(collectionIds) {
	if (collectionIds.length === 0) {
		console.log("   No collections to delete\n");
		return;
	}

	console.log(`🗑️  Deleting ${collectionIds.length} collections...`);
	const tracker = new PerformanceTracker("Collection Deletion");

	const mutation = `
    mutation DeleteCollection($input: CollectionDeleteInput!) {
      collectionDelete(input: $input) {
        deletedCollectionId
        userErrors { field message }
      }
    }
  `;

	for (const id of collectionIds) {
		try {
			await gql(STORE, TOKEN, mutation, { input: { id } });
			tracker.incrementApiCalls();
			process.stdout.write(".");
		} catch (error) {
			console.error(`\n   Error deleting collection ${id}:`, error.message);
		}

		// Rate limiting: 2 calls per second
		if (tracker.apiCalls % 2 === 0) {
			await sleep(1000);
		}
	}

	process.stdout.write("\n");
	tracker.report();
}

async function deletePages(pageIds) {
	if (pageIds.length === 0) {
		console.log("   No pages to delete\n");
		return;
	}

	console.log(`🗑️  Deleting ${pageIds.length} pages...`);
	const tracker = new PerformanceTracker("Page Deletion");

	const mutation = `
    mutation DeletePage($id: ID!) {
      pageDelete(id: $id) {
        deletedPageId
        userErrors { field message }
      }
    }
  `;

	for (const id of pageIds) {
		try {
			await gql(STORE, TOKEN, mutation, { id });
			tracker.incrementApiCalls();
			process.stdout.write(".");
		} catch (error) {
			console.error(`\n   Error deleting page ${id}:`, error.message);
		}

		// Rate limiting
		if (tracker.apiCalls % 2 === 0) {
			await sleep(1000);
		}
	}

	process.stdout.write("\n");
	tracker.report();
}

async function deleteMenus(menuIds) {
	if (menuIds.length === 0) {
		console.log("   No menus to delete\n");
		return;
	}

	console.log(`🗑️  Deleting ${menuIds.length} menus...`);
	const tracker = new PerformanceTracker("Menu Deletion");

	const mutation = `
    mutation DeleteMenu($id: ID!) {
      menuDelete(id: $id) {
        deletedMenuId
        userErrors { field message }
      }
    }
  `;

	for (const id of menuIds) {
		try {
			await gql(STORE, TOKEN, mutation, { id });
			tracker.incrementApiCalls();
			process.stdout.write(".");
		} catch (error) {
			console.error(`\n   Error deleting menu ${id}:`, error.message);
		}
	}

	process.stdout.write("\n");
	tracker.report();
}

// ========== Main Execution ==========

async function main() {
	const overallTracker = new PerformanceTracker("Overall Cleanup");

	try {
		// Step 1: Find all seeded resources
		console.log("🔍 Finding seeded resources...\n");

		const [products, collections, pages, menus] = await Promise.all([
			getSeededProducts(),
			getSeededCollections(),
			getSeededPages(),
			getSeededMenus(),
		]);

		console.log("\n📊 Found seeded resources:");
		console.log(`   Products:    ${products.length}`);
		console.log(`   Collections: ${collections.length}`);
		console.log(`   Pages:       ${pages.length}`);
		console.log(`   Menus:       ${menus.length}\n`);

		if (
			products.length === 0 &&
			collections.length === 0 &&
			pages.length === 0 &&
			menus.length === 0
		) {
			console.log("✨ No seeded resources found. Store is already clean!\n");
			return;
		}

		// Step 2: Confirmation prompt
		const rl = readline.createInterface({ input, output });
		const answer = await rl.question(
			"⚠️  This will permanently delete all seeded data. Continue? (yes/no): ",
		);
		rl.close();

		if (answer.toLowerCase() !== "yes") {
			console.log("\n❌ Cleanup cancelled.\n");
			return;
		}

		console.log("");

		// Step 3: Delete resources
		await deleteProductsBulk(products.map((p) => p.id));
		await deleteCollections(collections.map((c) => c.id));
		await deletePages(pages.map((p) => p.id));
		await deleteMenus(menus.map((m) => m.id));

		// Final report
		overallTracker.report();

		console.log("╔════════════════════════════════════════════════════════════╗");
		console.log("║                    ✅ Cleanup Complete!                    ║");
		console.log("╠════════════════════════════════════════════════════════════╣");
		console.log(`║ Products Deleted:    ${products.length}`.padEnd(61) + "║");
		console.log(`║ Collections Deleted: ${collections.length}`.padEnd(61) + "║");
		console.log(`║ Pages Deleted:       ${pages.length}`.padEnd(61) + "║");
		console.log(`║ Menus Deleted:       ${menus.length}`.padEnd(61) + "║");
		console.log("╚════════════════════════════════════════════════════════════╝\n");
	} catch (error) {
		console.error("\n❌ Error during cleanup:");
		console.error(error.message);
		process.exit(1);
	}
}

main();
