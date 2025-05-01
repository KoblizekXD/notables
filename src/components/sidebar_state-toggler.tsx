"use client";

import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSidebar } from "./ui/sidebar";
import { Checkbox } from "./ui/checkbox";

export function SidebarStateToggler() {
  const { sidebarType, toggleSidebarType } = useSidebar();

  return (
    <DropdownMenuCheckboxItem checked={sidebarType === "icon"} onCheckedChange={toggleSidebarType}>
      Collapsible sidebar
    </DropdownMenuCheckboxItem>
  );
}
