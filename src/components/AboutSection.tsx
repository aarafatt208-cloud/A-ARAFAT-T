import React from 'react';
import { Film, Sparkles, Shield, Cpu, Award, Globe, Video, Volume2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="w-full py-16 sm:py-24 border-t border-slate-900 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-12">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase tracking-widest">
            <Film className="w-4 h-4" />
            <span>STUDIO MANIFESTO &middot; YGS CINEMATIC ORIGINS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            The Intersection of <br />
            <span className="gold-gradient-text">Cinema &amp; High-End Technology.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-4">
            CINEMORA was architected for filmmakers, 3D animators, and digital visual artists who
            demand uncompromising reproduction fidelity. Where standard web compression flattens
            shadow details and dynamic range, our streaming pipeline preserves 10-bit luminance,
            calibrated color gamut, and spatial acoustics.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-950/70 border border-slate-800/80 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">4K UHD Master Quality</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native frame rate delivery with high-bitrate streaming benchmarks. Experience every
              specular highlight and deep shadow just as colorists intended in the grading suite.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-950/70 border border-slate-800/80 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Dolby Spatial Acoustics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-channel binaural simulation and immersive soundstage positioning, giving every
              orchestral swell and whisper tactile spatial presence.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-950/70 border border-slate-800/80 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Hardware Acceleration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Custom HTML5 canvas and video element rendering with zero-overhead buffer management,
              scrub caching, and instant picture-in-picture decoding.
            </p>
          </div>
        </div>

        {/* Studio Specs Bar */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-purple-950/20 border border-slate-800 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              24,000+ <span className="text-amber-400">FPS</span>
            </div>
            <div className="text-xs text-slate-400">Curated Film &amp; 3D Frames</div>
          </div>

          <div className="h-10 w-px bg-slate-800 hidden md:block" />

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              0.02<span className="text-amber-400">s</span>
            </div>
            <div className="text-xs text-slate-400">Instant HTML5 Seek Latency</div>
          </div>

          <div className="h-10 w-px bg-slate-800 hidden md:block" />

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              100<span className="text-amber-400">%</span>
            </div>
            <div className="text-xs text-slate-400">Private Local Client Storage</div>
          </div>

          <div className="h-10 w-px bg-slate-800 hidden md:block" />

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              ACES <span className="text-amber-400">2.0</span>
            </div>
            <div className="text-xs text-slate-400">Academy Color Encoding Standard</div>
          </div>
        </div>
      </div>
    </section>
  );
};
