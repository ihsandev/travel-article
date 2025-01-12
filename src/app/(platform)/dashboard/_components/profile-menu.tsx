"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMe } from "@/hooks/store/use-me";
import Cookie from "js-cookie";
import { ChevronsUpDown, LogOut, User2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export function ProfileMenu() {
  const { data: me, fetchData } = useMe();

  useEffect(() => {
    fetchData();
  }, []);

  const logout = () => {
    Cookie.remove("_token");
    Cookie.remove("_user");
    redirect("/sign-in");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="text-md">
            <SidebarMenuButton className="capitalize bg-sky-900 text-sky-50">
              <User2 /> {me?.username}
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/dashboard/profile">
                <User2 />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={logout}>
              <LogOut />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
