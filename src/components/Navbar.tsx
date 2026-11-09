import React, { useState, useEffect } from 'react';
import {
  Film,
  Search,
  Bookmark,
  PlusCircle,
  Menu,
  X,
  Code2,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSearch: () => void;
  onOpenLibrary: () => void;
  onOpenUpload: () => void;
  onOpenGuide: () => void;
  libraryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenSearch,
  onOpenLibrary,
  onOpenUpload,
  onOpenGuide,
  libraryCount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'browse', label: 'Discover' },
    { id: 'movies', label: 'Movies' },
    { id: 'animation', label: 'Animation' },
    { id: 'trending', label: 'Trending' },
    { id: 'library', label: 'My Library' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050508]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3'
          : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            onNavigate('hero');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group text-left"
        >
          <div className="w-9 h-9 rounded-xl border border-amber-500/50 bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:border-amber-400 transition-colors">
            <span className="font-cinema font-bold text-lg gold-gradient-text">C</span>
          </div>
          <div>
            <span className="font-cinema font-bold text-xl tracking-[0.2em] gold-gradient-text block">
              CINEMORA
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wider uppercase">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive ? 'text-amber-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full shadow-[0_0_8px_#F59E0B]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Utility Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-2"
            title="Search Catalog (/)"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium hidden md:inline">Search</span>
          </button>

          {/* Library Button */}
          <button
            onClick={onOpenLibrary}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-2 relative"
            title="My Library"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium hidden md:inline">Library</span>
            {libraryCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold font-mono flex items-center justify-center">
                {libraryCount}
              </span>
            )}
          </button>

          {/* Add Local Video button */}
          <button
            onClick={onOpenUpload}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 hidden sm:inline-flex"
            title="Import Local MP4"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Video</span>
          </button>

          {/* VS Code & Dev Guide button */}
          <button
            onClick={onOpenGuide}
            className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition-colors"
            title="VS Code & Project Structure Guide"
          >
            <Code2 className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-neutral-900 text-slate-300 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950/95 border-b border-slate-800 p-6 flex flex-col gap-4 backdrop-blur-xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2.5 px-3 rounded-lg text-sm font-semibold tracking-wider uppercase transition-colors ${
                  activeSection === link.id
                    ? 'bg-amber-500/15 text-amber-300'
                    : 'text-slate-300 hover:bg-neutral-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenUpload();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Import Local MP4 File</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
