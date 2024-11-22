import { createStorefrontApiClient, type ClientResponse } from "@shopify/storefront-api-client";

if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
	throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not defined");
}

if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN) {
	throw new Error("NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN is not defined");
}

export const shopifyClient = createStorefrontApiClient({
	storeDomain: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`,
	publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN,
	apiVersion: "2024-01",
});

export const TAGS = {
	products: "products",
	cart: "cart",
	myceliumsGambit: "myceliums-gambit",
} as const;

export type ShopifyResponse<T> = ClientResponse<T>;
