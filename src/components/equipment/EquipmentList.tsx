import { Equipment } from "@/types/equipment";
import EquipmentCard from "./EquipmentCard";

interface EquipmentListProps {
  equipment: Equipment[];
  onDelete: (id: string) => void;
}

const EquipmentList = ({ equipment, onDelete }: EquipmentListProps) => {
  if (equipment.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay equipos registrados
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {equipment.map((eq) => (
        <EquipmentCard key={eq.id} equipment={eq} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default EquipmentList;