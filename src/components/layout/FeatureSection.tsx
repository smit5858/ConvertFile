import React from 'react';
import { FileImage, Film, Cpu, CheckCircle2 } from 'lucide-react';

export const FeatureSection: React.FC = () => {
  const imageSpecs = [
    'Supports PNG, JPG, and JPEG inputs',
    'Converts to high-fidelity WebP format',
    'Uses native browser canvas rasterization',
    'Maintains color profile & transparent channels',
  ];

  const videoSpecs = [
    'Converts MP4 to modern WebM container',
    'Encodes with high-performance VP9 video codec',
    'Uses Opus audio encoder for crisp, high-bitrate audio',
    'Preserves original frame rate & pixel resolution',
  ];

  return (
    <div className="py-20 bg-secondary/30 border-y border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Under the Hood: Native Conversion Tech
          </h2>
          <p className="text-muted-foreground">
            We use cutting-edge web technologies to process your media files directly on your GPU/CPU thread.
            Zero cloud overhead. Maximum privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Image Spec Box */}
          <div className="glass-panel p-8 rounded-2xl bg-card border border-border/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/15 transition-colors duration-300">
              <FileImage className="w-32 h-32 -mr-8 -mt-8" />
            </div>
            
            <h3 className="text-2xl font-display font-bold text-foreground flex items-center gap-2 mb-4">
              <FileImage className="w-6 h-6 text-primary" />
              Lossless Image WebP Engine
            </h3>
            
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              We leverage browser canvas drawing buffers to rebuild and repackage files into the WebP format. By setting the encoder quality threshold to 1.0, the canvas exports the image bytes without down-sampling, preserving individual pixel values.
            </p>

            <ul className="space-y-3">
              {imageSpecs.map((spec, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Video Spec Box */}
          <div className="glass-panel p-8 rounded-2xl bg-card border border-border/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-purple-500/10 group-hover:text-purple-500/15 transition-colors duration-300">
              <Film className="w-32 h-32 -mr-8 -mt-8" />
            </div>

            <h3 className="text-2xl font-display font-bold text-foreground flex items-center gap-2 mb-4">
              <Film className="w-6 h-6 text-purple-500" />
              WebAssembly Video Transcoder
            </h3>
            
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              For videos, we instantiate a compiled WebAssembly binary of FFmpeg. Your browser executes highly optimized assembly instructions locally. We encode video streams to VP9 and audio to Opus, matching original pixel resolution and framerates.
            </p>

            <ul className="space-y-3">
              {videoSpecs.map((spec, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Local Processing Benefit */}
        <div className="mt-16 glass-panel p-8 rounded-2xl max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 border border-border/30">
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <Cpu className="w-8 h-8 animate-pulse-subtle" />
          </div>
          <div className="text-left flex-1">
            <h4 className="font-display font-bold text-lg text-foreground mb-1">Hardware Accelerated Local Rendering</h4>
            <p className="text-sm text-muted-foreground">
              Because all conversions are processed locally on your client machine, the speed is directly determined by your computer's hardware (GPU for image rendering, multi-threaded CPU for video compiling). Keep the page active while conversions are in progress for optimal background task execution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
