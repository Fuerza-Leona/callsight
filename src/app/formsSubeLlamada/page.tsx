"use client";
import React, { useState, useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import FormInputs from '../components/FormInputs';
import { saveToFile } from '../utils/saveToFile';

const Page: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<{ cliente: string; participantes: string[]; fecha: string } | null>(null);
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch companies data when component mounts
    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Get the access token from localStorage
                const accessToken = localStorage.getItem('ACCESS');
                
                if (!accessToken) {
                    throw new Error('No access token found');
                }
                
                // Make the API request with the Authorization header
                const response = await fetch('http://localhost:8000/api/v1/companies', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                
                const data = await response.json();
                setCompanies(data);
                console.log('Companies fetched:', data);
                
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch companies');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCompanies();
    }, []);

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
            <h1 className="text-black text-2xl font-bold flex items-center justify-center w-full text-center">Analizar una llamada</h1>
                <FileUploader onFileSelect={handleFileSelect} />
                <FormInputs onFormSubmit={handleFormSubmit} />
            </div>
        </div>
    );
};

export default Page;