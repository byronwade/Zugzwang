#!/usr/bin/env node
/**
 * seed-shopify-products.mjs
 *
 * Bulk creates products, collections, pages, and navigation for stress testing
 * Zugzwang storefront with realistic e-commerce data.
 *
 * Features:
 * - General e-commerce product mix (Electronics, Fashion, Home, Sports, etc.)
 * - Product variants (size, color, material) - 1-8 variants per product
 * - Lorem Picsum images with product identification
 * - Random inventory levels (0-500 units per variant)
 * - Custom metafields (rating, featured, specs)
 * - Performance metrics tracking
 * - Smart collections (tag-based auto-population)
 * - Content pages (automatically visible in Storefront API)
 * - Nested navigation menu
 * - Bulk publish products and collections to Online Store
 *
 * Usage:
 *   PRODUCT_COUNT=1000 node scripts/seed-shopify-products.mjs
 *
 * Required env:
 *   SHOPIFY_STORE_DOMAIN
 *   SHOPIFY_ADMIN_ACCESS_TOKEN
 *
 * Required app scopes:
 *   write_products, write_publications, write_online_store_navigation, write_content
 */

import fs from "node:fs/promises";
import {
	gql,
	sleep,
	slugify,
	pick,
	stagedUpload,
	runBulkMutation,
	pollBulkOperation,
	downloadJsonl,
	PerformanceTracker,
	generateProductData,
} from "./utils/shopify-helpers.mjs";

const STORE = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const PRODUCT_COUNT = Number(process.env.PRODUCT_COUNT || 1000);

if (!STORE || !TOKEN) {
	console.error("❌ Missing environment variables:");
	console.error("   SHOPIFY_STORE_DOMAIN (or NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN)");
	console.error("   SHOPIFY_ADMIN_ACCESS_TOKEN");
	process.exit(1);
}

console.log("\n╔════════════════════════════════════════════════════════════╗");
console.log("║           Zugzwang Shopify Product Seeder                 ║");
console.log("╠════════════════════════════════════════════════════════════╣");
console.log(`║ Store:    ${STORE.padEnd(48)}║`);
console.log(`║ Products: ${String(PRODUCT_COUNT).padEnd(48)}║`);
console.log("╚════════════════════════════════════════════════════════════╝\n");

// ========== Department & Category Taxonomy ==========

const DEPARTMENTS = [
	{
		title: "Electronics",
		tag: "dept:electronics",
		subcats: [
			{ title: "Audio", tag: "cat:electronics:audio" },
			{ title: "Computers", tag: "cat:electronics:computers" },
			{ title: "Cameras", tag: "cat:electronics:cameras" },
			{ title: "Accessories", tag: "cat:electronics:accessories" },
		],
	},
	{
		title: "Fashion & Apparel",
		tag: "dept:fashion",
		subcats: [
			{ title: "Men's Clothing", tag: "cat:fashion:mens" },
			{ title: "Women's Clothing", tag: "cat:fashion:womens" },
			{ title: "Shoes", tag: "cat:fashion:shoes" },
			{ title: "Accessories", tag: "cat:fashion:accessories" },
		],
	},
	{
		title: "Home & Garden",
		tag: "dept:home",
		subcats: [
			{ title: "Kitchen", tag: "cat:home:kitchen" },
			{ title: "Bedroom", tag: "cat:home:bedroom" },
			{ title: "Garden", tag: "cat:home:garden" },
			{ title: "Decor", tag: "cat:home:decor" },
		],
	},
	{
		title: "Sports & Outdoors",
		tag: "dept:sports",
		subcats: [
			{ title: "Fitness", tag: "cat:sports:fitness" },
			{ title: "Cycling", tag: "cat:sports:cycling" },
			{ title: "Camping", tag: "cat:sports:camping" },
			{ title: "Water Sports", tag: "cat:sports:water" },
		],
	},
	{
		title: "Beauty & Personal Care",
		tag: "dept:beauty",
		subcats: [
			{ title: "Skincare", tag: "cat:beauty:skincare" },
			{ title: "Makeup", tag: "cat:beauty:makeup" },
			{ title: "Hair Care", tag: "cat:beauty:hair" },
			{ title: "Fragrance", tag: "cat:beauty:fragrance" },
		],
	},
	{
		title: "Books & Media",
		tag: "dept:books",
		subcats: [
			{ title: "Fiction", tag: "cat:books:fiction" },
			{ title: "Non-Fiction", tag: "cat:books:nonfiction" },
			{ title: "Children's", tag: "cat:books:children" },
			{ title: "Ebooks", tag: "cat:books:ebooks" },
		],
	},
	{
		title: "Toys & Games",
		tag: "dept:toys",
		subcats: [
			{ title: "Action Figures", tag: "cat:toys:action" },
			{ title: "Board Games", tag: "cat:toys:board" },
			{ title: "Educational", tag: "cat:toys:educational" },
			{ title: "Outdoor Play", tag: "cat:toys:outdoor" },
		],
	},
	{
		title: "Automotive",
		tag: "dept:auto",
		subcats: [
			{ title: "Interior", tag: "cat:auto:interior" },
			{ title: "Exterior", tag: "cat:auto:exterior" },
			{ title: "Tools", tag: "cat:auto:tools" },
			{ title: "Electronics", tag: "cat:auto:electronics" },
		],
	},
];

