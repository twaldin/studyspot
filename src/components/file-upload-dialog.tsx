"use client";

import { useUploadThing } from '../uploadthing';
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UploadCloud, File, X } from "lucide-react";
import React, { useState, useCallback, useMemo, Suspense, lazy, useEffect } from 'react';
import { ICourse } from "@/features/courses/course.model";
import { useSelectedCourse, useCourses } from '@/hooks/api/courses';

interface FileUploadFormProps {
  acceptedFileTypes?: string;
}

interface FileWithValidation {
  file: File;
  id: string;
  isValid: boolean;
  errorMessage?: string;
  // File proxy properties for easier access
  name: string;
  size: number;
  type: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const validateFile = (file: File, acceptedTypes: string): { isValid: boolean; errorMessage?: string } => {
  const maxSize = 32 * 1024 * 1024; // 32MB max
  const acceptedTypesArray = acceptedTypes.split(',').map(type => type.trim());
  
  // Size validation
  if (file.size > maxSize) {
    return { isValid: false, errorMessage: 'File too large (max 32MB)' };
  }
  
  // Type validation
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!acceptedTypesArray.includes(fileExtension)) {
    return { isValid: false, errorMessage: 'File type not supported' };
  }
  
  return { isValid: true };
};

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadFinalized?: (files: { url: string; ufsUrl: string }[]) => void;
}

export function FileUploadDialog({ open, onOpenChange, onUploadFinalized }: FileUploadDialogProps) {
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const { data: selectedCourse, isLoading: isLoadingCourse, error: selectedCourseError } = useSelectedCourse();
  const { data: courses = [], isLoading: isLoadingCourses, error: coursesError } = useCourses();
  const acceptedFileTypes = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png";
  const [files, setFiles] = useState<FileWithValidation[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const validFiles = useMemo(() => files.filter(f => f.isValid), [files]);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList).map(file => {
      const validation = validateFile(file, acceptedFileTypes);
      // Create a wrapper object that preserves File properties
      const fileWithValidation: FileWithValidation = {
        file: file,
        id: Math.random().toString(36).substr(2, 9),
        isValid: validation.isValid,
        errorMessage: validation.errorMessage,
        // Proxy File properties for easier access
        name: file.name,
        size: file.size,
        type: file.type
      };
      return fileWithValidation;
    });
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { startUpload, isUploading } = useUploadThing(
    "courseMaterialUploader",
    {
      onClientUploadComplete: (res) => {
        setFiles([]);
        setUploadProgress({});
        // Clear the file input
        const fileInput = document.getElementById('fileDropZoneInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        if (onUploadFinalized && res) {
          onUploadFinalized(res);
        }
        onOpenChange(false);
        toast.success("Files uploaded successfully!");
      },
      onUploadError: (error: Error) => {
        setUploadProgress({});
        toast.error(`Upload Error: ${error.message}`);
      },
      onUploadBegin: (fileName) => {
        // Upload is starting - could add file-specific progress here
      },
      onUploadProgress: (progress: number) => {
        // Note: uploadthing doesn't provide fileName in progress callback
        // This is a simplified progress indicator for all files
        console.log('Upload progress:', progress);
      }
    }
  );

  const onUploadClick = useCallback(() => {
    const filesToUpload = validFiles.map(f => f.file);
    const courseId = selectedCourseId || selectedCourse?.id || 'temp';
    startUpload(filesToUpload, { courseId } as any);
  }, [selectedCourseId, selectedCourse, validFiles, startUpload]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      processFiles(event.target.files);
    }
  }, [processFiles]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFiles(event.dataTransfer.files);
      event.dataTransfer.clearData();
    }
  }, [processFiles]);

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
    
    // Only set drag inactive if leaving the drop zone entirely
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragActive(false);
    }
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Upload files to your course. These will improve the assistant's ability to answer questions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex flex-col items-center justify-center w-full">
            <div
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50 ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('fileDropZoneInput')?.click()}
            >
              <div className="flex flex-col items-center justify-center">
                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, etc. (MAX. 32MB)</p>
              </div>
            </div>
            <input 
              type="file"
              id="fileDropZoneInput"
              className="hidden"
              onChange={handleFileChange}
              accept={acceptedFileTypes}
              multiple
            />
          </div>
          
          {/* File list */}
          <div className="grid gap-3">
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className={`flex items-center justify-between p-2 border rounded-md ${
                  !file.isValid ? 'border-destructive bg-destructive/10' : ''
                }`}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <File className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!file.isValid && (
                      <span className="text-xs text-destructive">{file.errorMessage}</span>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-6 h-6 flex-shrink-0"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course selection */}
          <div className="grid gap-2">
            <Label htmlFor="course">Select Course</Label>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger id="course">
                <SelectValue placeholder={
                  isLoadingCourses ? "Loading courses..." : "Select a course"
                } />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title || course.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {coursesError && (
              <p className="text-sm text-destructive">
                Error loading courses. Please try again.
              </p>
            )}
          </div>
          
          {/* Checkboxes */}
          <div className="flex items-center gap-3">
            <Checkbox id="terms" defaultChecked />
            <Label htmlFor="terms">Make files publicly viewable</Label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="anonymous" />
            <div className="grid gap-2">
              <Label htmlFor="anonymous">Anonymous Upload</Label>
              <p className="text-muted-foreground text-sm">
                By clicking this checkbox, users will not be able to see who uploaded the file.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button 
            type="submit" 
            onClick={onUploadClick}
            disabled={validFiles.length === 0 || isUploading || !selectedCourseId || isLoadingCourses}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}