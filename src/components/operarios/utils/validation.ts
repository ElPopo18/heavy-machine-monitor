export interface FormErrors {
  cedula: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const validateOperarioForm = (formData: {
  cedula: string;
  firstName: string;
  lastName: string;
  phone: string;
}) => {
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

  return {
    errors: newErrors,
    isValid: !Object.values(newErrors).some(error => error !== "")
  };
};