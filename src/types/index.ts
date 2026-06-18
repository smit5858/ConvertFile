export type ConversionStatus = 'idle' | 'converting' | 'completed' | 'failed';

export interface ConversionFile {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  convertedSize: number | null;
  originalType: string;
  targetType: 'webp' | 'webm';
  previewUrl: string;
  status: ConversionStatus;
  progress: number; // 0 to 100
  error: string | null;
  convertedBlob: Blob | null;
  convertedUrl: string | null;
}

export type Theme = 'light' | 'dark';
