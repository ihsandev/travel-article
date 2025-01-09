import { HeroBackground } from "@/components/hero-background";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <HeroBackground imageStyle="opacity-50">
      <div className="flex items-center justify-center h-screen">
        <Card className="min-h-48 w-full max-w-md px-4 py-8 shadow-none">
          <CardContent className="shadow-none">{children}</CardContent>
        </Card>
      </div>
    </HeroBackground>
  );
}
