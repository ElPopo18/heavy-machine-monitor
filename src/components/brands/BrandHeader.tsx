import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BrandHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Marcas</h1>
      <Button onClick={() => navigate("/marcas/registro")}>
        <Plus className="h-4 w-4 mr-2" />
        Registrar Marca
      </Button>
    </div>
  );
};