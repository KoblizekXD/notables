"use client";

import { getUserCollections } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, LibraryBig } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

export default function SidebarCollections({ userId }: { userId: string }) {
  const { open } = useSidebar();
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["user-collections", userId],
    queryFn: () => getUserCollections(userId),
    enabled: !!userId,
  });
  if (isLoading || collections.length === 0) return null;
  return (
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
              {collections.slice(0, 5).map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-muted transition-colors"
                    hidden={!open}>
                    <Link href={`/collection/${collection.id}`}>
                      <LibraryBig className="h-4 w-4" />
                      <span className="truncate">{collection.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {collections.length > 5 && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-muted transition-colors text-muted-foreground"
                    hidden={!open}>
                    <Link href={`/profile/${userId}/collections`}>
                      <span>View all collections ({collections.length})</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
