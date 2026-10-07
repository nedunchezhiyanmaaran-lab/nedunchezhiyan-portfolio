import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUpRight, MessageSquare, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { submitVisitorFeedback } from '../utils/analytics';

interface HeroProps {
  onStartProject: () => void;
  onViewWork: () => void;
}

const RATING_TAGS = [
  { label: '⭐ 5 Stars', value: '5/5 ⭐' },
  { label: '🔥 Impressive', value: 'Impressive 🔥' },
  { label: '⚡ Blazing Fast', value: 'Blazing Fast ⚡' },
  { label: '✨ Clean Architecture', value: 'Clean UI & Code ✨' },
  { label: '💡 Great Work', value: 'Great Work 💡' },
  { label: '🛠️ Suggestion', value: 'Suggestion 🛠️' },
];

export const Hero: React.FC<HeroProps> = ({ onStartProject, onViewWork }) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState('5/5 ⭐');
  const [visitorName, setVisitorName] = useState('');
  const [visitorRole, setVisitorRole] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;

    setIsSubmitting(true);
    try {
      await submitVisitorFeedback({
        name: visitorName.trim() || 'Anonymous Visitor',
        role: visitorRole.trim() || 'Visitor',
        rating: selectedRating,
        message: feedbackMsg.trim(),
      });
      setIsSubmitted(true);
      setFeedbackMsg('');
      setTimeout(() => {
        setIsSubmitted(false);
        setIsFeedbackOpen(false);
      }, 3500);
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-36 sm:pt-42 pb-14 px-6 sm:px-10 max-w-7xl mx-auto">
      {/* Top Content */}
      <div className="space-y-8 sm:space-y-10">
        {/* Availability Badge & Live Visitor Interactive Pill */}
        <div className="flex flex-wrap items-center gap-3">
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

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsFeedbackOpen((prev) => !prev)}
            className={`group inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 shadow-md hover:scale-105 ${
              isFeedbackOpen
                ? 'bg-[#FF5500] text-white border border-[#FF5500]'
                : 'bg-[#141413] hover:bg-[#FF5500] text-white border border-white/15 hover:border-[#FF5500]'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5500] opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5500] group-hover:bg-white transition-colors"></span>
            </span>
            <MessageSquare className="w-3.5 h-3.5 text-[#FF5500] group-hover:text-white transition-colors" />
            <span>{isFeedbackOpen ? 'Close Feedback' : 'Leave Feedback'}</span>
          </motion.button>
        </div>

        {/* Clean, Monumental Headline */}
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
              Freelance Full Stack Developer bridging the gap between <strong className="font-semibold text-ink">product vision, PRD specifications, and resilient technical architecture</strong>. Whether building a new web application from zero-to-one or revamping &amp; modernizing an existing codebase, I deliver high-performance, production-ready software.
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

        {/* Interactive Real-Time Visitor Feedback Section Widget */}
        <AnimatePresence>
          {isFeedbackOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden pt-2"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-black/10 shadow-xl backdrop-blur-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.06] pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <h3 className="font-display font-bold text-lg text-ink">
                        Visitor Instant Feedback &amp; Review
                      </h3>
                    </div>
                    <p className="text-xs text-ink-secondary mt-0.5">
                      Share your quick thoughts, impression, or architecture suggestion. Logged in real-time to the admin panel by device.
                    </p>
                  </div>
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span>Real-time Live DB</span>
                  </span>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 flex items-center space-x-4"
                  >
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Thank you for your feedback!</h4>
                      <p className="text-xs text-emerald-700/90 mt-0.5">
                        Your reaction and review has been stored in Supabase and categorized by your device in the admin panel.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-4">
                    {/* Rating Pills */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-muted mb-2">
                        Select Reaction / Impression
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {RATING_TAGS.map((tag) => (
                          <button
                            type="button"
                            key={tag.value}
                            onClick={() => setSelectedRating(tag.value)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono transition-all ${
                              selectedRating === tag.value
                                ? 'bg-ink text-white shadow-sm'
                                : 'bg-canvas-subtle hover:bg-black/[0.06] text-ink border border-black/5'
                            }`}
                          >
                            {tag.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                          Your Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          placeholder="e.g. Alex"
                          className="w-full px-4 py-2.5 rounded-xl bg-canvas-subtle border border-black/10 focus:border-accent focus:bg-white focus:outline-none text-xs text-ink transition-colors"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                          Role / Title (Optional)
                        </label>
                        <input
                          type="text"
                          value={visitorRole}
                          onChange={(e) => setVisitorRole(e.target.value)}
                          placeholder="e.g. Product Lead, Founder"
                          className="w-full px-4 py-2.5 rounded-xl bg-canvas-subtle border border-black/10 focus:border-accent focus:bg-white focus:outline-none text-xs text-ink transition-colors"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                          Feedback / Note / Suggestion <span className="text-accent">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={feedbackMsg}
                            onChange={(e) => setFeedbackMsg(e.target.value)}
                            placeholder="What do you think of the design, projects, or codebase? Drop your thoughts..."
                            className="flex-1 px-4 py-2.5 rounded-xl bg-canvas-subtle border border-black/10 focus:border-accent focus:bg-white focus:outline-none text-xs text-ink transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={isSubmitting || !feedbackMsg.trim()}
                            className="px-5 py-2.5 rounded-xl bg-accent hover:bg-ink text-white text-xs font-semibold font-mono tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 shrink-0 shadow-md"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isSubmitting ? 'Saving...' : 'Submit'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Meta Bar: Core Pillars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.75 }}
        className="mt-16 sm:mt-24 pt-8 border-t border-black/[0.07] grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-ink-secondary"
      >
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-ink-muted mb-1 font-mono">Scope of Work</span>
          <span className="font-semibold text-ink">New Builds &middot; App Revamps &middot; Scaling</span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-ink-muted mb-1 font-mono">Architecture</span>
          <span className="font-semibold text-ink">PRD Blueprint &middot; Scalable Schemas</span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-ink-muted mb-1 font-mono">Full-Stack Tech</span>
          <span className="font-semibold text-ink">React &middot; Next.js &middot; TypeScript &middot; Node</span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-ink-muted mb-1 font-mono">Engagement</span>
          <span className="font-semibold text-ink">Freelance &middot; Remote Worldwide</span>
        </div>
      </motion.div>
    </section>
  );
};

