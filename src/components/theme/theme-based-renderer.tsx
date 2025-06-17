"use client";

import { useTheme } from "next-themes";

export default function ThemeBasedRenderer({
  dark,
  light,
  system,
}: {
  dark?: React.ReactNode;
  light?: React.ReactNode;
  system?: React.ReactNode;
}) {
  const { theme, resolvedTheme } = useTheme();

  if (theme === "dark" || (theme === "system" && resolvedTheme === "dark")) {
    return dark || null;
  }
  if (theme === "light" || (theme === "system" && resolvedTheme === "light")) {
    return light || null;
  }
  return null;
}
