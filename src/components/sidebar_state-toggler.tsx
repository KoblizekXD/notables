"use client";

import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useSidebar } from "./ui/sidebar";

export function SidebarStateToggler() {
  const { sidebarType, toggleSidebarType } = useSidebar();

  return (
    <DropdownMenuCheckboxItem
      checked={sidebarType === "icon"}
      onCheckedChange={toggleSidebarType}>
      Collapsible sidebar
    </DropdownMenuCheckboxItem>
  );
}
