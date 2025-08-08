"use client";

import { UploadCloud, File, X } from "lucide-react";
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";

interface FileWithValidation {
  file: File;
  id: string;
  isValid: boolean;
  errorMessage?: string;
  name: string;
  size: number;
  type: string;
}

interface SingleFileInputProps {
  acceptedFileTypes?: string;
  maxSize?: number; // in bytes
  onFileSelect?: (file: File | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const validateFile = (
  file: File, 
  acceptedTypes: string, 
  maxSize: number
): { isValid: boolean; errorMessage?: string } => {
  const acceptedTypesArray = acceptedTypes.split(',').map(type => type.trim());
  
  // Size validation
  if (file.size > maxSize) {
    return { isValid: false, errorMessage: `File too large (max ${formatFileSize(maxSize)})` };
  }
  
  // Type validation
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!acceptedTypesArray.includes(fileExtension)) {
    return { isValid: false, errorMessage: 'File type not supported' };
  }
  
  return { isValid: true };
};

export function SingleFileInput({
  acceptedFileTypes = ".pdf,.txt,.docx",
  maxSize = 32 * 1024 * 1024, // 32MB default
  onFileSelect,
  placeholder = "Click to upload or drag and drop",
  disabled = false,
  className = ""
}: SingleFileInputProps) {
  const [selectedFile, setSelectedFile] = useState<FileWithValidation | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const processFile = useCallback((file: File) => {
    const validation = validateFile(file, acceptedFileTypes, maxSize);
    const fileWithValidation: FileWithValidation = {
      file: file,
      id: Math.random().toString(36).substr(2, 9),
      isValid: validation.isValid,
      errorMessage: validation.errorMessage,
      name: file.name,
      size: file.size,
      type: file.type
    };
    
    setSelectedFile(fileWithValidation);
    onFileSelect?.(validation.isValid ? file : null);
  }, [acceptedFileTypes, maxSize, onFileSelect]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      processFile(event.target.files[0]);
    }
  }, [processFile]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, [processFile]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragActive(false);
    }
  }, []);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    onFileSelect?.(null);
    // Clear the file input
    const fileInput = document.getElementById('singleFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }, [onFileSelect]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      document.getElementById('singleFileInput')?.click();
    }
  }, [disabled]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Drop Zone */}
      <div
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50 ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center">
          <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
          <p className="mb-2 text-sm text-muted-foreground">{placeholder}</p>
          <p className="text-xs text-muted-foreground">
            {acceptedFileTypes.replace(/\./g, '').toUpperCase()} (MAX. {formatFileSize(maxSize)})
          </p>
        </div>
      </div>
      
      <input 
        type="file"
        id="singleFileInput"
        className="hidden"
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        disabled={disabled}
      />

      {/* Selected File Display */}
      {selectedFile && (
        <div className={`flex items-center justify-between p-2 border rounded-md ${
          !selectedFile.isValid ? 'border-destructive bg-destructive/10' : ''
        }`}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <File className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatFileSize(selectedFile.size)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!selectedFile.isValid && (
              <span className="text-xs text-destructive">{selectedFile.errorMessage}</span>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-6 h-6 flex-shrink-0"
              onClick={removeFile}
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}