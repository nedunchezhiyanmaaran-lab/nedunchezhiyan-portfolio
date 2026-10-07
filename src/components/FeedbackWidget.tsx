import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { submitVisitorFeedback } from '../utils/analytics';

const RATING_TAGS = [
  { label: '⭐ 5 Stars', value: '5/5 ⭐' },
  { label: '🔥 Impressive', value: 'Impressive 🔥' },
  { label: '⚡ Blazing Fast', value: 'Blazing Fast ⚡' },
  { label: '✨ Clean Architecture', value: 'Clean UI & Code ✨' },
  { label: '💡 Great Work', value: 'Great Work 💡' },
  { label: '🛠️ Suggestion', value: 'Suggestion 🛠️' },
];

export const FeedbackWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState('5/5 ⭐');
  const [visitorName, setVisitorName] = useState('');
  const [visitorRole, setVisitorRole] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear once user scrolls down past 80px
      if (window.scrollY > 80) {
        setIsVisible(true);
      } else {
        // Keep visible if popup is currently opened
        if (!isOpen) {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
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
        setIsOpen(false);
      }, 3000);
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Scroll Trigger Button (High Visibility Dark Black & Vibrant Orange) */}
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.85 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="group flex items-center space-x-3 px-5 py-3.5 rounded-full bg-[#0A0A09] hover:bg-[#FF5500] text-white shadow-[0_10px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_35px_rgba(255,85,0,0.45)] border-2 border-[#FF5500]/60 hover:border-[#FF5500] transition-all duration-300 hover:scale-105"
              aria-label="Give Visitor Feedback"
            >
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-[#FF5500] group-hover:text-white transition-colors" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5500] opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5500] group-hover:bg-white transition-colors"></span>
                </span>
              </div>
              <span className="text-xs font-bold font-sans tracking-wide">
                Leave Feedback
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Interactive Feedback Modal / Card */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg rounded-3xl bg-[#141413] border border-white/15 shadow-2xl p-6 sm:p-8 text-white space-y-5 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <h3 className="font-display font-bold text-lg text-white">
                      Visitor Impression &amp; Feedback
                    </h3>
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    Your feedback is saved directly to live telemetry and categorized by your device in the admin dashboard.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center space-x-4"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-white">Thank you for your feedback!</h4>
                    <p className="text-xs text-emerald-300/90 mt-0.5">
                      Your reaction has been recorded in Supabase and categorized by your device profile.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Reaction Tag Selection */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-2">
                      Select Your Impression / Reaction
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {RATING_TAGS.map((tag) => (
                        <button
                          type="button"
                          key={tag.value}
                          onClick={() => setSelectedRating(tag.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                            selectedRating === tag.value
                              ? 'bg-accent text-white font-semibold shadow-md'
                              : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-white/10'
                          }`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visitor Name & Role (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="e.g. Alex"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-accent focus:outline-none text-xs text-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                        Role / Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={visitorRole}
                        onChange={(e) => setVisitorRole(e.target.value)}
                        placeholder="e.g. Product Lead, Founder"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-accent focus:outline-none text-xs text-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Feedback Message (Required) */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                      Your Feedback / Thoughts <span className="text-accent">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={feedbackMsg}
                      onChange={(e) => setFeedbackMsg(e.target.value)}
                      placeholder="What do you think of the design, projects, or technical architecture? Drop your thoughts..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-accent focus:outline-none text-xs text-white transition-colors resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[11px] font-mono text-white/40">
                      ⚡ 100% Real-time Supabase DB
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting || !feedbackMsg.trim()}
                      className="px-6 py-2.5 rounded-xl bg-accent hover:bg-white hover:text-black text-white text-xs font-semibold font-mono tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Submitting...' : 'Send Feedback'}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
