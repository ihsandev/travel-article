"use client";

import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/store/use-me";
import { useEffect } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: me, fetchData } = useMe();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);
  console.log({ me });

  const logout = () => {
    Cookie.remove("_token");
    Cookie.remove("_user");
    router.replace("/sign-in");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
