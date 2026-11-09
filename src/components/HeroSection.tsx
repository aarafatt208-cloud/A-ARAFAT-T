import React from 'react';
import { VideoItem } from '../types/video';
import { Play, Bookmark, Info, ChevronDown, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  featuredVideo: VideoItem;
  onWatch: (video: VideoItem) => void;
  onExplore: () => void;
  isWatchlist: boolean;
  onToggleWatchlist: (id: string) => void;
  onSelectHero?: (video: VideoItem) => void;
  curatedHeroes?: VideoItem[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredVideo,
  onWatch,
  onExplore,
  isWatchlist,
  onToggleWatchlist,
  onSelectHero,
  curatedHeroes = [],
}) => {
  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center justify-start overflow-hidden bg-black select-none">
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Background Video */}
        <video
          src={featuredVideo.videoUrl}
          poster={featuredVideo.posterUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Cinematic Multi-layered Vignette and Color Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/80 to-transparent w-full lg:w-3/4" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/40 to-black/80" />

        {/* Ambient neon flares */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-amber-500/15 blur-[120px] pointer-events-none rounded-full" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full pt-28 pb-16 flex flex-col justify-between min-h-[75vh]">
        <div className="max-w-2xl lg:max-w-3xl flex flex-col gap-4 sm:gap-6">
          {/* Subtle Golden Subtitle & Editorial Kicker */}
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-300">
              FEATURED PREMIERE &middot; CINEMATIC 4K MASTER
            </span>
          </div>

          {/* Large Cinematic Heading */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
            EXPERIENCE <br />
            <span className="gold-gradient-text">PURE CINEMA.</span>
          </h1>

          {/* Subtitle / Title of the featured piece */}
          <div className="text-lg sm:text-xl font-medium text-slate-200">
            {featuredVideo.title}
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-xl line-clamp-3">
            {featuredVideo.description}
          </p>

          {/* Metadata Specs (Zero-Pill) */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono tracking-wider">
            <span className="text-amber-300 font-semibold">{featuredVideo.resolution}</span>
            <span>&middot;</span>
            <span>{featuredVideo.duration}</span>
            <span>&middot;</span>
            <span>{featuredVideo.category}</span>
            <span>&middot;</span>
            <span>Dolby Atmos Spatial</span>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => onWatch(featuredVideo)}
              className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm tracking-wide rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(featuredVideo.id)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold tracking-wide border transition-all duration-200 backdrop-blur-md ${
                isWatchlist
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-black/50 text-white hover:bg-slate-900 border-slate-700/80'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isWatchlist ? 'In Watchlist' : 'Watchlist'}</span>
            </button>

            <button
              onClick={onExplore}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold tracking-wide bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors backdrop-blur-md"
            >
              <Info className="w-4 h-4" />
              <span>Explore Catalog</span>
            </button>
          </div>
        </div>

        {/* Featured Film Switcher Strip (bottom right of hero on desktop) */}
        {curatedHeroes.length > 1 && onSelectHero && (
          <div className="hidden lg:flex items-center justify-between pt-8 border-t border-slate-800/40">
            <div className="text-xs font-mono uppercase text-slate-500 tracking-wider">
              Spotlight Selections
            </div>

            <div className="flex items-center gap-3">
              {curatedHeroes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectHero(item)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    item.id === featuredVideo.id
                      ? 'bg-slate-900/90 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-black/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.duration}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subtle Scroll Down Prompt */}
      <button
        onClick={onExplore}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-slate-500 hover:text-amber-400 transition-colors"
      >
        <span className="text-[10px] tracking-widest font-mono uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
};
