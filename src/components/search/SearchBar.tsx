import { Search, Truck, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  type: 'operator' | 'equipment';
  id: string;
  name: string;
  description?: string;
  photo_url?: string | null;
}

export const SearchBar = () => {
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

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'operator') {
      navigate(`/operarios/editar/${result.id}`);
    } else {
      navigate(`/equipos/editar/${result.id}`);
    }
  };

  return (
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
  );
};