/**
 * ============================================================================
 * ZUGZWANG - UNIVERSAL STORE CONFIGURATION
 * ============================================================================
 *
 * This file provides configuration defaults for the Zugzwang template.
 *
 * IMPORTANT: Many values below should be replaced with:
 * - Environment variables (NEXT_PUBLIC_*)
 * - Shopify metafields (fetched dynamically)
 * - Shopify shop data (from Storefront API)
 *
 * This file serves as a fallback configuration layer and demonstration
 * of the template's capabilities. For production use, configure your
 * store dynamically using the methods above.
 *
 * ============================================================================
 */

import type { LucideIcon } from "lucide-react";
import { BookOpen, HeadphonesIcon, RefreshCw, ShieldCheck, Sprout, Truck } from "lucide-react";

// ============================================================================
// SECTION 1: BRAND & IDENTITY
// ============================================================================

export const BRAND = {
	// Core brand information
	// TODO: Load from process.env.NEXT_PUBLIC_STORE_NAME or Shopify shop.name
	name: process.env.NEXT_PUBLIC_STORE_NAME || "Zugzwang",
	legalName: process.env.NEXT_PUBLIC_STORE_LEGAL_NAME || "Your Store LLC",
	tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE || "Modern E-Commerce Template",
	slogan: process.env.NEXT_PUBLIC_STORE_SLOGAN || "Built with Next.js & Shopify",

	// Domain configuration
	// TODO: Load from process.env or Shopify domain settings
	domain: process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "") || "yourdomain.com",
	url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",

	// Visual identity
	// TODO: Load logo from Shopify shop settings or metafields
	logo: {
		path: process.env.NEXT_PUBLIC_LOGO_PATH || "/logo.png",
		alt: `${process.env.NEXT_PUBLIC_STORE_NAME || "Zugzwang"} Logo`,
		width: 180,
		height: 60,
	},
	favicon: {
		path: "/favicon.ico",
	},

	// Brand colors
	// TODO: Load from environment variables or Shopify theme settings
	colors: {
		primary: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#2563eb", // Blue
		secondary: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#7c3aed", // Purple
		accent: process.env.NEXT_PUBLIC_ACCENT_COLOR || "#f3f4f6", // Gray
	},

	// Founder information
	// TODO: Load from Shopify metafields or environment
	founder: {
		name: process.env.NEXT_PUBLIC_FOUNDER_NAME || "Store Owner",
		title: process.env.NEXT_PUBLIC_FOUNDER_TITLE || "Founder",
	},

	// Company details
	// TODO: Load from Shopify metafields
	foundingDate: process.env.NEXT_PUBLIC_FOUNDING_DATE || new Date().toISOString().split("T")[0],
	foundingYear: process.env.NEXT_PUBLIC_FOUNDING_YEAR || new Date().getFullYear().toString(),
} as const;

// ============================================================================
// SECTION 2: BUSINESS INFORMATION
// ============================================================================

export const BUSINESS = {
	// Physical address
	// TODO: Load from Shopify metafields (custom.business_address)
	address: {
		street: process.env.NEXT_PUBLIC_BUSINESS_STREET || "123 Main Street",
		city: process.env.NEXT_PUBLIC_BUSINESS_CITY || "San Francisco",
		state: process.env.NEXT_PUBLIC_BUSINESS_STATE || "CA",
		stateCode: process.env.NEXT_PUBLIC_BUSINESS_STATE_CODE || "CA",
		zip: process.env.NEXT_PUBLIC_BUSINESS_ZIP || "94102",
		country: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || "United States",
		countryCode: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY_CODE || "US",
	},

	// Operating hours (for Schema.org)
	// TODO: Load from Shopify metafields (custom.business_hours)
	hours: {
		weekday: {
			days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			opens: process.env.NEXT_PUBLIC_HOURS_WEEKDAY_OPEN || "09:00",
			closes: process.env.NEXT_PUBLIC_HOURS_WEEKDAY_CLOSE || "17:00",
		},
		saturday: {
			days: ["Saturday"],
			opens: process.env.NEXT_PUBLIC_HOURS_SATURDAY_OPEN || "10:00",
			closes: process.env.NEXT_PUBLIC_HOURS_SATURDAY_CLOSE || "16:00",
		},
		sunday: {
			days: ["Sunday"],
			opens: null, // Closed by default
			closes: null,
		},
	},

	// Business metrics (for Schema.org)
	// TODO: Load from Shopify metafields
	metrics: {
		employeeRange: {
			min: Number(process.env.NEXT_PUBLIC_EMPLOYEE_MIN) || 1,
			max: Number(process.env.NEXT_PUBLIC_EMPLOYEE_MAX) || 50,
		},
		priceRange: process.env.NEXT_PUBLIC_PRICE_RANGE || "$$",
	},

	// Service areas
	// TODO: Load from Shopify metafields or market settings
	serviceAreas: {
		countries: process.env.NEXT_PUBLIC_SERVICE_COUNTRIES?.split(",") || ["US"],
		languages: process.env.NEXT_PUBLIC_SERVICE_LANGUAGES?.split(",") || ["en"],
	},
} as const;

// ============================================================================
// SECTION 3: CONTACT INFORMATION
// ============================================================================

