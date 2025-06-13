import Logo from "@/components/layout/logo";
import SidebarExec from "@/components/layout/sidebar-inset";
import { SidebarProvider } from "@/components/layout/sidebar-provider";
import { SidebarStateToggler } from "@/components/layout/sidebar-state-toggler";
import SidebarToggle from "@/components/layout/sidebar-trigger";
import { SignOutButton } from "@/components/layout/sign-out-button";
import Commander from "@/components/search/commander";
import DynamicCommand from "@/components/search/dynamic-command";

import { Avatar } from "@/components/profile/avatar";
import { DropdownThemeToggle } from "@/components/theme/dropdown-theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";

import { Cloud, ExternalLink, Settings } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="h-screen w-full">
      <SidebarProvider className="flex flex-col" defaultOpen={false}>
        <div className="bg-background h-[var(--header-height)] flex gap-x-2 md:gap-0 border-b md:grid grid-cols-3 w-full items-center sticky top-0 z-50">
          <Logo destination="/home" className="md:ml-1.5" />
          <div className="p-1 items-center md:items-stretch h-full flex-1 col-start-2 flex justify-end">
            <DynamicCommand trigger={<Commander />} />
          </div>
          <div className="flex ml-auto justify-end mr-[calc(var(--spacing)*2)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-fit h-fit hover:bg-muted rounded-sm transition-all p-0.5 cursor-pointer">
                  <Avatar
                    userId={session?.user.id || ""}
                    imagePath={session?.user.image}
                    fallback={session?.user.name.substring(0, 2) || "??"}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                      <Avatar
                        userId={session?.user.id || ""}
                        imagePath={session?.user.image}
                        fallback={session?.user.name.substring(0, 2) || "??"}
                      />
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
                <SignOutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-1">
          <SidebarExec userPath={`/profiles/${session?.user.id}`}>
            <SidebarToggle />
            {children}
          </SidebarExec>
        </div>
      </SidebarProvider>
    </div>
  );
}
