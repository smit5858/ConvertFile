import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Film, 
  Trash2, 
  AlertTriangle, 
  Loader2, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useConverterStore } from '../../store/useConverterStore';
import { FileDropZone } from './FileDropZone';
import { FileCard } from './FileCard';
import { loadFfmpeg, convertMp4ToWebm } from '../../services/videoConverterService';
import { downloadFile } from '../../utils/downloadFile';
import type { ConversionFile } from '../../types';

export const VideoConverter: React.FC = () => {
  const { 
    files, 
    addFiles, 
    removeFile, 
    updateStatus, 
    updateProgress, 
    completeConversion, 
    failConversion 
  } = useConverterStore();

  const [isFfmpegReady, setIsFfmpegReady] = useState(false);
  const [isFfmpegLoading, setIsFfmpegLoading] = useState(true);
  const [ffmpegError, setFfmpegError] = useState<string | null>(null);

  // Filter video files targeting webm
  const videoFiles = files.filter((f) => f.targetType === 'webm');
  
  const convertingFiles = videoFiles.filter((f) => f.status === 'converting');
  
  const isQueueEmpty = videoFiles.length === 0;
  const isConvertingAny = convertingFiles.length > 0;

  // Load FFmpeg core on mount so it's ready before the user clicks convert
  useEffect(() => {
    const initFfmpeg = async () => {
      try {
        setIsFfmpegLoading(true);
        setFfmpegError(null);
        await loadFfmpeg();
        setIsFfmpegReady(true);
      } catch (err: any) {
        setFfmpegError(
          err.message || 
          'Failed to initialize the video conversion engine. Ensure your connection is active and reload.'
        );
      } finally {
        setIsFfmpegLoading(false);
      }
    };

    initFfmpeg();
  }, []);

  const handleFilesSelected = (selectedFiles: File[]) => {
    addFiles(selectedFiles, 'webm');
  };

  const handleConvert = async (id: string) => {
    if (!isFfmpegReady) return;
    
    const item = videoFiles.find((f) => f.id === id);
    if (!item) return;

    updateStatus(id, 'converting');
    updateProgress(id, 0);

    try {
      const convertedBlob = await convertMp4ToWebm(item.file, (p) => {
        updateProgress(id, p);
      });
      
      const url = URL.createObjectURL(convertedBlob);
      
      completeConversion(id, convertedBlob, convertedBlob.size, url);
      
      // Confetti!
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#3b82f6', '#ec4899']
      });
      
      return true;
    } catch (err: any) {
      failConversion(id, err.message || 'Conversion failed');
      return false;
    }
  };

  const handleDownload = (item: ConversionFile) => {
    if (item.convertedUrl) {
      const newName = item.name.replace(/\.[^/.]+$/, '') + '.webm';
      downloadFile(item.convertedUrl, newName);
    }
  };

  const handleClearVideosQueue = () => {
    videoFiles.forEach((file) => removeFile(file.id));
  };

  // Check if any file is large (> 50MB) to show a visual warning card
  const hasLargeFile = videoFiles.some((f) => f.file.size > 50 * 1024 * 1024);

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      {/* Introduction */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mb-2 flex items-center justify-center gap-2">
          <Film className="w-7 h-7 text-purple-500" />
          MP4 to High-Quality WebM
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          Convert your MP4 videos into high-quality WebM containers using client-side FFmpeg WebAssembly. Complete control of colors, speed, and privacy.
        </p>
      </div>

      {/* Engine Loading Indicator */}
      {isFfmpegLoading && (
        <div className="glass-panel p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-center gap-3 animate-pulse-subtle">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm font-medium text-primary">
            Initializing WebAssembly Video Transcoder (FFmpeg)...
          </span>
        </div>
      )}

      {/* Engine Load Error */}
      {ffmpegError && (
        <div className="glass-panel p-6 rounded-2xl border border-destructive/20 bg-destructive/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive shrink-0" />
            <div className="text-left">
              <h4 className="font-display font-bold text-sm text-foreground">Transcoder Initialization Failed</h4>
              <p className="text-xs text-muted-foreground">{ffmpegError}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-semibold shrink-0 cursor-pointer"
          >
            Reload App
          </button>
        </div>
      )}

      {/* Engine Ready Indicator */}
      {isFfmpegReady && !isFfmpegLoading && !ffmpegError && (
        <div className="glass-panel py-3 px-5 rounded-full border border-green-500/20 bg-green-500/5 flex items-center gap-2 w-fit mx-auto text-xs text-green-600 dark:text-green-400 font-semibold">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Video conversion engine successfully loaded and sandbox ready.</span>
        </div>
      )}

      {/* Upload Zone */}
      <FileDropZone
        accept="video/mp4"
        onFilesSelected={handleFilesSelected}
        multiple={false} // Only allow converting one video at a time due to WASM thread intensity
        title="Upload video to convert"
        description="Supports MP4 format. Maximum suggested file size: 50MB."
        icon={<Film className="w-8 h-8 text-purple-500" />}
      />

      {/* Large File Warning Panel */}
      {hasLargeFile && (
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-left flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-display font-bold text-sm text-foreground">Large File Detected (&gt;50MB)</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Converting large video files in the browser takes significant CPU resources. 
              Your tab might temporarily freeze or become slow. Please **keep the tab active** and close other resource-heavy processes for faster processing.
            </p>
          </div>
        </div>
      )}

      {/* Queue Area */}
      {!isQueueEmpty && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
              Queue ({videoFiles.length} file)
            </h3>
            
            <button
              onClick={handleClearVideosQueue}
              disabled={isConvertingAny}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl border border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/25 text-muted-foreground font-semibold text-xs transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Queue
            </button>
          </div>

          {/* Cards List */}
          <div className="space-y-3.5">
            {videoFiles.map((file) => (
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
            <Film className="w-6 h-6" />
          </div>
          <h4 className="font-display font-bold text-foreground text-sm mb-1">Queue is empty</h4>
          <p className="text-xs text-muted-foreground max-w-xs">
            Add an MP4 video file above to start converting it to highest-quality WebM.
          </p>
        </div>
      )}

      {/* WASM Help Details */}
      <div className="pt-4 border-t border-border/30 max-w-2xl mx-auto flex items-center gap-2.5 text-xs text-muted-foreground justify-center">
        <HelpCircle className="w-4 h-4 shrink-0 text-muted-foreground/80" />
        <span>How it works: We spin up FFmpeg inside a browser-isolated worker thread to convert frame-by-frame with zero external logging.</span>
      </div>
    </div>
  );
};
