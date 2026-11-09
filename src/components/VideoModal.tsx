import React from 'react';
import { VideoItem } from '../types/video';
import { CustomVideoPlayer } from './CustomVideoPlayer';
import {
  Bookmark,
  Heart,
  Share2,
  Clock,
  Sparkles,
  Award,
  Film,
  Play,
  Check,
} from 'lucide-react';

interface VideoModalProps {
  video: VideoItem;
  onClose: () => void;
  onSelectVideo: (video: VideoItem) => void;
  allVideos: VideoItem[];
  isWatchlist: boolean;
  isFavorite: boolean;
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  video,
  onClose,
  onSelectVideo,
  allVideos,
  isWatchlist,
  isFavorite,
  onToggleWatchlist,
  onToggleFavorite,
  onProgressUpdate,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Filter 4-6 related videos by same category or trending
  const relatedVideos = allVideos
    .filter((v) => v.id !== video.id)
    .sort((a, b) => (a.category === video.category ? -1 : 1))
    .slice(0, 4);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-xl flex flex-col items-center justify-start py-4 sm:py-8 px-3 sm:px-6">
      {/* Container */}
      <div className="w-full max-w-6xl flex flex-col gap-6">
        {/* Top Back bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-amber-400 transition-colors"
          >
            <span>&larr; Return to Catalog</span>
            <span className="text-xs text-slate-600 font-mono hidden sm:inline">(ESC)</span>
          </button>
          <div className="text-xs text-slate-500 font-mono tracking-wider">
            CINEMORA THEATRICAL PLAYER &middot; {video.resolution}
          </div>
        </div>

        {/* The HTML5 Player */}
        <div className="w-full">
          <CustomVideoPlayer
            video={video}
            onClose={onClose}
            isWatchlist={isWatchlist}
            isFavorite={isFavorite}
            onToggleWatchlist={onToggleWatchlist}
            onToggleFavorite={onToggleFavorite}
            onProgressUpdate={onProgressUpdate}
            relatedVideos={relatedVideos}
            onSelectRelated={onSelectVideo}
          />
        </div>

        {/* Video Information & Meta Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8 rounded-2xl bg-neutral-950/80 border border-slate-800/80 backdrop-blur-md">
          {/* Main Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-xs text-amber-400/90 font-medium tracking-wider uppercase">
              <span>{video.category}</span>
              <span>&middot;</span>
              <span>{video.year}</span>
              <span>&middot;</span>
              <span className="px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-300 font-mono">
                {video.resolution}
              </span>
              <span>&middot;</span>
              <span>{video.rating}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              {video.title}
            </h1>

            <p className="text-sm sm:text-base text-amber-200/80 italic font-light">
              "{video.tagline}"
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {video.description}
            </p>

            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-slate-400 px-2.5 py-1 rounded bg-slate-900 border border-slate-800"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Quick Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => onToggleWatchlist(video.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
                  isWatchlist
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>

              <button
                onClick={() => onToggleFavorite(video.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-colors ${
                  isFavorite
                    ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Link Copied' : 'Share Film'}</span>
              </button>
            </div>
          </div>

          {/* Credits & Spec Side Panel */}
          <div className="flex flex-col gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Theatrical Specs
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Director / Studio</span>
                <span className="text-slate-200 font-medium">{video.director}</span>
              </div>

              <div>
                <span className="text-slate-500 block">Duration</span>
                <span className="text-slate-200 font-mono">{video.duration}</span>
              </div>

              <div>
                <span className="text-slate-500 block">Audio Mastering</span>
                <span className="text-slate-200">Dolby Atmos Spatial Audio 7.1</span>
              </div>

              <div>
                <span className="text-slate-500 block">Color Grading</span>
                <span className="text-slate-200">HDR10+ / ACES Cinema Pipeline</span>
              </div>

              <div>
                <span className="text-slate-500 block">Global Streams</span>
                <span className="text-amber-400 font-mono font-semibold">{video.views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Films Section */}
        {relatedVideos.length > 0 && (
          <div className="flex flex-col gap-4 pt-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span>Recommended Cinema in this Series</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedVideos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectVideo(item)}
                  className="group relative cursor-pointer rounded-xl overflow-hidden bg-neutral-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-300"
                >
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 text-[11px] font-mono text-slate-300 px-1.5 py-0.5 rounded bg-black/70">
                      {item.duration}
                    </div>
                  </div>

                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
