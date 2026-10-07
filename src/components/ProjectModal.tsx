import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, CheckCircle2, Layers, Cpu, Globe, ExternalLink, RefreshCw } from 'lucide-react';
import type { Project } from '../types';
import { LottiePlayer } from './LottiePlayer';
import { LOTTIE_URLS } from '../data/lottieAnimations';

import { trackProjectInteraction } from '../utils/analytics';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'case-study' | 'live-preview'>('case-study');
  const [iframeKey, setIframeKey] = useState(1);

  if (!project) return null;

  const handleLaunchExternal = () => {
    trackProjectInteraction(project.id, 'live_demo');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window (Rounded 3xl / 4xl) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-[#FBF9F5] rounded-3xl sm:rounded-4xl shadow-2xl flex flex-col border border-black/10 overflow-hidden z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-black/[0.08] bg-white">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
                {project.number} &middot; Case Study
              </span>
              <span className="hidden sm:inline-block w-px h-4 bg-black/10" />
              <h3 className="font-display font-semibold text-base sm:text-lg text-ink hidden sm:block">
                {project.title}
              </h3>
            </div>

            <div className="flex items-center space-x-3">
              {/* Segmented Pill Switcher */}
              <div className="flex bg-[#F2EFE8] p-1 rounded-full text-xs font-medium">
                <button
                  onClick={() => setActiveTab('case-study')}
                  className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                    activeTab === 'case-study'
                      ? 'bg-ink text-white shadow-sm font-semibold'
                      : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('live-preview')}
                  className={`px-4 py-1.5 rounded-full flex items-center space-x-1.5 transition-all duration-200 ${
                    activeTab === 'live-preview'
                      ? 'bg-ink text-white shadow-sm font-semibold'
                      : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live App</span>
                </button>
              </div>

              {/* Rounded Close Button */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/[0.04] hover:bg-black/10 flex items-center justify-center text-ink transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto no-scrollbar flex-1 p-6 sm:p-10 space-y-8">
            {activeTab === 'case-study' ? (
              <div className="space-y-8">
                {/* Tagline & Core Statement */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block">
                    {project.category} &middot; {project.timeline}
                  </span>
                  <h2 className="font-display text-2xl sm:text-4xl font-semibold text-ink leading-snug tracking-tight">
                    {project.tagline}
                  </h2>
                  <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-3xl font-normal">
                    {project.description}
                  </p>
                </div>

                {/* Rounded Pill Actions */}
                <div className="flex flex-wrap gap-3 items-center pt-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLaunchExternal}
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-ink text-[#FAF9F5] text-xs font-semibold tracking-wide hover:bg-accent transition-all duration-300 shadow-sm"
                  >
                    <span>Launch Live Interactive Demo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setActiveTab('live-preview')}
                    className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-ink text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Test Inside Embed</span>
                  </button>
                </div>

                {/* Tech Stack Pills */}
                <div className="pt-6 border-t border-black/[0.08] space-y-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block">
                    Technical Specifications
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-black/10 text-ink shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3-Part Contribution Breakdown */}
                <div className="pt-6 border-t border-black/[0.08] space-y-4">
                  <div className="rounded-2xl bg-[#FAF8F5] border border-black/[0.08] p-6 space-y-5">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/[0.06]">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="font-mono text-xs font-semibold text-ink uppercase tracking-wider">
                          Client Brief &amp; Autonomous Execution
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white border border-black/[0.06] text-[11px] font-mono text-ink-secondary font-medium">
                        Vision &rarr; Architecture &rarr; Live Demo
                      </span>
                    </div>

                    {/* 3 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:divide-x divide-black/[0.07]">
                      {/* 01. Client Vision */}
                      <div className="space-y-2.5">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted font-semibold block">
                          01 / Client Vision &amp; Prompt
                        </span>
                        <h4 className="font-display text-sm font-semibold text-ink">
                          Initial Concept &amp; Requirements
                        </h4>
                        <ul className="space-y-1.5 pt-1">
                          {project.startingPoint.providedByClient.map((item, idx) => (
                            <li key={idx} className="text-xs text-ink-secondary flex items-start space-x-2 leading-relaxed">
                              <span className="w-1 h-1 rounded-full bg-accent shrink-0 mt-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 02. Autonomous Execution */}
                      <div className="space-y-2.5 md:pl-6">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold block">
                          02 / Autonomous Build
                        </span>
                        <h4 className="font-display text-sm font-semibold text-ink">
                          {project.myContribution.role}
                        </h4>
                        <ul className="space-y-1.5 pt-1">
                          {project.myContribution.responsibilities.map((item, idx) => (
                            <li key={idx} className="text-xs text-ink flex items-start space-x-2 leading-relaxed">
                              <span className="w-1 h-1 rounded-full bg-ink shrink-0 mt-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 03. Live Interactive Demo */}
                      <div className="space-y-2.5 md:pl-6">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted font-semibold block">
                          03 / Delivered Prototype
                        </span>
                        <h4 className="font-display text-sm font-semibold text-ink">
                          Functional Interactive Demo
                        </h4>
                        <p className="text-xs text-ink-secondary leading-relaxed font-normal">
                          {project.delivered.outcome}
                        </p>
                        <ul className="space-y-1.5 pt-2 border-t border-black/[0.05]">
                          {project.delivered.keyDeliverables.map((item, idx) => (
                            <li key={idx} className="text-[11px] text-ink font-medium flex items-start space-x-2 leading-relaxed">
                              <span className="text-accent shrink-0 font-bold">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two Column Cards (Rounded 2xl) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Architecture Highlights */}
                  <div className="p-6 rounded-2xl bg-white border border-black/[0.08] space-y-4 shadow-sm">
                    <div className="flex items-center space-x-2 text-ink font-semibold text-sm">
                      <Cpu className="w-4 h-4 text-accent" />
                      <span>Engineering Highlights</span>
                    </div>
                    <ul className="space-y-2.5">
                      {project.architectureHighlights.map((item, i) => (
                        <li key={i} className="flex items-start space-x-2.5 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Core Capabilities */}
                  <div className="p-6 rounded-2xl bg-white border border-black/[0.08] space-y-4 shadow-sm">
                    <div className="flex items-center space-x-2 text-ink font-semibold text-sm">
                      <Layers className="w-4 h-4 text-accent" />
                      <span>Product Capabilities</span>
                    </div>
                    <ul className="space-y-2.5">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-2.5 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              /* Live Preview In-Modal Viewport */
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
                  <div className="flex items-center space-x-2 text-xs text-ink-secondary">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <LottiePlayer
                        src={LOTTIE_URLS.liveGlobe}
                        className="w-full h-full"
                        fallbackIcon={<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                      />
                    </div>
                    <span className="font-mono text-xs">Live Sandbox: {project.liveUrl}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIframeKey((k) => k + 1)}
                      className="inline-flex items-center space-x-1 text-xs text-ink-secondary hover:text-ink font-medium"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reload</span>
                    </button>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-accent hover:underline font-medium"
                    >
                      <span>Open in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="relative w-full h-[560px] bg-white border border-black/10 rounded-2xl overflow-hidden shadow-inner">
                  <iframe
                    key={iframeKey}
                    src={project.liveUrl}
                    title={project.title}
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
