import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  cedula: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  photo: File | null;
}

interface FormErrors {
  cedula: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const OperarioForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<FormData>({
    cedula: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    photo: null,
  });

  const [errors, setErrors] = React.useState<FormErrors>({
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

    if (!/^\d{7,8}$/.test(formData.cedula)) {
      newErrors.cedula = "La cédula debe contener entre 7 y 8 dígitos numéricos";
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/.test(formData.firstName)) {
      newErrors.firstName = "El nombre debe contener solo letras y tener al menos 2 caracteres";
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/.test(formData.lastName)) {
      newErrors.lastName = "El apellido debe contener solo letras y tener al menos 2 caracteres";
    }

    if (formData.phone && !/^\d{4}-\d{7}$/.test(formData.phone)) {
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

      // Solo intentar subir la foto si se seleccionó una
      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        // Primero crear el bucket si no existe
        const { data: bucketData, error: bucketError } = await supabase
          .storage
          .createBucket('operators-photos', {
            public: true,
            fileSizeLimit: 1024 * 1024 * 2, // 2MB
          });

        if (bucketError && bucketError.message !== 'Bucket already exists') {
          throw bucketError;
        }

        // Subir la foto
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('operators-photos')
          .upload(fileName, formData.photo);

        if (uploadError) throw uploadError;

        // Obtener la URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('operators-photos')
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      // Insertar el operario en la base de datos
      const { error: insertError } = await supabase
        .from('operators')
        .insert({
          cedula: formData.cedula,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || null,
          email: formData.email || null,
          photo_url: photoUrl,
        });

      if (insertError) throw insertError;

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
      if (name === 'phone') {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 11) {
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
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="XXXX-XXXXXXX (Opcional)"
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
  );
};