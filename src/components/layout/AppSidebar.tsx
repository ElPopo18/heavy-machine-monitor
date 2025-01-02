import { useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { navigationItems } from "./sidebar/navigationItems";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  // Initialize with an empty array to ensure all menus start collapsed
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Don't show sidebar on these paths
  const excludedPaths = ["/", "/auth"];

  // Check if current path starts with any excluded path
  const shouldHideSidebar = excludedPaths.some((path) => currentPath === path);

  if (shouldHideSidebar) {
    return null;
  }

  const toggleSubmenu = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarNavigation
              items={navigationItems}
              expandedItems={expandedItems}
              toggleSubmenu={toggleSubmenu}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}