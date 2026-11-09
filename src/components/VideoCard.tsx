import React, { useState, useRef } from 'react';
import { VideoItem } from '../types/video';
import { Play, Bookmark, Heart } from 'lucide-react';

interface VideoCardProps {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
  isWatchlist?: boolean;
  isFavorite?: boolean;
  onToggleWatchlist?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  isWatchlist = false,
  isFavorite = false,
  onToggleWatchlist,
  onToggleFavorite,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsHovered(true);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.currentTime = 0;
        videoPreviewRef.current.play().catch(() => {});
      }
    }, 280);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsHovered(false);
    if (videoPreviewRef.current) {
      videoPreviewRef.current.pause();
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onPlay(video)}
      className="group relative flex flex-col cursor-pointer rounded-xl overflow-hidden bg-neutral-900/60 border border-slate-800/80 hover:border-amber-500/50 hover:shadow-[0_10px_35px_rgba(245,158,11,0.15)] transition-all duration-300"
    >
      {/* Media Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
        {/* Main Poster Image */}
        <img
          src={video.posterUrl}
          alt={video.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isHovered && video.previewUrl ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Hover Video Preview if supported */}
        {video.previewUrl && (
          <video
            ref={videoPreviewRef}
            src={video.previewUrl}
            muted
            playsInline
            loop
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Play Icon Centered on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-[0_0_20px_#F59E0B] backdrop-blur-sm transform transition-transform group-hover:scale-110">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Top Badges (Duration, 4K) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-amber-500/20">
            {video.resolution}
          </span>
          <span className="text-[10px] font-mono text-slate-300 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-slate-700/60">
            {video.duration}
          </span>
        </div>

        {/* Quick Save Buttons */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {onToggleWatchlist && (
            <button
              onClick={() => onToggleWatchlist(video.id)}
              className={`p-1.5 rounded-md transition-colors ${
                isWatchlist
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-black/70 text-slate-300 hover:text-white border border-slate-700'
              }`}
              title={isWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          )}

          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(video.id)}
              className={`p-1.5 rounded-md transition-colors ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-black/70 text-slate-300 hover:text-white border border-slate-700'
              }`}
              title={isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-3.5 flex flex-col justify-between flex-grow">
        <div>
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mb-1">
            <span className="text-amber-400/90">{video.category}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{video.year}</span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-slate-500">{video.views} views</span>
          </div>

          <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {video.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
};