export const CONTACT = {
	// Email addresses
	// TODO: Load from Shopify metafields (custom.contact_emails)
	email: {
		support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@yourdomain.com",
		sales: process.env.NEXT_PUBLIC_SALES_EMAIL || "sales@yourdomain.com",
		general: process.env.NEXT_PUBLIC_GENERAL_EMAIL || "hello@yourdomain.com",
		legal: process.env.NEXT_PUBLIC_LEGAL_EMAIL || "legal@yourdomain.com",
	},

	// Phone numbers
	// TODO: Load from Shopify metafields (custom.contact_phones)
	phone: {
		main: process.env.NEXT_PUBLIC_PHONE_MAIN || "1-800-000-0000",
		mainFormatted: process.env.NEXT_PUBLIC_PHONE_FORMATTED || "1-800-000-0000",
		international: process.env.NEXT_PUBLIC_PHONE_INTERNATIONAL || "+1-415-555-0000",
		tollfree: process.env.NEXT_PUBLIC_PHONE_TOLLFREE === "true",
	},

	// Support options
	// TODO: Load from Shopify metafields (custom.support_info)
	support: {
		hours: process.env.NEXT_PUBLIC_SUPPORT_HOURS || "Mon-Fri 9AM-5PM",
		responseTime: process.env.NEXT_PUBLIC_SUPPORT_RESPONSE_TIME || "24 hours",
		languages: process.env.NEXT_PUBLIC_SUPPORT_LANGUAGES?.split(",") || ["English"],
		hearingImpaired: process.env.NEXT_PUBLIC_SUPPORT_HEARING_IMPAIRED === "true",
	},
} as const;

// ============================================================================
// SECTION 4: SOCIAL MEDIA
// ============================================================================

export const SOCIAL = {
	// TODO: Load from Shopify metafields (custom.social_links)
	facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "",
	instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
	twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "",
	youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "",
	linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "",
	pinterest: process.env.NEXT_PUBLIC_SOCIAL_PINTEREST || "",
	tiktok: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || "",

	// Social handles (without @)
	// Extract handles from URLs if not provided directly
	handles: {
		twitter:
			process.env.NEXT_PUBLIC_SOCIAL_TWITTER_HANDLE || process.env.NEXT_PUBLIC_SOCIAL_TWITTER?.split("/").pop() || "",
		instagram:
			process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_HANDLE ||
			process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM?.split("/").pop() ||
			"",
		facebook:
			process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_HANDLE || process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK?.split("/").pop() || "",
	},
} as const;

// ============================================================================
// SECTION 5: STORE POLICIES
// ============================================================================

export const POLICIES = {
	// Shipping policy
	shipping: {
		freeShippingThreshold: 75, // USD
		standardShipping: {
			processingTime: "1-2 business days",
			deliveryTime: "3-5 business days",
			cost: 5.99,
		},
		expressShipping: {
			processingTime: "Same day",
			deliveryTime: "1-2 business days",
			cost: 15.99,
		},
		international: {
			available: false,
			note: "Contact support for international orders",
		},
	},

	// Return policy
	returns: {
		windowDays: 30,
		conditions: "30-day satisfaction guarantee",
		freeReturns: true,
		restockingFee: 0,
		fullText:
			"We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, contact us for a full refund or replacement.",
	},

	// Warranty
	warranty: {
		durationYears: 1,
		description: "1-year product warranty on equipment",
	},

	// Payment methods
	payment: {
		accepted: [
			"Cash",
			"Credit Card",
			"Debit Card",
			"PayPal",
			"Shop Pay",
			"Apple Pay",
			"Google Pay",
			"Venmo",
			"Cryptocurrency",
		],
		logos: [
			{ name: "Visa", path: "/images/payment/visa.svg" },
			{ name: "Mastercard", path: "/images/payment/mastercard.svg" },
			{ name: "American Express", path: "/images/payment/amex.svg" },
			{ name: "PayPal", path: "/images/payment/paypal.svg" },
		],
	},

	// Privacy & compliance
	privacy: {
		cookieConsent: true,
		gdprCompliant: true,
		ccpaCompliant: true,
	},
} as const;

// ============================================================================
// SECTION 6: STORE FEATURES
// ============================================================================

export type StoreFeature = {
	id: string;
	icon: LucideIcon;
	title: string;
	description: string;
	order: number;
};

export const STORE_FEATURES: StoreFeature[] = [
	{
		id: "free-shipping",
		icon: Truck,
		title: process.env.NEXT_PUBLIC_FEATURE_SHIPPING_TITLE || "Free Shipping",
		description: process.env.NEXT_PUBLIC_FEATURE_SHIPPING_DESC || "Free shipping on qualifying orders",
		order: 1,
	},
	{
		id: "satisfaction-guarantee",
		icon: ShieldCheck,
		title: process.env.NEXT_PUBLIC_FEATURE_GUARANTEE_TITLE || "Money-Back Guarantee",
		description: process.env.NEXT_PUBLIC_FEATURE_GUARANTEE_DESC || "Shop with confidence - satisfaction guaranteed",
		order: 2,
	},
	{
		id: "sustainable",
		icon: Sprout,
		title: process.env.NEXT_PUBLIC_FEATURE_ECO_TITLE || "Eco-Friendly",
		description: process.env.NEXT_PUBLIC_FEATURE_ECO_DESC || "Sustainable practices and eco-friendly packaging",
		order: 3,
	},
	{
		id: "expert-resources",
		icon: BookOpen,
		title: process.env.NEXT_PUBLIC_FEATURE_RESOURCES_TITLE || "Expert Resources",
		description: process.env.NEXT_PUBLIC_FEATURE_RESOURCES_DESC || "Free guides and educational content",
		order: 4,
	},
	{
		id: "customer-support",
		icon: HeadphonesIcon,
		title: process.env.NEXT_PUBLIC_FEATURE_SUPPORT_TITLE || "Customer Support",
		description: process.env.NEXT_PUBLIC_FEATURE_SUPPORT_DESC || "Dedicated support from our team",
		order: 5,
	},
	{
		id: "subscriptions",
		icon: RefreshCw,
		title: process.env.NEXT_PUBLIC_FEATURE_SUBSCRIPTION_TITLE || "Subscribe & Save",
		description: process.env.NEXT_PUBLIC_FEATURE_SUBSCRIPTION_DESC || "Save with regular deliveries",
		order: 6,
	},
];

