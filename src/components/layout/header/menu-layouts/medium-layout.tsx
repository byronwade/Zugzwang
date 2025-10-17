"use client";

import { BookOpen, ChevronRight, Package, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { ShopifyCollection, ShopifyPage } from "@/lib/types";

type MenuItem = {
	id: string;
	title: string;
	url: string;
	items?: MenuItem[];
};

type MediumLayoutProps = {
	menuItems: MenuItem[];
	collections: ShopifyCollection[];
	pages: ShopifyPage[];
	onNavigate: (url: string) => void;
};

/**
 * Medium Layout
 * For growing stores with 8-15 collections and 11-20 pages
 * Includes search, grouped sections, 2-column grids
 */
export function MediumLayout({ menuItems, collections, pages, onNavigate }: MediumLayoutProps) {
	const [searchQuery, setSearchQuery] = useState("");

	// Filter collections and pages based on search and product count
	const filteredCollections = collections.filter((c) => {
		const productCount = c.products?.productsCount ?? c.products?.nodes?.length ?? 0;
		return productCount > 0 && c.title.toLowerCase().includes(searchQuery.toLowerCase());
	});

	const filteredPages = pages.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

	const filteredMenuItems = menuItems.filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

	return (
		<div className="space-y-6">
			{/* Search Bar */}
			<div className="relative px-2">
				<Search className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					className="h-10 pl-9 pr-4"
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search menu..."
					value={searchQuery}
				/>
			</div>

			{/* Main Navigation */}
			{filteredMenuItems.length > 0 && (
				<div className="space-y-2">
					<h3 className="mb-3 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
						Navigation
					</h3>
					<div className="space-y-1">
						{filteredMenuItems.map((item) => (
							<div key={item.id}>
								<button
									className="group flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
									onClick={() => onNavigate(item.url)}
								>
									<span className="font-medium text-foreground text-sm">{item.title}</span>
									<ChevronRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
								</button>
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

			{/* Collections Grid (2 columns) */}
			{filteredCollections.length > 0 && (
				<div className="space-y-2">
					<h3 className="mb-3 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
						Shop Collections
					</h3>
					<div className="grid grid-cols-2 gap-2">
						{filteredCollections.slice(0, 8).map((collection) => (
							<button
								className="group flex flex-col items-start gap-2 rounded-lg p-3 transition-colors hover:bg-muted"
								key={collection.id}
								onClick={() => onNavigate(`/collections/${collection.handle}`)}
							>
								<div className="h-20 w-full overflow-hidden rounded-md bg-muted">
									{collection.image?.url ? (
										<Image
											alt={collection.title}
											className="h-full w-full object-cover"
											height={80}
											src={collection.image.url}
											width={120}
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center">
											<Package className="h-6 w-6 text-muted-foreground" />
										</div>
									)}
								</div>
								<div className="w-full text-left">
									<p className="truncate font-medium text-foreground text-sm">{collection.title}</p>
									<p className="text-muted-foreground text-xs">
										{collection.products?.productsCount ?? collection.products?.nodes?.length ?? 0} items
									</p>
								</div>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Pages Grid (2 columns) */}
			{filteredPages.length > 0 && (
				<div className="space-y-2">
					<h3 className="mb-3 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Information</h3>
					<div className="grid grid-cols-2 gap-2">
						{filteredPages.slice(0, 8).map((page) => (
							<button
								className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
								key={page.id}
								onClick={() => onNavigate(`/pages/${page.handle}`)}
							>
								<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary/10">
									<BookOpen className="h-4 w-4 text-primary" />
								</div>
								<div className="min-w-0 flex-1 text-left">
									<p className="truncate font-medium text-foreground text-sm">{page.title}</p>
								</div>
							</button>
						))}
					</div>
				</div>
			)}

			{/* No results message */}
			{searchQuery &&
				filteredCollections.length === 0 &&
				filteredPages.length === 0 &&
				filteredMenuItems.length === 0 && (
					<div className="py-8 text-center">
						<p className="text-muted-foreground text-sm">No results found for &quot;{searchQuery}&quot;</p>
					</div>
				)}
		</div>
	);
}
