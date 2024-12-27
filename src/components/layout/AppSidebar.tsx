import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Clipboard,
  Users,
  Package2,
  Tags,
} from "lucide-react";

const navigationItems = [
  {
    title: "Equipos",
    url: "/equipos",
    icon: Package2,
  },
  {
    title: "Operarios",
    url: "/operarios",
    icon: Users,
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

  // Don't show sidebar on these paths
  const excludedPaths = [
    "/",
    "/auth"
  ];

  // Check if current path starts with any excluded path
  const shouldHideSidebar = excludedPaths.some(path => 
    currentPath === path
  );

  if (shouldHideSidebar) {
    return null;
  }

  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
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
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}