// ============================================================================
// SECTION 7: INDUSTRY & PRODUCT CATEGORIES
// ============================================================================

export const INDUSTRY = {
	// Industry type
	// TODO: Load from Shopify metafields or environment
	type: process.env.NEXT_PUBLIC_INDUSTRY_TYPE || "E-Commerce",
	category: process.env.NEXT_PUBLIC_INDUSTRY_CATEGORY || "Retail",

	// Product categories
	// NOTE: These should be dynamically loaded from Shopify collections
	// This is a fallback/example structure
	categories: [
		{ handle: "all", name: "All Products", description: "Browse all products" },
		{ handle: "featured", name: "Featured", description: "Featured products" },
		{ handle: "new-arrivals", name: "New Arrivals", description: "Latest products" },
		{ handle: "best-sellers", name: "Best Sellers", description: "Top-selling products" },
		{ handle: "sale", name: "Sale", description: "Products on sale" },
	],

	// Generic terminology (can be customized per store)
	// TODO: Load from Shopify metafields (custom.store_terminology)
	terminology: {
		mainProduct: process.env.NEXT_PUBLIC_MAIN_PRODUCT || "products",
		productPlural: process.env.NEXT_PUBLIC_PRODUCT_PLURAL || "items",
		activity: process.env.NEXT_PUBLIC_ACTIVITY || "shopping",
		practitioner: process.env.NEXT_PUBLIC_PRACTITIONER || "customer",
		practitioners: process.env.NEXT_PUBLIC_PRACTITIONERS || "customers",
		expertise: process.env.NEXT_PUBLIC_EXPERTISE || "quality",
	},
} as const;

// ============================================================================
// SECTION 8: SEO & METADATA
// ============================================================================

export const SEO = {
	// Site-wide defaults
	// TODO: Load from Shopify shop data or environment
	site: {
		titleTemplate: `%s | ${process.env.NEXT_PUBLIC_STORE_NAME || "Zugzwang"}`,
		defaultTitle:
			process.env.NEXT_PUBLIC_SEO_DEFAULT_TITLE ||
			`${process.env.NEXT_PUBLIC_STORE_NAME || "Zugzwang"} - Modern E-Commerce`,
		titleSeparator: " | ",
	},

	// Default keywords
	// TODO: Load from Shopify metafields (custom.seo_keywords) or make product-specific
	defaultKeywords: process.env.NEXT_PUBLIC_SEO_KEYWORDS?.split(",") || [
		"online store",
		"ecommerce",
		"shop online",
		"buy online",
		"quality products",
		"fast shipping",
		"secure checkout",
		"customer reviews",
		"best prices",
		"new arrivals",
	],

	// Page-specific metadata
	// TODO: Load from Shopify metafields for each page type
	pages: {
		home: {
			title: process.env.NEXT_PUBLIC_SEO_HOME_TITLE || `${BRAND.name} - ${BRAND.tagline}`,
			description:
				process.env.NEXT_PUBLIC_SEO_HOME_DESC ||
				`Shop quality products at ${BRAND.name}. Fast shipping, secure checkout, and excellent customer service.`,
			keywords: process.env.NEXT_PUBLIC_SEO_HOME_KEYWORDS?.split(",") || ["online store", "ecommerce", "shop online"],
		},
		products: {
			title: process.env.NEXT_PUBLIC_SEO_PRODUCTS_TITLE || "All Products",
			description: process.env.NEXT_PUBLIC_SEO_PRODUCTS_DESC || "Discover our complete collection of quality products.",
			keywords: process.env.NEXT_PUBLIC_SEO_PRODUCTS_KEYWORDS?.split(",") || ["products", "shop", "buy online"],
		},
		collections: {
			titleSuffix: process.env.NEXT_PUBLIC_SEO_COLLECTION_SUFFIX || `Collection | ${BRAND.name}`,
			descriptionTemplate:
				process.env.NEXT_PUBLIC_SEO_COLLECTION_DESC ||
				"Discover our premium {collection} collection with fast shipping and expert support.",
		},
		productDetail: {
			titleSuffix: `| ${BRAND.name}`,
			notFoundTitle: `Product Not Found | ${BRAND.name}`,
			notFoundDescription: "The requested product could not be found. Browse our collection of quality products.",
		},
		blog: {
			title: process.env.NEXT_PUBLIC_SEO_BLOG_TITLE || "Blog - Tips & Guides",
			description: process.env.NEXT_PUBLIC_SEO_BLOG_DESC || "Expert guides, tips, and insights.",
		},
		account: {
			title: "My Account",
			description: "Manage your orders, account settings, and preferences.",
		},
		cart: {
			title: "Shopping Cart",
			description: "Review your items and checkout securely.",
		},
		search: {
			title: "Search Results",
			descriptionTemplate: 'Find products matching "{query}".',
		},
	},

	// Social/OG defaults
	// TODO: Load from Shopify shop settings or metafields
	og: {
		type: "website",
		siteName: BRAND.name,
		image: process.env.NEXT_PUBLIC_OG_IMAGE || "/og-image.jpg",
		imageWidth: 1200,
		imageHeight: 630,
	},

	// Twitter card
	// TODO: Load from Shopify metafields (custom.social_twitter)
	twitter: {
		card: "summary_large_image",
		site: SOCIAL.handles.twitter ? `@${SOCIAL.handles.twitter}` : "",
		creator: SOCIAL.handles.twitter ? `@${SOCIAL.handles.twitter}` : "",
	},
} as const;

