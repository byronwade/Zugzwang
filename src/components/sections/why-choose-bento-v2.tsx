import {
	Award,
	Box,
	Clock,
	CreditCard,
	Headphones,
	Package,
	Shield,
	ShieldCheck,
	Star,
	Truck,
	Users,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FAQSection } from "./faq-section";

type WhyChooseBentoV2Props = {
	brandName?: string;
	tagline?: string;
	className?: string;
};

export function WhyChooseBentoV2({
	brandName = "Zugzology",
	tagline = "Premium Mushroom Cultivation Supplies",
	className,
}: WhyChooseBentoV2Props) {
	return (
		<section className={cn("w-full border-b border-border/70 bg-gradient-to-b from-background to-muted/20", className)}>
			<div className="container mx-auto px-4 py-8 sm:py-12 lg:py-20">
				{/* Header Section */}
				<div className="mb-8 text-center sm:mb-12 lg:mb-16">
					<h2 className="mb-3 font-bold text-2xl text-foreground tracking-tight sm:mb-4 sm:text-3xl lg:text-4xl">
						Why Choose {brandName}?
					</h2>
					<p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">{tagline}</p>
				</div>

				{/* Bento Grid Layout */}
				<div className="grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-4 sm:auto-rows-[minmax(200px,auto)] sm:grid-cols-2 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
					{/* Large Community Card - Spans 2 columns & 2 rows */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg sm:col-span-2 sm:p-8 md:col-span-2 md:row-span-2">
						<div className="relative z-10 flex h-full flex-col justify-between">
							<div className="mb-4 sm:mb-6">
								<Badge className="mb-3 bg-primary/10 text-primary sm:mb-4" variant="secondary">
									<Users className="mr-1.5 h-4 w-4" />
									TRUSTED COMMUNITY
								</Badge>
								<h3 className="mb-2 font-bold text-foreground text-xl sm:mb-3 sm:text-2xl">Join 10,000+ Growers</h3>
								<p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
									Part of a thriving community of mycology enthusiasts sharing knowledge and success stories.
								</p>
							</div>
							<div className="flex items-center gap-4 sm:gap-6">
								<div className="rounded-lg border border-border bg-background/60 p-3 backdrop-blur-sm sm:p-4">
									<div className="font-bold text-2xl text-primary sm:text-3xl">4.9★</div>
									<div className="text-muted-foreground text-xs">Avg Rating</div>
								</div>
								<div className="rounded-lg border border-border bg-background/60 p-3 backdrop-blur-sm sm:p-4">
									<div className="font-bold text-2xl text-foreground sm:text-3xl">2.5k+</div>
									<div className="text-muted-foreground text-xs">Reviews</div>
								</div>
							</div>
						</div>
					</div>

					{/* Orders Card - Spans 2 columns */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-6 shadow-sm transition-all duration-300 hover:border-green-500/40 hover:shadow-lg sm:col-span-2 md:col-span-2">
						<Badge className="mb-4 border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400" variant="outline">
							Proven Track Record
						</Badge>
						<div className="flex items-end gap-3">
							<div className="rounded-lg bg-green-500/10 p-3 text-green-600 dark:text-green-400">
								<Package className="h-8 w-8" />
							</div>
							<div>
								<div className="font-bold text-3xl text-foreground">25,000+</div>
								<div className="text-muted-foreground text-sm">Orders Shipped</div>
							</div>
						</div>
					</div>

					{/* Free Shipping Card - Spans 2 columns */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg sm:col-span-2 md:col-span-2">
						<div className="rounded-lg bg-primary/10 p-3 text-primary inline-flex mb-4">
							<Truck className="h-8 w-8" />
						</div>
						<h3 className="mb-2 font-semibold text-foreground text-lg sm:text-xl">Free Shipping</h3>
						<p className="text-muted-foreground text-sm sm:text-base">
							On orders over $50 with lightning-fast delivery
						</p>
					</div>

					{/* Quality Badge Card - Large, spans 2 columns & 2 rows */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-6 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg sm:col-span-2 sm:p-8 md:col-span-2 md:row-span-2">
						<div className="relative z-10 flex h-full flex-col justify-between">
							<div className="mb-4 inline-flex self-start rounded-lg bg-amber-500/20 p-4">
								<Award className="h-10 w-10 text-amber-600 dark:text-amber-500" />
							</div>
							<div>
								<h3 className="mb-2 font-bold text-foreground text-xl sm:mb-3 sm:text-2xl">Lab-Tested Quality</h3>
								<p className="mb-4 text-muted-foreground text-sm leading-relaxed sm:text-base">
									Every product undergoes rigorous testing for contamination, viability, and genetic integrity.
								</p>
								<Badge className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400" variant="outline">
									<ShieldCheck className="mr-1.5 h-4 w-4" />
									ISO CERTIFIED
								</Badge>
							</div>
						</div>
					</div>

					{/* 24/7 Support Card - Large, spans 2 columns & 2 rows */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-6 shadow-sm transition-all duration-300 hover:border-blue-500/40 hover:shadow-lg sm:col-span-2 sm:p-8 md:col-span-2 md:row-span-2">
						<div className="relative z-10 flex h-full flex-col justify-between">
							<div>
								<div className="mb-6 flex items-center gap-4">
									<div className="rounded-lg bg-blue-500/20 p-3 text-blue-600 dark:text-blue-400">
										<Clock className="h-8 w-8" />
									</div>
									<div className="flex items-baseline gap-2">
										<span className="font-bold text-4xl text-foreground">24</span>
										<span className="text-2xl text-muted-foreground">/</span>
										<span className="font-bold text-4xl text-foreground">7</span>
									</div>
								</div>
								<h3 className="mb-2 font-bold text-foreground text-lg sm:text-xl">Always Available</h3>
								<p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
									Comprehensive knowledge base and support system ready whenever you need help
								</p>
							</div>
							<div className="mt-6 grid grid-cols-3 gap-2">
								<div className="h-2 rounded-full bg-blue-500" />
								<div className="h-2 rounded-full bg-blue-500/60" />
								<div className="h-2 rounded-full bg-blue-500/30" />
							</div>
						</div>
					</div>

					{/* Discreet Shipping Card - Spans 2 columns */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6 shadow-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg sm:col-span-2 md:col-span-2">
						<div className="mb-4 inline-flex rounded-lg bg-purple-500/20 p-3 text-purple-600 dark:text-purple-400">
							<Box className="h-8 w-8" />
						</div>
						<h3 className="mb-2 font-semibold text-foreground text-lg sm:text-xl">100% Discreet</h3>
						<p className="text-muted-foreground text-sm sm:text-base">
							Plain packaging, zero branding, complete privacy guaranteed
						</p>
					</div>

					{/* Guarantee Card - Spans 2 columns */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-rose-500/10 to-pink-500/5 p-6 shadow-sm transition-all duration-300 hover:border-rose-500/40 hover:shadow-lg sm:col-span-2 md:col-span-2">
						<div className="mb-4 inline-flex rounded-lg bg-rose-500/20 p-3 text-rose-600 dark:text-rose-400">
							<ShieldCheck className="h-8 w-8" />
						</div>
						<div className="mb-2 flex items-center gap-2">
							<h3 className="font-semibold text-foreground text-lg sm:text-xl">30-Day</h3>
							<Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400" variant="secondary">
								GUARANTEE
							</Badge>
						</div>
						<p className="text-muted-foreground text-sm sm:text-base">
							100% money-back if you're not completely satisfied
						</p>
					</div>

					{/* Premium Products - Extra Large, spans 4 columns & 2 rows on desktop */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg sm:col-span-2 sm:p-8 md:col-span-4 md:row-span-2">
						<div className="grid h-full gap-6 md:grid-cols-2 md:gap-8">
							{/* Left side - Content */}
							<div className="flex flex-col justify-center">
								<div className="mb-4 inline-flex self-start rounded-lg bg-primary/10 p-4 text-primary">
									<Star className="h-10 w-10" />
								</div>
								<h3 className="mb-3 font-bold text-2xl text-foreground sm:text-3xl">Premium Selection</h3>
								<p className="mb-6 text-muted-foreground text-sm leading-relaxed sm:text-base">
									Every product is carefully selected, tested, and verified for maximum cultivation success.
								</p>
								<div className="space-y-3">
									{["Lab Tested", "Quality Verified", "Contamination Free"].map((item) => (
										<div key={item} className="flex items-center gap-3">
											<div className="h-2 w-2 rounded-full bg-primary" />
											<span className="font-medium text-foreground">{item}</span>
										</div>
									))}
								</div>
							</div>

							{/* Right side - Stats grid */}
							<div className="flex items-center justify-center">
								<div className="grid w-full max-w-sm gap-4 grid-cols-2">
									<div className="rounded-lg border border-border bg-background p-5 text-center">
										<div className="mb-1 font-bold text-2xl text-primary">100%</div>
										<div className="text-muted-foreground text-xs">Quality</div>
									</div>
									<div className="rounded-lg border border-border bg-background p-5 text-center">
										<div className="mb-1 font-bold text-2xl text-primary">30-Day</div>
										<div className="text-muted-foreground text-xs">Guarantee</div>
									</div>
									<div className="rounded-lg border border-border bg-background p-5 text-center">
										<div className="mb-1 font-bold text-2xl text-primary">Free</div>
										<div className="text-muted-foreground text-xs">Shipping</div>
									</div>
									<div className="rounded-lg border border-border bg-background p-5 text-center">
										<div className="mb-1 font-bold text-2xl text-primary">24/7</div>
										<div className="text-muted-foreground text-xs">Support</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Lightning Fast Card */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-yellow-500/10 to-amber-500/5 p-6 shadow-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-lg sm:col-span-2 md:col-span-2">
						<div className="mb-4 inline-flex rounded-lg bg-yellow-500/20 p-3 text-yellow-600 dark:text-yellow-400">
							<Zap className="h-8 w-8" />
						</div>
						<h3 className="mb-2 font-semibold text-foreground text-lg sm:text-xl">Lightning Fast</h3>
						<p className="text-muted-foreground text-sm sm:text-base">
							Same-day processing on orders placed before 2PM EST
						</p>
					</div>

					{/* Package Tracking Card */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg sm:col-span-2 md:col-span-2">
						<div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
							<Package className="h-8 w-8" />
						</div>
						<h3 className="mb-2 font-semibold text-foreground text-lg sm:text-xl">Real-Time Tracking</h3>
						<p className="mb-4 text-muted-foreground text-sm sm:text-base">
							Follow your order from our facility to your doorstep
						</p>
						<div className="flex h-12 items-end gap-1">
							{[30, 60, 100, 80, 50].map((height, i) => (
								<div
									key={i}
									className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary/60"
									style={{ height: `${height}%` }}
								/>
							))}
						</div>
					</div>

					{/* Secure Checkout Card */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg sm:col-span-2 md:col-span-2">
						<div className="mb-4 inline-flex rounded-lg bg-emerald-500/20 p-3 text-emerald-600 dark:text-emerald-400">
							<Shield className="h-8 w-8" />
						</div>
						<h3 className="mb-2 font-semibold text-foreground text-lg sm:text-xl">Secure Checkout</h3>
						<p className="mb-3 text-muted-foreground text-sm sm:text-base">
							SSL encrypted payment with bank-level security
						</p>
						<div className="flex flex-wrap gap-2">
							{["SSL", "PCI-DSS", "256-bit"].map((item) => (
								<Badge
									key={item}
									className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
									variant="outline"
								>
									{item}
								</Badge>
							))}
						</div>
					</div>

					{/* Quick Delivery Card */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-indigo-500/10 to-violet-500/5 p-6 shadow-sm transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg sm:col-span-2 md:col-span-2">
						<div className="mb-4 inline-flex rounded-lg bg-indigo-500/20 p-3 text-indigo-600 dark:text-indigo-400">
							<Package className="h-8 w-8" />
						</div>
						<h3 className="mb-2 font-semibold text-foreground text-lg sm:text-xl">Ships in 24 Hours</h3>
						<p className="mb-3 text-muted-foreground text-sm sm:text-base">
							Order today, ships tomorrow - guaranteed
						</p>
						<Badge className="border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" variant="outline">
							<Clock className="mr-1.5 h-3.5 w-3.5" />
							24-HR FULFILLMENT
						</Badge>
					</div>

					{/* Expert Support Hours - Spans 3 columns */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-6 shadow-sm transition-all duration-300 hover:border-orange-500/40 hover:shadow-lg sm:col-span-2 md:col-span-2 lg:col-span-3">
						<div className="mb-4 inline-flex rounded-lg bg-orange-500/20 p-3 text-orange-600 dark:text-orange-400">
							<Headphones className="h-8 w-8" />
						</div>
						<h3 className="mb-2 font-semibold text-foreground text-lg sm:text-xl">Expert Support</h3>
						<p className="mb-2 text-muted-foreground text-sm sm:text-base">
							Professional mycologists ready to help with your questions
						</p>
						<div className="font-semibold text-orange-600 text-sm dark:text-orange-400">Mon-Fri, 9am-5pm EST</div>
					</div>

					{/* Payment Options Card - Spans 3 columns */}
					<div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-6 shadow-sm transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg sm:col-span-2 md:col-span-2 lg:col-span-3">
						<div className="mb-4 inline-flex rounded-lg bg-cyan-500/20 p-3 text-cyan-600 dark:text-cyan-400">
							<CreditCard className="h-8 w-8" />
						</div>
						<h3 className="mb-2 font-semibold text-foreground text-lg sm:text-xl">All Payment Methods</h3>
						<p className="mb-4 text-muted-foreground text-sm sm:text-base">
							Credit cards, PayPal, Apple Pay, Shop Pay accepted
						</p>
						<div className="flex flex-wrap gap-2">
							{["Visa", "Mastercard", "Amex", "PayPal", "Shop Pay"].map((card) => (
								<Badge
									key={card}
									className="border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
									variant="outline"
								>
									{card}
								</Badge>
							))}
						</div>
					</div>

					{/* FAQ Section - Full Width */}
					<FAQSection />
				</div>
			</div>
		</section>
	);
}
