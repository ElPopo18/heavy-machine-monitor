import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Sistema de Gestión</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <Button onClick={() => navigate("/auth")} className="h-32">
          Iniciar Sesión / Registrarse
        </Button>
      </div>
    </div>
  );
};

export default Index;