#!/usr/bin/env node
/**
 * shopify-helpers.mjs
 *
 * Shared utility functions for Shopify Admin API bulk operations
 * Used by both seeding and cleanup scripts
 */

const API_VERSION = "2025-10";

/**
 * Make a GraphQL request to Shopify Admin API
 * @param {string} store - Store domain (e.g., "store.myshopify.com")
 * @param {string} token - Admin API access token
 * @param {string} query - GraphQL query/mutation string
 * @param {object} variables - GraphQL variables
 * @returns {Promise<object>} - Response data
 */
export async function gql(store, token, query, variables = {}) {
	const url = `https://${store}/admin/api/${API_VERSION}/graphql.json`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Shopify-Access-Token": token,
		},
		body: JSON.stringify({ query, variables }),
	});

	const json = await response.json();

	if (!response.ok || json.errors) {
		const errorMsg = json.errors ? JSON.stringify(json.errors, null, 2) : `HTTP ${response.status}`;
		throw new Error(`GraphQL error: ${errorMsg}\n${JSON.stringify(json, null, 2)}`);
	}

	return json.data;
}

/**
 * Sleep utility for polling
 * @param {number} ms - Milliseconds to sleep
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Convert string to URL-safe slug
 * @param {string} str - String to slugify
 * @returns {string} - Slugified string
 */
export function slugify(str) {
	return str
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}

/**
 * Pick random item from array
 * @param {Array} arr - Array to pick from
 * @returns {*} - Random item
 */
export function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
export function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate Lorem Picsum image URL with text overlay
 * @param {string} text - Text to overlay on image
 * @param {number} seed - Seed for consistent image
 * @param {number} width - Image width (default: 800)
 * @param {number} height - Image height (default: 800)
 * @returns {string} - Image URL
 */
export function generateProductImage(text, seed, width = 800, height = 800) {
	// Use Lorem Picsum with blur effect and specific seed
	const baseUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;

	// In production, you'd use a service like Cloudinary or imgix to add text overlay
	// For this demo, we return the base URL with a note about the overlay
	// The seed ensures consistent images for the same product
	return baseUrl;
}

/**
 * Stage upload for bulk operation
 * @param {string} store - Store domain
 * @param {string} token - Admin API access token
 * @param {string} filename - JSONL filename
 * @param {string} jsonlString - JSONL content
 * @returns {Promise<string>} - Staged upload path (S3 key)
 */
export async function stagedUpload(store, token, filename, jsonlString) {
	const stageMutation = `
    mutation Stage($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters { name value }
        }
        userErrors { field message }
      }
    }
  `;

	const stageVars = {
		input: [
			{
				resource: "BULK_MUTATION_VARIABLES",
				filename,
				mimeType: "text/jsonl",
				httpMethod: "POST",
			},
		],
	};

	const data = await gql(store, token, stageMutation, stageVars);
	const target = data.stagedUploadsCreate.stagedTargets?.[0];

	if (!target) {
		throw new Error(`stagedUploadsCreate failed: ${JSON.stringify(data.stagedUploadsCreate.userErrors)}`);
	}

	// Upload to S3
	const form = new FormData();
	for (const { name, value } of target.parameters) {
		form.append(name, value);
	}
	form.append("file", new Blob([jsonlString], { type: "text/jsonl" }), filename);

	const uploadRes = await fetch(target.url, { method: "POST", body: form });

	if (!uploadRes.ok) {
		const text = await uploadRes.text();
		throw new Error(`S3 upload failed: ${uploadRes.status} ${text}`);
	}

	// Return the staged upload path (S3 key)
	const keyParam = target.parameters.find((p) => p.name === "key");
	if (!keyParam) {
		throw new Error("Missing staged upload key parameter");
	}

	return keyParam.value;
}

