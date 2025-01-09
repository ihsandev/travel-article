"use client";

import { HeroBackground } from "@/components/hero-background";
import { Button } from "@/components/ui/button";
import { useCredentials } from "@/hooks/use-credentials";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const credentials = useCredentials();

  return (
    <HeroBackground>
      <div className="flex min-h-screen items-center gap-12">
        <div className="flex flex-col">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-sky-600">
              Travel Blog App
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-sky-950">
              Discover the world with us
            </h2>
            <p className="text-sky-950">
              Join our community of travelers and share your experiences
            </p>
          </div>
          <Link
            href={credentials?.token ? "/dashboard" : "/sign-in"}
            className="mt-8 block"
          >
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-sky-950 text-sky-950 px-14"
            >
              {credentials?.token ? "Go to Dashboard" : "Sign In"}
            </Button>
          </Link>
        </div>
        <div className="md:block hidden">
          <Image
            src="/moment.svg"
            width={800}
            height={800}
            className="h-[450px] w-[450px]"
            alt="hero"
          />
        </div>
      </div>
    </HeroBackground>
  );
}
