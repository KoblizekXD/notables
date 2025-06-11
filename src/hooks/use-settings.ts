import { useState, useEffect, useCallback } from "react";
import { SidebarPosition, SidebarType, Theme } from "@/lib/schemas";
import { settingsService, UISettings } from "@/lib/settings";

interface UseSettingsReturn {
  settings: UISettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (newSettings: Partial<UISettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<UISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userSettings = await settingsService.getSettings();
      setSettings(userSettings);
    } catch (err) {
      console.error("Error loading settings:", err);
      setError(err instanceof Error ? err.message : "Failed to load settings");
      setSettings({
        sidebarPosition: "left",
        sidebarType: "toggle",
        theme: "system",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(
    async (newSettings: Partial<UISettings>) => {
      try {
        setError(null);
        const updatedSettings = await settingsService.updateSettings(
          newSettings
        );
        setSettings(updatedSettings);
      } catch (err) {
        console.error("Error updating settings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update settings"
        );
        throw err; 
      }
    },
    []
  );

  const refreshSettings = useCallback(async () => {
    settingsService.clearAllCaches();
    await loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings,
  };
}

export function useSetting<K extends keyof UISettings>(
  key: K
): [UISettings[K] | null, (value: UISettings[K]) => Promise<void>, boolean] {
  const { settings, updateSettings, loading } = useSettings();
  const [optimisticValue, setOptimisticValue] = useState<UISettings[K] | null>(
    null
  );

  const currentValue = optimisticValue ?? settings?.[key] ?? null;

  const updateSetting = useCallback(
    async (value: UISettings[K]) => {
      setOptimisticValue(value);
      try {
        await updateSettings({ [key]: value } as Partial<UISettings>);
        setOptimisticValue(null);
      } catch (error) {
        setOptimisticValue(null);
        throw error;
      }
    },
    [key, updateSettings]
  );

  return [currentValue, updateSetting, loading];
}
