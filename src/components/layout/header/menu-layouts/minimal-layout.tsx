"use client";

import { ChevronRight } from "lucide-react";
import type { ShopifyCollection, ShopifyPage } from "@/lib/types";

type MenuItem = {
	id: string;
	title: string;
	url: string;
	items?: MenuItem[];
};

type MinimalLayoutProps = {
	menuItems: MenuItem[];
	collections: ShopifyCollection[];
	pages: ShopifyPage[];
	onNavigate: (url: string) => void;
};

/**
 * Minimal Layout
 * For very small stores with < 5 collections and < 5 pages
 * Simple flat list without images or complex grouping
 */
export function MinimalLayout({ menuItems, collections, pages, onNavigate }: MinimalLayoutProps) {
	return (
		<div className="space-y-4">
			{/* Main Navigation */}
			{menuItems.length > 0 && (
				<div className="space-y-1">
					{menuItems.map((item) => (
						<button
							className="group flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
							key={item.id}
							onClick={() => onNavigate(item.url)}
						>
							<span className="font-medium text-foreground text-sm">{item.title}</span>
							<ChevronRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
						</button>
					))}
				</div>
			)}

			{/* Collections - Simple list */}
			{collections.length > 0 && (
				<div className="space-y-1">
					{collections.slice(0, 4).map((collection) => (
						<button
							className="group flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
							key={collection.id}
							onClick={() => onNavigate(`/collections/${collection.handle}`)}
						>
							<span className="text-foreground text-sm">{collection.title}</span>
							<ChevronRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
						</button>
					))}
				</div>
			)}

			{/* Pages - Simple list */}
			{pages.length > 0 && (
				<div className="space-y-1">
					{pages.slice(0, 4).map((page) => (
						<button
							className="group flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
							key={page.id}
							onClick={() => onNavigate(`/pages/${page.handle}`)}
						>
							<span className="text-muted-foreground text-sm">{page.title}</span>
							<ChevronRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
						</button>
					))}
				</div>
			)}
		</div>
	);
}
