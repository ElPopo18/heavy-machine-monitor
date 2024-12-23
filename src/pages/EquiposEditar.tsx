import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const EquiposEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data, error } = await supabase
          .from('equipment')
          .select('*, brand:brands(id, name)')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (!data) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se encontró el equipo",
          });
          navigate('/equipos');
          return;
        }

        setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar la información del equipo",
        });
        navigate('/equipos');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id, navigate, toast]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigate('/equipos')}
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </Button>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Editar Equipo</h1>
          <p className="text-muted-foreground">Actualiza la información del equipo</p>
        </div>
        {/* TODO: Implementar formulario de edición */}
        <div className="text-center text-muted-foreground">
          Formulario de edición en desarrollo
        </div>
      </div>
    </div>
  );
};

export default EquiposEditar;