// ============================================================================
// SECTION 9: MARKETING & PROMOTIONS
// ============================================================================

export const PROMOTIONS = {
	// Active promotions
	// TODO: Load from Shopify metafields (custom.promotions)
	banners: {
		enabled: process.env.NEXT_PUBLIC_PROMO_ENABLED !== "false",
		messages: process.env.NEXT_PUBLIC_PROMO_MESSAGES?.split("|") || [
			"Free shipping on qualifying orders",
			"New products added regularly",
			"Expert customer support included",
		],
		rotationInterval: Number(process.env.NEXT_PUBLIC_PROMO_INTERVAL) || 5000,
	},

	// Discount tiers
	// TODO: Load from Shopify automatic discounts or metafields
	discounts: {
		volumeDiscounts: [
			{
				threshold: Number(process.env.NEXT_PUBLIC_DISCOUNT_TIER1_MIN) || 150,
				percentage: Number(process.env.NEXT_PUBLIC_DISCOUNT_TIER1_PCT) || 5,
				message: process.env.NEXT_PUBLIC_DISCOUNT_TIER1_MSG || "5% off orders over $150",
			},
			{
				threshold: Number(process.env.NEXT_PUBLIC_DISCOUNT_TIER2_MIN) || 300,
				percentage: Number(process.env.NEXT_PUBLIC_DISCOUNT_TIER2_PCT) || 10,
				message: process.env.NEXT_PUBLIC_DISCOUNT_TIER2_MSG || "10% off orders over $300",
			},
		],
	},

	// Trust indicators
	// TODO: Load from Shopify metafields (custom.trust_badges) or calculate from order data
	trustBadges: {
		customerCount: process.env.NEXT_PUBLIC_CUSTOMER_COUNT || "1,000+",
		reviewCount: process.env.NEXT_PUBLIC_REVIEW_COUNT || "500+",
		averageRating: process.env.NEXT_PUBLIC_AVERAGE_RATING || "4.8/5",
		successRate: process.env.NEXT_PUBLIC_SUCCESS_RATE || "98%",
	},
} as const;

// ============================================================================
// SECTION 10: CONTENT & COPY
// ============================================================================

export const CONTENT = {
	// Homepage
	// TODO: Load from Shopify metafields (custom.homepage_content)
	home: {
		hero: {
			defaultTitle: process.env.NEXT_PUBLIC_HERO_TITLE || `Welcome to ${BRAND.name}`,
			defaultSubtitle: process.env.NEXT_PUBLIC_HERO_SUBTITLE || BRAND.tagline,
			ctaPrimary: process.env.NEXT_PUBLIC_HERO_CTA_PRIMARY || "Shop Now",
			ctaSecondary: process.env.NEXT_PUBLIC_HERO_CTA_SECONDARY || "Browse Products",
			trustBadge: process.env.NEXT_PUBLIC_HERO_TRUST_BADGE || PROMOTIONS.banners.messages[0],
		},
		sections: {
			featured: {
				title: "Trending Kits & Supplies",
				subtitle: "Hand-selected items customers are loving right now",
				ctaLabel: "Shop all products",
			},
			bestSellers: {
				title: "Customer Favorites",
				subtitle: "Top-rated essentials backed by real purchase data",
				ctaLabel: "Browse best sellers",
			},
			newProducts: {
				title: "Latest Products",
				subtitle: "Check out our newest additions",
				ctaLabel: "View all new",
			},
			collections: {
				title: "Shop by Category",
				subtitle: "Explore our curated collections of premium cultivation supplies",
			},
		},
	},

	// Product pages
	product: {
		defaultFallback: "Premium mushroom growing supplies for serious cultivators.",
		stockStatus: {
			inStock: "In stock • Ships within 24 hours",
			lowStock: "Only {count} left in stock",
			outOfStock: "Out of stock",
			preOrder: "Available for pre-order",
		},
		trustBadges: ["30-day money-back guarantee", "Free shipping on orders over $75", "Expert support included"],
		sections: {
			description: "Product Details",
			specifications: "Specifications",
			reviews: "Customer Reviews",
			faq: "Frequently Asked Questions",
			related: "You May Also Like",
			recentlyViewed: "Recently Viewed",
		},
	},

	// Collection pages
	collection: {
		allProducts: {
			title: "All Products",
			description: "Browse our complete collection of premium mushroom growing supplies and equipment.",
		},
		fallbackDescription: "Browse our {collection} collection of premium mushroom growing supplies.",
		defaultSuffix: "Premium Mushroom Growing Supplies",
	},

	// Error pages
	errors: {
		notFound: {
			title: "Page Not Found",
			message: "The page you're looking for doesn't exist.",
			cta: "Return to Home",
		},
		productNotFound: {
			title: "Product Not Found",
			message:
				"The requested product could not be found. Browse our available mushroom cultivation supplies or search for something specific.",
			cta: "Browse Products",
		},
		collectionNotFound: {
			title: "Collection Not Found",
			message: "The requested collection could not be found.",
			cta: "View All Collections",
		},
		general: {
			title: "Something went wrong",
			message: "An unexpected error occurred. Please try again.",
			cta: "Try Again",
		},
	},

	// Authentication pages
	auth: {
		login: {
			title: "Sign In to Your Account",
			subtitle: "Access your orders, wishlist, and account settings.",
			cta: "Sign In",
			alternateAction: "Don't have an account? Sign up",
		},
		register: {
			title: "Create Your Account",
			subtitle: "Join thousands of successful mushroom cultivators.",
			cta: "Create Account",
			alternateAction: "Already have an account? Sign in",
		},
	},

	// Cart
	cart: {
		empty: {
			title: "Your cart is empty",
			message: "Start shopping to add items to your cart.",
			cta: "Continue Shopping",
		},
		summary: {
			subtotal: "Subtotal",
			shipping: "Shipping",
			tax: "Tax",
			total: "Total",
			freeShippingMessage: "Free shipping on all orders",
			checkoutButton: "Proceed to Checkout",
		},
	},

	// Header/Navigation UI strings
	navigation: {
		search: {
			placeholder: "Search...",
			placeholderLong: "Search Products and Articles...",
		},
		buttons: {
			learnAndGrow: "Learn & Grow",
			moreOptions: "More options",
			account: "Account",
			accountDashboard: "Account Dashboard",
			wishlist: "Wishlist",
			cart: "Cart",
			helpCenter: "Help Center",
			keyboardShortcuts: "Keyboard Shortcuts",
			orders: "Orders",
			home: "Home",
			menu: "Menu",
		},
		actions: {
			signIn: "Log in",
			signUp: "Sign up",
			createAccount: "Create account",
			signOut: "Sign out",
		},
	},

	// Promo banner messages
	promoBanner: {
		default: `Welcome to ${BRAND.name}! ${PROMOTIONS.banners.messages[0]}`,
	},
} as const;

