"use client";

import {
  SidebarProvider as BaseSidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSettings } from "@/hooks/use-settings";
import type { UISettings } from "@/lib/settings";
import { useTheme } from "next-themes";
import type React from "react";
import { createContext, useContext, useEffect } from "react";

interface SettingsContextType {
  settings: UISettings | null;
  loading: boolean;
  updateSettings: (newSettings: Partial<UISettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

interface SidebarProviderProps {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function SidebarProvider({
  children,
  className = "flex flex-col",
  defaultOpen = false,
}: SidebarProviderProps) {
  const { settings, loading, updateSettings } = useSettings();

  return (
    <BaseSidebarProvider className={className} defaultOpen={defaultOpen}>
      <ProviderContent
        settings={settings}
        loading={loading}
        updateSettings={updateSettings}>
        {children}
      </ProviderContent>
    </BaseSidebarProvider>
  );
}

function ProviderContent({
  children,
  settings,
  loading,
  updateSettings,
}: {
  children: React.ReactNode;
  settings: UISettings | null;
  loading: boolean;
  updateSettings: (newSettings: Partial<UISettings>) => Promise<void>;
}) {
  const { setTheme } = useTheme();
  const {
    sidebarPosition,
    sidebarType,
    setSidebarPosition,
    setSidebarType,
    setOpen,
  } = useSidebar();

  useEffect(() => {
    if (settings?.theme) setTheme(settings.theme);
  }, [settings?.theme, setTheme]);

  useEffect(() => {
    if (
      settings?.sidebarPosition &&
      settings.sidebarPosition !== sidebarPosition
    )
      setSidebarPosition(settings.sidebarPosition);
  }, [settings?.sidebarPosition, sidebarPosition, setSidebarPosition]);

  useEffect(() => {
    if (settings?.sidebarType && settings.sidebarType !== sidebarType)
      setSidebarType(settings.sidebarType);
  }, [settings?.sidebarType, sidebarType, setSidebarType]);
  useEffect(() => {
    const handlePositionChange = async () => {
      if (settings && sidebarPosition !== settings.sidebarPosition)
        try {
          await updateSettings({ sidebarPosition });
        } catch (error) {
          console.error("Failed to sync sidebar position:", error);
        }
    };

    const handleTypeChange = async () => {
      if (settings && sidebarType !== settings.sidebarType) {
        try {
          await updateSettings({ sidebarType });
        } catch (error) {
          console.error("Failed to sync sidebar type:", error);
        }
      }
    };
    const timeoutId = setTimeout(() => {
      handlePositionChange();
      handleTypeChange();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [sidebarPosition, sidebarType, settings, updateSettings]);

  const enhancedUpdateSettings = async (newSettings: Partial<UISettings>) => {
    const currentSidebarPosition = sidebarPosition;
    const currentSidebarType = sidebarType;
    const sidebarPositionChanging =
      newSettings.sidebarPosition &&
      newSettings.sidebarPosition !== currentSidebarPosition;
    const sidebarTypeChangingToIcon =
      newSettings.sidebarType &&
      newSettings.sidebarType !== currentSidebarType &&
      newSettings.sidebarType === "icon";
    const shouldCloseAndReopen =
      sidebarPositionChanging || sidebarTypeChangingToIcon;
    if (shouldCloseAndReopen) {
      setOpen(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    await updateSettings(newSettings);
    if (newSettings.theme) setTheme(newSettings.theme);
    if (newSettings.sidebarPosition)
      setSidebarPosition(newSettings.sidebarPosition);
    if (newSettings.sidebarType) setSidebarType(newSettings.sidebarType);

    if (shouldCloseAndReopen) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setOpen(false);
    }
  };

  const contextValue: SettingsContextType = {
    settings,
    loading,
    updateSettings: enhancedUpdateSettings,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useAppSettings must be used within a SidebarProvider");
  return context;
}

export { SidebarProvider as EnhancedSidebarProvider };
export { SidebarProvider as SettingsProvider };
