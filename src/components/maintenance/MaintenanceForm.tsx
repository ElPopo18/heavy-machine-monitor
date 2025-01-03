import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormField } from "./FormField";
import { isFutureOrToday, formatDate } from "./utils/dateUtils";

interface Equipment {
  id: string;
  name: string;
}

interface Operator {
  id: string;
  first_name: string;
  last_name: string;
}

const MaintenanceForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [observations, setObservations] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipmentData, operatorsData] = await Promise.all([
          supabase.from("equipment").select("id, name"),
          supabase.from("operators").select("id, first_name, last_name"),
        ]);

        if (equipmentData.error) throw equipmentData.error;
        if (operatorsData.error) throw operatorsData.error;

        setEquipment(equipmentData.data || []);
        setOperators(operatorsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEquipment || !selectedOperator || !scheduledDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
      });
      return;
    }

    // Ensure the date is valid and in the future
    if (!isFutureOrToday(scheduledDate)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La fecha programada debe ser hoy o una fecha futura",
      });
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Debe iniciar sesión para registrar un mantenimiento",
        });
        return;
      }

      // Format the date to ensure it's in YYYY-MM-DD format
      const formattedDate = formatDate(scheduledDate);
      console.log("Formatted date being sent:", formattedDate); // Debug log

      const { error } = await supabase.from("maintenance").insert({
        equipment_id: selectedEquipment,
        operator_id: selectedOperator,
        scheduled_date: formattedDate,
        observations: observations || null,
        user_id: user.id,
      });

      if (error) {
        console.error("Supabase error:", error); // Debug log
        throw error;
      }

      toast({
        title: "Mantenimiento registrado",
        description: "El mantenimiento ha sido programado exitosamente",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Error:", error);
      let errorMessage = "Error al registrar el mantenimiento";
      
      if (error.code === "23505") {
        errorMessage = "El operario ya tiene una actividad programada para esta fecha";
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  const today = formatDate(new Date().toISOString());

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        type="select"
        label="Equipo"
        required
        value={selectedEquipment}
        onChange={setSelectedEquipment}
        options={equipment.map(eq => ({ id: eq.id, label: eq.name }))}
        placeholder="Seleccione un equipo"
        error={equipment.length === 0 ? "Registre un equipo primero" : undefined}
      />

      <FormField
        type="select"
        label="Operario"
        required
        value={selectedOperator}
        onChange={setSelectedOperator}
        options={operators.map(op => ({ 
          id: op.id, 
          label: `${op.first_name} ${op.last_name}` 
        }))}
        placeholder="Seleccione un operario"
        error={operators.length === 0 ? "Registre un operario primero" : undefined}
      />

      <FormField
        type="date"
        label="Fecha"
        required
        value={scheduledDate}
        onChange={(e) => setScheduledDate(e.target.value)}
        min={today}
      />

      <FormField
        type="textarea"
        label="Observaciones"
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
        maxLength={300}
      />

      <Button type="submit" className="w-full">
        Registrar Mantenimiento
      </Button>
    </form>
  );
};

export default MaintenanceForm;