// ============================================================================
// SECTION 11: FAQ TEMPLATES
// ============================================================================

export const FAQ_TEMPLATES = {
	// Homepage FAQs
	homepage: [
		{
			question: "What types of mushroom growing supplies do you offer?",
			answer:
				"We offer a complete range of mushroom cultivation supplies including growing kits, sterilized substrates, liquid cultures, spawn, cultivation equipment, and educational resources for both beginners and commercial growers.",
		},
		{
			question: "Do you offer free shipping?",
			answer:
				"Yes! We offer free shipping on all orders over $75 within the United States. Orders are typically processed within 1-2 business days.",
		},
		{
			question: "What's your return policy?",
			answer:
				"We offer a 30-day satisfaction guarantee on all products. If you're not completely satisfied with your purchase, contact our support team for a full refund or replacement.",
		},
		{
			question: "How do I get started with mushroom cultivation?",
			answer:
				"We recommend starting with one of our beginner-friendly growing kits that include everything you need. We also provide free growing guides and expert support to help ensure your success.",
		},
		{
			question: "Do you ship internationally?",
			answer:
				"Currently we ship within the United States. For international orders, please contact our support team for special arrangements.",
		},
	],

	// Product page FAQs (generic)
	product: [
		{
			question: "What is included with this product?",
			answer:
				"This product includes everything you need for successful mushroom cultivation. Check the product details for specific contents.",
		},
		{
			question: "How long does shipping take?",
			answer:
				"Orders typically ship within 1-2 business days. Standard shipping takes 3-5 business days. We offer free shipping on orders over $75.",
		},
		{
			question: "What is your return policy?",
			answer:
				"We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, contact us for a full refund or replacement.",
		},
		{
			question: "Is this product suitable for beginners?",
			answer:
				"Yes! All our products come with detailed instructions and we provide free expert support to help ensure your success.",
		},
	],

	// Collection-specific FAQs
	collections: {
		substrate: [
			{
				question: "What kind of mushrooms can I grow with this substrate?",
				answer:
					"Our substrates are formulated to support a wide variety of gourmet and medicinal mushrooms, including oyster, shiitake, lion's mane, and reishi varieties. Check each product description for specific compatibility details.",
			},
			{
				question: "How should I store the substrate before use?",
				answer:
					"Store your substrate in a cool, dry place away from direct sunlight. Unopened substrate bags can typically be stored for 3-6 months when kept in proper conditions.",
			},
			{
				question: "Do I need to pasteurize or sterilize the substrate before use?",
				answer:
					"Our substrates come fully pasteurized and ready to use. Simply open in a clean environment and proceed with inoculation according to the included instructions.",
			},
		],
		kit: [
			{
				question: "Are your growing kits suitable for beginners?",
				answer:
					"Yes! Our kits are designed with beginners in mind and include detailed step-by-step instructions. They require minimal setup and maintenance, making them perfect for first-time growers.",
			},
			{
				question: "How long until I see mushrooms with a growing kit?",
				answer:
					"Most of our kits will produce their first flush of mushrooms within 10-14 days after setting up, depending on environmental conditions and the mushroom variety.",
			},
			{
				question: "What temperature and humidity levels are required?",
				answer:
					"Most mushroom varieties prefer temperatures between 65-75°F (18-24°C) and humidity levels of 80-95%. Each kit includes specific instructions for the particular mushroom variety.",
			},
		],
		equipment: [
			{
				question: "What equipment is essential for mushroom cultivation?",
				answer:
					"Essential equipment includes grow bags or containers, a spray bottle for misting, thermometer/hygrometer for monitoring conditions, and proper lighting. Advanced growers may also use pressure cookers, flow hoods, and humidity controllers.",
			},
			{
				question: "Is this equipment suitable for commercial growing?",
				answer:
					"Yes! Our equipment is suitable for both home hobbyists and commercial operations. We offer bulk pricing on larger orders - contact our sales team for volume discounts.",
			},
			{
				question: "What warranty or guarantee comes with the equipment?",
				answer:
					"All equipment comes with our standard 1-year warranty against manufacturing defects. We also offer a 30-day satisfaction guarantee on all purchases.",
			},
		],
		spawn: [
			{
				question: "How long does spawn stay viable?",
				answer:
					"When stored properly in a refrigerator (35-40°F), our spawn remains viable for 3-6 months. For best results, use spawn as soon as possible after receiving.",
			},
			{
				question: "What is the inoculation rate for spawn?",
				answer:
					"We recommend a 5-10% spawn-to-substrate ratio by weight for optimal colonization. Higher rates lead to faster colonization but use more spawn.",
			},
			{
				question: "Can I use this spawn with any substrate?",
				answer:
					"Our spawn works with a variety of substrates including hardwood sawdust, straw, and supplemented blends. Check the product description for specific substrate compatibility.",
			},
		],
		supplies: [
			{
				question: "Are these supplies food-safe and non-toxic?",
				answer:
					"Yes! All our growing supplies are food-safe and specifically formulated for edible mushroom cultivation. They contain no harmful chemicals or additives.",
			},
			{
				question: "Do you offer bulk pricing on supplies?",
				answer:
					"Absolutely! Orders over $150 receive automatic volume discounts, and we offer special wholesale pricing for commercial operations. Contact us for custom quotes on large orders.",
			},
			{
				question: "What's the shelf life of your supplies?",
				answer:
					"When stored properly in a cool, dry location, most supplies remain effective for 6-12 months. Specific shelf life varies by product - check individual product pages for details.",
			},
		],
	},

	// General product FAQs
	general: {
		bulkOrders: {
			question: "Do you offer bulk pricing or volume discounts?",
			answer:
				"Yes! We offer volume discounts on many of our products. Orders over $75 qualify for free shipping, and orders over $150 receive a 5% discount automatically applied at checkout.",
		},
	},
} as const;

