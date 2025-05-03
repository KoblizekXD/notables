import Commander from "@/components/commander";
import DynamicCommand from "@/components/dynamic-command";
import Logo from "@/components/logo";
import SidebarExec from "@/components/sidebar-inset";
import { SidebarStateToggler } from "@/components/sidebar-state-toggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { Cloud, ExternalLink, LogOut, Settings } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { DropdownThemeToggle } from "./dropdown-theme-toggle";

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="h-screen w-full">
      <SidebarProvider className="flex flex-col" defaultOpen={false}>
        <div className="h-[var(--header-height)] flex gap-x-2 md:gap-0 border-b md:grid grid-cols-3 w-full items-center">
          <Logo />
          <div className="p-1 items-center md:items-stretch h-full flex-1 col-start-2 flex justify-end">
            <DynamicCommand trigger={<Commander />} />
          </div>
          <div className="flex ml-auto justify-end mr-[calc(var(--spacing)*2)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-fit h-fit hover:bg-muted rounded-sm transition-all p-0.5 cursor-pointer">
                  <Avatar>
                    <AvatarImage src={session?.user.image || ""} />
                    <AvatarFallback>
                      {session?.user.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                      <Avatar>
                        <AvatarImage src={session?.user.image || ""} />
                        <AvatarFallback>
                          {session?.user.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {session?.user.name}
                      </span>
                      <Link
                        className="text-xs font-normal underline gap-x-1 flex items-center"
                        href={`/profiles/${session?.user.id}`}>
                        My profile
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownThemeToggle />
                <DropdownMenuSeparator />
                <SidebarStateToggler />
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Cloud />
                  API
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  <LogOut />
                  Sign-out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-1">
          <SidebarExec userPath={`/profiles/${session?.user.id}`}>
            {children}
          </SidebarExec>
        </div>
      </SidebarProvider>
    </div>
  );
}
