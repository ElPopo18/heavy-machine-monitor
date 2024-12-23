import React from 'react';
import { Button } from "@/components/ui/button";
import { FormField } from "./FormField";
import { useOperarioForm } from "./hooks/useOperarioForm";

export const OperarioForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    handleInputChange,
  } = useOperarioForm();

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
        accept=".jpg,.jpeg,.png,.gif,.svg"
        value=""
        onChange={handleInputChange}
        placeholder="(Opcional)"
      />

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registrando...' : 'Registrar Operario'}
      </Button>
    </form>
  );
};