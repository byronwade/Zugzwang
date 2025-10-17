import { CheckCircle, Play, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrefetchLink } from "@/components/ui/prefetch-link";
import type { ShopifyProduct } from "@/lib/types";

type HeroVideoCinematicProps = {
	products?: ShopifyProduct[];
};

// Server Component - no client JS needed
// CSS animations replace Framer Motion for better performance
export function HeroVideoCinematic({ products = [] }: HeroVideoCinematicProps) {
	return (
		<section className="hero-section relative w-full overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background py-16 sm:py-20 md:h-[calc(100vh-var(--header-height))] md:py-0">
			{/* Background Effects */}
			<div className="video-container absolute inset-0">
				{/* Animated gradient background */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

				{/* Animated glow effects */}
				<div className="absolute inset-0 opacity-30">
					<div className="glow-1 absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.15)_0%,transparent_50%)]" />
					<div className="glow-2 absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,hsl(var(--primary)/0.1)_0%,transparent_50%)]" />
				</div>

				{/* Vignette Overlay */}
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.4)_70%,hsl(var(--background)/0.8)_100%)]" />

				{/* Bottom Gradient - Fades to background color */}
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
			</div>

			{/* Content - CSS animations instead of Framer Motion */}
			<div className="hero-content relative z-10 flex items-start md:h-full md:items-center">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-3xl lg:max-w-4xl">
						{/* Small badge */}
						<div className="hero-badge mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 backdrop-blur-md sm:mb-6">
							<Sparkles className="h-4 w-4 text-primary" />
							<span className="text-foreground/90 text-sm uppercase tracking-wider">Premium Quality</span>
						</div>

						{/* Main Headline */}
						<h1 className="hero-title mb-4 font-black text-5xl text-foreground leading-[1.1] tracking-tight sm:mb-6 sm:text-6xl md:text-7xl lg:text-8xl">
							<span className="block">Discover</span>
							<span className="block text-primary">Quality</span>
							<span className="block">Products</span>
						</h1>

						{/* Tagline */}
						<p className="hero-tagline mb-6 max-w-2xl text-lg text-muted-foreground leading-relaxed sm:mb-8 sm:text-xl lg:text-2xl">
							Shop our curated collection of premium products. Quality guaranteed, shipped fast.
						</p>

						{/* CTAs */}
						<div className="hero-cta flex flex-col gap-3 sm:flex-row sm:gap-4">
							{/* Primary CTA */}
							<Button
								asChild
								className="group relative h-12 overflow-hidden rounded-md bg-primary px-8 font-semibold text-base text-primary-foreground shadow-2xl transition-all hover:bg-primary/90 hover:shadow-primary/50 sm:h-14 sm:px-10 sm:text-lg"
							>
								<PrefetchLink className="flex items-center gap-2" href="/products">
									<Play className="h-5 w-5 transition-transform group-hover:scale-110" />
									Shop Now
								</PrefetchLink>
							</Button>

							{/* Secondary CTA */}
							<Button
								asChild
								className="h-12 rounded-md border-2 border-primary/30 bg-background/10 px-8 font-semibold text-base text-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:bg-primary/10 sm:h-14 sm:px-10 sm:text-lg"
								variant="outline"
							>
								<PrefetchLink href="/collections/all">Browse Collections</PrefetchLink>
							</Button>
						</div>

						{/* Social Proof */}
						<div className="hero-social mt-8 flex flex-wrap items-center gap-4 sm:mt-12 sm:gap-6">
							<div className="flex items-center gap-2">
								<div className="-space-x-2 flex">
									{[...new Array(4)].map((_, i) => (
										<div
											className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/80 to-primary"
											key={i}
										/>
									))}
								</div>
								<span className="text-muted-foreground text-sm">Trusted Customers</span>
							</div>

							<div className="h-4 w-px bg-border" />

							<div className="flex items-center gap-2">
								<Star className="h-5 w-5 fill-primary text-primary" />
								<span className="text-muted-foreground text-sm">4.9/5 Rating</span>
							</div>

							<div className="h-4 w-px bg-border" />

							<div className="flex items-center gap-2">
								<CheckCircle className="h-5 w-5 text-primary" />
								<span className="text-muted-foreground text-sm">Fast Shipping</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Scroll Indicator - pure CSS */}
			<div className="scroll-indicator absolute right-0 bottom-8 left-0 z-20 flex justify-center">
				<div className="flex flex-col items-center gap-2">
					<span className="text-muted-foreground text-xs uppercase tracking-widest">Scroll</span>
					<div className="h-8 w-5 rounded-full border-2 border-border">
						<div className="scroll-dot mx-auto mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/70" />
					</div>
				</div>
			</div>
		</section>
	);
}
