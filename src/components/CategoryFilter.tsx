import React from 'react';
import { CATEGORIES } from '../data/mockVideos';
import { VideoCategory } from '../types/video';

interface CategoryFilterProps {
  selectedCategory: VideoCategory;
  onSelectCategory: (category: VideoCategory) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
      {CATEGORIES.map((cat) => {
        const count = categoryCounts[cat] || 0;
        const isActive = selectedCategory === cat;

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat as VideoCategory)}
            className={`whitespace-nowrap shrink-0 px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-2 ${
              isActive
                ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-neutral-900/80 text-slate-400 hover:text-white hover:bg-neutral-800 border border-slate-800/80'
            }`}
          >
            <span>{cat}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
