import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  Calendar, 
  Truck, 
  Users, 
  Building2,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SearchBar } from "@/components/search/SearchBar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel de Control</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      <SearchBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          to="/mantenimiento/registro"
          icon={Wrench}
          iconColor="text-blue-500"
          title="Registrar Mantenimiento"
          description="Programa nuevos mantenimientos"
        />

        <DashboardCard
          to="/mantenimiento/calendario"
          icon={Calendar}
          iconColor="text-green-500"
          title="Calendario"
          description="Ver mantenimientos programados"
        />

        <DashboardCard
          to="/equipos"
          icon={Truck}
          iconColor="text-yellow-500"
          title="Equipos"
          description="Gestionar equipos"
        />

        <DashboardCard
          to="/operarios"
          icon={Users}
          iconColor="text-purple-500"
          title="Operarios"
          description="Gestionar operarios"
        />

        <DashboardCard
          to="/marcas"
          icon={Building2}
          iconColor="text-red-500"
          title="Marcas"
          description="Gestionar marcas de equipos"
        />
      </div>
    </div>
  );
};

export default Index;