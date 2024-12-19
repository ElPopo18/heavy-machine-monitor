import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MarcasRegistro from "./MarcasRegistro";

const Marcas = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <MarcasRegistro />
    </div>
  );
};

export default Marcas;