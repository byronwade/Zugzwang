/**
 * Transforms Shopify URLs to local app URLs
 * @param url - The Shopify URL to transform
 * @returns The transformed local URL
 */
export function transformShopifyUrl(url: string): string {
	if (!url) {
		return "/";
	}

	try {
		// Remove domain and protocol
		const urlObj = new URL(url);
		let path = urlObj.pathname;

		// Remove trailing slashes
		path = path.replace(/\/$/, "");

		// Keep /pages/ prefix since that's where our dynamic route is
		// Keep /products/, /collections/, /blogs/ prefixes as well

		return path || "/";
	} catch (_error) {
		// If URL parsing fails, assume it's already a path
		let path = url;

		// Remove trailing slashes
		path = path.replace(/\/$/, "");

		return path || "/";
	}
}
