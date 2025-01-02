import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Brand {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  brandId: string;
  code: string;
  description: string;
  photo: File | null;
}

interface FormErrors {
  name: string;
  brandId: string;
  code: string;
  description: string;
}

const EquiposRegistro = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    brandId: "",
    code: "",
    description: "",
    photo: null,
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    brandId: "",
    code: "",
    description: "",
  });

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las marcas",
        });
      } else {
        setBrands(data || []);
      }
    };

    fetchBrands();
  }, []);

  const validateForm = () => {
    const newErrors = {
      name: "",
      brandId: "",
      code: "",
      description: "",
    };

    if (formData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.brandId) {
      newErrors.brandId = "Debe seleccionar una marca";
    }

    if (!formData.code) {
      newErrors.code = "El código es obligatorio";
    }

    if (!formData.description) {
      newErrors.description = "La descripción es obligatoria";
    } else if (formData.description.length > 300) {
      newErrors.description = "La descripción no puede exceder los 300 caracteres";
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
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Debe iniciar sesión para registrar equipos",
        });
        return;
      }

      // Verificar si el código ya existe usando maybeSingle() en lugar de single()
      const { data: existingEquipment, error: checkError } = await supabase
        .from('equipment')
        .select('id')
        .eq('code', formData.code)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingEquipment) {
        setErrors(prev => ({
          ...prev,
          code: "Este código ya está en uso",
        }));
        toast({
          variant: "destructive",
          title: "Error",
          description: "El código ingresado ya está en uso",
        });
        return;
      }

      let photoUrl = null;

      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('equipment-photos')
          .upload(fileName, formData.photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('equipment-photos')
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('equipment')
        .insert({
          name: formData.name,
          brand_id: formData.brandId,
          code: formData.code,
          description: formData.description,
          photo_url: photoUrl,
          user_id: user.id, // Add the user_id here
        });

      if (insertError) throw insertError;

      toast({
        title: "Equipo registrado exitosamente",
        description: "Los datos han sido guardados en la base de datos",
      });

      navigate('/equipos');
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error al registrar equipo",
        description: "Hubo un problema al guardar los datos. Por favor intente nuevamente.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files) {
        setFormData(prev => ({
          ...prev,
          photo: fileInput.files![0],
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Registrar Equipo</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandId">Marca *</Label>
            {brands.length === 0 ? (
              <p className="text-red-500">Por favor, registre una marca</p>
            ) : (
              <Select
                value={formData.brandId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, brandId: value }))}
              >
                <SelectTrigger className={errors.brandId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccione una marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.brandId && <p className="text-red-500 text-sm">{errors.brandId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Código *</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? "border-red-500" : ""}
              placeholder="Máximo 300 caracteres"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Registrar Equipo
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/equipos')} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquiposRegistro;