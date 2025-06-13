"use client";
import { SidebarInset, useSidebar } from "../ui/sidebar";
import Sidebar from "./sidebar";

export default function SidebarExec({
  children,
  userPath,
  className,
}: {
  children: React.ReactNode;
  userPath: string;
  className?: string;
}) {
  const { sidebarPosition } = useSidebar();
  return (
    <>
      {sidebarPosition === "left" && <Sidebar userPath={userPath} />}
      <SidebarInset className={className}>{children}</SidebarInset>
      {sidebarPosition === "right" && <Sidebar userPath={userPath} />}
    </>
  );
}
