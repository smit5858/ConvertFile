import { create } from 'zustand';
import type { ConversionFile, ConversionStatus } from '../types';

interface ConverterState {
  files: ConversionFile[];
  addFiles: (fileList: File[] | FileList, targetType: 'webp' | 'webm') => void;
  removeFile: (id: string) => void;
  clearQueue: () => void;
  updateStatus: (id: string, status: ConversionStatus) => void;
  updateProgress: (id: string, progress: number) => void;
  completeConversion: (
    id: string,
    convertedBlob: Blob,
    convertedSize: number,
    convertedUrl: string
  ) => void;
  failConversion: (id: string, error: string) => void;
}

export const useConverterStore = create<ConverterState>((set, get) => ({
  files: [],

  addFiles: (fileList, targetType) => {
    const newFiles: ConversionFile[] = Array.from(fileList).map((file) => {
      const id = Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      const previewUrl = URL.createObjectURL(file);
      return {
        id,
        file,
        name: file.name,
        originalSize: file.size,
        convertedSize: null,
        originalType: file.type,
        targetType,
        previewUrl,
        status: 'idle',
        progress: 0,
        error: null,
        convertedBlob: null,
        convertedUrl: null,
      };
    });

    set((state) => ({
      files: [...state.files, ...newFiles],
    }));
  },

  removeFile: (id) => {
    const fileToRemove = get().files.find((f) => f.id === id);
    if (fileToRemove) {
      if (fileToRemove.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      if (fileToRemove.convertedUrl) {
        URL.revokeObjectURL(fileToRemove.convertedUrl);
      }
    }
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    }));
  },

  clearQueue: () => {
    get().files.forEach((file) => {
      if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      if (file.convertedUrl) URL.revokeObjectURL(file.convertedUrl);
    });
    set({ files: [] });
  },

  updateStatus: (id, status) => {
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, status } : f)),
    }));
  },

  updateProgress: (id, progress) => {
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, progress } : f)),
    }));
  },

  completeConversion: (id, convertedBlob, convertedSize, convertedUrl) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id
          ? {
              ...f,
              status: 'completed',
              progress: 100,
              convertedBlob,
              convertedSize,
              convertedUrl,
            }
          : f
      ),
    }));
  },

  failConversion: (id, error) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id
          ? { ...f, status: 'failed', progress: 0, error }
          : f
      ),
    }));
  },
}));
