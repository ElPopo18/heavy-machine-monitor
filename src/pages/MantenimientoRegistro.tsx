import MaintenanceForm from "@/components/maintenance/MaintenanceForm";

const MantenimientoRegistro = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Registrar Mantenimiento</h1>
        <MaintenanceForm />
      </div>
    </div>
  );
};

export default MantenimientoRegistro;