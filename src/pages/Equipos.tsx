import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash, PlusCircle, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Equipment {
  id: string;
  name: string;
  code: string;
  description: string;
  photo_url: string | null;
  brand: {
    name: string;
  };
}

const Equipos = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          brand:brands(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los equipos",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Equipo eliminado",
        description: "El equipo ha sido eliminado exitosamente",
      });

      setEquipment(equipment.filter(eq => eq.id !== id));
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el equipo",
      });
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Equipos</h1>
          <Button onClick={() => navigate('/equipos/registro')} className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Registrar Equipo
          </Button>
        </div>

        {equipment.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay equipos registrados
          </div>
        ) : (
          <div className="grid gap-4">
            {equipment.map((eq) => (
              <Card key={eq.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={eq.photo_url || undefined} alt={eq.name} />
                      <AvatarFallback>{eq.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{eq.name}</h3>
                      <p className="text-sm text-muted-foreground">Código: {eq.code}</p>
                      <p className="text-sm text-muted-foreground">Marca: {eq.brand.name}</p>
                      <p className="text-sm mt-2">{eq.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/equipos/editar/${eq.id}`)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(eq.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Equipos;