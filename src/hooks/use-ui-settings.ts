import { useContext } from "react";
import { SettingsContext } from "@/contexts/settings-context";

/**
 * Custom hook to access UI settings
 * @throws {Error} If used outside of SettingsProvider
 */
export function useUISettings() {
	const context = useContext(SettingsContext);

	if (context === undefined) {
		throw new Error("useUISettings must be used within a SettingsProvider");
	}

	return context;
}
