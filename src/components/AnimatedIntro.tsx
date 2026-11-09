import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, FastForward } from 'lucide-react';

interface AnimatedIntroProps {
  onComplete: () => void;
}

export const AnimatedIntro: React.FC<AnimatedIntroProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  // Animate progress smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        // Accelerate smoothly
        const increment = prev < 50 ? 2 : prev < 85 ? 3 : 5;
        return Math.min(100, prev + increment);
      });
    }, 45);

    // Escape key listener to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  // Particle canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.8 - 0.2,
      opacity: Math.random() * 0.7 + 0.2,
      color: Math.random() > 0.4 ? '#F59E0B' : '#818CF8', // Gold or Electric Blue/Purple
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const skipIntro = () => {
    setFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030305] text-white transition-opacity duration-700 select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Atmospheric ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-purple-900/30 via-amber-500/15 to-blue-900/30 blur-[130px] rounded-full pointer-events-none" />

      {/* Center Cinematic Emblem & Brand */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-neutral-900/90 to-black/90 p-4 shadow-[0_0_50px_rgba(245,158,11,0.25)] flex items-center justify-center backdrop-blur-xl">
            <span className="font-cinema text-3xl font-bold tracking-wider gold-gradient-text">
              C
            </span>
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-amber-500/20 blur-md -z-10 animate-pulse" />
        </div>

        <h1 className="font-cinema text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.25em] uppercase gold-gradient-text mb-3 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
          CINEMORA
        </h1>

        <p className="text-xs sm:text-sm tracking-[0.4em] uppercase text-slate-400 font-medium mb-8">
          Ultra-Premium Digital Cinema &middot; YGS Studio
        </p>

        {/* Cinematic Loading Bar */}
        <div className="w-64 sm:w-80 h-1 bg-slate-900 rounded-full overflow-hidden mb-3 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 transition-all duration-100 ease-out shadow-[0_0_12px_#F59E0B]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
          <span>INITIALIZING CINEMATIC ENGINE</span>
          <span className="text-amber-400 tabular-nums">{progress}%</span>
        </div>
      </div>

      {/* Skip Intro button */}
      <button
        onClick={skipIntro}
        className="absolute bottom-8 right-8 z-20 flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wider uppercase text-slate-400 hover:text-white bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 rounded-lg backdrop-blur-md transition-all duration-200"
      >
        <FastForward className="w-3.5 h-3.5 text-amber-400" />
        <span>Skip Intro</span>
        <span className="text-[10px] text-slate-500 hidden sm:inline">(ESC)</span>
      </button>
    </div>
  );
};