/**
 * Run bulk operation mutation
 * @param {string} store - Store domain
 * @param {string} token - Admin API access token
 * @param {string} mutationString - GraphQL mutation string
 * @param {string} stagedUploadPath - Staged upload path from stagedUpload()
 * @returns {Promise<object>} - Bulk operation object
 */
export async function runBulkMutation(store, token, mutationString, stagedUploadPath) {
	const runMutation = `
    mutation RunBulk($mutation: String!, $stagedUploadPath: String!) {
      bulkOperationRunMutation(
        mutation: $mutation
        stagedUploadPath: $stagedUploadPath
      ) {
        bulkOperation { id status }
        userErrors { field message }
      }
    }
  `;

	const data = await gql(store, token, runMutation, {
		mutation: mutationString,
		stagedUploadPath,
	});

	const payload = data.bulkOperationRunMutation;

	if (payload.userErrors?.length) {
		throw new Error(`bulkOperationRunMutation error: ${JSON.stringify(payload.userErrors)}`);
	}

	return payload.bulkOperation;
}

/**
 * Poll bulk operation until complete
 * @param {string} store - Store domain
 * @param {string} token - Admin API access token
 * @param {string} type - Bulk operation type (MUTATION or QUERY)
 * @returns {Promise<object>} - Completed bulk operation
 */
export async function pollBulkOperation(store, token, type = "MUTATION") {
	const query = `
    query CurrentBulk($type: BulkOperationType) {
      currentBulkOperation(type: $type) {
        id
        status
        errorCode
        objectCount
        url
        partialDataUrl
        createdAt
      }
    }
  `;

	let lastStatus = "";
	let dots = 0;

	while (true) {
		const data = await gql(store, token, query, { type });
		const op = data.currentBulkOperation;

		if (!op) {
			throw new Error("No current bulk operation found");
		}

		// Show progress
		if (op.status !== lastStatus) {
			process.stdout.write(`\n   Status: ${op.status}`);
			lastStatus = op.status;
			dots = 0;
		} else {
			process.stdout.write(".");
			dots++;
			if (dots > 50) {
				process.stdout.write("\n   ");
				dots = 0;
			}
		}

		if (op.status === "COMPLETED" || op.status === "FAILED" || op.status === "CANCELED") {
			process.stdout.write("\n");
			return op;
		}

		await sleep(2000);
	}
}

/**
 * Download JSONL from bulk operation result URL
 * @param {string} url - Result URL from bulk operation
 * @returns {Promise<string>} - JSONL content
 */