const PAGES = [
	{
		title: "About Us",
		handle: "about-us",
		bodyHtml:
			"<h1>About Zugzwang</h1><p>Welcome to Zugzwang - your premier destination for quality products across all categories. We're committed to delivering exceptional value and outstanding customer service.</p><p>Founded with a passion for innovation, we curate the best products from around the world to bring you an unmatched shopping experience.</p>",
	},
	{
		title: "Customer Service",
		handle: "customer-service",
		bodyHtml:
			"<h1>Customer Service</h1><p>We're here to help! Our dedicated support team is available 24/7 to assist with any questions or concerns.</p><ul><li>📧 Email: support@zugzwang.com</li><li>📞 Phone: 1-800-ZUGZWANG</li><li>💬 Live Chat: Available on our website</li></ul>",
	},
	{
		title: "Shipping & Returns",
		handle: "shipping-returns",
		bodyHtml:
			"<h1>Shipping & Returns</h1><h2>Shipping</h2><p>Free shipping on orders over $50. Standard delivery 3-5 business days.</p><h2>Returns</h2><p>30-day money-back guarantee. Return any item for a full refund within 30 days of purchase.</p>",
	},
	{
		title: "Deals & Promotions",
		handle: "deals",
		bodyHtml:
			"<h1>Deals & Promotions</h1><p>Check back regularly for our latest deals and special offers. Save big on your favorite products!</p><p>Sign up for our newsletter to get exclusive discount codes and early access to sales.</p>",
	},
	{
		title: "FAQ",
		handle: "faq",
		bodyHtml:
			"<h1>Frequently Asked Questions</h1><h2>How do I track my order?</h2><p>You'll receive a tracking number via email once your order ships.</p><h2>What payment methods do you accept?</h2><p>We accept all major credit cards, PayPal, and Apple Pay.</p><h2>Do you ship internationally?</h2><p>Yes! We ship to over 100 countries worldwide.</p>",
	},
];

// ========== Smart Collection Creation ==========

async function createSmartCollection({ title, handle, matchTag }) {
	const mutation = `
    mutation CreateSmartCollection($input: CollectionInput!) {
      collectionCreate(input: $input) {
        collection { id handle title }
        userErrors { field message }
      }
    }
  `;

	const input = {
		title,
		handle,
		ruleSet: {
			appliedDisjunctively: true,
			rules: [
				{
					column: "TAG",
					relation: "EQUALS",
					condition: matchTag,
				},
			],
		},
		sortOrder: "BEST_SELLING",
	};

	const data = await gql(STORE, TOKEN, mutation, { input });
	const payload = data.collectionCreate;

	if (payload.userErrors?.length) {
		throw new Error(
			`collectionCreate error for ${title}: ${JSON.stringify(payload.userErrors)}`,
		);
	}

	return payload.collection;
}

