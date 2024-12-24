import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [selectedEvents, setSelectedEvents] = useState<MaintenanceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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

      // Refresh the events list and update the selected events
      await fetchMaintenanceEvents();
      if (selectedDate) {
        const updatedEventsForDay = maintenanceEvents.filter(
          (event) => event.scheduled_date === format(selectedDate, "yyyy-MM-dd") && event.id !== id
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

  const handleEdit = (id: string) => {
    // Navigate to edit page (you'll need to implement this page)
    navigate(`/mantenimiento/editar/${id}`);
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
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>Mantenimiento: {event.equipment.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <span className="font-medium">Operario:</span> {event.operator.first_name}{" "}
                    {event.operator.last_name}
                  </p>
                  <p>
                    <span className="font-medium">Fecha:</span>{" "}
                    {format(parseISO(event.scheduled_date), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </p>
                  {event.observations && (
                    <p>
                      <span className="font-medium">Observaciones:</span>{" "}
                      {event.observations}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(event.id)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente este
                          mantenimiento programado.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(event.id)}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
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