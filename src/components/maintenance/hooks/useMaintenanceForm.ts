import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { isFutureOrToday, formatDate } from "../utils/dateUtils";

interface Equipment {
  id: string;
  name: string;
}

interface Operator {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const useMaintenanceForm = () => {
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
          supabase.from("operators").select("id, first_name, last_name, email"),
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

  const sendMaintenanceEmail = async (operator: Operator, equipmentName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-maintenance-email', {
        body: {
          to: [operator.email],
          operatorName: `${operator.first_name} ${operator.last_name}`,
          equipmentName,
          scheduledDate,
          observations: observations || undefined,
        },
      });

      if (error) throw error;

      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el correo de notificación",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!selectedEquipment || !selectedOperator || !scheduledDate) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Por favor complete todos los campos obligatorios",
        });
        return;
      }

      // Validate date
      if (!isFutureOrToday(scheduledDate)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "La fecha programada debe ser hoy o una fecha futura",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Debe iniciar sesión para registrar un mantenimiento",
        });
        return;
      }

      const formattedDate = formatDate(scheduledDate);

      const { error } = await supabase.from("maintenance").insert({
        equipment_id: selectedEquipment,
        operator_id: selectedOperator,
        scheduled_date: formattedDate,
        observations: observations || null,
        user_id: user.id,
      });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // Send email notification
      const operator = operators.find(op => op.id === selectedOperator);
      const selectedEquip = equipment.find(eq => eq.id === selectedEquipment);
      
      if (operator && selectedEquip) {
        await sendMaintenanceEmail(operator, selectedEquip.name);
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
      } else if (error.code === "23514") {
        errorMessage = "La fecha programada debe ser hoy o una fecha futura";
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  return {
    equipment,
    operators,
    selectedEquipment,
    setSelectedEquipment,
    selectedOperator,
    setSelectedOperator,
    scheduledDate,
    setScheduledDate,
    observations,
    setObservations,
    loading,
    handleSubmit,
  };
};