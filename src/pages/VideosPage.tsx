import React from 'react';
import { VideoConverter } from '../components/converter/VideoConverter';

export const VideosPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <VideoConverter />
    </div>
  );
};