// ============================================================================
// SECTION 12: IMAGES & ASSETS
// ============================================================================

export const ASSETS = {
	// Logo & branding
	logo: "/logo.png",
	logoInverted: "/logo.png", // Same file, inverted via CSS
	favicon: "/favicon.ico",

	// Hero/Banner images
	banners: {
		hero1: "/banner.png",
		hero2: "/banner2.png",
		hero3: "/banner3.png",
		default: "/mycelium-roots.png",
	},

	// Background/decorative images
	backgrounds: {
		mycelium1: "/mycelium.png",
		mycelium2: "/mycelium1.png",
		mycelium3: "/mycelium2.png",
		mycelium4: "/mycelium3.png",
		mycelium5: "/mycelium4.png",
		mycelium6: "/mycelium5.png",
		mycelium7: "/mycelium6.png",
		myceliumRoots: "/mycelium-roots.png",
		myceliumRoots1: "/mycelium-roots1.png",
	},

	// Category images
	categories: {
		food: "/categories/food.png",
		liquidCulture: "/categories/liquid-culture.png",
		spawn: "/categories/spawn.png",
		substrate: "/categories/substrate.png",
		supplements: "/categories/suppliments.png",
		subscriptionBox: "/categories/subscription-box.png",
		tea: "/categories/tea.png",
		tinctures: "/categories/tinchers.png",
	},

	// Fallback/placeholder images
	placeholders: {
		product: "/placeholder-product.png",
		general: "/placeholder.svg",
		collection: "/mycelium-roots.png",
	},

	// Icons & misc
	misc: {
		usaFlag: "/usa.png",
	},

	// OG/Social images
	social: {
		ogImageDefault: "/og-image.jpg",
		twitterImageDefault: "/twitter-image.jpg",
	},
} as const;

// ============================================================================
// SECTION 13: NAVIGATION STRUCTURE
// ============================================================================

export const NAVIGATION = {
	// Shopify menu handles
	shopifyMenus: {
		main: "main-menu",
		footer: "footer",
		mobile: "mobile-menu",
	},

	// Footer navigation sections
	footer: {
		sections: [
			{
				id: "main",
				title: BRAND.name,
				links: [
					{ label: "About Us", href: "/about" },
					{ label: "Careers", href: "/careers" },
					{ label: "Wholesale Program", href: "/wholesale" },
					{ label: "News & Updates", href: "/blogs/news" },
					{ label: "Partner Program", href: "/partners" },
					{ label: "Affiliate Program", href: "/affiliate" },
					{ label: "Legal", href: "/legal" },
					{ label: "Service Status", href: "/status" },
				],
			},
			{
				id: "support",
				title: "Support",
				links: [
					{ label: "Customer Support", href: "/help/support" },
					{ label: "Help Center", href: "/help/center" },
					{ label: "Shipping Information", href: "/shipping" },
					{ label: "Returns & Exchanges", href: "/returns" },
					{ label: "FAQ", href: "/faq" },
				],
			},
			{
				id: "resources",
				title: "Resources",
				links: [
					{ label: "Growing Guides", href: "/guides" },
					{ label: "Blog", href: "/blog" },
					{ label: "Video Tutorials", href: "/videos" },
				],
			},
			{
				id: "products",
				title: "Products",
				links: [
					{ label: "All Products", href: "/collections/all" },
					{ label: "Grow Bags", href: "/collections/grow-bags" },
					{ label: "Substrates", href: "/collections/substrates" },
					{ label: "Equipment", href: "/collections/equipment" },
					{ label: "Supplies", href: "/collections/supplies" },
					{ label: "Bulk Orders", href: "/collections/bulk" },
				],
			},
			{
				id: "solutions",
				title: "Solutions",
				links: [
					{ label: "Wholesale Program", href: "/wholesale" },
					{ label: "Custom Orders", href: "/custom" },
					{ label: "Business Solutions", href: "/business" },
				],
			},
		],
		legal: [
			{ label: "Terms of Service", href: "/terms" },
			{ label: "Privacy Policy", href: "/privacy" },
			{ label: "Sitemap", href: "/sitemap" },
			{ label: "Cookie Preferences", href: "/cookies" },
		],
		region: {
			default: "USA",
			icon: "/usa.png",
		},
	},
} as const;

