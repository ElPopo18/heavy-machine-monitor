import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
      return;
    }
    toast.success("Sesión cerrada exitosamente");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logout button at the top */}
      <div className="w-full p-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="text-destructive hover:text-destructive"
        >
          Cerrar Sesión
        </Button>
      </div>

      {/* Main content centered */}
      <div className="flex-1 container mx-auto p-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-8">Sistema de Gestión</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full">
          <Button onClick={() => navigate("/equipos")} className="h-32">
            Gestión de Equipos
          </Button>
          <Button onClick={() => navigate("/operarios")} className="h-32">
            Gestión de Operarios
          </Button>
          <Button onClick={() => navigate("/marcas")} className="h-32">
            Gestión de Marcas
          </Button>
          <Button onClick={() => navigate("/mantenimiento/registro")} className="h-32">
            Mantenimiento
          </Button>
          <Button onClick={() => navigate("/mantenimiento/calendario")} className="h-32">
            Calendario de Mantenimientos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;