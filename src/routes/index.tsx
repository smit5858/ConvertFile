import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { ImagesPage } from '../pages/ImagesPage';
import { VideosPage } from '../pages/VideosPage';
import { NotFound } from '../pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/images" element={<ImagesPage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
