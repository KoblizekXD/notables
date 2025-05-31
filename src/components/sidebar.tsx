"use client";
import {
  ChevronDown,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Sidebar as Sbar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

interface SidebarItemType {
  title: string;
  url: string;
  icon: LucideIcon;
}

export default function Sidebar({ userPath }: { userPath: string }) {
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

  const groupsItems: Omit<SidebarItemType, "icon">[] = [
    {
      title: "g1",
      url: "#",
    },
    {
      title: "g2",
      url: "#",
    },
  ];

  return (
    <Sbar
      side={sidebarPosition}
      className="top-[var(--header-height)] bg-sidebar-primary"
      collapsible={sidebarType === "icon" ? "icon" : "offcanvas"}
      onMouseOver={() => sidebarType === "icon" && setOpen(true)}
      onMouseLeave={() => sidebarType === "icon" && setOpen(false)}
    >
      <SidebarHeader className="overflow-x-auto md:overflow-visible ">
        <SidebarGroupLabel className="-ml-2 -mb-2">Platform</SidebarGroupLabel>
        <SidebarGroupAction
          title="Toggle navbar"
          onClick={toggleSidebar}
          className="hover:bg-muted transition-colors"
          hidden={sidebarType === "icon"}
        >
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
                  asChild
                >
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
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild className="-ml-2 -mt-3">
              <CollapsibleTrigger>
                My Collections
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:-rotate-180 duration-300" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupsItems.map((item) => (
                    <SidebarMenuButton
                      asChild
                      key={item.title}
                      className="hover:bg-muted transition-colors"
                      hidden={!open}
                    >
                      <Link href={item.url}>
                        <p>{item.title}</p>
                      </Link>
                    </SidebarMenuButton>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter className="mb-[var(--header-height)]">
        <SidebarGroupContent>
          <SidebarMenuButton
            className="hover:bg-muted transition-colors"
            asChild
          >
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
