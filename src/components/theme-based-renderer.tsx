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
  const { theme } = useTheme();

  if (theme === "dark") {
    return dark || null;
  }
  if (theme === "light") {
    return light || null;
  }
  if (theme === "system") {
    return system || null;
  }
  return null;
}
