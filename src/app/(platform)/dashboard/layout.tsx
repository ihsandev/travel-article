import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full overflow-x-hidden overflow-y-auto">
        <SidebarTrigger />
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
