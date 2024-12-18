import React from 'react';
import { OperarioForm } from "@/components/operarios/OperarioForm";

const OperariosRegistro = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Registro de Operarios</h1>
        <OperarioForm />
      </div>
    </div>
  );
};

export default OperariosRegistro;