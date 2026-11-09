import React, { useState, useEffect, useRef } from 'react';
import { VideoItem } from '../types/video';
import { VideoCard } from './VideoCard';
import { Search, X, Film, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoItem[];
  onPlay: (video: VideoItem) => void;
  watchlist: string[];
  favorites: string[];
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  videos,
  onPlay,
  watchlist,
  favorites,
  onToggleWatchlist,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredVideos = cleanQuery
    ? videos.filter((v) => {
        const inTitle = v.title.toLowerCase().includes(cleanQuery);
        const inCat = v.category.toLowerCase().includes(cleanQuery);
        const inDesc = v.description.toLowerCase().includes(cleanQuery);
        const inDirector = v.director.toLowerCase().includes(cleanQuery);
        const inTags = v.tags.some((t) => t.toLowerCase().includes(cleanQuery));
        return inTitle || inCat || inDesc || inDirector || inTags;
      })
    : [];

  const suggestedTerms = [
    'Animation',
    'Cyberpunk',
    'Sci-Fi',
    '4K UHD',
    'Documentary',
    'Nature',
    'Tokyo',
    'Dragon',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex flex-col items-center justify-start py-8 px-4 sm:px-6">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Search Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Cinemora Search Engine
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Search (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Box */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, category, director, or keywords (e.g. Sci-Fi, Dragon, 4K)..."
            className="w-full pl-12 pr-12 py-4 bg-neutral-900 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-base sm:text-lg shadow-2xl"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Popular searches:</span>
          {suggestedTerms.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="text-xs px-2.5 py-1 rounded-lg bg-neutral-900/80 hover:bg-amber-500/10 hover:text-amber-300 text-slate-400 border border-slate-800 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {cleanQuery && (
          <div className="text-xs font-mono text-slate-400 pt-2">
            Found <span className="text-amber-400 font-bold">{filteredVideos.length}</span> films
            matching "{query}"
          </div>
        )}

        {/* Search Results Grid */}
        {cleanQuery && filteredVideos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={(v) => {
                  onPlay(v);
                  onClose();
                }}
                isWatchlist={watchlist.includes(video.id)}
                isFavorite={favorites.includes(video.id)}
                onToggleWatchlist={onToggleWatchlist}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* No Results State */}
        {cleanQuery && filteredVideos.length === 0 && (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-neutral-950/60 rounded-2xl border border-slate-800/60">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No cinematic titles found</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              We couldn't find any videos matching "{query}". Try checking for spelling errors or
              explore categories like Animation or Sci-Fi.
            </p>
            <button
              onClick={() => setQuery('')}
              className="mt-2 px-4 py-2 text-xs font-medium bg-amber-500 text-slate-950 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
            >
              Clear Search Query
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
