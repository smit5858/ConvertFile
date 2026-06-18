import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Heart, Shield, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border/40 py-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-tr from-primary to-purple-600 text-white">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                ConvertFile
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Free browser-based media converter that converts images to lossless WebP and videos to WebM. 
              Zero uploads, total privacy, and maximum output quality.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-green-500" />
                No server uploads
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-primary" />
                100% Secure
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground uppercase tracking-wider mb-4">
              Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/images" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Image to WebP
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Video to WebM
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground uppercase tracking-wider mb-4">
              Libraries
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors">FFmpeg.wasm</li>
              <li className="hover:text-foreground transition-colors">Canvas API</li>
              <li className="hover:text-foreground transition-colors">React 18 & Vite</li>
              <li className="hover:text-foreground transition-colors">Zustand State</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} ConvertFile. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for visual excellence with
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse-subtle" />
            using WebAssembly.
          </p>
        </div>
      </div>
    </footer>
  );
};
