'use client';
import { useState } from 'react';
import FormInputs from '@/components/FormInputs';
import { saveToFile } from '@/utils/saveToFile';

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
    <div className="relative left-64 top-32 w-82/100 min-h-screen grid grid-cols-3 gap-2 auto-rows-min">
      <div>
        <h1 className="text-black text-2xl font-bold flex items-center justify-center w-full text-center">
          Analizar una llamada
        </h1>
        <FormInputs onFormSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default Page;
