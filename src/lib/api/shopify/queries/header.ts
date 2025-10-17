import { CACHE_TAGS } from "../cache-config";
import { shopifyFetch } from "../client";
import type { ShopifyCollectionWithPagination } from "../types";

export type MenuItem = {
	id: string;
	title: string;
	url: string;
	items?: MenuItem[];
};

export type ShopifyHeaderResponse = {
	shop: {
		name: string;
		description: string;
		primaryDomain: {
			url: string;
		};
	};
	menu: {
		items: MenuItem[];
	};
	blogs: {
		edges: Array<{
			node: {
				id: string;
				handle: string;
				title: string;
				articles: {
					edges: Array<{
						node: {
							id: string;
							handle: string;
							title: string;
							publishedAt: string;
						};
					}>;
				};
			};
		}>;
	};
	collections: {
		edges: Array<{
			node: ShopifyCollectionWithPagination;
		}>;
	};
};

export type HeaderQueryResponse = {
	shop: {
		name: string;
		description: string;
		primaryDomain: {
			url: string;
		};
	};
	menu: {
		items: MenuItem[];
	};
	blogs: {
		edges: Array<{
			node: {
				id: string;
				handle: string;
				title: string;
				articles: {
					edges: Array<{
						node: {
							id: string;
							handle: string;
							title: string;
							publishedAt: string;
						};
					}>;
				};
			};
		}>;
	};
	collections: {
		edges: Array<{
			node: ShopifyCollectionWithPagination;
		}>;
	};
};

export type HeaderData = {
	shop: ShopifyHeaderResponse["shop"] | null;
	menuItems: ShopifyHeaderResponse["menu"]["items"];
	blogs: ShopifyHeaderResponse["blogs"]["edges"][number]["node"][];
	collections: ShopifyCollectionWithPagination[];
};

export const headerQuery = `
	query getHeaderData($menuHandle: String!) {
		shop {
			name
			description
			primaryDomain {
				url
			}
		}
		menu(handle: $menuHandle) {
			items {
				id
				title
				url
				items {
					id
					title
					url
					items {
						id
						title
						url
					}
				}
			}
		}
		blogs(first: 3, sortKey: UPDATED_AT) {
			edges {
				node {
					id
					handle
					title
					articles(first: 1) {
						edges {
							node {
								id
								handle
								title
								publishedAt
							}
						}
					}
				}
			}
		}
		collections(first: 10) {
			edges {
				node {
					id
					handle
					title
					description
					image {
						url
						altText
						width
						height
					}
				}
			}
		}
	}
`;

export async function getHeaderData(): Promise<HeaderData> {
	try {
		// Try zugzwang-main-nav first (seeded menu with all collections)
		let response = await shopifyFetch<HeaderQueryResponse>({
			query: headerQuery,
			variables: { menuHandle: "zugzwang-main-nav" },
			tags: [CACHE_TAGS.MENU],
		});

		// If zugzwang menu doesn't exist or has no items, fall back to main-menu
		if (!response.data?.menu?.items || response.data.menu.items.length === 0) {
			response = await shopifyFetch<HeaderQueryResponse>({
				query: headerQuery,
				variables: { menuHandle: "main-menu" },
				tags: [CACHE_TAGS.MENU],
			});
		}

		if (!response.data) {
			throw new Error("No data returned from header query");
		}

		return {
			shop: response.data.shop,
			menuItems: response.data.menu?.items || [],
			blogs: response.data.blogs.edges.map((edge) => edge.node),
			collections: response.data.collections.edges.map((edge) => edge.node),
		};
	} catch (_error) {
		return {
			shop: null,
			menuItems: [],
			blogs: [],
			collections: [],
		};
	}
}
