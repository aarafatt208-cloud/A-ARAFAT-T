import React from 'react';
import { Film, Play, RotateCcw, Github, Twitter, Youtube, Instagram, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/mockVideos';
import { VideoCategory } from '../types/video';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onSelectCategory: (category: VideoCategory) => void;
  onReplayIntro: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectCategory,
  onReplayIntro,
}) => {
  return (
    <footer className="w-full bg-[#030305] border-t border-slate-900 text-slate-400 text-xs">
      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl border border-amber-500/50 bg-black flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <span className="font-cinema font-bold text-lg gold-gradient-text">C</span>
            </div>
            <span className="font-cinema font-bold text-xl tracking-[0.2em] gold-gradient-text">
              CINEMORA
            </span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Ultra-premium cinematic streaming and visual animation repository. Designed for
            connoisseurs of motion design, 3D CGI, independent films, and high-fidelity digital
            masterpieces.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onReplayIntro}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-slate-800 transition-colors text-xs font-medium"
              title="Re-watch the cinematic opening animation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Cinematic Intro</span>
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2 text-slate-500">
            <a href="#youtube" className="p-2 rounded-lg bg-neutral-900 hover:text-amber-400 hover:bg-slate-800 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#twitter" className="p-2 rounded-lg bg-neutral-900 hover:text-amber-400 hover:bg-slate-800 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#instagram" className="p-2 rounded-lg bg-neutral-900 hover:text-amber-400 hover:bg-slate-800 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#github" className="p-2 rounded-lg bg-neutral-900 hover:text-amber-400 hover:bg-slate-800 transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
            Navigation
          </h4>
          <ul className="space-y-2">
            {['hero:Home', 'browse:Discover', 'movies:Feature Films', 'animation:Animation Lab', 'trending:Trending Now', 'library:My Vault'].map((item) => {
              const [id, label] = item.split(':');
              return (
                <li key={id}>
                  <button
                    onClick={() => onNavigate(id)}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 3: Curated Categories */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
            Genres &amp; Formats
          </h4>
          <ul className="space-y-2">
            {CATEGORIES.slice(1, 7).map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => {
                    onSelectCategory(cat);
                    onNavigate('browse');
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Platform Compliance */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
            Standards
          </h4>
          <ul className="space-y-2 text-slate-500">
            <li>Dolby Vision &middot; Atmos 7.1</li>
            <li>HTML5 Fullscreen API v2</li>
            <li>Zero-Cookie Local Storage</li>
            <li>VP9 / AV1 / H.264 Codec</li>
            <li>4K UHD 60FPS Bitstream</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
        <div>
          &copy; {new Date().getFullYear()} CINEMORA &middot; YGS Cinematic Studio. All rights
          reserved.
        </div>

        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-slate-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-slate-400 transition-colors">
            Terms of Service
          </a>
          <a href="#licensing" className="hover:text-slate-400 transition-colors">
            Media Licensing
          </a>
        </div>
      </div>
    </footer>
  );
};
