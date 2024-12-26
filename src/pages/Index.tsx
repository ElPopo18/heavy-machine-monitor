import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Wrench, 
  Calendar, 
  Truck, 
  Users, 
  Building2 
} from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/mantenimiento/registro">
          <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Wrench className="h-8 w-8 text-blue-500" />
              <div>
                <h2 className="text-xl font-semibold">Registrar Mantenimiento</h2>
                <p className="text-gray-600">Programa nuevos mantenimientos</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/mantenimiento/calendario">
          <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Calendar className="h-8 w-8 text-green-500" />
              <div>
                <h2 className="text-xl font-semibold">Calendario</h2>
                <p className="text-gray-600">Ver mantenimientos programados</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/equipos">
          <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Truck className="h-8 w-8 text-yellow-500" />
              <div>
                <h2 className="text-xl font-semibold">Equipos</h2>
                <p className="text-gray-600">Gestionar equipos</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/operarios">
          <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <h2 className="text-xl font-semibold">Operarios</h2>
                <p className="text-gray-600">Gestionar operarios</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/marcas">
          <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Building2 className="h-8 w-8 text-red-500" />
              <div>
                <h2 className="text-xl font-semibold">Marcas</h2>
                <p className="text-gray-600">Gestionar marcas de equipos</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Index;