"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMe } from "@/hooks/store/use-me";
import { UserCircle } from "lucide-react";

export default function ProfilePage() {
  const { data } = useMe();
  return (
    <section className="flex flex-col justify-center items-center">
      <Card className="w-full md:w-1/2">
        <CardContent className="text-center flex items-center justify-center flex-col mt-8">
          <UserCircle size={100} />
          <h1 className="text-2xl md:text-4xl capitalize font-bold">
            {data?.username}
          </h1>
          <p>{data?.email}</p>
          <div className="mt-6">
            <Button>Logout</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
