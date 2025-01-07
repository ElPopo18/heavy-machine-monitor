import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface MaintenanceEditFormProps {
  maintenanceId: string;
}

const MaintenanceEditForm = ({ maintenanceId }: MaintenanceEditFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [observations, setObservations] = useState("");
  const [loading, setLoading] = useState(true);
  const [originalOperatorId, setOriginalOperatorId] = useState("");
  const [originalDate, setOriginalDate] = useState("");
  const [selectedEquipmentName, setSelectedEquipmentName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch maintenance data
        const { data: maintenanceData, error: maintenanceError } = await supabase
          .from("maintenance")
          .select("*")
          .eq("id", maintenanceId)
          .single();

        if (maintenanceError) throw maintenanceError;

        // Fetch equipment and operators
        const [equipmentData, operatorsData] = await Promise.all([
          supabase.from("equipment").select("id, name"),
          supabase.from("operators").select("id, first_name, last_name, email"),
        ]);

        if (equipmentData.error) throw equipmentData.error;
        if (operatorsData.error) throw operatorsData.error;

        setEquipment(equipmentData.data || []);
        setOperators(operatorsData.data || []);

        // Set form values
        if (maintenanceData) {
          setSelectedEquipment(maintenanceData.equipment_id);
          setSelectedOperator(maintenanceData.operator_id);
          setScheduledDate(maintenanceData.scheduled_date);
          setObservations(maintenanceData.observations || "");
          // Store original values for comparison
          setOriginalOperatorId(maintenanceData.operator_id);
          setOriginalDate(maintenanceData.scheduled_date);

          // Find and store equipment name
          const equipmentItem = equipmentData.data?.find(
            (eq) => eq.id === maintenanceData.equipment_id
          );
          if (equipmentItem) {
            setSelectedEquipmentName(equipmentItem.name);
          }
        }
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
  }, [maintenanceId, toast]);

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

    try {
      const { error } = await supabase
        .from("maintenance")
        .update({
          equipment_id: selectedEquipment,
          operator_id: selectedOperator,
          scheduled_date: scheduledDate,
          observations: observations || null,
        })
        .eq("id", maintenanceId);

      if (error) {
        if (error.code === "23505") {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "El operario ya tiene una actividad programada para esta fecha",
          });
          return;
        }
        throw error;
      }

      // Enviar correo de notificación
      const selectedOperatorData = operators.find(op => op.id === selectedOperator);
      if (selectedOperatorData) {
        await supabase.functions.invoke('send-maintenance-notification', {
          body: {
            to: [selectedOperatorData.email],
            operatorName: `${selectedOperatorData.first_name} ${selectedOperatorData.last_name}`,
            equipmentName: selectedEquipmentName,
            action: 'edited',
            scheduledDate,
            observations: observations || undefined,
          },
        });
      }

      toast({
        title: "Mantenimiento actualizado",
        description: "El mantenimiento ha sido actualizado exitosamente",
      });

      navigate("/mantenimiento/calendario");
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al actualizar el mantenimiento",
      });
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="equipment">Equipo *</Label>
        <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un equipo" />
          </SelectTrigger>
          <SelectContent>
            {equipment.map((eq) => (
              <SelectItem key={eq.id} value={eq.id}>
                {eq.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="operator">Operario *</Label>
        <Select value={selectedOperator} onValueChange={setSelectedOperator}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un operario" />
          </SelectTrigger>
          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op.id} value={op.id}>
                {`${op.first_name} ${op.last_name}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Fecha *</Label>
        <Input
          type="date"
          id="date"
          min={today}
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observations">Observaciones</Label>
        <Textarea
          id="observations"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          maxLength={300}
          placeholder="Detalles u observaciones (opcional)"
          className="h-32"
        />
        <p className="text-sm text-muted-foreground">
          {observations.length}/300 caracteres
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/mantenimiento/calendario")}
          className="w-full"
        >
          Cancelar
        </Button>
        <Button type="submit" className="w-full">
          Actualizar Mantenimiento
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceEditForm;