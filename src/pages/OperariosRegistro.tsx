import React, { useState } from 'react';
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
      cedula: "",
      firstName: "",
      lastName: "",
      phone: "",
    };

    // Validación de cédula (7-8 dígitos numéricos)
    if (!/^\d{7,8}$/.test(formData.cedula)) {
      newErrors.cedula = "La cédula debe contener entre 7 y 8 dígitos numéricos";
    }

    // Validación de nombre (solo letras, mínimo 2 caracteres)
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/.test(formData.firstName)) {
      newErrors.firstName = "El nombre debe contener solo letras y tener al menos 2 caracteres";
    }

    // Validación de apellido (solo letras, mínimo 2 caracteres)
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/.test(formData.lastName)) {
      newErrors.lastName = "El apellido debe contener solo letras y tener al menos 2 caracteres";
    }

    // Validación de teléfono (formato XXXX-XXXXXXX)
    if (!/^\d{4}-\d{7}$/.test(formData.phone)) {
      newErrors.phone = "El teléfono debe tener el formato XXXX-XXXXXXX";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Por favor, corrija los errores en el formulario",
      });
      return;
    }

    try {
      let photoUrl = null;
      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('operators-photos')
          .upload(fileName, formData.photo);

        if (uploadError) throw uploadError;

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
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error al registrar operario",
        description: "Hubo un problema al guardar los datos. Por favor intente nuevamente.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files) {
      setFormData(prev => ({
        ...prev,
        photo: files[0],
      }));
    } else {
      // Para el campo de teléfono, aplicamos el formato automáticamente
      if (name === 'phone') {
        const cleaned = value.replace(/\D/g, ''); // Elimina todo excepto números
        if (cleaned.length <= 11) { // 4 + 7 dígitos
          const formatted = cleaned.length > 4 
            ? `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
            : cleaned;
          setFormData(prev => ({ ...prev, [name]: formatted }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Registro de Operarios</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cedula">Cédula *</Label>
            <Input
              id="cedula"
              name="cedula"
              value={formData.cedula}
              onChange={handleInputChange}
              className={errors.cedula ? "border-red-500" : ""}
            />
            {errors.cedula && <p className="text-red-500 text-sm">{errors.cedula}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="XXXX-XXXXXXX"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Opcional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Foto (Opcional)</Label>
            <Input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
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