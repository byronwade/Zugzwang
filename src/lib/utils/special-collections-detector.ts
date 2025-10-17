/**
 * Special Collections Detector
 *
 * Automatically identifies high-value collections that should be featured
 * prominently in navigation (Sales, Deals, Best Sellers, etc.)
 */

import type { ShopifyCollection } from "@/lib/types";

export type SpecialCollectionType = "sale" | "deals" | "best-sellers" | "new-arrivals" | "featured" | "clearance";

export type SpecialCollection = {
	type: SpecialCollectionType;
	collection: ShopifyCollection;
	priority: number; // Lower number = higher priority
	label: string; // Display label
	icon?: string; // Optional icon name
};

/**
 * Keywords to identify each special collection type
 */
const COLLECTION_KEYWORDS: Record<SpecialCollectionType, string[]> = {
	sale: ["sale", "sales", "on sale", "discount", "discounted"],
	deals: ["deal", "deals", "offer", "offers", "special", "specials"],
	"best-sellers": ["best seller", "best-seller", "bestseller", "best selling", "top seller", "popular"],
	"new-arrivals": ["new arrival", "new-arrival", "new", "just in", "latest", "recently added"],
	featured: ["featured", "spotlight", "highlight", "curated"],
	clearance: ["clearance", "closeout", "final sale", "last chance"],
};

/**
 * Priority order for special collections (lower = more prominent)
 */
const COLLECTION_PRIORITY: Record<SpecialCollectionType, number> = {
	sale: 1,
	deals: 2,
	"best-sellers": 3,
	"new-arrivals": 4,
	featured: 5,
	clearance: 6,
};

/**
 * Display labels for each collection type
 */
const COLLECTION_LABELS: Record<SpecialCollectionType, string> = {
	sale: "Sale",
	deals: "Deals",
	"best-sellers": "Best Sellers",
	"new-arrivals": "New Arrivals",
	featured: "Featured",
	clearance: "Clearance",
};

/**
 * Icon suggestions for each collection type (Lucide React icons)
 */
const COLLECTION_ICONS: Record<SpecialCollectionType, string> = {
	sale: "Tag",
	deals: "Zap",
	"best-sellers": "TrendingUp",
	"new-arrivals": "Sparkles",
	featured: "Star",
	clearance: "Percent",
};

/**
 * Check if a collection matches a special type based on its title
 */
function matchesCollectionType(collection: ShopifyCollection, type: SpecialCollectionType): boolean {
	const title = collection.title.toLowerCase();
	const handle = collection.handle.toLowerCase();
	const keywords = COLLECTION_KEYWORDS[type];

	return keywords.some((keyword) => title.includes(keyword) || handle.includes(keyword));
}

/**
 * Detect the type of a special collection
 */
function detectCollectionType(collection: ShopifyCollection): SpecialCollectionType | null {
	// Check each type in priority order
	const types: SpecialCollectionType[] = [
		"sale",
		"deals",
		"best-sellers",
		"new-arrivals",
		"featured",
		"clearance",
	];

	for (const type of types) {
		if (matchesCollectionType(collection, type)) {
			return type;
		}
	}

	return null;
}

/**
 * Identify all special collections from a list
 */
export function detectSpecialCollections(collections: ShopifyCollection[]): SpecialCollection[] {
	const specialCollections: SpecialCollection[] = [];
	const seenTypes = new Set<SpecialCollectionType>();

	for (const collection of collections) {
		const type = detectCollectionType(collection);

		// Only include first match of each type (avoid duplicates)
		if (type && !seenTypes.has(type)) {
			seenTypes.add(type);
			specialCollections.push({
				type,
				collection,
				priority: COLLECTION_PRIORITY[type],
				label: COLLECTION_LABELS[type],
				icon: COLLECTION_ICONS[type],
			});
		}
	}

	// Sort by priority (lower number first)
	return specialCollections.sort((a, b) => a.priority - b.priority);
}

/**
 * Get a specific special collection by type
 */
export function getSpecialCollection(
	collections: ShopifyCollection[],
	type: SpecialCollectionType
): ShopifyCollection | null {
	for (const collection of collections) {
		if (matchesCollectionType(collection, type)) {
			return collection;
		}
	}
	return null;
}

/**
 * Check if any special collections exist
 */
export function hasSpecialCollections(collections: ShopifyCollection[]): boolean {
	return collections.some((collection) => detectCollectionType(collection) !== null);
}

/**
 * Get labels for special collections (for display purposes)
 */
export function getSpecialCollectionLabel(type: SpecialCollectionType): string {
	return COLLECTION_LABELS[type];
}

/**
 * Get icon name for special collection type
 */
export function getSpecialCollectionIcon(type: SpecialCollectionType): string {
	return COLLECTION_ICONS[type];
}
