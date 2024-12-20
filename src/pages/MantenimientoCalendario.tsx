import MaintenanceCalendar from "@/components/maintenance/MaintenanceCalendar";

const MantenimientoCalendario = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Calendario de Mantenimientos</h1>
        <MaintenanceCalendar />
      </div>
    </div>
  );
};

export default MantenimientoCalendario;