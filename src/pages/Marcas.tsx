import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Marcas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
    };

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (description.length > 300) {
      newErrors.description = "La descripción no puede exceder los 300 caracteres";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Debe iniciar sesión para registrar una marca",
        });
        return;
      }

      const { error } = await supabase.from("brands").insert({
        name: name.trim(),
        description: description.trim() || null,
        user_id: user.id,
      });

      if (error) {
        if (error.code === "23505") {
          setErrors((prev) => ({
            ...prev,
            name: "Ya existe una marca con este nombre",
          }));
          return;
        }
        throw error;
      }

      toast({
        title: "Marca registrada",
        description: "La marca ha sido registrada exitosamente",
      });
      
      // Use window.location for a full page refresh to ensure proper navigation
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar la marca",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Registrar Marca</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? "border-red-500" : ""}
              placeholder="Máximo 300 caracteres"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {description.length}/300 caracteres
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Registrar Marca
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.href = "/"}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Marcas;