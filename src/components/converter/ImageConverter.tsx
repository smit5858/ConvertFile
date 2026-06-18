import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw, 
  FileArchive 
} from 'lucide-react';
import { useConverterStore } from '../../store/useConverterStore';
import { FileDropZone } from './FileDropZone';
import { FileCard } from './FileCard';
import { convertToWebp } from '../../services/imageConverterService';
import { downloadFile } from '../../utils/downloadFile';
import { zipAndDownload } from '../../utils/zipFiles';
import type { ConversionFile } from '../../types';

export const ImageConverter: React.FC = () => {
  const { 
    files, 
    addFiles, 
    removeFile, 
    updateStatus, 
    updateProgress, 
    completeConversion, 
    failConversion 
  } = useConverterStore();

  const [isProcessingAll, setIsProcessingAll] = useState(false);

  // Filter image files targeting webp
  const imageFiles = files.filter((f) => f.targetType === 'webp');
  
  const idleFiles = imageFiles.filter((f) => f.status === 'idle');
  const completedFiles = imageFiles.filter((f) => f.status === 'completed');
  const convertingFiles = imageFiles.filter((f) => f.status === 'converting');
  
  const isQueueEmpty = imageFiles.length === 0;
  const isConvertingAny = convertingFiles.length > 0;

  const handleFilesSelected = (selectedFiles: File[]) => {
    addFiles(selectedFiles, 'webp');
  };

  const handleConvert = async (id: string) => {
    const item = imageFiles.find((f) => f.id === id);
    if (!item) return;

    updateStatus(id, 'converting');
    updateProgress(id, 0);

    try {
      const convertedBlob = await convertToWebp(item.file, (p) => {
        updateProgress(id, p);
      });
      
      const url = URL.createObjectURL(convertedBlob);
      
      completeConversion(id, convertedBlob, convertedBlob.size, url);
      return true;
    } catch (err: any) {
      failConversion(id, err.message || 'Conversion failed');
      return false;
    }
  };

  const handleConvertAll = async () => {
    if (idleFiles.length === 0) return;
    setIsProcessingAll(true);

    const promises = idleFiles.map((file) => handleConvert(file.id));
    const results = await Promise.all(promises);

    setIsProcessingAll(false);

    // If all files converted successfully in this batch, trigger confetti
    const allSuccessful = results.every(Boolean);
    if (allSuccessful && results.length > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#d946ef', '#3b82f6']
      });
    }
  };

  const handleDownload = (item: ConversionFile) => {
    if (item.convertedUrl) {
      const newName = item.name.replace(/\.[^/.]+$/, '') + '.webp';
      downloadFile(item.convertedUrl, newName);
    }
  };

  const handleDownloadAllZip = async () => {
    if (completedFiles.length === 0) return;

    const zipItems = completedFiles.map((item) => ({
      blob: item.convertedBlob!,
      name: item.name.replace(/\.[^/.]+$/, '') + '.webp',
    }));

    await zipAndDownload(zipItems, 'converted_images.zip');
  };

  const handleClearImagesQueue = () => {
    imageFiles.forEach((file) => removeFile(file.id));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      {/* Introduction */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mb-2 flex items-center justify-center gap-2">
          <ImageIcon className="w-7 h-7 text-primary" />
          Image to Lossless WebP
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          Drag and drop your images to convert them to high-performance WebP files, keeping transparent channels and color profiles 100% intact.
        </p>
      </div>

      {/* Upload Zone */}
      <FileDropZone
        accept="image/png, image/jpeg, image/jpg"
        onFilesSelected={handleFilesSelected}
        multiple={true}
        title="Upload images to convert"
        description="Supports PNG, JPG, and JPEG formats. Processed completely offline."
        icon={<ImageIcon className="w-8 h-8 text-primary" />}
      />

      {/* Queue Area */}
      {!isQueueEmpty && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-border/40">
            <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
              Queue ({imageFiles.length} {imageFiles.length === 1 ? 'file' : 'files'})
            </h3>
            
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {idleFiles.length > 0 && (
                <button
                  onClick={handleConvertAll}
                  disabled={isConvertingAny || isProcessingAll}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessingAll ? 'animate-spin' : ''}`} />
                  Convert All
                </button>
              )}
              
              {completedFiles.length > 0 && (
                <button
                  onClick={handleDownloadAllZip}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <FileArchive className="w-3.5 h-3.5" />
                  Download ZIP
                </button>
              )}

              <button
                onClick={handleClearImagesQueue}
                disabled={isConvertingAny || isProcessingAll}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl border border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/25 text-muted-foreground font-semibold text-xs transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ml-auto sm:ml-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Queue
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
            {imageFiles.map((file) => (
              <FileCard
                key={file.id}
                item={file}
                onConvert={handleConvert}
                onDownload={handleDownload}
                onRemove={removeFile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State Banner */}
      {isQueueEmpty && (
        <div className="glass-panel p-10 rounded-3xl text-center border border-border/40 flex flex-col items-center justify-center bg-card/25">
          <div className="p-3 bg-secondary rounded-full text-muted-foreground mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h4 className="font-display font-bold text-foreground text-sm mb-1">Queue is empty</h4>
          <p className="text-xs text-muted-foreground max-w-xs">
            Add PNG or JPG images above to start converting them to lossless WebP.
          </p>
        </div>
      )}
    </div>
  );
};
