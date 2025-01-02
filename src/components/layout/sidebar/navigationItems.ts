import {
  Calendar,
  Clipboard,
  Users,
  Package2,
  Tags,
  Home,
  FilePlus,
} from "lucide-react";

export const navigationItems = [
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