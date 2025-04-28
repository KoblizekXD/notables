
import Logo from "@/components/logo";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}