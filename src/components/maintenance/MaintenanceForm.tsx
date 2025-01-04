import { getTodayFormatted } from "./utils/dateUtils";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { useMaintenanceForm } from "./hooks/useMaintenanceForm";

const MaintenanceForm = () => {
  const {
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
  } = useMaintenanceForm();

  if (loading) {
    return <div>Cargando...</div>;
  }

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
        min={getTodayFormatted()}
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