import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";

interface NavigationItem {
  title: string;
  url?: string;
  icon: React.ComponentType<any>;
  submenu?: {
    title: string;
    url: string;
    icon?: React.ComponentType<any>;
  }[];
}

interface SidebarNavigationProps {
  items: NavigationItem[];
  expandedItems: string[];
  toggleSubmenu: (title: string) => void;
}

export function SidebarNavigation({ items, expandedItems, toggleSubmenu }: SidebarNavigationProps) {
  const location = useLocation();

  const isSubmenuExpanded = (title: string) => expandedItems.includes(title);

  const isActiveSubmenu = (item: NavigationItem) => {
    if (item.submenu) {
      return item.submenu.some((subItem) => subItem.url === location.pathname);
    }
    return false;
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          {item.submenu ? (
            <>
              <SidebarMenuButton
                onClick={() => toggleSubmenu(item.title)}
                className={`${
                  isActiveSubmenu(item) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
                <ChevronRight
                  className={`ml-auto h-4 w-4 transition-transform ${
                    isSubmenuExpanded(item.title) ? "rotate-90" : ""
                  }`}
                />
              </SidebarMenuButton>
              {isSubmenuExpanded(item.title) && (
                <SidebarMenuSub>
                  {item.submenu.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={location.pathname === subItem.url}
                      >
                        <NavLink to={subItem.url}>
                          {subItem.icon && (
                            <subItem.icon className="h-4 w-4 mr-2" />
                          )}
                          <span>{subItem.title}</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </>
          ) : (
            <SidebarMenuButton asChild>
              <NavLink
                to={item.url || ""}
                className={({ isActive }) =>
                  `flex items-center gap-2 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </NavLink>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}