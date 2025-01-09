import { cn } from "@/lib/utils";

export function HeroBackground({
  children,
  imageStyle,
}: Readonly<{ children: React.ReactNode; imageStyle?: string }>) {
  return (
    <section className="min-h-screen bg-sky-200 gap-10 relative">
      <div
        className={cn(
          "bg-[url('/auth-bg.jpg')] bg-cover bg-center bg-no-repeat absolute top-0 left-0 w-full h-full z-0 opacity-10",
          imageStyle
        )}
      />
      <div className="z-10 w-full relative container">{children}</div>
    </section>
  );
}
