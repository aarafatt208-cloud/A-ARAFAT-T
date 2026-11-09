import React, { useState } from 'react';
import { VideoItem, UserLibrary } from '../types/video';
import { VideoCard } from './VideoCard';
import {
  Bookmark,
  Heart,
  History,
  HardDrive,
  Trash2,
  Play,
  Film,
  PlusCircle,
  AlertCircle,
} from 'lucide-react';

interface MyLibraryViewProps {
  library: UserLibrary;
  allVideos: VideoItem[];
  onPlay: (video: VideoItem) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
  onOpenUploadModal: () => void;
  onDeleteLocalVideo?: (id: string) => void;
}

export const MyLibraryView: React.FC<MyLibraryViewProps> = ({
  library,
  allVideos,
  onPlay,
  onToggleWatchlist,
  onToggleFavorite,
  onClearHistory,
  onOpenUploadModal,
  onDeleteLocalVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'favorites' | 'history' | 'local'>(
    'watchlist'
  );

  const videoMap = new Map<string, VideoItem>();
  allVideos.forEach((v) => videoMap.set(v.id, v));
  library.localVideos.forEach((v) => videoMap.set(v.id, v));

  const watchlistVideos = library.watchlist
    .map((id) => videoMap.get(id))
    .filter((v): v is VideoItem => !!v);

  const favoriteVideos = library.favorites
    .map((id) => videoMap.get(id))
    .filter((v): v is VideoItem => !!v);

  const historyEntries = library.watchHistory
    .map((h) => ({
      ...h,
      video: videoMap.get(h.videoId),
    }))
    .filter((h): h is typeof h & { video: VideoItem } => !!h.video);

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-purple-950/30 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Film className="w-3.5 h-3.5" />
            <span>PERSONAL CINEMATIC VAULT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            My Studio Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Your private streaming archive. Saved titles and play history are securely persisted in
            your local browser storage (localStorage).
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-colors self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Local Video</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
            activeTab === 'watchlist'
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-neutral-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Watchlist</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20">
            {watchlistVideos.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
            activeTab === 'favorites'
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-neutral-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Favorites</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20">
            {favoriteVideos.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
            activeTab === 'history'
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-neutral-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Continue Watching</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20">
            {historyEntries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('local')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
            activeTab === 'local'
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-neutral-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>My Custom Files</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20">
            {library.localVideos.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Watchlist */}
      {activeTab === 'watchlist' && (
        <div>
          {watchlistVideos.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-neutral-950/40 rounded-2xl border border-dashed border-slate-800">
              <Bookmark className="w-10 h-10 text-slate-600" />
              <h3 className="text-base font-semibold text-white">Your Watchlist is Empty</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Explore the catalog and bookmark titles with the bookmark icon to queue them for your
                next cinematic evening.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {watchlistVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={onPlay}
                  isWatchlist={true}
                  isFavorite={library.favorites.includes(video.id)}
                  onToggleWatchlist={onToggleWatchlist}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Favorites */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteVideos.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-neutral-950/40 rounded-2xl border border-dashed border-slate-800">
              <Heart className="w-10 h-10 text-slate-600" />
              <h3 className="text-base font-semibold text-white">No Favorites Added Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Tap the heart button on films and animations you adore to pin them directly into your
                hall of fame.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {favoriteVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={onPlay}
                  isWatchlist={library.watchlist.includes(video.id)}
                  isFavorite={true}
                  onToggleWatchlist={onToggleWatchlist}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Continue Watching / History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {historyEntries.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Playback History</span>
              </button>
            </div>
          )}

          {historyEntries.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-neutral-950/40 rounded-2xl border border-dashed border-slate-800">
              <History className="w-10 h-10 text-slate-600" />
              <h3 className="text-base font-semibold text-white">No Recent Viewing History</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Whenever you stream a video in Cinemora, your progress is tracked automatically so
                you can resume right where you left off.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {historyEntries.map((item) => {
                const percent =
                  item.durationSec > 0
                    ? Math.min(100, (item.progressSec / item.durationSec) * 100)
                    : 0;

                return (
                  <div
                    key={item.videoId}
                    onClick={() => onPlay(item.video)}
                    className="group cursor-pointer rounded-xl overflow-hidden bg-neutral-900 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img
                        src={item.video.posterUrl}
                        alt={item.video.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800">
                        <div
                          className="h-full bg-amber-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 flex flex-col justify-between flex-grow">
                      <div>
                        <h4 className="text-sm font-semibold text-white truncate group-hover:text-amber-300">
                          {item.video.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <span>{item.video.category}</span>
                          <span>&middot;</span>
                          <span className="font-mono">{Math.round(percent)}% watched</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-2">
                        Last played: {new Date(item.watchedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Custom / Local Videos */}
      {activeTab === 'local' && (
        <div>
          {library.localVideos.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-neutral-950/40 rounded-2xl border border-dashed border-slate-800">
              <HardDrive className="w-10 h-10 text-slate-600" />
              <h3 className="text-base font-semibold text-white">No Local Videos Loaded</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Have an MP4 movie or animation project on your computer? Click "Add Local Video" to
                stream it through Cinemora's custom theatrical player!
              </p>
              <button
                onClick={onOpenUploadModal}
                className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
              >
                Select MP4 From Disk
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {library.localVideos.map((video) => (
                <div key={video.id} className="relative group">
                  <VideoCard
                    video={video}
                    onPlay={onPlay}
                    isWatchlist={library.watchlist.includes(video.id)}
                    isFavorite={library.favorites.includes(video.id)}
                    onToggleWatchlist={onToggleWatchlist}
                    onToggleFavorite={onToggleFavorite}
                  />
                  {onDeleteLocalVideo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLocalVideo(video.id);
                      }}
                      className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/80 hover:bg-rose-900/80 text-rose-300 border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity z-20 text-xs"
                      title="Remove local video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
