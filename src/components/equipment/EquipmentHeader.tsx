import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EquipmentHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Lista de Equipos</h1>
      <Button onClick={() => navigate('/equipos/registro')} className="gap-2">
        <PlusCircle className="h-5 w-5" />
        Registrar Equipo
      </Button>
    </div>
  );
};

export default EquipmentHeader;