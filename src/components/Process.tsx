import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Compass, Layers, Code2, Rocket } from 'lucide-react';
import { PROCESS_STEPS } from '../data/portfolioData';
import { LottiePlayer } from './LottiePlayer';
import {
  PRD_BLUEPRINT_LOTTIE,
  ARCHITECTURE_NODES_LOTTIE,
  CODE_BUILD_LOTTIE,
  ROCKET_LAUNCH_LOTTIE,
} from '../data/localLottieData';

const STEP_ANIMATIONS = [
  { data: PRD_BLUEPRINT_LOTTIE, icon: Compass },
  { data: ARCHITECTURE_NODES_LOTTIE, icon: Layers },
  { data: CODE_BUILD_LOTTIE, icon: Code2 },
  { data: ROCKET_LAUNCH_LOTTIE, icon: Rocket },
];

export const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="process" className="bg-[#F4EFE5] border-b border-black/[0.08] py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs uppercase tracking-widest text-accent font-semibold font-mono">
              04 &middot; Methodology &amp; Execution
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-section-title font-semibold tracking-tight text-ink font-display">
              How We Build Together.
            </h2>
            <p className="text-sm sm:text-base text-ink-secondary max-w-md leading-relaxed">
              A structured four-stage execution model designed to reduce uncertainty, ship rapidly, and eliminate technical debt.
            </p>
          </div>
        </div>

      {/* Connected Flowing Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Step Selector Pills */}
        <div className="lg:col-span-4 space-y-3">
          {PROCESS_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.step}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? 'bg-ink text-white shadow-md'
                    : 'bg-black/[0.03] text-ink hover:bg-black/[0.06]'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className={`font-mono text-xs font-semibold ${isActive ? 'text-accent' : 'text-ink-muted'}`}>
                    {step.step}
                  </span>
                  <span className="font-display font-semibold text-sm sm:text-base tracking-normal">
                    {step.title}
                  </span>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 text-accent' : 'opacity-30'}`} />
              </button>
            );
          })}
        </div>

        {/* Active Stage Canvas */}
        <div className="lg:col-span-8 p-8 sm:p-12 rounded-3xl bg-white border border-black/[0.08] shadow-sm relative overflow-hidden">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold block">
                  Phase {PROCESS_STEPS[activeStep].step} &middot; {PROCESS_STEPS[activeStep].title}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-snug tracking-tight">
                  {PROCESS_STEPS[activeStep].subtitle}
                </h3>
                <p className="text-base text-ink-secondary leading-relaxed font-normal">
                  {PROCESS_STEPS[activeStep].description}
                </p>
              </div>

              {/* Lottie Animation Canvas */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#FAF9F5] border border-black/[0.06] p-2 flex items-center justify-center shrink-0 shadow-inner">
                <LottiePlayer
                  animationData={STEP_ANIMATIONS[activeStep].data}
                  className="w-full h-full"
                  fallbackIcon={
                    (() => {
                      const Icon = STEP_ANIMATIONS[activeStep].icon;
                      return <Icon className="w-8 h-8 text-accent" />;
                    })()
                  }
                />
              </div>
            </div>

            {/* Deliverables Pills */}
            <div className="pt-6 border-t border-black/[0.08] space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block">
                Deliverables &amp; Outcomes
              </span>
              <div className="flex flex-wrap gap-2.5">
                {PROCESS_STEPS[activeStep].outputs.map((output, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 rounded-full bg-[#FBF9F5] border border-black/[0.08] flex items-center space-x-2 text-xs text-ink font-medium"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{output}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
};
