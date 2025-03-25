"use client";  

import React, { useState } from 'react';

const FileUploader: React.FC<{ onFileSelect: (file: File) => void }> = ({ onFileSelect }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
        </div>
    );
};

export default FileUploader;
