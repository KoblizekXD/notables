"use client";
import Sidebar from "./sidebar";
import { SidebarInset, useSidebar } from "./ui/sidebar";

export default function SidebarExec({
  children,
  userPath,
}: { children: React.ReactNode; userPath: string }) {
  const { sidebarPosition } = useSidebar();
  return (
    <>
      {sidebarPosition === "left" && <Sidebar userPath={userPath} />}
      <SidebarInset>{children}</SidebarInset>
      {sidebarPosition === "right" && <Sidebar userPath={userPath} />}
    </>
  );
}
