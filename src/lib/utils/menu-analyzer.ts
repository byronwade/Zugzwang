/**
 * Menu Analyzer - Intelligent Menu Sizing System
 *
 * This utility analyzes your store's content (collections, pages, menu items)
 * and determines the optimal menu structure and complexity level.
 *
 * Store Sizes:
 * - MINIMAL: < 3 collections, < 3 pages, < 5 menu items
 * - SMALL: 3-7 collections, 3-10 pages, 5-10 menu items
 * - MEDIUM: 8-15 collections, 11-20 pages, 11-20 menu items
 * - LARGE: > 15 collections, > 20 pages, > 20 menu items
 */

export type StoreSize = "minimal" | "small" | "medium" | "large";

export type MenuStrategy = {
	size: StoreSize;
	headerLayout: "flat" | "dropdown" | "mega";
	mobileLayout: "simple" | "grouped" | "advanced";
	showSearch: boolean;
	showImages: boolean;
	groupCollections: boolean;
	maxVisibleItems: number;
	collectionGridColumns: number;
	pageGridColumns: number;
};

export type StoreMetrics = {
	collectionCount: number;
	pageCount: number;
	menuItemCount: number;
	hasNestedMenus: boolean;
	totalNavigableItems: number;
};

/**
 * Calculate a complexity score based on store metrics
 */
function calculateComplexityScore(metrics: StoreMetrics): number {
	let score = 0;

	// Collection weight: 2 points each
	score += metrics.collectionCount * 2;

	// Page weight: 1.5 points each
	score += metrics.pageCount * 1.5;

	// Menu item weight: 1 point each
	score += metrics.menuItemCount * 1;

	// Nested menu bonus: 5 points
	if (metrics.hasNestedMenus) {
		score += 5;
	}

	return score;
}

/**
 * Determine store size category based on complexity score
 */
function determineStoreSize(score: number): StoreSize {
	if (score < 15) {
		return "minimal"; // Very simple stores
	}
	if (score < 35) {
		return "small"; // Basic stores
	}
	if (score < 70) {
		return "medium"; // Growing stores
	}
	return "large"; // Complex stores
}

/**
 * Get recommended menu strategy based on store size
 */
export function getMenuStrategy(metrics: StoreMetrics): MenuStrategy {
	const score = calculateComplexityScore(metrics);
	const size = determineStoreSize(score);

	switch (size) {
		case "minimal":
			return {
				size,
				headerLayout: "flat",
				mobileLayout: "simple",
				showSearch: false,
				showImages: false,
				groupCollections: false,
				maxVisibleItems: 4,
				collectionGridColumns: 1,
				pageGridColumns: 1,
			};

		case "small":
			return {
				size,
				headerLayout: "dropdown",
				mobileLayout: "simple",
				showSearch: false,
				showImages: true,
				groupCollections: false,
				maxVisibleItems: 6,
				collectionGridColumns: 1,
				pageGridColumns: 1,
			};

		case "medium":
			return {
				size,
				headerLayout: "dropdown",
				mobileLayout: "grouped",
				showSearch: true,
				showImages: true,
				groupCollections: true,
				maxVisibleItems: 8,
				collectionGridColumns: 2,
				pageGridColumns: 2,
			};

		case "large":
			return {
				size,
				headerLayout: "mega",
				mobileLayout: "advanced",
				showSearch: true,
				showImages: true,
				groupCollections: true,
				maxVisibleItems: 12,
				collectionGridColumns: 3,
				pageGridColumns: 2,
			};
	}
}

/**
 * Analyze store metrics and return optimal menu strategy
 */
export function analyzeMenuStructure(
	collectionCount: number,
	pageCount: number,
	menuItemCount: number,
	hasNestedMenus: boolean = false
): MenuStrategy {
	const metrics: StoreMetrics = {
		collectionCount,
		pageCount,
		menuItemCount,
		hasNestedMenus,
		totalNavigableItems: collectionCount + pageCount + menuItemCount,
	};

	return getMenuStrategy(metrics);
}

/**
 * Get human-readable description of the menu strategy
 */
export function getStrategyDescription(strategy: MenuStrategy): string {
	const descriptions: Record<StoreSize, string> = {
		minimal: "Your store has minimal content. Using a simple, flat navigation for optimal simplicity.",
		small: "Your store is small. Using a clean dropdown navigation with featured items.",
		medium: "Your store is growing. Using grouped navigation with search and organized sections.",
		large: "Your store is large. Using an advanced mega menu with multi-column layouts and search.",
	};

	return descriptions[strategy.size];
}
