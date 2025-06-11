import { SidebarPosition, SidebarType, Theme } from "./schemas";
import {
  getSettings as getSettingsAction,
  updateSettings as updateSettingsAction,
} from "./actions";

export interface UISettings {
  sidebarPosition: SidebarPosition;
  sidebarType: SidebarType;
  theme: Theme;
}

const SETTINGS_CACHE_KEY = "user_settings";
const SETTINGS_TIMESTAMP_KEY = "user_settings_timestamp";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export class SettingsService {
  private static instance: SettingsService;
  private settings: UISettings | null = null;
  private constructor() {}
  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  private isCacheValid(): boolean {
    if (typeof window === "undefined") return false;
    const timestamp = localStorage.getItem(SETTINGS_TIMESTAMP_KEY);
    if (!timestamp) return false;
    const cacheTime = parseInt(timestamp, 10);
    const now = Date.now();
    return now - cacheTime < CACHE_DURATION;
  }

  private getCachedSettings(): UISettings | null {
    if (typeof window === "undefined") return null;
    if (!this.isCacheValid()) {
      this.clearCache();
      return null;
    }
    try {
      const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
      if (!cached) return null;
      const parsedSettings = JSON.parse(cached);
      if (
        parsedSettings &&
        typeof parsedSettings.sidebarPosition === "string" &&
        typeof parsedSettings.sidebarType === "string" &&
        typeof parsedSettings.theme === "string"
      ) return parsedSettings as UISettings;
      return null;
    } catch (error) {
      console.error("Error parsing cached settings:", error);
      this.clearCache();
      return null;
    }
  }

  private setCachedSettings(settings: UISettings): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
      localStorage.setItem(SETTINGS_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error("Error caching settings:", error);
    }
  }

  private clearCache(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SETTINGS_CACHE_KEY);
    localStorage.removeItem(SETTINGS_TIMESTAMP_KEY);
  }

  async getSettings(): Promise<UISettings> {
    if (this.settings) return this.settings;
    const cachedSettings = this.getCachedSettings();
    if (cachedSettings) {
      this.settings = cachedSettings;
      return cachedSettings;
    }
    try {
      const result = await getSettingsAction();
      if (result.error) throw new Error(result.error);
      const settings = result.settings as UISettings;
      this.settings = settings;
      this.setCachedSettings(settings);
      return settings;
    } catch (error) {
      console.error("Error fetching settings:", error);
      const defaultSettings: UISettings = {
        sidebarPosition: "left",
        sidebarType: "toggle",
        theme: "system",
      };
      return defaultSettings;
    }
  }
  async updateSettings(newSettings: Partial<UISettings>): Promise<UISettings> {
    try {
      const result = await updateSettingsAction(newSettings);
      if (!result.success || result.error)
        throw new Error(result.error || "Failed to update settings");
      const updatedSettings = result.settings as UISettings;
      this.settings = updatedSettings;
      this.setCachedSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  }
  clearAllCaches(): void {
    this.settings = null;
    this.clearCache();
  }
}
export const settingsService = SettingsService.getInstance();
