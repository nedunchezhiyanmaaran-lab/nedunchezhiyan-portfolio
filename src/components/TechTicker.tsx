import React from 'react';
import { TECH_MARQUEE } from '../data/portfolioData';

export const TechTicker: React.FC = () => {
  // Duplicate array for infinite seamless looping
  const items = [...TECH_MARQUEE, ...TECH_MARQUEE, ...TECH_MARQUEE];

  return (
    <div className="w-full editorial-border-t editorial-border-b bg-canvas-warm/50 py-4 sm:py-5 overflow-hidden select-none">
      <div className="flex items-center space-x-4">
        {/* Label on left for desktop */}
        <div className="hidden lg:flex items-center pl-8 pr-6 border-r border-stroke shrink-0 font-mono text-[10px] tracking-widest uppercase text-ink-muted">
          <span>STACK &middot; ARCHITECTURE</span>
        </div>

        {/* Marquee track */}
        <div className="group flex overflow-hidden whitespace-nowrap mask-radial">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] space-x-12 sm:space-x-16 items-center">
            {items.map((tech, idx) => (
              <div key={idx} className="flex items-center space-x-6">
                <span className="font-mono text-xs sm:text-sm tracking-wider uppercase text-ink-secondary group-hover:text-ink transition-colors duration-150">
                  {tech}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-stroke-strong" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
