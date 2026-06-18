import React from 'react';
import { 
  Trash2, 
  RefreshCw, 
  Download, 
  AlertCircle, 
  PlaySquare, 
  ImageIcon 
} from 'lucide-react';
import type { ConversionFile } from '../../types';
import { formatSize } from '../../utils/formatSize';

interface FileCardProps {
  item: ConversionFile;
  onConvert: (id: string) => void;
  onDownload: (item: ConversionFile) => void;
  onRemove: (id: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({
  item,
  onConvert,
  onDownload,
  onRemove,
}) => {
  const isImage = item.targetType === 'webp';
  const savings = item.convertedSize && item.originalSize
    ? Math.round(((item.originalSize - item.convertedSize) / item.originalSize) * 100)
    : 0;

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 border border-border/40 bg-card/50 transition-all duration-300 animate-slide-up">
      {/* File Preview */}
      <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0 border border-border/40 relative">
        {isImage ? (
          item.previewUrl ? (
            <img 
              src={item.previewUrl} 
              alt={item.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback icon if preview fails
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          )
        ) : (
          item.previewUrl ? (
            <video 
              src={item.previewUrl} 
              className="w-full h-full object-cover" 
              muted 
              playsInline
            />
          ) : (
            <PlaySquare className="w-6 h-6 text-muted-foreground" />
          )
        )}
      </div>

      {/* File Details */}
      <div className="flex-1 w-full text-center sm:text-left min-w-0">
        <h4 className="font-display font-bold text-sm text-foreground truncate" title={item.name}>
          {item.name}
        </h4>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1 text-xs text-muted-foreground">
          <span>{formatSize(item.originalSize)}</span>
          <span>•</span>
          <span className="uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded-md bg-secondary font-semibold text-secondary-foreground">
            {item.file.name.split('.').pop()} → {item.targetType}
          </span>
          {item.status === 'completed' && item.convertedSize && (
            <>
              <span>•</span>
              <span className="text-foreground font-medium">{formatSize(item.convertedSize)}</span>
              {savings > 0 && (
                <span className="text-green-500 font-semibold bg-green-500/10 px-1.5 py-0.5 rounded">
                  Saved {savings}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Conversion Progress Bar */}
        {item.status === 'converting' && (
          <div className="mt-3 w-full">
            <div className="flex justify-between items-center text-xs text-primary font-medium mb-1">
              <span>Converting...</span>
              <span>{item.progress}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out" 
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {item.status === 'failed' && item.error && (
          <p className="mt-1 text-xs text-destructive flex items-center justify-center sm:justify-start gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {item.error}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border/30">
        {item.status === 'idle' && (
          <button
            onClick={() => onConvert(item.id)}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full sm:w-auto justify-center cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Convert
          </button>
        )}

        {item.status === 'completed' && (
          <button
            onClick={() => onDownload(item)}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full sm:w-auto justify-center cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        )}

        <button
          onClick={() => onRemove(item.id)}
          disabled={item.status === 'converting'}
          className={`p-2 rounded-xl border border-border/40 transition-colors cursor-pointer ${
            item.status === 'converting'
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 text-muted-foreground'
          }`}
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
