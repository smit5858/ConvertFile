import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-6">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-display font-extrabold text-foreground mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-all duration-300 hover:scale-[1.02] shadow-md shadow-primary/10"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
};
