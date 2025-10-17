"use client";

import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";

// TypeScript types for settings
export type ContainerWidth = "default" | "narrow" | "wide" | "full";
export type Density = "compact" | "comfortable" | "spacious";
export type FontSize = "small" | "medium" | "large";
export type AnimationSpeed = "full" | "reduced" | "none";
export type GridDensity = "3" | "4" | "5";

export interface UISettings {
	// Appearance
	containerWidth: ContainerWidth;
	density: Density;

	// Accessibility
	fontSize: FontSize;
	reduceMotion: boolean;
	highContrast: boolean;

	// Display
	animationSpeed: AnimationSpeed;
	gridDensity: GridDensity;
}

// Default settings
const DEFAULT_SETTINGS: UISettings = {
	containerWidth: "default",
	density: "comfortable",
	fontSize: "medium",
	reduceMotion: false,
	highContrast: false,
	animationSpeed: "full",
	gridDensity: "4",
};

// Context type
interface SettingsContextType {
	settings: UISettings;
	updateSetting: <K extends keyof UISettings>(key: K, value: UISettings[K]) => void;
	resetSettings: () => void;
}

// Create context
export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = "ui-settings-preferences";

// Provider component
interface SettingsProviderProps {
	children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps): JSX.Element {
	const [settings, setSettings] = useState<UISettings>(DEFAULT_SETTINGS);
	const [isInitialized, setIsInitialized] = useState(false);

	// Load settings from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as Partial<UISettings>;
				setSettings((prev) => ({ ...prev, ...parsed }));
			}
		} catch (error) {
			console.error("Failed to load UI settings:", error);
		} finally {
			setIsInitialized(true);
		}
	}, []);

	// Apply settings to document
	useEffect(() => {
		if (!isInitialized) {
			return;
		}

		const root = document.documentElement;

		// Container width CSS variable
		const containerWidthMap: Record<ContainerWidth, string> = {
			default: "",
			narrow: "64rem",
			wide: "80rem",
			full: "100%",
		};
		root.style.setProperty("--container-max-width", containerWidthMap[settings.containerWidth]);

		// Density spacing
		const densityMap: Record<Density, string> = {
			compact: "0.75",
			comfortable: "1",
			spacious: "1.25",
		};
		root.style.setProperty("--density-scale", densityMap[settings.density]);

		// Font size
		const fontSizeMap: Record<FontSize, string> = {
			small: "0.875",
			medium: "1",
			large: "1.125",
		};
		root.style.setProperty("--font-scale", fontSizeMap[settings.fontSize]);

		// Reduce motion
		root.style.setProperty("--animation-duration", settings.reduceMotion ? "0.01ms" : "200ms");

		// High contrast
		if (settings.highContrast) {
			root.classList.add("high-contrast");
		} else {
			root.classList.remove("high-contrast");
		}

		// Animation speed
		const animationSpeedMap: Record<AnimationSpeed, string> = {
			full: "200ms",
			reduced: "100ms",
			none: "0.01ms",
		};
		root.style.setProperty("--animation-speed", animationSpeedMap[settings.animationSpeed]);

		// Grid density
		root.style.setProperty("--grid-columns", settings.gridDensity);
	}, [settings, isInitialized]);

	// Save settings to localStorage whenever they change
	useEffect(() => {
		if (!isInitialized) {
			return;
		}

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
		} catch (error) {
			console.error("Failed to save UI settings:", error);
		}
	}, [settings, isInitialized]);

	// Update a single setting
	const updateSetting = useCallback(<K extends keyof UISettings>(key: K, value: UISettings[K]) => {
		setSettings((prev) => ({
			...prev,
			[key]: value,
		}));
	}, []);

	// Reset to default settings
	const resetSettings = useCallback(() => {
		setSettings(DEFAULT_SETTINGS);
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch (error) {
			console.error("Failed to reset UI settings:", error);
		}
	}, []);

	const value: SettingsContextType = {
		settings,
		updateSetting,
		resetSettings,
	};

	return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
