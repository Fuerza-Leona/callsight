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
      <input
        type="file"
        className="p-3 border rounded-lg bg-gray-200 border-black"
        onChange={handleFileChange}
        id="fileInput"
      />
      {selectedFile && (
        <p className="mt-2 text-sm text-gray-600">
          Archivo seleccionado: {selectedFile.name}
        </p>
      )}
    </div>
  );
};

export default FileUploader;
