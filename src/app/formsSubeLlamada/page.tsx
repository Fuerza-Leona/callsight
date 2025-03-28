"use client";
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import FormInputs from '../components/FormInputs';
import { saveToFile } from '../utils/saveToFile';

const Page: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<{ cliente: string; participantes: string[]; fecha: string } | null>(null);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const handleFormSubmit = (data: { cliente: string; participantes: string[]; fecha: string }) => {
        setFormData(data);

        const fileName = selectedFile ? selectedFile.name : 'No file uploaded';
        const formattedData = `Cliente: ${data.cliente}, Participantes: ${data.participantes.join(', ')}, Fecha: ${data.fecha}, Archivo: ${fileName}\n`;

        saveToFile(formattedData);
    };

    return (
        <div className="relative left-64 top-32 w-82/100 min-h-screen grid grid-cols-3 gap-2 auto-rows-min m-2">
            <div>
            <h1 className="text-black text-2xl font-bold flex items-center justify-center w-full text-center">Adjunta una llamada</h1>
                <FileUploader onFileSelect={handleFileSelect} />
                <FormInputs onFormSubmit={handleFormSubmit} />
            </div>
        </div>
        
    );
};

export default Page;
