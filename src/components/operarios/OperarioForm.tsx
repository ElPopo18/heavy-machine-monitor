import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormField } from "./FormField";
import { validateOperarioForm, FormErrors } from "./utils/validation";

interface FormData {
  cedula: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  photo: File | null;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateOperarioForm(formData);
    setErrors(validation.errors);
    
    if (!validation.isValid) {
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

        const { data: bucketData, error: bucketError } = await supabase
          .storage
          .createBucket('operators-photos', {
            public: true,
            fileSizeLimit: 1024 * 1024 * 2,
          });

        if (bucketError && bucketError.message !== 'Bucket already exists') {
          throw bucketError;
        }

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('operators-photos')
          .upload(fileName, formData.photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('operators-photos')
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

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
      <FormField
        id="cedula"
        label="Cédula"
        value={formData.cedula}
        onChange={handleInputChange}
        error={errors.cedula}
        required
      />

      <FormField
        id="firstName"
        label="Nombre"
        value={formData.firstName}
        onChange={handleInputChange}
        error={errors.firstName}
        required
      />

      <FormField
        id="lastName"
        label="Apellido"
        value={formData.lastName}
        onChange={handleInputChange}
        error={errors.lastName}
        required
      />

      <FormField
        id="phone"
        label="Teléfono"
        value={formData.phone}
        onChange={handleInputChange}
        error={errors.phone}
        placeholder="XXXX-XXXXXXX (Opcional)"
      />

      <FormField
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="(Opcional)"
      />

      <FormField
        id="photo"
        label="Foto"
        type="file"
        value=""
        onChange={handleInputChange}
        placeholder="(Opcional)"
      />

      <Button type="submit" className="w-full">
        Registrar Operario
      </Button>
    </form>
  );
};