// ============================================================================
// SECTION 14: SCHEMA.ORG STRUCTURED DATA DEFAULTS
// ============================================================================

export const SCHEMA_DEFAULTS = {
	// Organization schema
	organization: {
		type: "Organization" as const,
		priceRange: "$$",
		areaServed: ["US", "CA"],
		availableLanguages: ["en", "es"],
		makesOfferText: "Free Shipping",
		makesOfferDescription: "Free shipping on orders over $75",
	},

	// Store/LocalBusiness schema
	store: {
		types: ["Store", "LocalBusiness"] as const,
		paymentMethods: ["Cash", "Credit Card", "PayPal", "Shop Pay", "Apple Pay", "Google Pay", "Cryptocurrency"],
		currenciesAccepted: "USD",
		priceRange: "$$",
	},

	// Product schema defaults
	product: {
		condition: "https://schema.org/NewCondition",
		availability: {
			inStock: "https://schema.org/InStock",
			outOfStock: "https://schema.org/OutOfStock",
			preOrder: "https://schema.org/PreOrder",
		},
		returnPolicy: {
			category: "https://schema.org/MerchantReturnFiniteReturnWindow",
			merchantReturnDays: 30,
			returnMethod: "https://schema.org/ReturnByMail",
			returnFees: "https://schema.org/FreeReturn",
		},
		shipping: {
			handlingTime: { min: 0, max: 1, unit: "DAY" },
			transitTime: { min: 2, max: 5, unit: "DAY" },
			freeShipping: true,
		},
		warrantyDuration: { value: 1, unit: "ANN" },
	},

	// Catalog schema (for Store schema)
	catalog: {
		name: "Product Catalog",
		categories: [
			{ name: "Mushroom Growing Kits", category: "Growing Kits" },
			{ name: "Cultivation Supplies", category: "Supplies" },
			{ name: "Substrates & Media", category: "Substrates" },
			{ name: "Equipment & Tools", category: "Equipment" },
		],
	},

	// Review defaults (when no reviews exist)
	reviews: {
		defaultRating: 4.8,
		defaultCount: 75,
		bestRating: 5,
		worstRating: 1,
	},
} as const;

// ============================================================================
// SECTION 15: UI/UX SETTINGS
// ============================================================================

export const UI_SETTINGS = {
	// Product grid settings
	productGrid: {
		itemsPerPage: 24,
		itemsPerPageOptions: [12, 24, 48, 96],
		defaultView: "grid" as "grid" | "list",
		defaultSort: "featured" as const,
	},

	// Price ranges for filters
	priceRanges: [
		{ label: "Under $25", min: 0, max: 25 },
		{ label: "$25 to $50", min: 25, max: 50 },
		{ label: "$50 to $100", min: 50, max: 100 },
		{ label: "$100 to $200", min: 100, max: 200 },
		{ label: "Over $200", min: 200, max: 999_999 },
	],

	// Pagination
	pagination: {
		postsPerPage: 12,
		productsPerPage: 24,
		maxPaginationButtons: 5,
	},

	// Image sizes (for Next.js Image component)
	imageSizes: {
		thumbnail: "(max-width: 768px) 100px, 150px",
		productCard: "(max-width: 768px) 100vw, 400px",
		productDetail: "(max-width: 768px) 100vw, 50vw",
		hero: "(max-width: 768px) 100vw, 40vw",
		collection: "(max-width: 768px) 100vw, 800px",
	},

	// Animation settings
	animations: {
		pageTransition: 300,
		hoverScale: 1.05,
		fadeInDuration: 200,
	},
} as const;

// ============================================================================
// SECTION 16: ANALYTICS & TRACKING
// ============================================================================

export const ANALYTICS = {
	// Google Analytics
	ga: {
		measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
		enabled: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
	},

	// Google Tag Manager
	gtm: {
		containerId: process.env.NEXT_PUBLIC_GTM_ID,
		enabled: !!process.env.NEXT_PUBLIC_GTM_ID,
	},

	// Facebook Pixel
	facebook: {
		pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
		enabled: !!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
	},

	// Event tracking
	events: {
		trackPageViews: true,
		trackProductViews: true,
		trackAddToCart: true,
		trackPurchases: true,
		trackSearches: true,
	},
} as const;

// ============================================================================
// SECTION 17: OPTICAL ALIGNMENT CONFIGURATION
// ============================================================================

/**
 * Optical alignment settings for UI elements
 * These values ensure visual balance based on human perception
 * rather than pure mathematical alignment
 */
