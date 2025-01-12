"use client";
import {
  Inbox,
  LayoutDashboard,
  ListCollapse,
  MessageCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ProfileMenu } from "./profile-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Articles",
    url: "/dashboard/articles",
    icon: Inbox,
  },
  {
    title: "Comments",
    url: "/dashboard/comments",
    icon: MessageCircle,
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: ListCollapse,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="relative bg-sky-200 text-sky-950">
        <div className="bg-[url('/auth-bg.jpg')] bg-cover bg-right bg-no-repeat absolute top-0 left-0 w-full h-full z-0 opacity-50" />
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-lg my-2 text-sky-900">
            Travel Blogs
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "hover:bg-sky-50",
                      pathname === item.url && "bg-sky-50"
                    )}
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-sky-900 rounded-t-sm">
        <ProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
