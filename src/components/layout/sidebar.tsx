"use client";
import {
  LibraryBig,
  type LucideIcon,
  NotepadText,
  PanelLeftClose,
  PanelRightClose,
  Settings,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar as Sbar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import SidebarCollections from "./sidebar-collections";

interface SidebarItemType {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface SidebarProps {
  userPath: string;
  userId?: string;
}

export default function Sidebar({ userPath, userId }: SidebarProps) {
  const { setOpen, open, sidebarType, toggleSidebar, sidebarPosition } =
    useSidebar();

  const platformItems: SidebarItemType[] = [
    {
      title: "Favorites",
      url: "/favorites",
      icon: Star,
    },
    {
      title: "Trending",
      url: "/trends",
      icon: TrendingUp,
    },
    {
      title: "My notes",
      url: `/profiles/${userPath}#notes`,
      icon: NotepadText,
    },
    {
      title: "Collections",
      url: "/collections",
      icon: LibraryBig,
    },
  ];

  return (
    <Sbar
      side={sidebarPosition}
      className="top-[var(--header-height)] bg-sidebar-primary"
      collapsible={sidebarType === "icon" ? "icon" : "offcanvas"}
      onMouseEnter={() => sidebarType === "icon" && setOpen(true)}
      onMouseLeave={() => sidebarType === "icon" && setOpen(false)}>
      <SidebarHeader className="overflow-x-auto md:overflow-visible ">
        <SidebarGroupLabel className="-ml-2 -mb-2">Platform</SidebarGroupLabel>
        <SidebarGroupAction
          title="Toggle navbar"
          onClick={toggleSidebar}
          className="hover:bg-muted transition-colors"
          hidden={sidebarType === "icon"}>
          {sidebarPosition === "left" ? (
            <PanelLeftClose />
          ) : (
            <PanelRightClose />
          )}
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            {platformItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="hover:bg-muted transition-colors"
                  asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarHeader>

      <SidebarContent>
        {userId && <SidebarCollections userId={userId} />}
      </SidebarContent>

      <SidebarFooter className="mb-[var(--header-height)]">
        <SidebarGroupContent>
          <SidebarMenuButton
            className="hover:bg-muted transition-colors"
            asChild>
            <Link href="/settings">
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sbar>
  );
}