export async function downloadJsonl(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download JSONL: ${response.status}`);
	}
	return await response.text();
}

/**
 * Performance metrics tracker
 */
export class PerformanceTracker {
	constructor(label) {
		this.label = label;
		this.startTime = Date.now();
		this.startMemory = process.memoryUsage();
		this.apiCalls = 0;
	}

	incrementApiCalls() {
		this.apiCalls++;
	}

	report() {
		const endTime = Date.now();
		const endMemory = process.memoryUsage();
		const duration = endTime - this.startTime;

		const heapUsedDiff = endMemory.heapUsed - this.startMemory.heapUsed;
		const heapUsedDiffMB = (heapUsedDiff / 1024 / 1024).toFixed(2);

		console.log("\n╔════════════════════════════════════════════════════════════╗");
		console.log(`║ 📊 Performance Report: ${this.label.padEnd(33)}║`);
		console.log("╠════════════════════════════════════════════════════════════╣");
		console.log(`║ Duration:      ${(duration / 1000).toFixed(2)}s`.padEnd(61) + "║");
		console.log(`║ API Calls:     ${this.apiCalls}`.padEnd(61) + "║");
		console.log(`║ Memory Change: ${heapUsedDiffMB}MB`.padEnd(61) + "║");
		console.log("╚════════════════════════════════════════════════════════════╝\n");
	}
}

/**
 * Generate realistic product data for e-commerce
 * @param {number} index - Product index
 * @param {object} department - Department object with title, tag, subcats
 * @param {string} subTag - Subcategory tag
 * @returns {object} - Product input for GraphQL
 */
export function generateProductData(index, department, subTag) {
	const brands = [
		"TechFlow",
		"Urban Style",
		"HomeEssentials",
		"SportMax",
		"Beauty Pro",
		"KidZone",
		"AutoParts Plus",
		"BookNook",
	];

	const adjectives = ["Premium", "Pro", "Ultra", "Max", "Elite", "Classic", "Modern", "Deluxe", "Essential", "Smart"];

	const nouns = {
		Electronics: [
			"Wireless Headphones",
			"Bluetooth Speaker",
			"Smart Watch",
			"Tablet",
			"USB Hub",
			"Power Bank",
			"Camera",
			"Keyboard",
		],
		Fashion: ["T-Shirt", "Jeans", "Sneakers", "Jacket", "Dress", "Hoodie", "Backpack", "Sunglasses"],
		Home: [
			"Coffee Maker",
			"Blender",
			"Vacuum Cleaner",
			"Air Purifier",
			"Desk Lamp",
			"Storage Bins",
			"Cookware Set",
			"Bedding Set",
		],
		Sports: [
			"Yoga Mat",
			"Dumbbells",
			"Water Bottle",
			"Running Shoes",
			"Resistance Bands",
			"Jump Rope",
			"Gym Bag",
			"Fitness Tracker",
		],
		Beauty: [
			"Face Cream",
			"Shampoo",
			"Makeup Brush Set",
			"Nail Polish",
			"Hair Dryer",
			"Facial Cleanser",
			"Body Lotion",
			"Perfume",
		],
		Books: [
			"Mystery Novel",
			"Sci-Fi Paperback",
			"Cookbook",
			"Self-Help Guide",
			"Biography",
			"Children's Book",
			"Graphic Novel",
			"Journal",
		],
		Toys: [
			"Action Figure",
			"Puzzle",
			"Board Game",
			"Building Blocks",
			"Doll",
			"RC Car",
			"Art Supplies",
			"Stuffed Animal",
		],
		Auto: [
			"Car Phone Mount",
			"Dash Cam",
			"Floor Mats",
			"Air Freshener",
			"Tool Kit",
			"Jump Starter",
			"Seat Covers",
			"Tire Gauge",
		],
	};

	const deptKey = department.title.split(" ")[0]; // First word
	const productNouns = nouns[deptKey] || nouns.Electronics;

	const title = `${pick(adjectives)} ${pick(productNouns)} ${1000 + index}`;
	const price = (Math.random() * 450 + 10).toFixed(2);
	const compareAtPrice = Math.random() > 0.7 ? (Number(price) * 1.2).toFixed(2) : null;

	// Generate variants (size, color, material)
	const variantOptions = generateVariantOptions(deptKey);
	const variants = generateVariants(variantOptions, price, index);

	// Generate metafields
	const metafields = [
		{
			namespace: "custom",
			key: "rating",
			value: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
			type: "number_decimal",
		},
		{
			namespace: "custom",
			key: "featured",
			value: (Math.random() > 0.8).toString(),
			type: "boolean",
		},
		{
			namespace: "custom",
			key: "specifications",
			value: JSON.stringify({
				weight: `${(Math.random() * 10 + 0.5).toFixed(1)} lbs`,
				dimensions: `${randomInt(5, 20)}"x${randomInt(5, 20)}"x${randomInt(2, 10)}"`,
				warranty: pick(["1 Year", "2 Years", "Lifetime", "30 Days"]),
			}),
			type: "json",
		},
	];

	const input = {
		title,
		vendor: pick(brands),
		productType: department.title,
		status: "ACTIVE",
		descriptionHtml: `<p><strong>${title}</strong> - High-quality ${deptKey.toLowerCase()} product designed for performance and durability. Perfect for everyday use.</p><p>Features include excellent craftsmanship, reliable performance, and great value.</p>`,
		productOptions: variantOptions.map((opt, idx) => ({
			name: opt.name,
			position: idx + 1,
			values: opt.values.map((v) => ({ name: v })),
		})),
		variants,
		tags: [
			department.tag,
			subTag,
			"seed:test", // Tag for cleanup
			...(Math.random() > 0.7 ? ["featured"] : []),
			...(Math.random() > 0.8 ? ["sale"] : []),
		],
		seo: {
			title: `${title} - ${department.title}`,
			description: `Shop ${title}. High-quality ${deptKey.toLowerCase()} at great prices. Free shipping available.`,
		},
		metafields,
	};

	return input;
}

