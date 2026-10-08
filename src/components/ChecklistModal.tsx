import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Send, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitChecklistForm } from '../lib/api';
import { logAnalyticsEvent } from '../utils/analytics';
import { downloadChecklistPdf } from '../utils/generatePdf';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChecklistModal: React.FC<ChecklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [refSource, setRefSource] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState('');
  const [honeypot, setHoneypot] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Read ref parameter from URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('utm_source');
    if (ref) {
      setRefSource(ref);
    }
  }, []);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Honeypot check
    if (honeypot) {
      setIsSubmitted(true);
      return;
    }

    if (!name.trim() || !email.trim() || !idea.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      await submitChecklistForm({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        idea: idea.trim(),
        ref: refSource || undefined,
      });

      logAnalyticsEvent('contact_submit', `📋 Checklist Form Submitted by ${name}`);

      setIsSubmitted(true);

      // Trigger celebrate confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D84C24', '#141413', '#FBF9F5'],
        });
      } catch (err) {
        console.warn('Confetti unavailable', err);
      }
    } catch (err) {
      console.error('Failed to submit checklist lead:', err);
      setErrorMsg('Failed to process. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    downloadChecklistPdf({
      founderName: name.trim() || undefined,
      projectIdea: idea.trim() || undefined,
    });
    logAnalyticsEvent('section_read', '📋 Downloaded MVP Scoping PDF Document');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
      {/* Lightly dimmed backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[3px]"
        aria-hidden="true"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white text-ink border border-black/10 p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.25)] font-sans space-y-6"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.08] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-sans font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Engineering Resource</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-ink tracking-tight pt-1">
              Free MVP Scoping Checklist
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-ink-secondary hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          /* Lead Capture Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
              Enter your details to receive the 8-point MVP scoping framework and save your project concept.
            </p>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-accent text-ink text-xs font-sans flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-accent" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }}
              aria-hidden="true"
            />

            {/* Name */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-sans font-semibold text-ink">
                <span>01. Founder Name</span>
                <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F3] border border-black/10 text-ink placeholder:text-ink-muted text-sm font-sans focus:outline-none focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-sans font-semibold text-ink">
                <span>02. Email Address</span>
                <span className="text-accent">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F3] border border-black/10 text-ink placeholder:text-ink-muted text-sm font-sans focus:outline-none focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            {/* Idea */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-sans font-semibold text-ink">
                <span>03. What are you building? (one sentence)</span>
                <span className="text-accent">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. An automated invoicing tool for freelance designers..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F3] border border-black/10 text-ink placeholder:text-ink-muted text-sm font-sans focus:outline-none focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-accent text-white font-sans text-sm font-semibold hover:bg-ink transition-all flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send me the checklist</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs font-sans text-ink-muted pt-1">
              🔒 Zero spam guarantee. Instant access on screen immediately.
            </p>
          </form>
        ) : (
          /* Post Submit Success View */
          <div className="py-4 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto border border-accent/25">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-display font-bold text-ink tracking-tight">
                Checklist Unlocked!
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary font-sans leading-relaxed">
                Thank you, <strong className="text-ink">{name}</strong>! A copy has been dispatched to <strong className="text-accent">{email}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-black/10 text-left text-xs font-sans space-y-1">
              <div className="text-accent font-semibold">Your Project Spec:</div>
              <div className="text-ink-secondary italic">&ldquo;{idea}&rdquo;</div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="flex-1 py-3 px-4 rounded-2xl bg-accent text-white hover:bg-ink font-sans text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-2xl bg-white border border-black/15 text-ink hover:border-accent hover:text-accent font-sans text-xs font-semibold transition-colors"
              >
                Done / Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
