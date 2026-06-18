import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Image, Video, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative pt-16 pb-20 overflow-hidden bg-background sm:pt-24 sm:pb-28">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-primary/10 to-purple-500/10 blur-3xl" />
      <div className="absolute top-10 left-10 -z-10 h-[200px] w-[200px] rounded-full bg-pink-500/5 blur-3xl" />

      <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold tracking-wide uppercase mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Local Browser Conversion</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1] mb-6">
          Convert Media with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
            Absolute Quality
          </span>{' '}
          Preservation
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto mb-10 text-base leading-relaxed sm:text-lg text-muted-foreground">
          Transform PNG, JPG, or JPEG images into lossless WebP, and MP4 videos to highest-quality WebM.
          All processing runs client-side in your browser. <strong>Your files never upload to any server.</strong>
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 mb-16 sm:flex-row">
          <Link
            to="/images"
            className="flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Image className="w-5 h-5" />
            Convert Images
          </Link>
          <Link
            to="/videos"
            className="flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-3.5 rounded-xl bg-secondary text-secondary-foreground font-semibold border border-border/50 hover:bg-secondary/80 hover:border-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Video className="w-5 h-5" />
            Convert Videos
          </Link>
        </div>

        {/* Core Value Props Cards */}
        <div className="grid max-w-5xl grid-cols-1 gap-8 pt-6 mx-auto text-left md:grid-cols-3">
          {/* Card 1: Privacy */}
          <div className="p-6 glass-panel rounded-2xl">
            <div className="p-3 mb-4 text-green-500 border w-fit rounded-xl bg-green-500/10 border-green-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold font-display text-foreground">100% Privacy-First</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Files are processed entirely inside your local sandbox. No files are uploaded to our servers, keeping your media completely private.
            </p>
          </div>

          {/* Card 2: Highest Quality */}
          <div className="p-6 glass-panel rounded-2xl">
            <div className="p-3 mb-4 border w-fit rounded-xl bg-primary/10 text-primary border-primary/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold font-display text-foreground">Lossless Quality</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Maintains exact resolution, color spaces, and bitrates. Never compromises quality for compression size.
            </p>
          </div>

          {/* Card 3: Free & Unlimited */}
          <div className="p-6 glass-panel rounded-2xl">
            <div className="p-3 mb-4 text-pink-500 border w-fit rounded-xl bg-pink-500/10 border-pink-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold font-display text-foreground">Unlimited Conversions</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              No daily conversion caps, file size restrictions, or premium upgrades. Convert as many files as your device memory allows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
