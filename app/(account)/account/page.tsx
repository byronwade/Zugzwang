import AccountInfo from "./account-info";
import OrderHistory from "./order-history";
import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/seo-utils";
import { getEnhancedBreadcrumbSchema, getEnhancedPersonSchema } from "@/lib/seo/enhanced-jsonld";
import Script from "next/script";
import { UniversalBreadcrumb, BreadcrumbConfigs } from "@/components/navigation/universal-breadcrumb";
import { requireCustomerSession } from "@/lib/services/customer-session";
import { AccountNavigation } from "./account-navigation";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generateSEOMetadata({
  title: "My Account - Account Dashboard",
  description: "Manage your account information, view order history, track shipments, and update your preferences. Secure customer portal for mushroom cultivation supplies.",
  keywords: [
    "account dashboard",
    "customer account",
    "order history",
    "account settings",
    "customer portal",
    "profile management",
    "order tracking"
  ],
  url: "/account",
  noindex: true, // Account pages shouldn't be indexed for privacy
  openGraph: {
    type: "website",
  },
});

export default async function AccountPage() {
	const { customer } = await requireCustomerSession("/account");
	const breadcrumbSchema = getEnhancedBreadcrumbSchema([
		{ name: "Home", url: "/" },
		{ name: "My Account", url: "/account" },
	]);
	const customerSchema = getEnhancedPersonSchema({
		name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Customer",
		email: customer.email,
	});
	const orders = customer.orders?.edges?.map(({ node }) => node) ?? [];

	return (
		<>
			{/* JSON-LD Structured Data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(customerSchema),
				}}
			/>

			{/* Google Analytics for Account View */}
			<Script id="account-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					window.dataLayer.push({
						'event': 'page_view',
						'page_type': 'account_dashboard',
						'page_location': window.location.href,
						'user_id': '${customer.id}',
						'customer_type': '${orders.length > 0 ? "returning" : "new"}'
					});
				`}
			</Script>

			<div className="min-h-screen bg-muted/50">
				<div className="pt-4 px-4">
					<UniversalBreadcrumb items={BreadcrumbConfigs.account()} />
				</div>
				<AccountNavigation active="dashboard" />
				<div className="flex flex-col gap-8 p-4 pb-16 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<AccountInfo customer={customer} />
					</div>
					<div className="w-full lg:w-2/3">
						<OrderHistory orders={orders} />
					</div>
				</div>
			</div>
		</>
	);
}
