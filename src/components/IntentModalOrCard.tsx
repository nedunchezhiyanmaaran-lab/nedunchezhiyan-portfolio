import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ArrowLeft, X } from 'lucide-react';
import {
  ALLOWED_ROLES,
  ALLOWED_GOALS,
  type UserRole,
  type UserGoal,
  getStoredIntent,
  saveUserIntent,
  skipUserIntent,
} from '../utils/intent';

interface IntentCardProps {
  onCompleted?: () => void;
}

export const IntentModalOrCard: React.FC<IntentCardProps> = ({
  onCompleted,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 'done'>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);

  useEffect(() => {
    // Check if user already answered or skipped
    const stored = getStoredIntent();
    if (stored && (stored.answered || stored.skipped)) {
      setIsVisible(false);
      return;
    }

    // If partially answered before, resume at step 2 modal
    if (stored?.role && !stored.goal) {
      setSelectedRole(stored.role);
      setCurrentStep(2);
    }

    setIsVisible(true);
  }, []);

  const handleSkip = useCallback(async () => {
    setIsVisible(false);
    await skipUserIntent();
    if (onCompleted) onCompleted();
  }, [onCompleted]);

  // Handle Escape key for Step 2 Modal
  useEffect(() => {
    if (currentStep !== 2) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, handleSkip]);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    // Save Step 1 immediately so partial response is persisted
    saveUserIntent(role, undefined);
    // Open Step 2 as a separate popup modal dialog
    setCurrentStep(2);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleSelectGoal = (goal: UserGoal) => {
    setSelectedGoal(goal);
    if (selectedRole) {
      saveUserIntent(selectedRole, goal);
    } else {
      saveUserIntent(undefined, goal);
    }
    setCurrentStep('done');

    // Auto close after 800ms
    setTimeout(() => {
      setIsVisible(false);
      if (onCompleted) onCompleted();
    }, 800);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
          {/* Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
            aria-hidden="true"
          />

          {/* Modal Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-lg rounded-3xl bg-white text-ink border border-black/10 p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.25)] font-sans space-y-6 overflow-hidden"
          >
            {/* DONE / SUCCESS STATE */}
            {currentStep === 'done' && (
              <div className="py-6 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-ink">
                  Portfolio Tailored!
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary">
                  Showing content relevant to <strong className="text-ink">{selectedRole}</strong> &bull; <strong className="text-accent">{selectedGoal}</strong>
                </p>
              </div>
            )}

            {/* STEP 1: ROLE SELECTION */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 border-b border-black/[0.08] pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-sans font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Personalize Your Experience (5s)</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-ink tracking-tight pt-1">
                      Quick question so I can show what&apos;s relevant
                    </h2>
                  </div>

                  <button
                    onClick={handleSkip}
                    className="p-1.5 rounded-full hover:bg-black/5 text-ink-secondary hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Role Buttons */}
                <div className="space-y-3">
                  <p className="text-xs font-sans font-semibold text-ink uppercase tracking-wider text-ink-muted">
                    I&apos;m a...
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ALLOWED_ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleSelectRole(role)}
                        className="w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-sans font-medium text-left bg-[#FAF8F3] hover:bg-ink hover:text-white border-black/10 text-ink transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer shadow-2xs"
                      >
                        <span>{role}</span>
                        <span className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2 flex items-center justify-between text-xs text-ink-muted border-t border-black/[0.06]">
                  <span>Privacy first &bull; No cookies required</span>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-ink-muted hover:text-accent underline transition-colors cursor-pointer font-medium"
                  >
                    Skip, just show me the work
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: GOAL SELECTION */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 border-b border-black/[0.08] pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-sans font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Step 2 of 2 &bull; Role: {selectedRole}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-ink tracking-tight pt-1">
                      What brings you here today?
                    </h2>
                  </div>

                  <button
                    onClick={handleSkip}
                    className="p-1.5 rounded-full hover:bg-black/5 text-ink-secondary hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Goal Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-sans font-semibold uppercase tracking-wider text-ink-muted">
                      I&apos;m looking to...
                    </p>
                    <button
                      type="button"
                      onClick={handleBackToStep1}
                      className="inline-flex items-center space-x-1 text-xs font-sans text-ink-secondary hover:text-accent transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Role</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {ALLOWED_GOALS.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleSelectGoal(goal)}
                        className="w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-sans font-medium text-left bg-[#FAF8F3] hover:bg-ink hover:text-white border-black/10 text-ink transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer shadow-2xs"
                      >
                        <span>{goal}</span>
                        <span className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2 flex items-center justify-between text-xs text-ink-muted border-t border-black/[0.06]">
                  <span>Privacy first &bull; No cookies required</span>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-ink-muted hover:text-accent underline transition-colors cursor-pointer font-medium"
                  >
                    Skip, show work
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
