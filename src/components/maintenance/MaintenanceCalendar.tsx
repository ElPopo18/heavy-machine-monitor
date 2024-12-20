import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceEvent {
  id: string;
  scheduled_date: string;
  equipment: {
    name: string;
  };
  operator: {
    first_name: string;
    last_name: string;
  };
  observations: string | null;
}

const MaintenanceCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [maintenanceEvents, setMaintenanceEvents] = useState<MaintenanceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMaintenanceEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("maintenance")
          .select(`
            id,
            scheduled_date,
            observations,
            equipment:equipment_id(name),
            operator:operator_id(first_name, last_name)
          `);

        if (error) throw error;

        setMaintenanceEvents(data || []);
      } catch (error) {
        console.error("Error fetching maintenance events:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los eventos de mantenimiento",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceEvents();
  }, [toast]);

  const getDayContent = (day: Date) => {
    const eventsForDay = maintenanceEvents.filter(
      (event) => event.scheduled_date === format(day, "yyyy-MM-dd")
    );

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className="text-sm">{format(day, "d")}</span>
        {eventsForDay.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
        )}
      </div>
    );
  };

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const eventsForDay = maintenanceEvents.filter(
        (event) => event.scheduled_date === format(date, "yyyy-MM-dd")
      );

      if (eventsForDay.length > 0) {
        eventsForDay.forEach((event) => {
          toast({
            title: `Mantenimiento: ${event.equipment.name}`,
            description: `Operario: ${event.operator.first_name} ${
              event.operator.last_name
            }\nFecha: ${format(new Date(event.scheduled_date), "dd/MM/yyyy", {
              locale: es,
            })}${event.observations ? `\nObservaciones: ${event.observations}` : ""}`,
          });
        });
      }
    }
  };

  if (loading) {
    return <div>Cargando calendario...</div>;
  }

  return (
    <div className="p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        className="rounded-md border"
        components={{
          DayContent: ({ date }) => getDayContent(date),
        }}
      />
      <p className="text-sm text-muted-foreground mt-4">
        * Los días con mantenimientos programados están marcados con una línea
      </p>
    </div>
  );
};

export default MaintenanceCalendar;