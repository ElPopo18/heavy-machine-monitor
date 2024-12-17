import React, { useState } from 'react';  // Add this import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const OperariosRegistro = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cedula: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    photo: null as File | null,
  });

  const [errors, setErrors] = useState({
    cedula: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const validateForm = () => {
    const newErrors = {
      cedula: formData.cedula ? "" : "Complete este campo por favor",
      firstName: formData.firstName ? "" : "Complete este campo por favor",
      lastName: formData.lastName ? "" : "Complete este campo por favor",
      phone: formData.phone ? "" : "Complete este campo por favor",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let photoUrl = null;
      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('operators-photos')
          .upload(fileName, formData.photo);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('operators-photos')
          .getPublicUrl(fileName);
        
        photoUrl = publicUrl;
      }

      const { error } = await supabase.from('operators').insert({
        cedula: formData.cedula,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        email: formData.email || null,
        photo_url: photoUrl,
      });

      if (error) throw error;

      toast({
        title: "Operario registrado exitosamente",
        description: "Los datos han sido guardados en la base de datos",
      });

      navigate('/operarios');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al registrar operario",
        description: "Hubo un problema al guardar los datos. Por favor intente nuevamente.",
      });
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Registro de Operarios</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cedula">Cédula</Label>
            <Input
              id="cedula"
              value={formData.cedula}
              onChange={(e) => setFormData(prev => ({ ...prev, cedula: e.target.value }))}
              className={errors.cedula ? "border-red-500" : ""}
            />
            {errors.cedula && <p className="text-red-500 text-sm">{errors.cedula}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Opcional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Foto (Opcional)</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.files?.[0] || null }))}
            />
          </div>

          <Button type="submit" className="w-full">
            Registrar Operario
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OperariosRegistro;