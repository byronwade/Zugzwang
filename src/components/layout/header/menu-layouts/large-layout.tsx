"use client";

import { BookOpen, ChevronRight, Layers, Package, Search, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ShopifyCollection, ShopifyPage } from "@/lib/types";

type MenuItem = {
	id: string;
	title: string;
	url: string;
	items?: MenuItem[];
};

type LargeLayoutProps = {
	menuItems: MenuItem[];
	collections: ShopifyCollection[];
	pages: ShopifyPage[];
	onNavigate: (url: string) => void;
};

/**
 * Large Layout
 * For large stores with > 15 collections and > 20 pages
 * Advanced mega menu with tabs, 3-column grids, search, categorization
 */
export function LargeLayout({ menuItems, collections, pages, onNavigate }: LargeLayoutProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("all");

	// Sort collections by product count (most popular first)
	const featuredCollections = useMemo(() => {
		return [...collections]
			.sort((a, b) => {
				const aCount = a.products?.productsCount ?? a.products?.nodes?.length ?? 0;
				const bCount = b.products?.productsCount ?? b.products?.nodes?.length ?? 0;
				return bCount - aCount;
			})
			.slice(0, 3);
	}, [collections]);

	// Filter based on search
	const filteredCollections = useMemo(() => {
		return collections.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [collections, searchQuery]);

	const filteredPages = useMemo(() => {
		return pages.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [pages, searchQuery]);

	const filteredMenuItems = useMemo(() => {
		return menuItems.filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [menuItems, searchQuery]);

	return (
		<div className="space-y-6">
			{/* Search Bar with Enhanced Styling */}
			<div className="relative px-2">
				<Search className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					className="h-11 pl-9 pr-4 text-base"
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search collections, pages, and menu items..."
					value={searchQuery}
				/>
			</div>

			{/* Featured/Popular Collections Banner */}
			{!searchQuery && featuredCollections.length > 0 && (
				<div className="space-y-3 rounded-lg bg-primary/5 p-4">
					<div className="flex items-center gap-2">
						<TrendingUp className="h-4 w-4 text-primary" />
						<h3 className="font-semibold text-foreground text-sm">Popular Collections</h3>
					</div>
					<div className="grid grid-cols-3 gap-2">
						{featuredCollections.map((collection) => (
							<button
								className="group flex flex-col items-start gap-2 rounded-md bg-background p-2 transition-colors hover:bg-muted"
								key={collection.id}
								onClick={() => onNavigate(`/collections/${collection.handle}`)}
							>
								<div className="relative h-16 w-full overflow-hidden rounded-md bg-muted">
									{collection.image?.url ? (
										<Image
											alt={collection.title}
											className="h-full w-full object-cover"
											fill
											sizes="120px"
											src={collection.image.url}
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center">
											<Package className="h-5 w-5 text-muted-foreground" />
										</div>
									)}
									<Badge className="absolute top-1 right-1 h-5 px-1.5 text-xs" variant="secondary">
										{collection.products?.productsCount ?? collection.products?.nodes?.length ?? 0}
									</Badge>
								</div>
								<p className="w-full truncate text-left font-medium text-foreground text-xs">{collection.title}</p>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Tabbed Content */}
			<Tabs className="w-full" onValueChange={setActiveTab} value={activeTab}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="all">
						<Layers className="mr-2 h-4 w-4" />
						All
					</TabsTrigger>
					<TabsTrigger value="collections">
						<Package className="mr-2 h-4 w-4" />
						Collections
					</TabsTrigger>
					<TabsTrigger value="pages">
						<BookOpen className="mr-2 h-4 w-4" />
						Pages
					</TabsTrigger>
				</TabsList>

				{/* All Tab */}
				<TabsContent className="mt-4 space-y-6" value="all">
					{/* Navigation */}
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
											<div className="mt-1 ml-4 grid grid-cols-2 gap-1 border-muted-foreground/20 border-l pl-3">
												{item.items.map((subItem) => (
													<button
														className="group flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-muted"
														key={subItem.id}
														onClick={() => onNavigate(subItem.url)}
													>
														<span className="truncate text-muted-foreground text-xs">{subItem.title}</span>
													</button>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{/* Collections Grid (3 columns) */}
					{filteredCollections.length > 0 && (
						<div className="space-y-2">
							<h3 className="mb-3 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
								All Collections
							</h3>
							<div className="grid grid-cols-3 gap-2">
								{filteredCollections.slice(0, 12).map((collection) => (
									<button
										className="group flex flex-col items-start gap-2 rounded-lg p-2 transition-colors hover:bg-muted"
										key={collection.id}
										onClick={() => onNavigate(`/collections/${collection.handle}`)}
									>
										<div className="relative h-16 w-full overflow-hidden rounded-md bg-muted">
											{collection.image?.url ? (
												<Image
													alt={collection.title}
													className="h-full w-full object-cover"
													fill
													sizes="120px"
													src={collection.image.url}
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center">
													<Package className="h-5 w-5 text-muted-foreground" />
												</div>
											)}
										</div>
										<p className="w-full truncate text-left font-medium text-foreground text-xs">{collection.title}</p>
										<p className="text-muted-foreground text-xs">
											{collection.products?.productsCount ?? collection.products?.nodes?.length ?? 0} products
										</p>
									</button>
								))}
							</div>
						</div>
					)}

					{/* Pages Grid (2 columns) */}
					{filteredPages.length > 0 && (
						<div className="space-y-2">
							<h3 className="mb-3 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
								Information
							</h3>
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
				</TabsContent>

				{/* Collections Only Tab */}
				<TabsContent className="mt-4" value="collections">
					<div className="grid grid-cols-3 gap-3">
						{filteredCollections.map((collection) => (
							<button
								className="group flex flex-col items-start gap-2 rounded-lg p-3 transition-colors hover:bg-muted"
								key={collection.id}
								onClick={() => onNavigate(`/collections/${collection.handle}`)}
							>
								<div className="relative h-20 w-full overflow-hidden rounded-md bg-muted">
									{collection.image?.url ? (
										<Image
											alt={collection.title}
											className="h-full w-full object-cover"
											fill
											sizes="150px"
											src={collection.image.url}
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
										{collection.products?.productsCount ?? collection.products?.nodes?.length ?? 0} products
									</p>
								</div>
							</button>
						))}
					</div>
				</TabsContent>

				{/* Pages Only Tab */}
				<TabsContent className="mt-4" value="pages">
					<div className="grid grid-cols-2 gap-2">
						{filteredPages.map((page) => (
							<button
								className="group flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
								key={page.id}
								onClick={() => onNavigate(`/pages/${page.handle}`)}
							>
								<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary/10">
									<BookOpen className="h-5 w-5 text-primary" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium text-foreground text-sm">{page.title}</p>
									{page.bodySummary && (
										<p className="line-clamp-2 text-muted-foreground text-xs">{page.bodySummary}</p>
									)}
								</div>
							</button>
						))}
					</div>
				</TabsContent>
			</Tabs>

			{/* No results message */}
			{searchQuery &&
				filteredCollections.length === 0 &&
				filteredPages.length === 0 &&
				filteredMenuItems.length === 0 && (
					<div className="py-12 text-center">
						<Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
						<p className="font-medium text-foreground text-sm">No results found</p>
						<p className="text-muted-foreground text-xs">Try searching for something else</p>
					</div>
				)}
		</div>
	);
}
