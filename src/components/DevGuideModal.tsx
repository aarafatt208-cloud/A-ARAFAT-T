import React, { useState } from 'react';
import {
  X,
  Code2,
  FileCode,
  FolderTree,
  Terminal,
  Laptop,
  Check,
  Copy,
  FolderPlus,
  Play,
} from 'lucide-react';

interface DevGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevGuideModal: React.FC<DevGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'files'>('guide');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, filename: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const sampleHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CINEMORA — Ultra Premium Digital Cinema</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- Animated Intro -->
  <div id="intro-screen" class="intro-screen">
    <div class="intro-emblem">C</div>
    <h1 class="intro-title">CINEMORA</h1>
    <p class="intro-sub">ULTRA-PREMIUM DIGITAL CINEMA</p>
    <div class="intro-bar"><div class="intro-bar-fill"></div></div>
    <button id="skip-intro" class="skip-btn">Skip Intro</button>
  </div>

  <!-- Main Navbar -->
  <header class="navbar">
    <div class="logo">CINEMORA<span>.STUDIO</span></div>
    <nav class="nav-links">
      <a href="#hero">Home</a>
      <a href="#browse">Discover</a>
      <a href="#library">My Library</a>
      <a href="#about">About</a>
    </nav>
    <button class="action-btn" id="open-upload">Add MP4 Video</button>
  </header>

  <!-- Hero Video Section -->
  <section class="hero" id="hero">
    <video autoplay muted loop playsinline class="hero-bg-video">
      <source src="videos/hero.mp4" type="video/mp4" />
    </video>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <span class="hero-kicker">FEATURED 4K PREMIERE</span>
      <h1>EXPERIENCE <span>PURE CINEMA</span></h1>
      <p>Stream world-class films, 3D CGI animation, and cinematic masterworks.</p>
      <div class="hero-actions">
        <button class="btn-primary" id="hero-watch-btn">Watch Now</button>
        <button class="btn-secondary" id="hero-explore-btn">Explore Catalog</button>
      </div>
    </div>
  </section>

  <!-- Video Player Modal -->
  <div id="player-modal" class="modal hidden">
    <div class="modal-content">
      <button id="close-player" class="close-btn">&times;</button>
      <video id="main-video" controls class="theatre-video">
        <source src="videos/video1.mp4" type="video/mp4" />
      </video>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>`;

  const sampleCssCode = `:root {
  --bg-dark: #050508;
  --gold-primary: #f59e0b;
  --gold-gradient: linear-gradient(135deg, #FFF6D6 0%, #F59E0B 45%, #D97706 100%);
  --neon-blue: #38bdf8;
  --neon-purple: #818cf8;
  --charcoal: #0e0e15;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-dark);
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow-x: hidden;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2.5rem;
  background: rgba(5, 5, 8, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links a {
  color: #94a3b8;
  text-decoration: none;
  margin: 0 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #ffffff;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding: 0 2.5rem;
  overflow: hidden;
}

.hero-bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #050508, transparent 70%),
              linear-gradient(to right, #050508 40%, transparent 80%);
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 700px;
}

.btn-primary {
  background: var(--gold-primary);
  color: #000;
  border: none;
  padding: 0.85rem 1.8rem;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.modal.hidden {
  display: none;
}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex flex-col items-center justify-start py-8 px-4 sm:px-6">
      <div className="w-full max-w-4xl bg-neutral-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Cinemora Local Setup &amp; VS Code Guide
              </h2>
              <p className="text-xs text-slate-400">
                Instructions for HP EliteBook &amp; running locally on VS Code with Google Chrome
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

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'guide'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Step-by-Step Setup Guide
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'files'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Static File Templates (HTML / CSS / JS)
          </button>
        </div>

        {/* Content Tab 1: Setup Guide */}
        {activeTab === 'guide' && (
          <div className="p-6 sm:p-8 flex flex-col gap-6 text-sm text-slate-300">
            {/* Folder Layout Section */}
            <div className="p-5 rounded-xl bg-neutral-900/60 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase">
                <FolderTree className="w-4 h-4" />
                <span>Standard Folder Architecture</span>
              </div>
              <pre className="font-mono text-xs text-slate-300 bg-black/70 p-4 rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
{`CINEMORA/
├── index.html        (Semantic HTML5 layout & video container)
├── style.css         (Black & Gold luxury theme, animations & glassmorphism)
├── script.js         (Video controls, search, category filtering & library)
├── videos/
│   ├── hero.mp4      (Background looping video)
│   ├── video1.mp4    (Cinematic feature film)
│   └── video2.mp4    (3D Animation short)
└── images/
    ├── logo.png      (Cinemora gold monogram)
    ├── poster1.jpg   (Sci-Fi film key art)
    └── poster2.jpg   (Animation poster)`}
              </pre>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Running Locally on your Laptop (HP EliteBook / Windows)</span>
              </h3>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 rounded-lg bg-neutral-900 border border-slate-800">
                  <strong className="text-amber-300 block mb-1">
                    Step 1: Open Folder in VS Code
                  </strong>
                  Open VS Code &rarr; Click <code>File</code> &rarr; <code>Open Folder</code> &rarr;
                  Select your <code>CINEMORA</code> directory.
                </div>

                <div className="p-3.5 rounded-lg bg-neutral-900 border border-slate-800">
                  <strong className="text-amber-300 block mb-1">
                    Step 2: Install "Live Server" Extension in VS Code
                  </strong>
                  Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-amber-300">Ctrl+Shift+X</kbd>, search for <strong>Live Server</strong> (by Ritwick Dey) and click <strong>Install</strong>.
                </div>

                <div className="p-3.5 rounded-lg bg-neutral-900 border border-slate-800">
                  <strong className="text-amber-300 block mb-1">
                    Step 3: Launch in Google Chrome
                  </strong>
                  Right-click <code>index.html</code> in VS Code and choose <strong>"Open with Live Server"</strong> (or click "Go Live" at the bottom right). Chrome will launch automatically with smooth video playback enabled!
                </div>

                <div className="p-3.5 rounded-lg bg-neutral-900 border border-slate-800">
                  <strong className="text-amber-300 block mb-1">
                    Step 4: Adding Your Own MP4 Videos
                  </strong>
                  Drop any <code>.mp4</code> file into the <code>videos/</code> folder, or use the in-app <strong>"Add Video"</strong> button right here to stream any file directly from your disk!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab 2: Code Templates */}
        {activeTab === 'files' && (
          <div className="p-6 sm:p-8 flex flex-col gap-6 text-sm">
            <p className="text-xs text-slate-400">
              You can copy these clean starter code files into your local VS Code workspace if you
              prefer a vanilla HTML/CSS/JS project:
            </p>

            {/* HTML Block */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>index.html</span>
                <button
                  onClick={() => copyToClipboard(sampleHtmlCode, 'index.html')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700"
                >
                  {copiedFile === 'index.html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === 'index.html' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/80 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-60 overflow-y-auto">
                {sampleHtmlCode}
              </pre>
            </div>

            {/* CSS Block */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>style.css</span>
                <button
                  onClick={() => copyToClipboard(sampleCssCode, 'style.css')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700"
                >
                  {copiedFile === 'style.css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === 'style.css' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/80 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-60 overflow-y-auto">
                {sampleCssCode}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-neutral-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
