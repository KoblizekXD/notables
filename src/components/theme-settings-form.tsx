"use client";

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
import { useAppSettings } from "@/components/sidebar-provider";
import { Theme } from "@/lib/schemas";
import { Loader2, RefreshCw, Monitor, Sun, Moon } from "lucide-react";
import { toast } from "sonner";

export function ThemeSettingsForm() {
  const { settings, loading, updateSettings } = useAppSettings();

  const handleThemeChange = async (theme: Theme) => {
    try {
      await updateSettings({ theme });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update theme"
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
        <span className="ml-2">Loading theme settings...</span>
      </div>
    );
  }

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Theme Settings</h3>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getThemeIcon(settings?.theme || "system")}
            Appearance
          </CardTitle>
          <CardDescription>
            Choose your preferred theme. The system option will follow your
            device's theme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Theme</Label>
            <RadioGroup
              value={settings?.theme || "system"}
              onValueChange={handleThemeChange}
              className="grid grid-cols-1 gap-4"
            >
              <label
                htmlFor="system"
                className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value="system" id="system" />
                <div className="flex items-center gap-2 flex-1">
                  <Monitor className="h-4 w-4" />
                  <div>
                    <div className="font-medium">System</div>
                    <p className="text-sm text-muted-foreground">
                      Follow your device's theme setting
                    </p>
                  </div>
                </div>
              </label>

              <label
                htmlFor="light"
                className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value="light" id="light" />
                <div className="flex items-center gap-2 flex-1">
                  <Sun className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Light</div>
                    <p className="text-sm text-muted-foreground">
                      Always use light theme
                    </p>
                  </div>
                </div>
              </label>

              <label
                htmlFor="dark"
                className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value="dark" id="dark" />
                <div className="flex items-center gap-2 flex-1">
                  <Moon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Dark</div>
                    <p className="text-sm text-muted-foreground">
                      Always use dark theme
                    </p>
                  </div>
                </div>
              </label>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
