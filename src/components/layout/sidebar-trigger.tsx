"use client";

import { PanelRightOpen } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

export default function SidebarToggle() {
  const { toggleSidebar, open, sidebarPosition, sidebarType } = useSidebar();
  return (
    <button
      type="button"
      className={`absolute top-1 ${
        sidebarPosition === "left" ? "left-1" : "right-1"
      }`}
      onClick={toggleSidebar}
      hidden={open || sidebarType === "icon"}>
      <PanelRightOpen
        className={`size-6 ${sidebarPosition === "left" && "rotate-180"}`}
      />
    </button>
  );
}
