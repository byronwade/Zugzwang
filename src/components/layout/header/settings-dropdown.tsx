"use client";

import { Monitor, Moon, Sun, RotateCcw, Settings2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUISettings } from "@/hooks/use-ui-settings";
import type {
	AnimationSpeed,
	ContainerWidth,
	Density,
	FontSize,
	GridDensity,
} from "@/contexts/settings-context";

interface SettingsDropdownProps {
	variant?: "icon" | "button";
}

export function SettingsDropdown({ variant = "icon" }: SettingsDropdownProps): JSX.Element {
	const { theme, setTheme } = useTheme();
	const { settings, updateSetting, resetSettings } = useUISettings();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{variant === "icon" ? (
					<Button
						variant="ghost"
						size="icon"
						className="relative h-9 w-9 rounded-md hover:bg-muted"
						aria-label="Open settings"
					>
						<Settings2 className="h-[18px] w-[18px]" />
					</Button>
				) : (
					<Button variant="outline" size="sm" className="gap-2">
						<Settings2 className="h-4 w-4" />
						Settings
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[340px] max-h-[600px] overflow-y-auto">
				<DropdownMenuLabel className="flex items-center justify-between">
					<span>Settings</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={resetSettings}
						className="h-7 gap-1 text-xs"
						aria-label="Reset to defaults"
					>
						<RotateCcw className="h-3 w-3" />
						Reset
					</Button>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Appearance Section */}
				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
						Appearance
					</DropdownMenuLabel>

					{/* Theme Switcher */}
					<div className="px-2 py-3">
						<Label className="text-sm font-medium">Theme</Label>
						<RadioGroup
							value={theme}
							onValueChange={setTheme}
							className="mt-2 grid grid-cols-3 gap-2"
						>
							<div>
								<RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
								<Label
									htmlFor="theme-light"
									className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
								>
									<Sun className="h-5 w-5" />
									<span className="text-xs">Light</span>
								</Label>
							</div>
							<div>
								<RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
								<Label
									htmlFor="theme-dark"
									className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
								>
									<Moon className="h-5 w-5" />
									<span className="text-xs">Dark</span>
								</Label>
							</div>
							<div>
								<RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
								<Label
									htmlFor="theme-system"
									className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
								>
									<Monitor className="h-5 w-5" />
									<span className="text-xs">System</span>
								</Label>
							</div>
						</RadioGroup>
					</div>

					{/* Container Width */}
					<div className="px-2 py-3">
						<Label htmlFor="container-width" className="text-sm font-medium">
							Container Width
						</Label>
						<Select
							value={settings.containerWidth}
							onValueChange={(value) => updateSetting("containerWidth", value as ContainerWidth)}
						>
							<SelectTrigger id="container-width" className="mt-2">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="default">Default</SelectItem>
								<SelectItem value="narrow">Narrow (64rem)</SelectItem>
								<SelectItem value="wide">Wide (80rem)</SelectItem>
								<SelectItem value="full">Full Width</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Density */}
					<div className="px-2 py-3">
						<Label htmlFor="density" className="text-sm font-medium">
							Spacing Density
						</Label>
						<Select
							value={settings.density}
							onValueChange={(value) => updateSetting("density", value as Density)}
						>
							<SelectTrigger id="density" className="mt-2">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="compact">Compact</SelectItem>
								<SelectItem value="comfortable">Comfortable</SelectItem>
								<SelectItem value="spacious">Spacious</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{/* Accessibility Section */}
				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
						Accessibility
					</DropdownMenuLabel>

					{/* Font Size */}
					<div className="px-2 py-3">
						<Label htmlFor="font-size" className="text-sm font-medium">
							Font Size
						</Label>
						<Select
							value={settings.fontSize}
							onValueChange={(value) => updateSetting("fontSize", value as FontSize)}
						>
							<SelectTrigger id="font-size" className="mt-2">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="small">Small</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="large">Large</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Reduce Motion */}
					<DropdownMenuItem
						className="flex items-center justify-between px-2 py-3"
						onSelect={(e) => e.preventDefault()}
					>
						<Label htmlFor="reduce-motion" className="cursor-pointer text-sm font-medium">
							Reduce Motion
						</Label>
						<Switch
							id="reduce-motion"
							checked={settings.reduceMotion}
							onCheckedChange={(checked) => updateSetting("reduceMotion", checked)}
						/>
					</DropdownMenuItem>

					{/* High Contrast */}
					<DropdownMenuItem
						className="flex items-center justify-between px-2 py-3"
						onSelect={(e) => e.preventDefault()}
					>
						<Label htmlFor="high-contrast" className="cursor-pointer text-sm font-medium">
							High Contrast
						</Label>
						<Switch
							id="high-contrast"
							checked={settings.highContrast}
							onCheckedChange={(checked) => updateSetting("highContrast", checked)}
						/>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{/* Display Section */}
				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
						Display
					</DropdownMenuLabel>

					{/* Animation Speed */}
					<div className="px-2 py-3">
						<Label htmlFor="animation-speed" className="text-sm font-medium">
							Animation Speed
						</Label>
						<Select
							value={settings.animationSpeed}
							onValueChange={(value) => updateSetting("animationSpeed", value as AnimationSpeed)}
						>
							<SelectTrigger id="animation-speed" className="mt-2">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="full">Full</SelectItem>
								<SelectItem value="reduced">Reduced</SelectItem>
								<SelectItem value="none">None</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Grid Density */}
					<div className="px-2 py-3">
						<Label htmlFor="grid-density" className="text-sm font-medium">
							Product Grid Columns
						</Label>
						<Select
							value={settings.gridDensity}
							onValueChange={(value) => updateSetting("gridDensity", value as GridDensity)}
						>
							<SelectTrigger id="grid-density" className="mt-2">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="3">3 Columns</SelectItem>
								<SelectItem value="4">4 Columns</SelectItem>
								<SelectItem value="5">5 Columns</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
