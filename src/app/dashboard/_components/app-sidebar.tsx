"use client"

// Updated 2026-05-11 — Help link, active states, My Movies ?section=, Suspense-friendly searchParams.

import * as React from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Film,
  Settings,
  HelpCircle,
  LogOut,
  User,
  ShoppingBag,
} from "lucide-react"

import Link from "next/link"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is the navigation data
const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Movies",
      url: "/dashboard?section=order-history",
      icon: Film,
    },
    {
      title: "Shop",
      url: "/", // New added code
      icon: ShoppingBag,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings", // New added code
      icon: Settings,
    },
    {
      title: "Help & Support",
      url: "/dashboard/help-support",
      icon: HelpCircle,
    },
  ],
}

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: { name: string | null; email: string } | null }) {
  const pathname = usePathname() ?? ""
  const searchParams = useSearchParams()
  const router = useRouter()
  const dashboardSection = searchParams.get("section")

  const isOverviewActive =
    pathname === "/dashboard" && dashboardSection !== "order-history"
  const isMyMoviesActive =
    pathname === "/dashboard" && dashboardSection === "order-history"
  const isShopActive = pathname === "/"
  const isSettingsActive = pathname.startsWith("/dashboard/settings")
  const isHelpActive = pathname.startsWith("/dashboard/help-support")

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Film className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">MovieShop</span>
                  <span className="text-xs text-muted-foreground">Premium v1.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => {
                const active =
                  item.title === "Overview"
                    ? isOverviewActive
                    : item.title === "My Movies"
                      ? isMyMoviesActive
                      : item.title === "Shop"
                        ? isShopActive
                        : false

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => {
                        if (item.title === "My Movies" && pathname === "/dashboard" && dashboardSection === "order-history") {
                          document.getElementById("order-history")?.scrollIntoView({ behavior: "smooth", block: "start" })
                        } else {
                          router.push(item.url)
                        }
                      }}
                      style={active ? { backgroundColor: "#e8e8e8", fontWeight: 500 } : undefined}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => {
                const active =
                  item.title === "Settings"
                    ? isSettingsActive
                    : item.title === "Help & Support"
                      ? isHelpActive
                      : false

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      size="sm"
                      onClick={() => router.push(item.url)}
                      style={active ? { backgroundColor: "#e8e8e8", fontWeight: 500 } : undefined}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3 px-1">
                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                  <User className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none overflow-hidden">
                  <span className="font-medium truncate text-sm">{user?.name ?? "User"}</span>
                  <span className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</span>
                </div>
                <LogOut className="ml-auto size-4 text-muted-foreground" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
