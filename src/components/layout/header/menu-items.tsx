"use server";

import { cache } from "react";
import { transformShopifyUrl } from "@/components/utils/transform-shopify-url";
import { getAllCollections } from "@/lib/api/shopify/actions";
import { getMenuRobust } from "@/lib/api/shopify/menu-fetcher";
import { getStoreConfigSafe } from "@/lib/config/store-config";
import { loadStoreConfiguration } from "@/lib/config/store-data-loader";
import type { ShopifyMenuItem } from "@/lib/types";
import { analyzeMenuStructure, type MenuStrategy } from "@/lib/utils/menu-analyzer";

type MenuItem = {
	id: string;
	title: string;
	url: string;
	items?: MenuItem[];
};

export type MenuData = {
	items: MenuItem[];
	strategy: MenuStrategy;
};

type MainMenuResponse = {
	menu?: {
		items: ShopifyMenuItem[];
	};
};

function mapMenuItems(items: ShopifyMenuItem[] = []): MenuItem[] {
	return items.map((item) => ({
		id: item.id,
		title: item.title,
		url: transformShopifyUrl(item.url),
		items: item.items && item.items.length > 0 ? mapMenuItems(item.items) : undefined,
	}));
}

// Basic fallback menu
const BASIC_FALLBACK_MENU: MenuItem[] = [
	{ id: "home", title: "Home", url: "/" },
	{ id: "shop", title: "Shop", url: "/collections/all" },
	{ id: "about", title: "About", url: "/pages/about" },
	{ id: "contact", title: "Contact", url: "/pages/contact" },
];

// Build dynamic fallback menu from actual collections
async function buildDynamicFallbackMenu(): Promise<MenuItem[]> {
	try {
		const collections = await getAllCollections();

		if (!collections || collections.length === 0) {
			return BASIC_FALLBACK_MENU;
		}

		// Take first 6 collections for the submenu
		const collectionItems = collections.slice(0, 6).map((collection) => ({
			id: `collection-${collection.id}`,
			title: collection.title,
			url: `/collections/${collection.handle}`,
		}));

		return [
			{ id: "home", title: "Home", url: "/" },
			{
				id: "collections",
				title: "Collections",
				url: "/collections/all",
				items: collectionItems,
			},
			{ id: "shop-all", title: "Shop All", url: "/collections/all" },
			{ id: "blogs", title: "Blog", url: "/blogs" },
		];
	} catch (_error) {
		return BASIC_FALLBACK_MENU;
	}
}

// Count nested menu items recursively
function countNestedItems(items: MenuItem[]): number {
	return items.reduce((count, item) => {
		const subCount = item.items ? countNestedItems(item.items) : 0;
		return count + 1 + subCount;
	}, 0);
}

// Check if menu has any nested items
function hasNestedItems(items: MenuItem[]): boolean {
	return items.some((item) => item.items && item.items.length > 0);
}

// Get menu items with caching - legacy function for backward compatibility
export const getMenuItems = cache(async (): Promise<MenuItem[]> => {
	const data = await getMenuData();
	return data.items;
});

// Get complete menu data with strategy analysis
export const getMenuData = cache(async (): Promise<MenuData> => {
	try {
		await loadStoreConfiguration();
		const config = getStoreConfigSafe();

		// Try zugzwang-main-nav first (seeded menu with all collections)
		let menuItems = await getMenuRobust("zugzwang-main-nav");

		// If not found, try configured menu or default
		if (!menuItems || menuItems.length === 0) {
			const mainMenuHandle = config.navigation?.mainMenu || "main-menu";
			menuItems = await getMenuRobust(mainMenuHandle);
		}

		let items: MenuItem[];

		// If we have menu items from Shopify, use them
		if (menuItems && menuItems.length > 0) {
			items = mapMenuItems(menuItems);
		} else {
			items = await buildDynamicFallbackMenu();
		}

		// Get collections count for analysis
		const collections = await getAllCollections();
		const collectionCount = collections?.length || 0;

		// Count total menu items (including nested)
		const menuItemCount = countNestedItems(items);
		const hasNested = hasNestedItems(items);

		// For pages, we'll estimate based on typical store sizes
		// In a real scenario, you'd fetch actual page count
		const estimatedPageCount = Math.min(collectionCount + 5, 15);

		// Analyze and get strategy
		const strategy = analyzeMenuStructure(collectionCount, estimatedPageCount, menuItemCount, hasNested);

		return {
			items,
			strategy,
		};
	} catch (_error) {
		// Fallback with minimal strategy
		return {
			items: BASIC_FALLBACK_MENU,
			strategy: analyzeMenuStructure(0, 0, BASIC_FALLBACK_MENU.length, false),
		};
	}
});
