import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileDropZoneProps {
  accept: string;
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  accept,
  onFilesSelected,
  multiple = true,
  icon,
  title,
  description,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const filteredFiles = filterFilesByAccept(droppedFiles, accept);
      if (filteredFiles.length > 0) {
        onFilesSelected(multiple ? filteredFiles : [filteredFiles[0]]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected(multiple ? selectedFiles : [selectedFiles[0]]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onButtonClick();
    }
  };

  const filterFilesByAccept = (files: File[], acceptTypes: string): File[] => {
    const acceptedList = acceptTypes.split(',').map((type) => type.trim().toLowerCase());
    return files.filter((file) => {
      const fileType = file.type.toLowerCase();
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      return acceptedList.some((accepted) => {
        if (accepted === '*') return true;
        if (accepted.endsWith('/*')) {
          const mainType = accepted.split('/')[0];
          return fileType.startsWith(mainType + '/');
        }
        return fileType === accepted || fileExtension === accepted;
      });
    });
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Upload files by dragging and dropping here or clicking to select"
      className={`relative overflow-hidden w-full flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-4 focus:ring-offset-background group ${
        isDragActive
          ? 'border-primary bg-primary/5 scale-[0.99]'
          : 'border-border hover:border-primary/40 hover:bg-secondary/40'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        tabIndex={-1}
      />

      <div className={`p-4 rounded-2xl bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300 mb-4 ${
        isDragActive ? 'text-primary bg-primary/10 scale-110' : ''
      }`}>
        {icon || <UploadCloud className="w-8 h-8" />}
      </div>

      <h3 className="font-display font-bold text-lg text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      
      {/* Visual Accent Corner Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};