async function createAllCollections() {
	console.log("📁 Creating smart collections...");
	const tracker = new PerformanceTracker("Collection Creation");
	const created = { departments: {}, subcategories: {} };

	// Create department collections
	for (const dept of DEPARTMENTS) {
		const handle = slugify(dept.title);
		const col = await createSmartCollection({
			title: dept.title,
			handle,
			matchTag: dept.tag,
		});
		created.departments[dept.title] = col;
		tracker.incrementApiCalls();
		process.stdout.write(".");
	}

	// Create subcategory collections
	for (const dept of DEPARTMENTS) {
		for (const sub of dept.subcats) {
			const handle = slugify(`${dept.title}-${sub.title}`);
			const col = await createSmartCollection({
				title: `${dept.title} · ${sub.title}`,
				handle,
				matchTag: sub.tag,
			});
			created.subcategories[sub.title] = col;
			tracker.incrementApiCalls();
			process.stdout.write(".");
		}
	}

	process.stdout.write("\n");
	tracker.report();

	return created;
}

// ========== Page Creation ==========

async function createPage({ title, handle, bodyHtml }) {
	const mutation = `
    mutation CreatePage($page: PageCreateInput!) {
      pageCreate(page: $page) {
        page { id handle title }
        userErrors { field message }
      }
    }
  `;

	const variables = {
		page: {
			title,
			handle,
			body: bodyHtml, // API 2025-10 uses 'body' instead of 'bodyHtml'
		},
	};

	const data = await gql(STORE, TOKEN, mutation, variables);
	const payload = data.pageCreate;

	if (payload.userErrors?.length) {
		throw new Error(`pageCreate error for ${title}: ${JSON.stringify(payload.userErrors)}`);
	}

	return payload.page;
}

async function createAllPages() {
	console.log("📄 Creating content pages...");
	const tracker = new PerformanceTracker("Page Creation");
	const pagesMap = {};

	for (const page of PAGES) {
		pagesMap[page.title] = await createPage(page);
		tracker.incrementApiCalls();
		process.stdout.write(".");
	}

	process.stdout.write("\n");
	tracker.report();

	return pagesMap;
}

// ========== Product JSONL Generation ==========

function buildProductJSONL(count) {
	console.log(`📦 Generating ${count} product records...`);
	const lines = [];

	// Distribute products evenly across departments
	const deptTags = DEPARTMENTS.map((d) => d.tag);
	const allSubTags = DEPARTMENTS.flatMap((d) => d.subcats.map((s) => s.tag));

	for (let i = 0; i < count; i++) {
		const deptIndex = i % DEPARTMENTS.length;
		const department = DEPARTMENTS[deptIndex];
		const subTag = pick(department.subcats.map((s) => s.tag));

		const input = generateProductData(i, department, subTag);
		lines.push(JSON.stringify({ input }));

		if ((i + 1) % 100 === 0) {
			process.stdout.write(`   ${i + 1} / ${count}\r`);
		}
	}

	process.stdout.write(`   ${count} / ${count} ✓\n`);

	return lines.join("\n") + "\n";
}

// ========== Navigation Menu Creation ==========

async function createMainMenu(collectionsMap, pagesMap) {
	console.log("🧭 Creating navigation menu...");
	const tracker = new PerformanceTracker("Menu Creation");

	const getDeptCol = (title) => collectionsMap.departments[title]?.id;
	const getSubcatColByTitle = (title) => collectionsMap.subcategories[title]?.id;

	const items = [
		{
			title: "Shop by Category",
			type: "CATALOG",
			items: DEPARTMENTS.map((dept) => ({
				title: dept.title,
				type: "COLLECTION",
				resourceId: getDeptCol(dept.title),
				items: dept.subcats.map((sub) => ({
					title: sub.title,
					type: "COLLECTION",
					resourceId: getSubcatColByTitle(sub.title),
				})),
			})),
		},
		{
			title: "Deals",
			type: "PAGE",
			resourceId: pagesMap["Deals & Promotions"].id,
		},
		{
			title: "Customer Service",
			type: "PAGE",
			resourceId: pagesMap["Customer Service"].id,
		},
		{
			title: "Shipping & Returns",
			type: "PAGE",
			resourceId: pagesMap["Shipping & Returns"].id,
		},
		{
			title: "FAQ",
			type: "PAGE",
			resourceId: pagesMap["FAQ"].id,
		},
		{
			title: "About",
			type: "PAGE",
			resourceId: pagesMap["About Us"].id,
		},
	];

	const mutation = `
    mutation CreateMenu($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
      menuCreate(title: $title, handle: $handle, items: $items) {
        menu { id handle }
        userErrors { field message }
      }
    }
  `;

	const variables = {
		title: "Zugzwang Main Navigation",
		handle: "zugzwang-main-nav",
		items,
	};

	const data = await gql(STORE, TOKEN, mutation, variables);
	const payload = data.menuCreate;

	if (payload.userErrors?.length) {
		throw new Error(`menuCreate error: ${JSON.stringify(payload.userErrors)}`);
	}

	tracker.incrementApiCalls();
	tracker.report();

	return payload.menu;
}

// ========== Online Store Publication ==========

async function getOnlineStorePublicationId() {
	const query = `
    query GetPubs {
      publications(first: 10) {
        edges { node { id name } }
      }
    }
  `;

	const data = await gql(STORE, TOKEN, query);
	const pubs = data.publications.edges.map((e) => e.node);
	const online = pubs.find((p) => (p.name || "").toLowerCase().includes("online"));

	if (!online) {
		throw new Error(`No 'Online Store' publication found. Found: ${pubs.map((p) => p.name).join(", ")}`);
	}

	return online.id;
}

function buildPublishJsonl({ productIds, collectionIds, pageIds, publicationId }) {
	const lineFor = (gid) =>
		JSON.stringify({
			id: gid,
			input: [{ publicationId }],
		});

	const lines = [
		...productIds.map(lineFor),
		...collectionIds.map(lineFor),
		...pageIds.map(lineFor),
	];

	return lines.join("\n") + "\n";
}

// ========== Main Execution ==========

