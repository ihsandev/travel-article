"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMe } from "@/hooks/store/use-me";
import { UserCircle } from "lucide-react";
import Cookie from "js-cookie";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { data } = useMe();

  const logout = () => {
    Cookie.remove("_token");
    Cookie.remove("_user");
    redirect("/sign-in");
  };

  return (
    <section className="flex flex-col justify-center items-center">
      <Card className="w-full md:w-1/2">
        <CardContent className="text-center flex items-center justify-center flex-col mt-8">
          <UserCircle size={80} className="text-sky-900/70" />
          <h1 className="text-2xl md:text-4xl capitalize font-bold">
            {data?.username}
          </h1>
          <p>{data?.email}</p>
          <div className="mt-6">
            <Button onClick={logout}>Logout</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
