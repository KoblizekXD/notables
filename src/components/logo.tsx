"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ThemeBasedRenderer from "./theme-based-renderer";

export default function Logo({
  animate = true,
  className,
}: { animate?: boolean; className?: string }) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, x: "calc(var(--spacing) * -2)" } : {}}
      animate={animate ? { opacity: 1, x: "calc(var(--spacing) * 2)" } : {}}
      transition={{ duration: 0.4, ease: "circInOut" }}
      className={cn("absolute left-1 top-3", className)}>
      <Link href={"/"}>
        <ThemeBasedRenderer
          light={
            <Image
              src={"/simple-logo.svg"}
              width={120}
              height={32}
              alt="Notables"
            />
          }
          dark={
            <Image
              src={"/simple-logo-light.svg"}
              width={120}
              height={32}
              alt="Notables"
            />
          }
        />
      </Link>
    </motion.div>
  );
}
