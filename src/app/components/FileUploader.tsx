import React, { useRef } from 'react';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onFileSelect(event.target.files[0]);
        }
    };

    return (
        <div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="video/*"  
                className="hidden" 
            />

            <button 
                onClick={() => fileInputRef.current?.click()} 
                className="px-4 py-2 border-2 border-gray-500 rounded-lg text-gray-700 hover:bg-gray-200"
            >
                Subir Archivo
            </button>
        </div>
    );
};

export default FileUploader;