export const OPTICAL_ALIGNMENT = {
	// Icon alignment adjustments by shape
	icons: {
		triangular: {
			// Arrows, carets, play buttons appear left-heavy
			translateX: "2px",
			translateY: "0px",
			description: "Right shift for triangular icons (arrows, carets)",
		},
		circular: {
			// Circles appear high in their containers
			translateX: "0px",
			translateY: "1px",
			description: "Down shift for circular icons (CheckCircle, Clock)",
		},
		bottomHeavy: {
			// Hearts, anchors appear bottom-heavy
			translateX: "0px",
			translateY: "-1px",
			description: "Up shift for bottom-heavy icons (Heart)",
		},
		leftHeavy: {
			// Trucks, some asymmetric icons
			translateX: "2px",
			translateY: "0px",
			description: "Right shift for left-heavy icons (Truck, ShoppingCart)",
		},
		star: {
			// Stars need special handling
			translateX: "0px",
			translateY: "0.5px",
			description: "Slight down shift for star icons",
		},
	},

	// Typography adjustments
	typography: {
		uppercase: {
			// Uppercase appears larger than lowercase at same size
			sizeMultiplier: 0.96, // Reduce to 96% of original
			letterSpacing: "0.05em", // Increase tracking
			description: "Optical size and spacing for uppercase text",
		},
		currency: {
			// Currency symbols should be smaller and raised
			sizeMultiplier: 0.875, // 87.5% of base
			verticalAlign: "0.125em",
			description: "Optical sizing for currency symbols",
		},
		decimals: {
			// Decimal values should be smaller
			sizeMultiplier: 0.8, // 80% of base
			verticalAlign: "0.0625em",
			description: "Optical sizing for price decimals",
		},
	},

	// Spacing adjustments
	spacing: {
		iconTextGap: {
			default: "0.5rem", // 8px
			triangular: "0.4375rem", // 7px on pointed side
			circular: "0.5rem",
			description: "Gap between icons and text for optical balance",
		},
		buttonPadding: {
			textOnly: { x: "1rem", y: "0.5rem" },
			withIcon: { x: "0.75rem", y: "0.5rem" },
			iconOnly: "0.5rem",
			description: "Optical padding for button contexts",
		},
		containerPadding: {
			text: { x: "1rem", y: "0.5rem" },
			icon: "0.5rem",
			mixed: { x: "0.75rem", y: "0.5rem" },
			description: "Optical padding for different content types",
		},
	},

	// Form element adjustments
	forms: {
		inputIconPosition: {
			// Icons in form inputs need slight visual centering
			verticalAdjustment: "-1px",
			horizontalPadding: "0.75rem",
			description: "Optical centering for form input icons",
		},
	},

	// Loading spinner adjustments
	loaders: {
		inButton: {
			translateY: "1px",
			description: "Optical centering for spinners in buttons",
		},
	},

	// Navigation adjustments
	navigation: {
		iconTextAlignment: {
			gap: "0.5rem",
			padding: { x: "0.75rem", y: "0.5rem" },
			description: "Optical spacing for nav items with icons",
		},
	},

	// Badge adjustments
	badges: {
		textPadding: { x: "0.5rem", y: "0.125rem" },
		iconBadgePadding: "0.25rem",
		minHeight: "1.25rem",
		description: "Optical padding for badge components",
	},

	// Card adjustments
	cards: {
		imagePaddingCompensation: "2px", // Rounded corners affect perceived size
		contentPadding: { x: "1rem", y: "0.75rem" },
		description: "Optical adjustments for card components",
	},

	// Enabled/disabled flags
	enabled: {
		icons: true,
		typography: true,
		spacing: true,
		forms: true,
		loaders: true,
		navigation: true,
		badges: true,
		cards: true,
	},
} as const;

/**
 * Get optical alignment value for a specific use case
 */
export function getOpticalAlignmentValue(
	category: keyof typeof OPTICAL_ALIGNMENT,
	subcategory: string,
	property: string
): string | number | undefined {
	const cat = OPTICAL_ALIGNMENT[category as keyof typeof OPTICAL_ALIGNMENT];
	if (cat && typeof cat === "object" && subcategory in cat) {
		const subcat = (cat as any)[subcategory];
		if (subcat && typeof subcat === "object" && property in subcat) {
			return (subcat as any)[property];
		}
	}
	return;
}

/**
 * Check if optical alignment is enabled for a category
 */
export function isOpticalAlignmentEnabled(category: keyof typeof OPTICAL_ALIGNMENT.enabled): boolean {
	return OPTICAL_ALIGNMENT.enabled[category];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the full configuration object
 */
export function getStoreConfig() {
	return {
		brand: BRAND,
		business: BUSINESS,
		contact: CONTACT,
		social: SOCIAL,
		policies: POLICIES,
		features: STORE_FEATURES,
		industry: INDUSTRY,
		seo: SEO,
		content: CONTENT,
		faqs: FAQ_TEMPLATES,
		assets: ASSETS,
		navigation: NAVIGATION,
		schema: SCHEMA_DEFAULTS,
		ui: UI_SETTINGS,
		promotions: PROMOTIONS,
		analytics: ANALYTICS,
		opticalAlignment: OPTICAL_ALIGNMENT,
	};
}

/**
 * Get a specific config value with type safety
 */
export function getConfigValue<T extends keyof ReturnType<typeof getStoreConfig>>(
	section: T
): ReturnType<typeof getStoreConfig>[T] {
	return getStoreConfig()[section];
}

/**
 * Get brand name (most commonly used)
 */
export function getBrandName(): string {
	return BRAND.name;
}

/**
 * Get site URL
 */
export function getSiteUrl(): string {
	return BRAND.url;
}

/**
 * Get domain
 */
export function getDomain(): string {
	return BRAND.domain;
}

/**
 * Replace template variables in text
 * Example: "Browse our {collection} collection" -> "Browse our Kits collection"
 */
export function replaceTemplateVars(text: string, vars: Record<string, string>): string {
	let result = text;
	for (const [key, value] of Object.entries(vars)) {
		result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
	}
	return result;
}

/**
 * Get industry-specific terminology
 */
export function getTerminology() {
	return INDUSTRY.terminology;
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(featureId: string): boolean {
	return STORE_FEATURES.some((f) => f.id === featureId);
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type StoreConfig = ReturnType<typeof getStoreConfig>;
export type ConfigSection = keyof StoreConfig;

// Default export
export default getStoreConfig;
