"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function LinkingButton({
  children,
  href,
  ...props
}: {
  children: React.ReactNode;
  href: string;
} & React.ComponentProps<"button">) {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push(href);
      }}
      {...props}>
      {children}
    </Button>
  );
}
