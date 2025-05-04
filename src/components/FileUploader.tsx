import React, { useState } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      onFileSelect(file); // Call the prop function
    }
  };

  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Subir Archivo</label>
      <div className="relative w-full">
        <label
          htmlFor="fileInput"
          className="w-full p-3 bg-gray-200 rounded-lg flex justify-between items-center cursor-pointer text-gray-700"
        >
          <span>
            {selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'}
          </span>
          <span className="bg-white px-3 py-1 rounded-lg text-[#13202a] font-medium">
            Elegir Archivo
          </span>
        </label>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          id="fileInput"
          accept="audio/*"
        />
      </div>
    </div>
  );
};

export default FileUploader;
