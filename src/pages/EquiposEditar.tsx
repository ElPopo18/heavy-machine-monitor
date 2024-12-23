import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

interface Brand {
  id: string;
  name: string;
}

interface Equipment {
  id: string;
  name: string;
  brand_id: string;
  code: string;
  description: string;
  photo_url: string | null;
  brand: Brand;
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

const EquiposEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
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
    const fetchData = async () => {
      try {
        // Fetch equipment data
        const { data: equipmentData, error: equipmentError } = await supabase
          .from('equipment')
          .select('*, brand:brands(id, name)')
          .eq('id', id)
          .single();

        if (equipmentError) throw equipmentError;
        
        if (!equipmentData) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se encontró el equipo",
          });
          navigate('/equipos');
          return;
        }

        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('*')
          .order('name');

        if (brandsError) throw brandsError;

        setBrands(brandsData || []);
        setEquipment(equipmentData);
        setFormData({
          name: equipmentData.name,
          brandId: equipmentData.brand_id,
          code: equipmentData.code,
          description: equipmentData.description,
          photo: null,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar la información del equipo",
        });
        navigate('/equipos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast]);

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
      // Check if code exists and it's not the current equipment's code
      if (formData.code !== equipment?.code) {
        const { data: existingEquipment, error: checkError } = await supabase
          .from('equipment')
          .select('id')
          .eq('code', formData.code)
          .maybeSingle();

        if (checkError) throw checkError;

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
      }

      let photoUrl = equipment?.photo_url || null;

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

      const { error: updateError } = await supabase
        .from('equipment')
        .update({
          name: formData.name,
          brand_id: formData.brandId,
          code: formData.code,
          description: formData.description,
          photo_url: photoUrl,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      toast({
        title: "Equipo actualizado",
        description: "Los datos han sido actualizados exitosamente",
      });

      navigate('/equipos');
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error al actualizar equipo",
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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigate('/equipos')}
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </Button>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Editar Equipo</h1>
          <p className="text-muted-foreground">Actualiza la información del equipo</p>
        </div>

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
            {equipment?.photo_url && (
              <div className="mt-2">
                <img
                  src={equipment.photo_url}
                  alt={equipment.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Guardar Cambios
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

export default EquiposEditar;