async function main() {
	const overallTracker = new PerformanceTracker("Overall Seeding");

	try {
		// Step 1: Create collections
		const collectionsMap = await createAllCollections();
		const allCollectionIds = [
			...Object.values(collectionsMap.departments).map((c) => c.id),
			...Object.values(collectionsMap.subcategories).map((c) => c.id),
		];

		// Step 2: Create pages
		const pagesMap = await createAllPages();
		const allPageIds = Object.values(pagesMap).map((p) => p.id);

		// Step 3: Build product JSONL
		const productsJsonl = buildProductJSONL(PRODUCT_COUNT);
		await fs.writeFile("products.jsonl", productsJsonl, "utf8");
		console.log("   ✓ Saved products.jsonl for debugging\n");

		// Step 4: Stage and upload products
		console.log("☁️  Staging JSONL upload...");
		const stagedPath = await stagedUpload(STORE, TOKEN, "products.jsonl", productsJsonl);
		console.log("   ✓ Staged at:", stagedPath, "\n");
		overallTracker.incrementApiCalls();

		// Step 5: Run bulk productSet mutation
		console.log("⚙️  Running bulk productSet...");
		const productSetMutation = `
      mutation ProductSetBulk($input: ProductSetInput!) {
        productSet(input: $input) {
          product { id }
          userErrors { field message }
        }
      }
    `;
		await runBulkMutation(STORE, TOKEN, productSetMutation, stagedPath);
		overallTracker.incrementApiCalls();

		// Step 6: Poll bulk operation
		console.log("⏳ Polling bulk operation...");
		const opResult = await pollBulkOperation(STORE, TOKEN, "MUTATION");

		if (opResult.status !== "COMPLETED") {
			throw new Error(
				`Bulk mutation failed: ${opResult.status} ${opResult.errorCode || ""}`,
			);
		}

		console.log(`   ✓ Created ${opResult.objectCount} records\n`);

		// Step 7: Download and parse product IDs
		console.log("📥 Downloading result JSONL...");
		const resultText = await downloadJsonl(opResult.url);
		const productIds = [];

		for (const line of resultText.trim().split("\n")) {
			try {
				const obj = JSON.parse(line);
				const id =
					obj?.data?.productSet?.product?.id || obj?.data?.productCreate?.product?.id;
				if (id) productIds.push(id);
			} catch {
				// Ignore malformed lines
			}
		}

		console.log(`   ✓ Captured ${productIds.length} product IDs\n`);

		// Step 8: Get Online Store publication
		console.log("🏪 Getting Online Store publication...");
		const publicationId = await getOnlineStorePublicationId();
		console.log("   ✓ Publication ID:", publicationId, "\n");
		overallTracker.incrementApiCalls();

		// Step 9: Build publish JSONL
		console.log("📝 Building publish JSONL...");
		const publishJsonl = buildPublishJsonl({
			productIds,
			collectionIds: allCollectionIds,
			pageIds: allPageIds,
			publicationId,
		});
		await fs.writeFile("publish.jsonl", publishJsonl, "utf8");
		console.log("   ✓ Saved publish.jsonl for debugging\n");

		// Step 10: Stage publish JSONL
		console.log("☁️  Staging publish JSONL...");
		const publishStaged = await stagedUpload(STORE, TOKEN, "publish.jsonl", publishJsonl);
		console.log("   ✓ Staged at:", publishStaged, "\n");
		overallTracker.incrementApiCalls();

		// Step 11: Run bulk publishablePublish
		console.log("⚙️  Running bulk publishablePublish...");
		const bulkPublishMutation = `
      mutation BulkPublish($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          publishable {
            __typename
            ... on Product { id }
            ... on Collection { id }
            ... on Page { id }
          }
          userErrors { field message }
        }
      }
    `;
		await runBulkMutation(STORE, TOKEN, bulkPublishMutation, publishStaged);
		overallTracker.incrementApiCalls();

		// Step 12: Poll publish operation
		console.log("⏳ Polling publish operation...");
		const pubResult = await pollBulkOperation(STORE, TOKEN, "MUTATION");

		if (pubResult.status !== "COMPLETED") {
			throw new Error(`Bulk publish failed: ${pubResult.status} ${pubResult.errorCode || ""}`);
		}

		console.log("   ✓ Published all resources\n");

		// Step 13: Create navigation menu
		const menu = await createMainMenu(collectionsMap, pagesMap);
		console.log(`   ✓ Created menu: ${menu.handle}\n`);

		// Final report
		overallTracker.report();

		console.log("╔════════════════════════════════════════════════════════════╗");
		console.log("║                    ✅ Seeding Complete!                    ║");
		console.log("╠════════════════════════════════════════════════════════════╣");
		console.log(`║ Products:    ${productIds.length}`.padEnd(61) + "║");
		console.log(`║ Collections: ${allCollectionIds.length}`.padEnd(61) + "║");
		console.log(`║ Pages:       ${Object.keys(pagesMap).length}`.padEnd(61) + "║");
		console.log(`║ Menu:        ${menu.handle}`.padEnd(61) + "║");
		console.log("╠════════════════════════════════════════════════════════════╣");
		console.log("║ Next Steps:                                                ║");
		console.log("║ 1. Set theme header menu to 'zugzwang-main-nav'            ║");
		console.log("║ 2. Visit your storefront to see the products               ║");
		console.log("║ 3. Run 'npm run cleanup:shopify' to remove test data       ║");
		console.log("╚════════════════════════════════════════════════════════════╝\n");
	} catch (error) {
		console.error("\n❌ Error during seeding:");
		console.error(error.message);
		process.exit(1);
	}
}

main();
