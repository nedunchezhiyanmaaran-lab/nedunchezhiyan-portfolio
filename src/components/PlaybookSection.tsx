import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, Download, ArrowRight } from 'lucide-react';
import { PLAYBOOKS, type PlaybookGoalKey } from '../data/playbooks.config';
import { getStoredIntent, type UserIntent } from '../utils/intent';
import { trackEvent, getStoredRef } from '../utils/sourceTracking';
import { downloadChecklistPdf } from '../utils/generatePdf';
import { saveChecklistLead } from '../utils/analytics';

interface PlaybookSectionProps {
  onNavigateToContactWithAnswers?: (starterText: string) => void;
}

export const PlaybookSection: React.FC<PlaybookSectionProps> = ({
  onNavigateToContactWithAnswers,
}) => {
  const [intent, setIntent] = useState<UserIntent | null>(() => getStoredIntent());
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPdfFormOpen, setIsPdfFormOpen] = useState(false);
  const [founderName, setFounderName] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [hasTrackedOpen, setHasTrackedOpen] = useState(false);

  useEffect(() => {
    const handleIntentChange = (e: CustomEvent<UserIntent>) => {
      setIntent(e.detail);
    };

    window.addEventListener('intent_updated' as any, handleIntentChange);
    return () => window.removeEventListener('intent_updated' as any, handleIntentChange);
  }, []);

  // Determine active goal, defaulting to 'new_app' so the 8-Point MVP Checklist is always directly visible
  let goalKey: PlaybookGoalKey = 'new_app';
  const canonicalGoal = intent?.canonicalGoal;

  if (canonicalGoal === 'revamp' || intent?.goal === 'Revamp or improve an existing app') {
    goalKey = 'revamp';
  } else if (canonicalGoal === 'manual_process' || intent?.goal === 'Turn a manual process into software') {
    goalKey = 'manual_process';
  } else {
    goalKey = 'new_app';
  }

  const playbook = PLAYBOOKS[goalKey];

  const handleToggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    if (next && !hasTrackedOpen) {
      setHasTrackedOpen(true);
      trackEvent({ event: 'playbook_opened', goal: goalKey });
    }
  };

  const handleCtaClick = () => {
    trackEvent({ event: 'playbook_cta_click', goal: goalKey });
    if (onNavigateToContactWithAnswers) {
      onNavigateToContactWithAnswers('My answers to the playbook: ');
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleDownloadPdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist to DB under this visitor's device
    saveChecklistLead({
      name: founderName.trim() || 'Anonymous Founder',
      idea: projectIdea.trim() || `${playbook.title} (${goalKey})`,
      ref: getStoredRef(),
    });

    downloadChecklistPdf({
      goalKey: goalKey,
      founderName: founderName.trim() || undefined,
      projectIdea: projectIdea.trim() || undefined,
    });
    setIsPdfFormOpen(false);
  };

  return (
    <section id="checklist" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#FAF8F3] border-t border-b border-black/[0.08] scroll-mt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Collapsible Header Container */}
        <div
          onClick={handleToggleExpand}
          className="p-5 sm:p-6 rounded-3xl bg-white border border-black/10 hover:border-black/25 transition-all shadow-xs cursor-pointer select-none flex items-start justify-between gap-4"
        >
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-sans font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Playbook</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
              {playbook.title}
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary font-sans leading-relaxed">
              {playbook.disclaimer}
            </p>
          </div>

          <button
            type="button"
            className="p-2.5 rounded-2xl bg-[#FAF8F3] text-ink hover:text-accent border border-black/10 transition-colors shrink-0 mt-1"
            aria-label={isExpanded ? 'Collapse playbook' : 'Expand playbook'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Collapsible Body Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden space-y-6"
            >
              {/* Playbook Items List */}
              <div className="space-y-3">
                {playbook.items.map((item) => (
                  <div
                    key={item.num}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-black/[0.08] space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-start space-x-3.5">
                      <span className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/25 text-accent font-sans text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {item.num}
                      </span>
                      <div className="space-y-1.5 flex-1">
                        <h3 className="font-display font-bold text-ink text-base sm:text-lg leading-snug tracking-tight">
                          {item.question}
                        </h3>

                        {item.rule && (
                          <div className="text-xs sm:text-sm text-ink-secondary font-sans leading-relaxed">
                            <strong className="text-ink font-semibold">Rule: </strong>
                            <span>{item.rule}</span>
                          </div>
                        )}

                        {item.trap && (
                          <div className="text-xs sm:text-sm text-red-700/90 font-sans leading-relaxed">
                            <strong className="font-semibold text-red-800">Trap: </strong>
                            <span>{item.trap}</span>
                          </div>
                        )}

                        {item.example && (
                          <div className="text-xs sm:text-sm text-ink-muted font-sans italic leading-relaxed pt-0.5">
                            <span className="font-semibold text-ink-secondary not-italic">Example (illustrative): </span>
                            <span>{item.example}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons & Optional PDF Inline Form */}
              <div className="p-6 rounded-3xl bg-white border border-black/10 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Primary CTA: Discuss your answers */}
                  <button
                    type="button"
                    onClick={handleCtaClick}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-accent text-white hover:bg-black font-sans text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                  >
                    <span>Discuss your answers with me</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Toggle PDF Download form */}
                  <button
                    type="button"
                    onClick={() => setIsPdfFormOpen((prev) => !prev)}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white border border-black/15 text-ink hover:border-accent hover:text-accent font-sans text-xs sm:text-sm font-medium transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-accent" />
                    <span>Download as PDF</span>
                  </button>
                </div>

                {/* Inline Optional PDF Form (name and project line optional) */}
                <AnimatePresence>
                  {isPdfFormOpen && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleDownloadPdfSubmit}
                      className="pt-4 border-t border-black/[0.08] space-y-3"
                    >
                      <p className="text-xs text-ink-secondary font-sans">
                        Optional: Add your name and project line to customize your PDF download (both can be left empty).
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-sans font-semibold text-ink block mb-1">
                            Your Name (optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Alex Morgan"
                            value={founderName}
                            onChange={(e) => setFounderName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-black/10 text-xs font-sans text-ink focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-sans font-semibold text-ink block mb-1">
                            Your Project in One Line (optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Automated invoicing for designers"
                            value={projectIdea}
                            onChange={(e) => setProjectIdea(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-black/10 text-xs font-sans text-ink focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-ink text-white hover:bg-accent font-sans text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Generate &amp; Download PDF</span>
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
