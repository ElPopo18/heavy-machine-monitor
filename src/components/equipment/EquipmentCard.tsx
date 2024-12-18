import { Equipment } from "@/types/equipment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trash, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EquipmentCardProps {
  equipment: Equipment;
  onDelete: (id: string) => void;
}

const EquipmentCard = ({ equipment, onDelete }: EquipmentCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={equipment.photo_url || undefined} alt={equipment.name} />
            <AvatarFallback>{equipment.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{equipment.name}</h3>
            <p className="text-sm text-muted-foreground">Código: {equipment.code}</p>
            <p className="text-sm text-muted-foreground">Marca: {equipment.brand.name}</p>
            <p className="text-sm mt-2">{equipment.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/equipos/editar/${equipment.id}`)}
              className="text-blue-500 hover:text-blue-600"
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(equipment.id)}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;