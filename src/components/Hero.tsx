import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onStartProject: () => void;
  onViewWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartProject, onViewWork }) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-36 sm:pt-42 pb-14 px-6 sm:px-10 max-w-7xl mx-auto">
      {/* Top Content */}
      <div className="space-y-8 sm:space-y-10">
        {/* Clean Modern Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white border border-black/[0.08] shadow-sm backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-ink font-sans">
            Available for freelance
          </span>
        </motion.div>

        {/* Clean, Monumental Headline - No weird underlines or font collisions */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-hero-headline font-bold tracking-tight text-ink font-display"
          >
            I build digital products that{' '}
            <span className="text-accent">move businesses forward.</span>
          </motion.h1>
        </div>

        {/* Narrative & Action Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 xl:col-span-6 space-y-4"
          >
            <p className="text-lg sm:text-xl text-ink-secondary leading-relaxed font-normal">
              Freelance Full Stack Developer bridging the gap between <strong className="font-semibold text-ink">product vision, PRD specifications, and resilient technical architecture</strong>. I turn complex business ideas into high-performance web applications and SaaS systems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 xl:col-span-6 flex flex-wrap gap-4 lg:justify-end items-center"
          >
            <button
              onClick={onStartProject}
              className="group inline-flex items-center space-x-3 px-7 py-4 rounded-full bg-ink text-[#FAF9F5] text-sm font-semibold tracking-wide hover:bg-accent transition-all duration-300 shadow-md hover:scale-[1.02]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              onClick={onViewWork}
              className="group inline-flex items-center space-x-2 px-6 py-4 rounded-full bg-white hover:bg-black/[0.04] border border-black/10 text-ink text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
            >
              <span>View Selected Work</span>
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Meta Bar: Core Pillars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.75 }}
        className="mt-16 sm:mt-24 pt-8 border-t border-black/[0.07] grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-ink-secondary"
      >
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-ink-muted mb-1 font-mono">Product Strategy</span>
          <span className="font-semibold text-ink">PRD &middot; User Flows &middot; Scoping</span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-ink-muted mb-1 font-mono">Architecture</span>
          <span className="font-semibold text-ink">Schema Design &middot; Scalable APIs</span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-ink-muted mb-1 font-mono">Full-Stack Tech</span>
          <span className="font-semibold text-ink">React &middot; Next.js &middot; FastAPI &middot; Node</span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-ink-muted mb-1 font-mono">Location</span>
          <span className="font-semibold text-ink">India (UTC+5:30) &middot; Remote Worldwide</span>
        </div>
      </motion.div>
    </section>
  );
};
