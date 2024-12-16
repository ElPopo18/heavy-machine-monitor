import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Truck, Building2, Wrench, Calendar, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const menuOptions = [
    { title: "Operarios", icon: Users, route: "/operarios" },
    { title: "Equipos", icon: Truck, route: "/equipos" },
    { title: "Marcas", icon: Building2, route: "/marcas" },
    { title: "Mantenimiento", icon: Wrench, route: "/mantenimiento" },
    { title: "Calendario", icon: Calendar, route: "/calendario" },
    { title: "Editar Perfil", icon: UserCog, route: "/perfil" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Search Bar */}
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Menu Grid */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuOptions.map((option) => (
            <Button
              key={option.title}
              variant="outline"
              className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-accent"
              onClick={() => navigate(option.route)}
            >
              <option.icon className="h-8 w-8" />
              <span className="text-lg font-medium">{option.title}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;