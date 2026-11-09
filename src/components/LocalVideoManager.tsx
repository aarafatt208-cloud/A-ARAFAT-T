import React, { useState, useRef } from 'react';
import { VideoItem, VideoCategory } from '../types/video';
import { CATEGORIES } from '../data/mockVideos';
import {
  UploadCloud,
  FileVideo,
  X,
  Play,
  CheckCircle,
  AlertCircle,
  Film,
  Sparkles,
} from 'lucide-react';

interface LocalVideoManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (newVideo: VideoItem) => void;
}

export const LocalVideoManager: React.FC<LocalVideoManagerProps> = ({
  isOpen,
  onClose,
  onAddVideo,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoCategory>('Cinematic Films');
  const [director, setDirector] = useState('My Studio');
  const [error, setError] = useState<string | null>(null);
  const [durationSec, setDurationSec] = useState(0);
  const [durationStr, setDurationStr] = useState('00:00');
  const [snapshotPoster, setSnapshotPoster] = useState<string | null>(null);

  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.includes('video/mp4') && !selected.type.includes('video/webm')) {
      setError('Please select a valid MP4 or WebM video file.');
      return;
    }

    setFile(selected);
    const blobUrl = URL.createObjectURL(selected);
    setPreviewUrl(blobUrl);

    // Auto-fill title from filename
    if (!title) {
      const cleanName = selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleVideoMetadataLoaded = () => {
    const v = previewVideoRef.current;
    if (!v) return;
    const dur = Math.floor(v.duration) || 0;
    setDurationSec(dur);
    const mins = Math.floor(dur / 60);
    const secs = dur % 60;
    setDurationStr(`${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`);

    // Capture automatic poster frame at 1 sec
    try {
      v.currentTime = Math.min(1.5, dur / 2);
    } catch {}
  };

  const captureFramePoster = () => {
    const v = previewVideoRef.current;
    const canvas = canvasRef.current;
    if (!v || !canvas) return;
    canvas.width = v.videoWidth || 640;
    canvas.height = v.videoHeight || 360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setSnapshotPoster(dataUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !previewUrl) {
      setError('Please select an MP4 video file.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title for the video.');
      return;
    }

    const newVideo: VideoItem = {
      id: `local-${Date.now()}`,
      title: title.trim(),
      tagline: 'Local Session Video File',
      description:
        description.trim() ||
        `Local high-definition video imported from disk: ${file.name} (${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)} MB).`,
      category: category,
      tags: ['Local', 'MP4', 'Session'],
      duration: durationStr,
      durationSec: durationSec,
      year: new Date().getFullYear(),
      resolution: '1080p HD',
      rating: 'NR',
      videoUrl: previewUrl,
      previewUrl: previewUrl,
      posterUrl:
        snapshotPoster ||
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
      director: director.trim() || 'Independent Creator',
      views: 'Local Stream',
      isLocal: true,
    };

    onAddVideo(newVideo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex flex-col items-center justify-start py-8 px-4 sm:px-6">
      <div className="w-full max-w-2xl bg-neutral-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Add Local MP4 to Cinemora
              </h2>
              <p className="text-xs text-slate-400">
                Stream your local MP4 video file inside Cinemora’s theatrical player
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="mx-6 mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <span>
            <strong>Client-Side Storage:</strong> Your video remains on your computer and is
            streamed locally via HTML5 Blob URL for privacy and ultra-fast playback.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* File Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select MP4 Video File
            </label>
            <label className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-900/40 group">
              <input
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-amber-400 transition-colors mb-2" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                {file ? file.name : 'Click to select or drag and drop MP4 video'}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Supports .mp4, .webm files up to 2GB
              </span>
            </label>
          </div>

          {/* Preview Box */}
          {previewUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-400">
                  Player Stream Preview
                </span>
                <button
                  type="button"
                  onClick={captureFramePoster}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  Capture Poster from Current Frame
                </button>
              </div>

              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
                <video
                  ref={previewVideoRef}
                  src={previewUrl}
                  controls
                  onLoadedMetadata={handleVideoMetadataLoaded}
                  onSeeked={captureFramePoster}
                  className="w-full h-full object-contain"
                />
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
                <span>Duration: {durationStr}</span>
                <span>&middot;</span>
                <span>Size: {(file ? file.size / (1024 * 1024) : 0).toFixed(1)} MB</span>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Cinematic Showreel 2026"
              className="w-full px-4 py-2.5 bg-neutral-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
              required
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VideoCategory)}
                className="w-full px-4 py-2.5 bg-neutral-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Director / Creator
              </label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="Creator name"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Description / Synopsis
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, notes, or story premise..."
              className="w-full px-4 py-2.5 bg-neutral-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add to Session Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
