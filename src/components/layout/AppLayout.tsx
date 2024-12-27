import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Don't show sidebar trigger on these paths
  const excludedPaths = [
    "/",
    "/auth"
  ];

  // Check if current path starts with any excluded path
  const shouldHideSidebarTrigger = excludedPaths.some(path => 
    currentPath === path
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-4">
            {!shouldHideSidebarTrigger && <SidebarTrigger className="mb-4" />}
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}