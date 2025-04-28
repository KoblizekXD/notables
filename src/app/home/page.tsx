"use client";

import Logo from "@/components/logo";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="h-screen w-full">
      <SidebarProvider className="flex flex-col">
        <div className="h-[var(--header-height)] border-b flex items-center">
          <Logo />
        </div>
        <div className="flex flex-1">
          <Sidebar className="top-[var(--header-height)] bg-sidebar-primary">

          </Sidebar>
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
