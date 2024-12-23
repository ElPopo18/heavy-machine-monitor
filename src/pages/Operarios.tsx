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

interface Operator {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo_url: string | null;
}

const Operarios = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOperators = async () => {
    try {
      const { data, error } = await supabase
        .from('operators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOperators(data || []);
    } catch (error) {
      console.error('Error fetching operators:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los operarios",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('operators')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Operario eliminado",
        description: "El operario ha sido eliminado exitosamente",
      });

      setOperators(operators.filter(op => op.id !== id));
    } catch (error) {
      console.error('Error deleting operator:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el operario",
      });
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Operarios</h1>
          <Button onClick={() => navigate('/operarios/registro')} className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Registrar Operario
          </Button>
        </div>

        {operators.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay operarios registrados
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {operators.map((operator) => (
              <Card key={operator.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={operator.photo_url || undefined} alt={`${operator.first_name} ${operator.last_name}`} />
                      <AvatarFallback>{operator.first_name[0]}{operator.last_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{operator.first_name} {operator.last_name}</h3>
                      <p className="text-sm text-muted-foreground">{operator.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/operarios/editar/${operator.id}`)}
                        className="text-primary hover:text-primary/90"
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(operator.id)}
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

export default Operarios;