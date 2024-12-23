import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateOperarioForm } from "../utils/validation";
import type { FormData } from "../types";

export const useOperarioForm = (initialData?: FormData | null, operatorId?: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    cedula: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    photo: null,
  });

  const [errors, setErrors] = useState({
    cedula: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.access_token) {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: "Debe iniciar sesión para registrar operarios",
      });
      return;
    }

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

    setIsSubmitting(true);

    try {
      let photoUrl = null;

      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop()?.toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
        
        if (!fileExt || !validExtensions.includes(fileExt)) {
          toast({
            variant: "destructive",
            title: "Error de archivo",
            description: "Por favor, seleccione una imagen válida (jpg, jpeg, png, gif, svg)",
          });
          setIsSubmitting(false);
          return;
        }

        const fileName = `${Math.random()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('operators-photos')
          .upload(fileName, formData.photo);

        if (uploadError) {
          console.error('Error uploading photo:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('operators-photos')
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      const operatorData = {
        cedula: formData.cedula,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        email: formData.email || null,
        ...(photoUrl && { photo_url: photoUrl }),
      };

      let error;

      if (operatorId) {
        // Update existing operator
        const { error: updateError } = await supabase
          .from('operators')
          .update(operatorData)
          .eq('id', operatorId);
        error = updateError;
      } else {
        // Create new operator
        const { error: insertError } = await supabase
          .from('operators')
          .insert(operatorData);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: operatorId ? "Operario actualizado exitosamente" : "Operario registrado exitosamente",
        description: "Los datos han sido guardados en la base de datos",
      });

      navigate('/operarios');
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: operatorId ? "Error al actualizar operario" : "Error al registrar operario",
        description: "Hubo un problema al guardar los datos. Por favor intente nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files) {
      const file = files[0];
      if (file) {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
        
        if (!fileExt || !validExtensions.includes(fileExt)) {
          toast({
            variant: "destructive",
            title: "Error de archivo",
            description: "Por favor, seleccione una imagen válida (jpg, jpeg, png, gif, svg)",
          });
          e.target.value = '';
          return;
        }
        
        setFormData(prev => ({
          ...prev,
          photo: file,
        }));
      }
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

  return {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    handleInputChange,
  };
};