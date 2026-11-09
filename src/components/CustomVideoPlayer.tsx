import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  PictureInPicture,
  Settings,
  Bookmark,
  Heart,
  X,
  Loader2,
  AlertCircle,
  Film,
} from 'lucide-react';
import { VideoItem } from '../types/video';

interface CustomVideoPlayerProps {
  video: VideoItem;
  isOpen?: boolean;
  onClose?: () => void;
  onToggleWatchlist?: (videoId: string) => void;
  onToggleFavorite?: (videoId: string) => void;
  isWatchlist?: boolean;
  isFavorite?: boolean;
  onVideoEnd?: () => void;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
  initialTime?: number;
  relatedVideos?: VideoItem[];
  onSelectRelated?: (video: VideoItem) => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  video,
  onClose,
  onToggleWatchlist,
  onToggleFavorite,
  isWatchlist = false,
  isFavorite = false,
  onVideoEnd,
  onProgressUpdate,
  initialTime = 0,
  relatedVideos = [],
  onSelectRelated,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressTrackRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSec || 0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger brief visual feedback icon (e.g. Play, Pause, 10s skip)
  const flashFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => {
      setActionFeedback(null);
    }, 600);
  };

  // Activity timer to hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 2600);
    }
  };

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) {
      v.play()
        .then(() => {
          setIsPlaying(true);
          flashFeedback('PLAY');
        })
        .catch((err) => {
          console.warn('Playback error:', err);
        });
    } else {
      v.pause();
      setIsPlaying(false);
      flashFeedback('PAUSE');
    }
  }, []);

  const seekRelative = useCallback((deltaSec: number) => {
    const v = videoRef.current;
    if (!v) return;
    const newTime = Math.min(Math.max(0, v.currentTime + deltaSec), v.duration || 9999);
    v.currentTime = newTime;
    setCurrentTime(newTime);
    flashFeedback(deltaSec > 0 ? `+${deltaSec}s` : `${deltaSec}s`);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isMuted) {
      v.muted = false;
      v.volume = volume || 0.85;
      setIsMuted(false);
      flashFeedback('UNMUTED');
    } else {
      v.muted = true;
      setIsMuted(true);
      flashFeedback('MUTED');
    }
  }, [isMuted, volume]);

  const changeVolume = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    const cleanVal = Math.max(0, Math.min(1, val));
    v.volume = cleanVal;
    setVolume(cleanVal);
    if (cleanVal === 0) {
      v.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      v.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullscreen = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) {
      c.requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document.exitFullscreen?.()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, []);

  const togglePiP = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (v.requestPictureInPicture) {
        await v.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('Picture in picture error:', err);
    }
  };

  const handleSpeedChange = (speed: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
    flashFeedback(`${speed}x`);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekRelative(-5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekRelative(5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          changeVolume(volume + 0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeVolume(volume - 0.1);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen?.();
          } else if (onClose) {
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekRelative, toggleMute, toggleFullscreen, volume, isFullscreen, onClose]);

  // Sync fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Set initial time if specified
  useEffect(() => {
    const v = videoRef.current;
    if (v && initialTime > 0) {
      v.currentTime = initialTime;
    }
  }, [video.id, initialTime]);

  // Video track seeking
  const handleProgressScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = progressTrackRef.current;
    const v = videoRef.current;
    if (!track || !v || !v.duration) return;
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = percentage * v.duration;
    v.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = progressTrackRef.current;
    const v = videoRef.current;
    if (!track || !v || !v.duration) return;
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    setHoverTime(percentage * v.duration);
    setHoverPosition(clickX);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full bg-black select-none overflow-hidden group flex flex-col justify-center ${
        isFullscreen ? 'h-screen' : 'aspect-video max-h-[80vh] rounded-2xl border border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)]'
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.posterUrl}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onPlay={() => {
          setIsPlaying(true);
          setIsBuffering(false);
        }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onTimeUpdate={() => {
          const v = videoRef.current;
          if (!v) return;
          setCurrentTime(v.currentTime);
          onProgressUpdate?.(v.currentTime, v.duration || duration);

          if (v.buffered && v.buffered.length > 0) {
            setBufferedEnd(v.buffered.end(v.buffered.length - 1));
          }
        }}
        onLoadedMetadata={() => {
          const v = videoRef.current;
          if (!v) return;
          setDuration(v.duration || video.durationSec);
          setIsBuffering(false);
          setHasError(false);
        }}
        onEnded={() => {
          setIsPlaying(false);
          onVideoEnd?.();
        }}
        onError={() => {
          setIsBuffering(false);
          setHasError(true);
        }}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Center Action Feedback Flash */}
      {actionFeedback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="px-6 py-3 rounded-xl bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300 font-cinema tracking-widest text-lg font-bold shadow-2xl animate-fade">
            {actionFeedback}
          </div>
        </div>
      )}

      {/* Buffering Spinner */}
      {isBuffering && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-black/30 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
            <span className="text-xs font-mono tracking-wider text-slate-300 uppercase">
              Loading Stream
            </span>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Stream Encountered An Issue</h3>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            Unable to stream video file. If this is a local session file, you can re-select it using
            the "Manage Local Video" button.
          </p>
          <button
            onClick={() => {
              const v = videoRef.current;
              if (v) {
                setHasError(false);
                setIsBuffering(true);
                v.load();
                v.play().catch(() => {});
              }
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg transition-colors text-sm"
          >
            Retry Playback
          </button>
        </div>
      )}

      {/* Top Bar Overlay (Title, Category, Close, Favorite) */}
      <div
        className={`absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/85 via-black/40 to-transparent z-30 transition-opacity duration-300 flex items-center justify-between ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 max-w-[70%]">
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white truncate drop-shadow">
              {video.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span>{video.category}</span>
              <span>&middot;</span>
              <span className="font-mono">{video.resolution}</span>
              <span>&middot;</span>
              <span>{video.year}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleWatchlist && (
            <button
              onClick={() => onToggleWatchlist(video.id)}
              className={`p-2 rounded-lg transition-colors ${
                isWatchlist
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-black/50 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
              title={isWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          )}

          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(video.id)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-black/50 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
              title={isFavorite ? 'In Favorites' : 'Add to Favorites'}
            >
              <Heart className="w-4 h-4" />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-black/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors ml-2"
              title="Close Player (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-30 transition-opacity duration-300 flex flex-col gap-3 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Interactive Progress Bar */}
        <div
          ref={progressTrackRef}
          onClick={handleProgressScrub}
          onMouseMove={handleProgressHover}
          onMouseLeave={() => setHoverTime(null)}
          className="relative w-full h-2 group/track cursor-pointer py-1"
        >
          {/* Base bar */}
          <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden transition-all duration-200 group-hover/track:h-2.5">
            {/* Buffer bar */}
            <div
              className="h-full bg-slate-600/50 absolute left-0 top-0 transition-all duration-150"
              style={{ width: `${bufferPercent}%` }}
            />
            {/* Played bar */}
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 relative shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Scrub scrubber thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 border-amber-500 opacity-0 group-hover/track:opacity-100 transition-opacity"
            style={{ left: `${progressPercent}%` }}
          />

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 border border-slate-700 text-[11px] font-mono text-amber-300 pointer-events-none"
              style={{ left: `${hoverPosition}px` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between text-slate-200">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Play / Pause button */}
            <button
              onClick={togglePlay}
              className="p-2 sm:p-2.5 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            {/* Skip -5s */}
            <button
              onClick={() => seekRelative(-5)}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Rewind 5s (←)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Skip +5s */}
            <button
              onClick={() => seekRelative(5)}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Forward 5s (→)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume control with hover slider */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="w-14 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                title="Volume Slider"
              />
            </div>

            {/* Timestamps */}
            <div className="text-xs font-mono text-slate-400 tracking-wider">
              <span className="text-white tabular-nums">{formatTime(currentTime)}</span>
              <span className="mx-1 text-slate-600">/</span>
              <span className="tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right utility buttons: Speed, PiP, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-medium text-amber-300 transition-colors"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 mb-2 py-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 flex flex-col min-w-[70px]">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-3 py-1 text-xs font-mono text-left hover:bg-amber-500/20 hover:text-amber-300 transition-colors ${
                        playbackSpeed === spd ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-300'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture in Picture */}
            {'pictureInPictureEnabled' in document && (
              <button
                onClick={togglePiP}
                className="p-1.5 text-slate-400 hover:text-white transition-colors hidden sm:inline-flex"
                title="Picture in Picture"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
