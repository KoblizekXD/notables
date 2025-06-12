"use client";

import { useAppSettings } from "@/components/sidebar-provider";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DropdownThemeToggle() {
  const { settings, updateSettings } = useAppSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleToggle = async () => {
    try {
      const newTheme = settings?.theme === "dark" ? "light" : "dark";
      await updateSettings({ theme: newTheme });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update theme",
      );
    }
  };

  return (
    <DropdownMenuCheckboxItem
      checked={settings?.theme === "dark"}
      onCheckedChange={handleToggle}>
      Dark mode
    </DropdownMenuCheckboxItem>
  );
}
