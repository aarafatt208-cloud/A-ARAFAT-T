import React, { useState, useEffect, useMemo } from 'react';
import { VideoItem, VideoCategory, UserLibrary } from './types/video';
import { INITIAL_VIDEOS, HERO_FEATURED_VIDEO, CATEGORIES } from './data/mockVideos';
import { AnimatedIntro } from './components/AnimatedIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CollectionRow } from './components/VideoCollections';
import { CategoryFilter } from './components/CategoryFilter';
import { VideoCard } from './components/VideoCard';
import { VideoModal } from './components/VideoModal';
import { SearchModal } from './components/SearchModal';
import { MyLibraryView } from './components/MyLibraryView';
import { LocalVideoManager } from './components/LocalVideoManager';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { DevGuideModal } from './components/DevGuideModal';
import { Sparkles, Film, Bookmark, Heart, CheckCircle2, ChevronRight, SlidersHorizontal } from 'lucide-react';

const STORAGE_KEY = 'cinemora_vault_v1';

export default function App() {
  // Intro state - check if user already saw it in this session
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('cinemora_intro_seen');
    } catch {
      return true;
    }
  });

  // Modals & Navigation
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('All');
  const [currentModalVideo, setCurrentModalVideo] = useState<VideoItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User Library Persistence
  const [userLibrary, setUserLibrary] = useState<UserLibrary>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read user library from localStorage:', e);
    }
    return {
      watchlist: ['cin-02', 'cin-04'],
      favorites: ['cin-hero-01'],
      watchHistory: [
        {
          videoId: 'cin-hero-01',
          watchedAt: new Date().toISOString(),
          progressSec: 420,
          durationSec: 734,
        },
      ],
      localVideos: [],
    };
  });

  // Save library changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userLibrary));
    } catch (e) {
      console.warn('Could not save user library to localStorage:', e);
    }
  }, [userLibrary]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('cinemora_intro_seen', 'true');
    } catch {}
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Combine static and imported local videos
  const allVideos = useMemo(() => {
    return [...userLibrary.localVideos, ...INITIAL_VIDEOS];
  }, [userLibrary.localVideos]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allVideos.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = allVideos.filter((v) => v.category === cat).length;
      }
    });
    return counts;
  }, [allVideos]);

  // Filtered catalog by active category
  const filteredCatalog = useMemo(() => {
    if (selectedCategory === 'All') return allVideos;
    return allVideos.filter((v) => v.category === selectedCategory);
  }, [allVideos, selectedCategory]);

  // Filtered collections for carousels
  const trendingVideos = useMemo(() => allVideos.filter((v) => v.trending), [allVideos]);
  const animationVideos = useMemo(
    () => allVideos.filter((v) => v.category === '2D Animation' || v.category === '3D Animation'),
    [allVideos]
  );
  const cinematicFilms = useMemo(
    () => allVideos.filter((v) => v.category === 'Cinematic Films' || v.category === 'Short Films'),
    [allVideos]
  );
  const techAndDocs = useMemo(
    () =>
      allVideos.filter(
        (v) =>
          v.category === 'Technology' ||
          v.category === 'Documentary' ||
          v.category === 'Motion Graphics'
      ),
    [allVideos]
  );
  const editorsChoice = useMemo(
    () => allVideos.filter((v) => v.isEditorsChoice || v.featured),
    [allVideos]
  );

  // Watchlist toggle handler
  const handleToggleWatchlist = (videoId: string) => {
    setUserLibrary((prev) => {
      const exists = prev.watchlist.includes(videoId);
      const updated = exists
        ? prev.watchlist.filter((id) => id !== videoId)
        : [...prev.watchlist, videoId];

      showToast(exists ? 'Removed from Watchlist' : 'Added to Watchlist');
      return { ...prev, watchlist: updated };
    });
  };

  // Favorite toggle handler
  const handleToggleFavorite = (videoId: string) => {
    setUserLibrary((prev) => {
      const exists = prev.favorites.includes(videoId);
      const updated = exists
        ? prev.favorites.filter((id) => id !== videoId)
        : [...prev.favorites, videoId];

      showToast(exists ? 'Removed from Favorites' : 'Saved to Favorites');
      return { ...prev, favorites: updated };
    });
  };

  // Video progress recorder for history
  const handleProgressUpdate = (currentTime: number, duration: number) => {
    if (!currentModalVideo) return;
    const vId = currentModalVideo.id;

    setUserLibrary((prev) => {
      const filtered = prev.watchHistory.filter((h) => h.videoId !== vId);
      const newEntry = {
        videoId: vId,
        watchedAt: new Date().toISOString(),
        progressSec: Math.floor(currentTime),
        durationSec: Math.floor(duration),
      };
      return {
        ...prev,
        watchHistory: [newEntry, ...filtered.slice(0, 19)], // keep last 20
      };
    });
  };

  const handleClearHistory = () => {
    setUserLibrary((prev) => ({ ...prev, watchHistory: [] }));
    showToast('Playback history cleared');
  };

  // Add imported local video
  const handleAddLocalVideo = (newVideo: VideoItem) => {
    setUserLibrary((prev) => ({
      ...prev,
      localVideos: [newVideo, ...prev.localVideos],
    }));
    showToast(`Added "${newVideo.title}" to session library`);
    setCurrentModalVideo(newVideo);
  };

  const handleDeleteLocalVideo = (id: string) => {
    setUserLibrary((prev) => ({
      ...prev,
      localVideos: prev.localVideos.filter((v) => v.id !== id),
    }));
    showToast('Local video removed');
  };

  // Section smooth navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Spectacular Animated Intro */}
      {showIntro && <AnimatedIntro onComplete={handleIntroComplete} />}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-neutral-900/95 border border-amber-500/50 text-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md text-xs font-semibold animate-fade">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Sticky Top Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLibrary={() => handleNavigate('library')}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        libraryCount={userLibrary.watchlist.length + userLibrary.favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        {/* Full-width Hero Video Section */}
        <div id="hero">
          <HeroSection
            featuredVideo={HERO_FEATURED_VIDEO}
            onWatch={(v) => setCurrentModalVideo(v)}
            onExplore={() => handleNavigate('browse')}
            isWatchlist={userLibrary.watchlist.includes(HERO_FEATURED_VIDEO.id)}
            onToggleWatchlist={handleToggleWatchlist}
            curatedHeroes={[HERO_FEATURED_VIDEO, INITIAL_VIDEOS[1], INITIAL_VIDEOS[2]]}
            onSelectHero={(v) => setCurrentModalVideo(v)}
          />
        </div>

        {/* Multi-Row Video Collections */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full py-8 space-y-6">
          <div id="trending">
            <CollectionRow
              title="Trending Now"
              subtitle="Most streamed motion films and 3D visual masterworks this week"
              videos={trendingVideos}
              onPlay={(v) => setCurrentModalVideo(v)}
              watchlist={userLibrary.watchlist}
              favorites={userLibrary.favorites}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          <div id="movies">
            <CollectionRow
              title="Cinematic Masterpieces"
              subtitle="Narrative short films, sci-fi epics, and high-contrast neo-noir cinematography"
              videos={cinematicFilms}
              onPlay={(v) => setCurrentModalVideo(v)}
              watchlist={userLibrary.watchlist}
              favorites={userLibrary.favorites}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          <div id="animation">
            <CollectionRow
              title="3D &amp; 2D Animation Lab"
              subtitle="Masterclass CGI character animation, surreal dreamscapes, and fantasy sagas"
              videos={animationVideos}
              onPlay={(v) => setCurrentModalVideo(v)}
              watchlist={userLibrary.watchlist}
              favorites={userLibrary.favorites}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          <CollectionRow
            title="Editor's Choice &middot; 4K UHD"
            subtitle="Curator-selected visual fidelity showcasing peak dynamic range and sound design"
            videos={editorsChoice}
            onPlay={(v) => setCurrentModalVideo(v)}
            watchlist={userLibrary.watchlist}
            favorites={userLibrary.favorites}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleFavorite={handleToggleFavorite}
          />

          <CollectionRow
            title="Documentary &amp; Motion Science"
            subtitle="Ecosystem explorations, artisanal masterminds, and generative geometric physics"
            videos={techAndDocs}
            onPlay={(v) => setCurrentModalVideo(v)}
            watchlist={userLibrary.watchlist}
            favorites={userLibrary.favorites}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleFavorite={handleToggleFavorite}
          />
        </section>

        {/* Full Interactive Video Catalog with Filters */}
        <section id="browse" className="w-full py-12 border-t border-slate-900 bg-neutral-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1 uppercase tracking-widest">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>INTERACTIVE ARCHIVE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                  Discover Full Catalog
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Filter by category or genre to isolate specific cinematography styles and technical
                  formats.
                </p>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Displaying <span className="text-amber-400 font-bold">{filteredCatalog.length}</span>{' '}
                curated titles
              </div>
            </div>

            {/* Category Filter Pills */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />

            {/* Grid of Videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-4">
              {filteredCatalog.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={(v) => setCurrentModalVideo(v)}
                  isWatchlist={userLibrary.watchlist.includes(video.id)}
                  isFavorite={userLibrary.favorites.includes(video.id)}
                  onToggleWatchlist={handleToggleWatchlist}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Personal Video Library View */}
        <section id="library" className="w-full py-12 border-t border-slate-900 bg-black/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <MyLibraryView
              library={userLibrary}
              allVideos={allVideos}
              onPlay={(v) => setCurrentModalVideo(v)}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleFavorite={handleToggleFavorite}
              onClearHistory={handleClearHistory}
              onOpenUploadModal={() => setIsUploadOpen(true)}
              onDeleteLocalVideo={handleDeleteLocalVideo}
            />
          </div>
        </section>

        {/* About Section */}
        <AboutSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigate('browse');
        }}
        onReplayIntro={handleReplayIntro}
      />

      {/* Dedicated Video Viewing Modal & Full Player */}
      {currentModalVideo && (
        <VideoModal
          video={currentModalVideo}
          onClose={() => setCurrentModalVideo(null)}
          onSelectVideo={(v) => setCurrentModalVideo(v)}
          allVideos={allVideos}
          isWatchlist={userLibrary.watchlist.includes(currentModalVideo.id)}
          isFavorite={userLibrary.favorites.includes(currentModalVideo.id)}
          onToggleWatchlist={handleToggleWatchlist}
          onToggleFavorite={handleToggleFavorite}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        videos={allVideos}
        onPlay={(v) => setCurrentModalVideo(v)}
        watchlist={userLibrary.watchlist}
        favorites={userLibrary.favorites}
        onToggleWatchlist={handleToggleWatchlist}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Local Video Manager Modal */}
      <LocalVideoManager
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddVideo={handleAddLocalVideo}
      />

      {/* VS Code & Developer Setup Guide Modal */}
      <DevGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
