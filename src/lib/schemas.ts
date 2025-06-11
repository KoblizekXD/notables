import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Your username must be atleast 3 characters long!")
      .max(32, "Your username must be atmost 32 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Your username must only contain letters, numbers, and underscores!"
      ),
    email: z.string().email("Please enter a valid email address!"),
    password: z.string().min(8).max(40),
    confirmPassword: z.string().min(8).max(40),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords must match",
      });
    }
  });

export const settingsSchema = z.object({
  sidebarPosition: z.boolean().default(false), // false = left, true = right
  sidebarType: z.boolean().default(false), // false = toggle, true = icon
  theme: z.number().int().min(0).max(2).default(0), // 0 = system, 1 = light, 2 = dark
});

export type Settings = z.infer<typeof settingsSchema>;

export const sidebarPositionToBoolean = (position: "left" | "right"): boolean =>
  position === "right";

export const booleanToSidebarPosition = (value: boolean): "left" | "right" =>
  value ? "right" : "left";

export const sidebarTypeToBoolean = (type: "toggle" | "icon"): boolean =>
  type === "icon";

export const booleanToSidebarType = (value: boolean): "toggle" | "icon" =>
  value ? "icon" : "toggle";

export const themeToNumber = (theme: "system" | "light" | "dark"): number => {
  switch (theme) {
    case "light":
      return 1;
    case "dark":
      return 2;
    default:
      return 0;
  }
};

export const numberToTheme = (value: number): "system" | "light" | "dark" => {
  switch (value) {
    case 1:
      return "light";
    case 2:
      return "dark";
    default:
      return "system";
  }
};

export type SidebarPosition = "left" | "right";
export type SidebarType = "toggle" | "icon";
export type Theme = "system" | "light" | "dark";
