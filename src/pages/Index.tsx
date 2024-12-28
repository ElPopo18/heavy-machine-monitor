import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Wrench, 
  Calendar, 
  Truck, 
  Users, 
  Building2,
  LogOut,
  Search
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface SearchResult {
  type: 'operator' | 'equipment';
  id: string;
  name: string;
  description?: string;
  photo_url?: string | null;
}

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];

      const [operatorsResult, equipmentResult] = await Promise.all([
        supabase
          .from('operators')
          .select('id, first_name, last_name, photo_url')
          .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
          .limit(5),
        supabase
          .from('equipment')
          .select('id, name, description, photo_url')
          .ilike('name', `%${searchTerm}%`)
          .limit(5)
      ]);

      const operators: SearchResult[] = (operatorsResult.data || []).map(op => ({
        type: 'operator',
        id: op.id,
        name: `${op.first_name} ${op.last_name}`,
        photo_url: op.photo_url
      }));

      const equipment: SearchResult[] = (equipmentResult.data || []).map(eq => ({
        type: 'equipment',
        id: eq.id,
        name: eq.name,
        description: eq.description,
        photo_url: eq.photo_url
      }));

      return [...operators, ...equipment];
    },
    enabled: searchTerm.length > 2
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'operator') {
      navigate(`/operarios/editar/${result.id}`);
    } else {
      navigate(`/equipos/editar/${result.id}`);
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

      <div className="relative mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar operarios o equipos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {searchTerm.length > 2 && (
          <div className="absolute w-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-10">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Buscando...</div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {result.type === 'operator' ? (
                        <Users className="h-4 w-4 text-gray-600" />
                      ) : (
                        <Truck className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-gray-500">
                        {result.type === 'operator' ? 'Operario' : 'Equipo'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchResults?.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No se encontraron resultados
              </div>
            ) : null}
          </div>
        )}
      </div>

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