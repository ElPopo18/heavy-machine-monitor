import { useParams } from "react-router-dom";
import MaintenanceEditForm from "@/components/maintenance/MaintenanceEditForm";

const MantenimientoEditar = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Error: ID no proporcionado</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Editar Mantenimiento</h1>
        <MaintenanceEditForm maintenanceId={id} />
      </div>
    </div>
  );
};

export default MantenimientoEditar;