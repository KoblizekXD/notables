"use client";

import { useAppSettings } from "@/components/layout/sidebar-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { SidebarPosition, SidebarType } from "@/lib/schemas";
import {
  Loader2,
  Menu,
  MoreHorizontal,
  PanelLeft,
  PanelRight,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export function SidebarSettingsForm() {
  const { settings, loading, updateSettings } = useAppSettings();

  const handlePositionChange = async (position: SidebarPosition) => {
    try {
      await updateSettings({ sidebarPosition: position });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update position",
      );
    }
  };

  const handleTypeChange = async (type: SidebarType) => {
    try {
      await updateSettings({ sidebarType: type });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update type",
      );
    }
  };

  const handleRefresh = async () => {
    try {
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to refresh");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading sidebar settings...</span>
      </div>
    );
  }

  const getPositionIcon = (position: SidebarPosition) => {
    return position === "left" ? (
      <PanelLeft className="h-4 w-4" />
    ) : (
      <PanelRight className="h-4 w-4" />
    );
  };

  const getTypeIcon = (type: SidebarType) => {
    return type === "toggle" ? (
      <Menu className="h-4 w-4" />
    ) : (
      <MoreHorizontal className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sidebar Settings</h3>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getPositionIcon(settings?.sidebarPosition || "left")}
              Position
            </CardTitle>
            <CardDescription>
              Choose which side of the screen the sidebar appears on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label>Sidebar Position</Label>
              <RadioGroup
                value={settings?.sidebarPosition || "left"}
                onValueChange={handlePositionChange}
                className="grid grid-cols-1 gap-4">
                <label
                  htmlFor="position-left"
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="left" id="position-left" />
                  <div className="flex items-center gap-2 flex-1">
                    <PanelLeft className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Left Side</div>
                      <p className="text-sm text-muted-foreground">
                        Sidebar appears on the left side
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  htmlFor="position-right"
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="right" id="position-right" />
                  <div className="flex items-center gap-2 flex-1">
                    <PanelRight className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Right Side</div>
                      <p className="text-sm text-muted-foreground">
                        Sidebar appears on the right side
                      </p>
                    </div>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTypeIcon(settings?.sidebarType || "toggle")}
              Type
            </CardTitle>
            <CardDescription>
              Choose how the sidebar behaves and appears
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label>Sidebar Type</Label>
              <RadioGroup
                value={settings?.sidebarType || "toggle"}
                onValueChange={handleTypeChange}
                className="grid grid-cols-1 gap-4">
                <label
                  htmlFor="type-toggle"
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="toggle" id="type-toggle" />
                  <div className="flex items-center gap-2 flex-1">
                    <Menu className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Full Sidebar</div>
                      <p className="text-sm text-muted-foreground">
                        Complete sidebar with all features
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  htmlFor="type-icon"
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="icon" id="type-icon" />
                  <div className="flex items-center gap-2 flex-1">
                    <MoreHorizontal className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Icon Only</div>
                      <p className="text-sm text-muted-foreground">
                        Compact sidebar showing only icons
                      </p>
                    </div>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
