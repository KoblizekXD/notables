"use client";
import { useAppSettings } from "@/components/layout/sidebar-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UISettings } from "@/lib/settings";
import { toast } from "sonner";

export default function SidebarSettings() {
  const { settings, updateSettings } = useAppSettings();
  const handlePositionChange = async (value: UISettings["sidebarPosition"]) => {
    try {
      await updateSettings({ sidebarPosition: value });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update position",
      );
    }
  };

  const handleTypeChange = async (value: UISettings["sidebarType"]) => {
    try {
      await updateSettings({ sidebarType: value });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update type",
      );
    }
  };

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div>
        <label
          htmlFor="sidebar-position"
          className="block text-sm font-medium text-muted-foreground">
          Sidebar Position
        </label>
        <Select
          value={settings?.sidebarPosition || "left"}
          onValueChange={handlePositionChange}>
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
          className="block text-sm font-medium text-muted-foreground">
          Sidebar Type
        </label>
        <Select
          value={settings?.sidebarType || "toggle"}
          onValueChange={handleTypeChange}>
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
