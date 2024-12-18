import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BrandList } from "@/components/brands/BrandList";
import { BrandHeader } from "@/components/brands/BrandHeader";

const Marcas = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BrandHeader />
      <BrandList />
    </div>
  );
};

export default Marcas;