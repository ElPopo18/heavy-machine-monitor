import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const { data: maintenanceCount, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ["maintenanceCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("maintenance")
        .select("*", { count: "exact", head: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el conteo de mantenimientos",
        });
        throw error;
      }

      return count || 0;
    },
  });

  const { data: equipmentCount, isLoading: isLoadingEquipment } = useQuery({
    queryKey: ["equipmentCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("equipment")
        .select("*", { count: "exact", head: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el conteo de equipos",
        });
        throw error;
      }

      return count || 0;
    },
  });

  const { data: operatorsCount, isLoading: isLoadingOperators } = useQuery({
    queryKey: ["operatorsCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("operators")
        .select("*", { count: "exact", head: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el conteo de operarios",
        });
        throw error;
      }

      return count || 0;
    },
  });

  if (isLoadingMaintenance || isLoadingEquipment || isLoadingOperators) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Mantenimientos</h2>
          <p className="text-3xl font-bold">{maintenanceCount}</p>
          <p className="text-gray-600">Programados</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Equipos</h2>
          <p className="text-3xl font-bold">{equipmentCount}</p>
          <p className="text-gray-600">Registrados</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Operarios</h2>
          <p className="text-3xl font-bold">{operatorsCount}</p>
          <p className="text-gray-600">Activos</p>
        </div>
      </div>
    </div>
  );
};

export default Index;