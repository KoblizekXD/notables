"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";

export default function SidebarSettings() {
  const {
    sidebarType,
    sidebarPosition,
    toggleSidebarPosition,
    toggleSidebarType,
  } = useSidebar();

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div>
        <label
          htmlFor="sidebar-position"
          className="block text-sm font-medium text-muted-foreground"
        >
          Sidebar Position
        </label>
        <Select
          defaultValue={sidebarPosition}
          onValueChange={toggleSidebarPosition}
        >
          <SelectTrigger className="w-full">
            <SelectValue id="sidebar-position" placeholder="Select Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label
          htmlFor="sidebar-type"
          className="block text-sm font-medium text-muted-foreground"
        >
          Sidebar Type
        </label>
        <Select defaultValue={sidebarType} onValueChange={toggleSidebarType}>
          <SelectTrigger className="w-full">
            <SelectValue id="sidebar-type" placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="icon">Icon</SelectItem>
            <SelectItem value="toggle">Toggle</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
