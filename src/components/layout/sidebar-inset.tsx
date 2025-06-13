"use client";
import { SidebarInset, useSidebar } from "../ui/sidebar";
import Sidebar from "./sidebar";

export default function SidebarExec({
  children,
  userPath,
  userId,
  className,
}: {
  children: React.ReactNode;
  userPath: string;
  userId?: string;
  className?: string;
}) {
  const { sidebarPosition } = useSidebar();
  return (
    <>
      {sidebarPosition === "left" && (
        <Sidebar userPath={userPath} userId={userId} />
      )}
      <SidebarInset className={className}>{children}</SidebarInset>
      {sidebarPosition === "right" && (
        <Sidebar userPath={userPath} userId={userId} />
      )}
    </>
  );
}
