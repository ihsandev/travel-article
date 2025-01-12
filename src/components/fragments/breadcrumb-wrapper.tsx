import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";

export function BreadcrumbWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Breadcrumb>
      <BreadcrumbList>{children}</BreadcrumbList>
    </Breadcrumb>
  );
}
