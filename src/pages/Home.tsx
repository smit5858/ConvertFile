import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Film } from 'lucide-react';
import { HeroSection } from '../components/layout/HeroSection';
import { FeatureSection } from '../components/layout/FeatureSection';
import { ImageConverter } from '../components/converter/ImageConverter';
import { VideoConverter } from '../components/converter/VideoConverter';

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');

  return (
    <div className="space-y-4">
      {/* Hero Section Banner */}
      <HeroSection />

      {/* Main Converter Hub (Tabs & Components) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-panel p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-border/40 bg-card/40 flex items-center justify-center gap-2 max-w-md mx-auto mb-12">
          <button
            onClick={() => setActiveTab('images')}
            className={`relative flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl sm:rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === 'images'
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/15'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Image Converter</span>
          </button>
          
          <button
            onClick={() => setActiveTab('videos')}
            className={`relative flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl sm:rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/15'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Video Converter</span>
          </button>
        </div>

        {/* Dynamic Display Area with Framer Motion slide transitions */}
        <div className="overflow-hidden min-h-[380px] py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'images' ? <ImageConverter /> : <VideoConverter />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Under-the-hood specs section */}
      <FeatureSection />
    </div>
  );
};
