"use client";

import { Heart, Home, Loader2, Menu, ShoppingCart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { transformShopifyUrl } from "@/components/utils/transform-shopify-url";
import { useStoreConfig } from "@/hooks/use-store-config";
import { getAllCollections, getPages } from "@/lib/api/shopify/actions";
import { CONTENT } from "@/lib/config/wadesdesign.config";
import type { ShopifyCollection, ShopifyPage } from "@/lib/types";
import type { MenuStrategy } from "@/lib/utils/menu-analyzer";
import { LargeLayout } from "./menu-layouts/large-layout";
import { MediumLayout } from "./menu-layouts/medium-layout";
import { MinimalLayout } from "./menu-layouts/minimal-layout";
import { SmallLayout } from "./menu-layouts/small-layout";

type MenuItem = {
	id: string;
	title: string;
	url: string;
	items?: MenuItem[];
};

type MenuSheetProps = {
	items: MenuItem[];
	strategy: MenuStrategy;
};

const buildPageUrl = (page: ShopifyPage) => {
	if (page.handle) {
		return `/pages/${page.handle}`;
	}
	return transformShopifyUrl(page.onlineStoreUrl || "/");
};

export function MenuSheetFixed({ items, strategy }: MenuSheetProps) {
	const router = useRouter();
	const { storeName } = useStoreConfig();
	const { openCart } = useCart();
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [collections, setCollections] = useState<ShopifyCollection[]>([]);
	const [pages, setPages] = useState<ShopifyPage[]>([]);

	const handleOpenChange = useCallback((open: boolean) => {
		setIsOpen(open);
	}, []);

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		if (collections.length && pages.length) {
			return;
		}

		setIsLoading(true);
		Promise.all([getAllCollections(), getPages()])
			.then(([collectionData, pageData]) => {
				setCollections(collectionData ?? []);
				setPages(pageData ?? []);
			})
			.catch((_error) => {})
			.finally(() => setIsLoading(false));
	}, [isOpen, collections.length, pages.length]);

	const handleNavigate = useCallback(
		(url: string) => {
			setIsOpen(false);
			requestAnimationFrame(() => router.push(url));
		},
		[router]
	);

	const handleCartClick = useCallback(() => {
		setIsOpen(false);
		requestAnimationFrame(() => openCart());
	}, [openCart]);

	// Determine which layout to render based on strategy
	const renderLayout = () => {
		const layoutProps = {
			menuItems: items,
			collections,
			pages,
			onNavigate: handleNavigate,
		};

		switch (strategy.size) {
			case "minimal":
				return <MinimalLayout {...layoutProps} />;
			case "small":
				return <SmallLayout {...layoutProps} />;
			case "medium":
				return <MediumLayout {...layoutProps} />;
			case "large":
				return <LargeLayout {...layoutProps} />;
			default:
				return <SmallLayout {...layoutProps} />;
		}
	};

	return (
		<Sheet onOpenChange={handleOpenChange} open={isOpen}>
			<SheetTrigger asChild>
				<Button
					className="mr-4 h-8 w-8 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					size="icon"
					variant="ghost"
				>
					<Menu className="h-5 w-5" />
					<span className="sr-only">{CONTENT.navigation.buttons.menu}</span>
				</Button>
			</SheetTrigger>
			<SheetContent className="flex w-full flex-col p-0 sm:max-w-md" side="left">
				{/* Header with Menu Strategy Badge */}
				<div className="flex items-center justify-between border-border border-b p-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
							<Menu className="h-5 w-5 text-primary" />
						</div>
						<div>
							<SheetTitle className="flex items-center gap-2 font-semibold text-foreground">
								{CONTENT.navigation.buttons.menu}
								{strategy.size !== "small" && (
									<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 ring-1 ring-primary/20">
										<Sparkles className="h-3 w-3 text-primary" />
										<span className="text-primary text-xs capitalize">{strategy.size}</span>
									</span>
								)}
							</SheetTitle>
							<p className="text-muted-foreground text-xs">{storeName}</p>
						</div>
					</div>
				</div>

				{/* Content */}
				<ScrollArea className="flex-1">
					{isLoading && !collections.length && !pages.length ? (
						<div className="flex items-center justify-center py-20 text-muted-foreground">
							<Loader2 className="h-6 w-6 animate-spin" />
						</div>
					) : (
						<div className="p-4">{renderLayout()}</div>
					)}
				</ScrollArea>

				{/* Footer Actions */}
				<div className="border-border border-t p-4">
					<div className="grid grid-cols-3 gap-2">
						<Button
							className="flex h-auto flex-col gap-1 py-3"
							onClick={() => handleNavigate("/")}
							size="sm"
							variant="outline"
						>
							<Home className="h-5 w-5 text-muted-foreground" />
							<span className="text-xs">{CONTENT.navigation.buttons.home}</span>
						</Button>
						<Button
							className="flex h-auto flex-col gap-1 py-3"
							onClick={() => handleNavigate("/wishlist")}
							size="sm"
							variant="outline"
						>
							<Heart className="h-5 w-5 text-muted-foreground" />
							<span className="text-xs">{CONTENT.navigation.buttons.wishlist}</span>
						</Button>
						<Button
							className="flex h-auto flex-col gap-1 bg-primary py-3 hover:bg-primary/90"
							onClick={handleCartClick}
							size="sm"
							variant="default"
						>
							<ShoppingCart className="h-5 w-5" />
							<span className="text-xs">{CONTENT.navigation.buttons.cart}</span>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
