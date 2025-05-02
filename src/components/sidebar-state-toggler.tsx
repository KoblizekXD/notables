"use client";

import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useSidebar } from "./ui/sidebar";

export function SidebarStateToggler() {
  const {
    sidebarType,
    toggleSidebarType,
    sidebarPosition,
    toggleSidebarPosition,
  } = useSidebar();

  return (
    <>
      <DropdownMenuCheckboxItem
        checked={sidebarType === "icon"}
        onCheckedChange={toggleSidebarType}>
        Collapsible sidebar
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={sidebarPosition === "right"}
        onCheckedChange={toggleSidebarPosition}>
        Move sidebar to right
      </DropdownMenuCheckboxItem>
    </>
  );
}
