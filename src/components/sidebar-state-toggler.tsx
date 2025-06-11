"use client";

import {
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "./ui/sidebar";

export function SidebarStateToggler() {
  const {
    sidebarType,
    toggleSidebarType,
    sidebarPosition,
    toggleSidebarPosition,
  } = useSidebar();
  const isMobile = useIsMobile();

  return isMobile ? (
    <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
      Sidebar options are available only on PC!
    </DropdownMenuLabel>
  ) : (
    <>
      <DropdownMenuCheckboxItem
        checked={sidebarType === "icon"}
        onCheckedChange={() => toggleSidebarType()}
      >
        Collapsible sidebar
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={sidebarPosition === "right"}
        onCheckedChange={() => toggleSidebarPosition()}
      >
        Move sidebar to right
      </DropdownMenuCheckboxItem>
    </>
  );
}
