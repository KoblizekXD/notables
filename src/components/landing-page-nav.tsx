"use client"
 
import * as React from "react"
import Link from "next/link"
 
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
 
type props ={
  className?: string
}

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Trending theme 1",
    href: "#",
    description:  "Description 1",
  },
  {
    title: "Trending theme 2",
    href: "#",
    description: "Description 2",
  },
  {
    title: "Trending theme 3",
    href: "#",
    description: "Description 3",
  },
  {
    title: "Trending theme 4",
    href: "#",
    description: "Description 4",
  },
  {
    title: "Trending theme 5",
    href: "#",
    description: "Description 5",
  },
  {
    title: "Trending theme 6",
    href: "#",
    description: "Description 6",
  },
]

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
 
export default function NavMenu(props: props) {
  return (
    <NavigationMenu className={`${props.className}`}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <ListItem href="#" title="Introduction">
                Start with your learning journey right here!
              </ListItem>
              <ListItem href="#" title="How to create?">
                Wanna share knowledge? Start creating your own content!
              </ListItem>
              <ListItem href="#" title="Games">
                Learn while playing games! We have a lot of them for you.
              </ListItem>
              <ListItem href="#" title="Profile introduction">
                Configure your profile ot impress others.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Popular</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" suppressHydrationWarning passHref className={navigationMenuTriggerStyle()}>
            Discussion
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
 
