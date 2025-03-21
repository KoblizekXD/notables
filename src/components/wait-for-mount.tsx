//src\components\ClientRender.tsx
"use client";

import { type ReactNode, useEffect, useState } from "react";

export const WaitForMount = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return <>{children}</>;
};
