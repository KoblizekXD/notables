import Logo from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full">
      <SidebarProvider className="flex flex-col">
        <div className="h-[var(--header-height)] border-b grid grid-cols-3 w-full items-center">
          <Logo />
          <div className="border col-start-2 flex justify-center">Hello</div>
          <div className="flex justify-end mr-[calc(var(--spacing)*2)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-fit h-fit hover:bg-muted rounded-sm transition-all p-0.5 cursor-pointer">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>EX</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>EX</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Ethan Xu</span>
                      <Link
                        className="text-xs font-normal underline gap-x-1 flex items-center"
                        href={"/profiles/"}>
                        My profile
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-1">
          <Sidebar className="top-[var(--header-height)] bg-sidebar-primary">
            {}
          </Sidebar>
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
