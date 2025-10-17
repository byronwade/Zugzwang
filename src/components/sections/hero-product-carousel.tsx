"use client";

import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PrefetchLink } from "@/components/ui/prefetch-link";
import { cn } from "@/lib/utils";
import type { ShopifyProduct } from "@/lib/types";

type HeroProductCarouselProps = {
	products: ShopifyProduct[];
};

export function HeroProductCarousel({ products = [] }: HeroProductCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	// Filter products that have images
	const validProducts = products.filter((product) => product.images?.nodes?.[0]?.url);

	// Auto-advance carousel
	useEffect(() => {
		if (!isAutoPlaying || validProducts.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % validProducts.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, validProducts.length]);

	const goToNext = () => {
		setCurrentIndex((prev) => (prev + 1) % validProducts.length);
		setIsAutoPlaying(false);
	};

	const goToPrev = () => {
		setCurrentIndex((prev) => (prev - 1 + validProducts.length) % validProducts.length);
		setIsAutoPlaying(false);
	};

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
		setIsAutoPlaying(false);
	};

	if (!validProducts.length) {
		return (
			<section className="relative h-[calc(100vh-var(--header-height))] min-h-[500px] w-full bg-gradient-to-br from-background via-muted/30 to-background">
				<div className="flex h-full items-center justify-center">
					<div className="text-center">
						<h1 className="mb-4 font-bold text-4xl text-foreground md:text-6xl">Welcome to Our Store</h1>
						<p className="mb-8 text-muted-foreground text-xl">Discover our amazing products</p>
						<Button asChild size="lg">
							<PrefetchLink href="/collections/all">Browse Collections</PrefetchLink>
						</Button>
					</div>
				</div>
			</section>
		);
	}

	const currentProduct = validProducts[currentIndex];
	const currentVariant = currentProduct?.variants?.nodes?.[0];
	const currentImage = currentProduct?.images?.nodes?.[0];

	return (
		<section className="hero-carousel relative h-[calc(100vh-var(--header-height))] min-h-[500px] w-full overflow-hidden bg-background">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

			{/* Carousel slides */}
			<div className="relative h-full">
				{validProducts.map((product, index) => {
					const variant = product.variants?.nodes?.[0];
					const image = product.images?.nodes?.[0];
					const isActive = index === currentIndex;

					return (
						<div
							className={cn(
								"absolute inset-0 transition-opacity duration-700",
								isActive ? "opacity-100" : "pointer-events-none opacity-0"
							)}
							key={product.id}
						>
							{/* Split Layout: Image Left, Content Right */}
							<div className="grid h-full grid-cols-1 lg:grid-cols-2">
								{/* Image Side */}
								<div className="relative flex items-center justify-center bg-muted/30 p-8 lg:p-12">
									{/* Decorative elements */}
									<div className="absolute top-8 right-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
									<div className="absolute bottom-12 left-12 h-40 w-40 rounded-full bg-secondary/5 blur-3xl" />

									{/* Product Image */}
									<div className="relative z-10 aspect-square w-full max-w-2xl">
										<div className="relative h-full w-full overflow-hidden rounded-2xl bg-background shadow-2xl">
											{image && (
												<Image
													alt={image.altText || product.title}
													className="object-cover"
													fill
													priority={index === 0}
													quality={95}
													sizes="(max-width: 1024px) 100vw, 50vw"
													src={image.url}
												/>
											)}
										</div>

										{/* Floating badge */}
										{variant?.compareAtPrice?.amount &&
											Number.parseFloat(variant.compareAtPrice.amount) >
												Number.parseFloat(variant.price.amount || "0") && (
												<div className="absolute top-4 right-4 rounded-full bg-destructive px-4 py-2 font-bold text-destructive-foreground text-sm shadow-lg">
													Sale
												</div>
											)}
									</div>
								</div>

								{/* Content Side */}
								<div className="flex items-center p-8 lg:p-12">
									<div className="w-full max-w-xl">
										{/* Product Badge */}
										{product.productType && (
											<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
												<span className="text-foreground/90 text-xs uppercase tracking-wider">
													{product.productType}
												</span>
											</div>
										)}

										{/* Product Title */}
										<h1 className="mb-4 font-black text-4xl text-foreground leading-tight tracking-tight md:text-5xl lg:text-6xl">
											{product.title}
										</h1>

										{/* Product Description */}
										{product.description && (
											<p className="mb-6 line-clamp-3 text-lg text-muted-foreground leading-relaxed">
												{product.description}
											</p>
										)}

										{/* Rating */}
										<div className="mb-6 flex items-center gap-2">
											<div className="flex">
												{[...Array(5)].map((_, i) => (
													<Star className="h-5 w-5 fill-primary text-primary" key={i} />
												))}
											</div>
											<span className="text-muted-foreground text-sm">(4.9 / 5)</span>
										</div>

										{/* Price */}
										<div className="mb-8 flex items-baseline gap-3">
											<span className="font-bold text-4xl text-foreground">
												{variant?.price.currencyCode === "USD" ? "$" : ""}
												{Number.parseFloat(variant?.price.amount || "0").toFixed(2)}
											</span>
											{variant?.compareAtPrice?.amount &&
												Number.parseFloat(variant.compareAtPrice.amount) >
													Number.parseFloat(variant.price.amount || "0") && (
													<span className="text-2xl text-muted-foreground line-through">
														{variant.price.currencyCode === "USD" ? "$" : ""}
														{Number.parseFloat(variant.compareAtPrice.amount).toFixed(2)}
													</span>
												)}
										</div>

										{/* CTAs */}
										<div className="flex flex-col gap-3 sm:flex-row">
											<Button asChild className="h-14 px-8 text-base" size="lg">
												<PrefetchLink
													className="flex items-center gap-2"
													href={`/products/${product.handle}`}
												>
													<ShoppingCart className="h-5 w-5" />
													View Product
												</PrefetchLink>
											</Button>
											<Button asChild className="h-14 px-8 text-base" size="lg" variant="outline">
												<PrefetchLink href="/collections/all">Browse More</PrefetchLink>
											</Button>
										</div>

										{/* Features */}
										<div className="mt-8 flex flex-wrap gap-6 border-border border-t pt-6">
											<div className="flex items-center gap-2">
												<svg
													className="h-5 w-5 text-primary"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														d="M5 13l4 4L19 7"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
													/>
												</svg>
												<span className="text-muted-foreground text-sm">Free Shipping</span>
											</div>
											<div className="flex items-center gap-2">
												<svg
													className="h-5 w-5 text-primary"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
													/>
												</svg>
												<span className="text-muted-foreground text-sm">Quality Guaranteed</span>
											</div>
											<div className="flex items-center gap-2">
												<svg
													className="h-5 w-5 text-primary"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
													/>
												</svg>
												<span className="text-muted-foreground text-sm">Easy Returns</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Navigation Controls */}
			{validProducts.length > 1 && (
				<>
					{/* Previous/Next Buttons */}
					<button
						aria-label="Previous slide"
						className="absolute top-1/2 left-4 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:scale-110 lg:left-8"
						onClick={goToPrev}
						type="button"
					>
						<ChevronLeft className="h-6 w-6" />
					</button>
					<button
						aria-label="Next slide"
						className="absolute top-1/2 right-4 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:scale-110 lg:right-8"
						onClick={goToNext}
						type="button"
					>
						<ChevronRight className="h-6 w-6" />
					</button>

					{/* Dots Navigation */}
					<div className="absolute right-0 bottom-8 left-0 z-20 flex justify-center gap-2">
						{validProducts.map((_, index) => (
							<button
								aria-label={`Go to slide ${index + 1}`}
								className={cn(
									"h-2 rounded-full transition-all",
									index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
								)}
								key={index}
								onClick={() => goToSlide(index)}
								type="button"
							/>
						))}
					</div>
				</>
			)}
		</section>
	);
}
