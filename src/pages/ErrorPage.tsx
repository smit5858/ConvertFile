import React from 'react';
// Link removed in favor of standard anchor for full reload on error recovery
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

export const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-6">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-display font-extrabold text-foreground mb-2">Oops! Something went wrong</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We encountered an unexpected error. Please try refreshing the page or returning home.
      </p>
      <div className="flex flex-wrap items-center gap-4 justify-center">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all duration-300 hover:scale-[1.02] shadow-sm"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
        <a
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-all duration-300 hover:scale-[1.02] shadow-md shadow-primary/10"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </a>
      </div>
    </div>
  );
};
