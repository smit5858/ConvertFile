import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Zap, Image, Video } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { to: '/', label: 'Home', icon: <Zap className="w-4 h-4" /> },
    { to: '/images', label: 'Image Converter', icon: <Image className="w-4 h-4" /> },
    { to: '/videos', label: 'Video Converter', icon: <Video className="w-4 h-4" /> },
  ];

  const activeStyle = 'text-primary border-b-2 border-primary font-medium';
  const inactiveStyle = 'text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted-foreground/30 font-medium';

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 text-white transition-transform duration-300 shadow-md rounded-xl bg-gradient-to-tr from-primary to-purple-600 shadow-primary/20 group-hover:scale-105">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-transparent font-display bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                ConvertFile
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="items-center hidden space-x-8 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 py-1 px-0.5 text-sm transition-all duration-200 ${
                    isActive ? activeStyle : inactiveStyle
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Controls (Theme Toggle, Cta) */}
          <div className="items-center hidden gap-4 md:flex">
            <ThemeToggle />
            <Link
              to="/images"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 hover:scale-[1.02] shadow-sm shadow-primary/10 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="border-b md:hidden border-border/40 bg-card/95 backdrop-blur-md animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3.5 rounded-xl text-base transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-border/40">
              <Link
                to="/images"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center w-full py-3 font-semibold text-center transition-colors rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
