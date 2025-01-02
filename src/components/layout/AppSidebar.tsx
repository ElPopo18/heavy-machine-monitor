import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Clipboard,
  Users,
  Package2,
  Tags,
  Home,
  FilePlus,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navigationItems = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Equipos",
    icon: Package2,
    submenu: [
      {
        title: "Lista de Equipos",
        url: "/equipos",
      },
      {
        title: "Registrar Equipo",
        url: "/equipos/registro",
        icon: FilePlus,
      },
    ],
  },
  {
    title: "Operarios",
    icon: Users,
    submenu: [
      {
        title: "Lista de Operarios",
        url: "/operarios",
      },
      {
        title: "Registrar Operario",
        url: "/operarios/registro",
        icon: FilePlus,
      },
    ],
  },
  {
    title: "Marcas",
    url: "/marcas",
    icon: Tags,
  },
  {
    title: "Calendario de Mantenimiento",
    url: "/mantenimiento/calendario",
    icon: Calendar,
  },
  {
    title: "Registrar Mantenimiento",
    url: "/mantenimiento/registro",
    icon: Clipboard,
  },
];

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

  const isSubmenuExpanded = (title: string) => expandedItems.includes(title);

  const isActiveSubmenu = (item: any) => {
    if (item.submenu) {
      return item.submenu.some(
        (subItem: any) => subItem.url === location.pathname
      );
    }
    return false;
  };

  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
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
                        to={item.url}
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}