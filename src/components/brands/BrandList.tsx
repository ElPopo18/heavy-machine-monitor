import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandCard } from "./BrandCard";
import { useToast } from "@/hooks/use-toast";

export const BrandList = () => {
  const { toast } = useToast();

  const { data: brands, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las marcas",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!brands?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No hay marcas registradas</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
};