/**
 * Generate variant options based on department
 * @param {string} deptKey - Department key
 * @returns {Array} - Array of option objects
 */
function generateVariantOptions(deptKey) {
	const optionsByDept = {
		Electronics: [
			{ name: "Color", values: ["Black", "White", "Silver", "Blue"] },
			{ name: "Storage", values: ["64GB", "128GB", "256GB"] },
		],
		Fashion: [
			{ name: "Size", values: ["XS", "S", "M", "L", "XL", "XXL"] },
			{ name: "Color", values: ["Black", "Navy", "Gray", "White", "Red"] },
		],
		Home: [
			{ name: "Color", values: ["White", "Black", "Stainless", "Red"] },
			{ name: "Size", values: ["Small", "Medium", "Large"] },
		],
		Sports: [
			{ name: "Size", values: ["Small", "Medium", "Large"] },
			{ name: "Color", values: ["Black", "Blue", "Red", "Green"] },
		],
		Beauty: [{ name: "Size", values: ["Travel", "Regular", "Value"] }],
		Books: [{ name: "Format", values: ["Paperback", "Hardcover", "Ebook"] }],
		Toys: [
			{ name: "Age", values: ["3+", "5+", "8+", "12+"] },
			{ name: "Color", values: ["Multi", "Red", "Blue", "Pink"] },
		],
		Auto: [{ name: "Variant", values: ["Standard", "Deluxe", "Premium"] }],
	};

	const options = optionsByDept[deptKey] || optionsByDept.Electronics;

	// Randomly use 1-2 options
	return Math.random() > 0.5 ? [options[0]] : options.slice(0, 2);
}

/**
 * Generate product variants
 * @param {Array} options - Variant options
 * @param {string} basePrice - Base price
 * @param {number} seed - Seed for image generation
 * @returns {Array} - Array of variant objects
 */
function generateVariants(options, basePrice, seed) {
	const variants = [];

	if (options.length === 1) {
		// Single option
		options[0].values.forEach((value, idx) => {
			const price = (Number(basePrice) + idx * 5).toFixed(2);
			// Simplified variant for API 2025-10 - only basic fields
			variants.push({
				optionValues: [{ optionName: options[0].name, name: value }],
				price: Number(price),
				compareAtPrice: Math.random() > 0.7 ? Number(price) * 1.15 : null,
				sku: `SKU-${seed}-${idx}`,
				barcode: `${seed}${String(idx).padStart(8, "0")}`,
				taxable: true,
			});
		});
	} else if (options.length === 2) {
		// Two options (combinations)
		let idx = 0;
		options[0].values.forEach((value1) => {
			options[1].values.forEach((value2) => {
				const price = (Number(basePrice) + idx * 3).toFixed(2);
				// Simplified variant for API 2025-10 - only basic fields
				variants.push({
					optionValues: [
						{ optionName: options[0].name, name: value1 },
						{ optionName: options[1].name, name: value2 },
					],
					price: Number(price),
					compareAtPrice: Math.random() > 0.7 ? Number(price) * 1.15 : null,
					sku: `SKU-${seed}-${idx}`,
					barcode: `${seed}${String(idx).padStart(8, "0")}`,
					taxable: true,
				});
				idx++;
			});
		});
	}

	return variants;
}
