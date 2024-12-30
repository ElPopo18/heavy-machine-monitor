import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
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
import { MaintenanceEvent } from "./types";

interface MaintenanceEventCardProps {
  event: MaintenanceEvent;
  onDelete: (id: string) => Promise<void>;
}

export const MaintenanceEventCard = ({ event, onDelete }: MaintenanceEventCardProps) => {
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigate(`/mantenimiento/editar/${id}`);
  };

  return (
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
            <span className="font-medium">Observaciones:</span> {event.observations}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => handleEdit(event.id)}>
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
              <AlertDialogAction onClick={() => onDelete(event.id)}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};