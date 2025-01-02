import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceEvent } from "./types";
import { MaintenanceEventCard } from "./MaintenanceEventCard";
import { isFutureOrToday, formatDate } from "./utils/dateUtils";

const MaintenanceCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [maintenanceEvents, setMaintenanceEvents] = useState<MaintenanceEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<MaintenanceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMaintenanceEvents();
  }, [toast]);

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

      // Filter out past events and ensure correct date handling
      const futureEvents = (data || [])
        .filter((event) => isFutureOrToday(event.scheduled_date))
        .map(event => ({
          ...event,
          // Ensure the date is parsed correctly without timezone offset
          scheduled_date: event.scheduled_date.split('T')[0]
        }));

      setMaintenanceEvents(futureEvents);
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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("maintenance")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Mantenimiento eliminado",
        description: "El mantenimiento ha sido eliminado exitosamente",
      });

      await fetchMaintenanceEvents();
      if (selectedDate) {
        const updatedEventsForDay = maintenanceEvents.filter(
          (event) => formatDate(event.scheduled_date) === format(selectedDate, "yyyy-MM-dd") && event.id !== id
        );
        setSelectedEvents(updatedEventsForDay);
      }
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el mantenimiento",
      });
    }
  };

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
      setSelectedEvents(eventsForDay);
    } else {
      setSelectedEvents([]);
    }
  };

  if (loading) {
    return <div>Cargando calendario...</div>;
  }

  return (
    <div className="flex gap-6">
      <div>
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

      <div className="flex-1">
        {selectedEvents.length > 0 ? (
          <div className="space-y-4">
            {selectedEvents.map((event) => (
              <MaintenanceEventCard
                key={event.id}
                event={event}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : selectedDate ? (
          <p className="text-muted-foreground">
            No hay mantenimientos programados para esta fecha.
          </p>
        ) : (
          <p className="text-muted-foreground">
            Selecciona una fecha para ver los mantenimientos programados.
          </p>
        )}
      </div>
    </div>
  );
};

export default MaintenanceCalendar;