import React, { useRef } from 'react';
import { VideoItem } from '../types/video';
import { VideoCard } from './VideoCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface CollectionRowProps {
  title: string;
  subtitle?: string;
  videos: VideoItem[];
  onPlay: (video: VideoItem) => void;
  watchlist: string[];
  favorites: string[];
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const CollectionRow: React.FC<CollectionRowProps> = ({
  title,
  subtitle,
  videos,
  onPlay,
  watchlist,
  favorites,
  onToggleWatchlist,
  onToggleFavorite,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const offset = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollRef.current.scrollTo({
      left: scrollLeft + offset,
      behavior: 'smooth',
    });
  };

  if (!videos || videos.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 py-4 w-full">
      {/* Row Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display flex items-center gap-2">
            <span>{title}</span>
          </h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Scroll Controls */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-neutral-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-neutral-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory"
      >
        {videos.map((video) => (
          <div
            key={video.id}
            className="w-[280px] sm:w-[320px] md:w-[360px] shrink-0 snap-start"
          >
            <VideoCard
              video={video}
              onPlay={onPlay}
              isWatchlist={watchlist.includes(video.id)}
              isFavorite={favorites.includes(video.id)}
              onToggleWatchlist={onToggleWatchlist}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
