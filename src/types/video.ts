export type VideoCategory =
  | 'All'
  | 'Cinematic Films'
  | '2D Animation'
  | '3D Animation'
  | 'Motion Graphics'
  | 'Nature'
  | 'Technology'
  | 'Documentary'
  | 'Short Films'
  | 'Music Videos'
  | 'Travel Films'
  | 'Creative Videos';

export interface VideoItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: VideoCategory;
  tags: string[];
  duration: string;
  durationSec: number;
  year: number;
  resolution: '4K UHD' | '1080p HD';
  rating: string;
  videoUrl: string;
  previewUrl?: string;
  posterUrl: string;
  director: string;
  featured?: boolean;
  trending?: boolean;
  isEditorsChoice?: boolean;
  views: string;
  isLocal?: boolean;
}

export interface UserLibrary {
  watchlist: string[];
  favorites: string[];
  watchHistory: {
    videoId: string;
    watchedAt: string;
    progressSec: number;
    durationSec: number;
  }[];
  localVideos: VideoItem[];
}
