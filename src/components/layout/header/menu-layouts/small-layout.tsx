"use client";

import { ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import type { ShopifyCollection, ShopifyPage } from "@/lib/types";
import type { SpecialCollection } from "@/lib/utils/special-collections-detector";

type MenuItem = {
	id: string;
	title: string;
	url: string;
	items?: MenuItem[];
};

type SmallLayoutProps = {
	menuItems: MenuItem[];
	collections: ShopifyCollection[];
	pages: ShopifyPage[];
	onNavigate: (url: string) => void;
	specialCollections?: SpecialCollection[];
	showAllProducts?: boolean;
};

/**
 * Small Layout
 * For small stores with 3-7 collections and 3-10 pages
 * Shows images for collections, clean organization
 */
export function SmallLayout({
	menuItems,
	collections,
	pages,
	onNavigate,
	specialCollections = [],
	showAllProducts = true,
}: SmallLayoutProps) {
	return (
		<div className="space-y-6">
			{/* Main Navigation */}
			{menuItems.length > 0 && (
				<div className="space-y-2">
					<h3 className="mb-3 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
						Navigation
					</h3>
					<div className="space-y-1">
						{menuItems.map((item) => (
							<div key={item.id}>
								<button
									className="group flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
									onClick={() => onNavigate(item.url)}
								>
									<span className="font-medium text-foreground text-sm">{item.title}</span>
									<ChevronRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
								</button>
								{/* Render submenu items if they exist */}
								{item.items && item.items.length > 0 && (
									<div className="mt-1 ml-4 space-y-1 border-muted-foreground/20 border-l pl-3">
										{item.items.map((subItem) => (
											<button
												className="group flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-muted"
												key={subItem.id}
												onClick={() => onNavigate(subItem.url)}
											>
												<span className="text-muted-foreground text-xs">{subItem.title}</span>
												<ChevronRight className="h-3 w-3 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
											</button>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Special Collections & All Products */}
			{(showAllProducts || specialCollections.length > 0) && (
				<div className="space-y-2">
					<h3 className="mb-3 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Quick Links</h3>
					<div className="space-y-1">
						{/* All Products Link */}
						{showAllProducts && (
							<button
								className="group flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
								onClick={() => onNavigate("/collections/all")}
							>
								<span className="font-medium text-foreground text-sm">All Products</span>
								<ChevronRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
							</button>
						)}

						{/* Special Collections */}
						{specialCollections.map((special) => (
							<button
								className="group flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
								key={special.type}
								onClick={() => onNavigate(`/collections/${special.collection.handle}`)}
							>
								<span className="font-medium text-foreground text-sm">{special.label}</span>
								<ChevronRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
							</button>
						))}
					</div>
				</div>
			)}

			{/* Collections with Images */}
			{collections.length > 0 && (
				<div className="space-y-2">
					<h3 className="mb-3 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
						Shop Collections
					</h3>
					<div className="space-y-1">
						{collections
							.filter((collection) => {
								const productCount =
									collection.products?.productsCount ?? collection.products?.nodes?.length ?? 0;
								return productCount > 0;
							})
							.slice(0, 6)
							.map((collection) => (
							<button
								className="group flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
								key={collection.id}
								onClick={() => onNavigate(`/collections/${collection.handle}`)}
							>
								<div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
									{collection.image?.url ? (
										<Image
											alt={collection.title}
											className="h-full w-full object-cover"
											height={48}
											src={collection.image.url}
											width={48}
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center">
											<Package className="h-5 w-5 text-muted-foreground" />
										</div>
									)}
								</div>
								<div className="min-w-0 flex-1 text-left">
									<p className="truncate font-medium text-foreground text-sm">{collection.title}</p>
									<p className="text-muted-foreground text-xs">
										{collection.products?.productsCount ?? collection.products?.nodes?.length ?? 0} products
									</p>
								</div>
								<ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
							</button>
						))}
					</div>
				</div>
			)}

			{/* Pages */}
			{pages.length > 0 && (
				<div className="space-y-2">
					<h3 className="mb-3 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Information</h3>
					<div className="space-y-1">
						{pages.slice(0, 6).map((page) => (
							<button
								className="group flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
								key={page.id}
								onClick={() => onNavigate(`/pages/${page.handle}`)}
							>
								<span className="text-foreground text-sm">{page.title}</span>
								<ChevronRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
