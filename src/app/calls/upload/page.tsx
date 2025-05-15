'use client';
import { useState } from 'react';
import FormInputs from '@/components/FormInputs';
import { saveToFile } from '@/utils/saveToFile';
import ProtectedRoute from '@/components/ProtectedRoute';

const Page: React.FC = () => {
  const [, setFormData] = useState<{
    cliente: string;
    participantes: string[];
    fecha: string;
    file: File | null;
  } | null>(null);

  const handleFormSubmit = (data: {
    cliente: string;
    participantes: string[];
    fecha: string;
    file: File | null;
  }) => {
    setFormData(data);

    const fileName = data.file ? data.file.name : 'No file uploaded';
    const formattedData = `Cliente: ${
      data.cliente
    }, Participantes: ${data.participantes.join(', ')}, Fecha: ${
      data.fecha
    }, Archivo: ${fileName}\n`;

    saveToFile(formattedData);
  };

  return (
    <ProtectedRoute>
      <div className="relative left-64 top-20 w-82/100 flex justify-center">
        <div className="w-full max-w-md pb-10">
          <h1 className="text-black text-2xl font-bold text-center mb-6">
            Analizar una llamada
          </h1>
          <FormInputs onFormSubmit={handleFormSubmit} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
