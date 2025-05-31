"use client";

import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DropdownThemeToggle() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenuCheckboxItem
      checked={theme.theme === "dark"}
      onCheckedChange={() => {
        theme.setTheme(theme.theme === "dark" ? "light" : "dark");
      }}>
      Dark mode
    </DropdownMenuCheckboxItem>
  );
}
