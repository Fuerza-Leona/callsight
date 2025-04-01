"use client";

import React, { useState } from "react";
import { Button, Typography } from "@mui/material";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Validate file type (only allow videos)
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file.");
        setSelectedFile(null);
        return;
      }

      setError(""); // Clear any previous error
      setSelectedFile(file);
      onFileSelect(file); // Pass file to parent component
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      <Typography variant="h6" >
        Adjunta una llamada
      </Typography>

      {/* File Input */}
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-input"
      />
      <label htmlFor="file-input">
        <Button variant="outlined" component="span">
          Choose File
        </Button>
      </label>

      {/* Show selected file name only once */}
      {selectedFile && (
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          {selectedFile.name}
        </Typography>
      )}

      {/* Error Message */}
      {error && (
        <Typography variant="body2" color="error" style={{ marginTop: "10px" }}>
          {error}
        </Typography>
      )}
    </div>
  );
};

export default FileUploader;
