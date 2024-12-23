import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { OperarioForm } from "@/components/operarios/OperarioForm";

const OperariosEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchOperator = async () => {
      try {
        const { data, error } = await supabase
          .from('operators')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (!data) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se encontró el operario",
          });
          navigate('/operarios');
          return;
        }

        setInitialData({
          cedula: data.cedula,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          email: data.email || '',
          photo: null,
        });
      } catch (error) {
        console.error('Error fetching operator:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar la información del operario",
        });
        navigate('/operarios');
      } finally {
        setLoading(false);
      }
    };

    fetchOperator();
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
            onClick={() => navigate('/operarios')}
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </Button>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Editar Operario</h1>
          <p className="text-muted-foreground">Actualiza la información del operario</p>
        </div>
        <OperarioForm initialData={initialData} operatorId={id} />
      </div>
    </div>
  );
};

export default OperariosEditar;