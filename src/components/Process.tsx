import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Compass, Layers, Code2, Rocket, Sparkles, Database, Terminal, ShieldCheck } from 'lucide-react';
import { PROCESS_STEPS } from '../data/portfolioData';

const STEP_META = [
  {
    icon: Compass,
    secondaryIcon: Sparkles,
    badge: 'PRD v1.0',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/30',
    glow: 'from-accent/20 to-transparent',
    accentText: 'Phase 01 Spec',
  },
  {
    icon: Layers,
    secondaryIcon: Database,
    badge: 'Schema & API',
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'from-amber-500/20 to-transparent',
    accentText: 'Phase 02 Arch',
  },
  {
    icon: Code2,
    secondaryIcon: Terminal,
    badge: 'Full-Stack',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'from-emerald-500/20 to-transparent',
    accentText: 'Phase 03 Build',
  },
  {
    icon: Rocket,
    secondaryIcon: ShieldCheck,
    badge: 'Production',
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'from-purple-500/20 to-transparent',
    accentText: 'Phase 04 Live',
  },
];

export const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const currentMeta = STEP_META[activeStep];
  const Icon = currentMeta.icon;

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
              const meta = STEP_META[idx];
              const StepIcon = meta.icon;
              return (
                <button
                  key={step.step}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 flex items-center justify-between group ${
                    isActive
                      ? 'bg-ink text-white shadow-md'
                      : 'bg-black/[0.03] text-ink hover:bg-black/[0.06]'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-semibold ${
                      isActive ? 'bg-accent/20 text-accent' : 'bg-black/[0.05] text-ink-muted'
                    }`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`block font-mono text-[11px] font-semibold ${isActive ? 'text-accent' : 'text-ink-muted'}`}>
                        PHASE {step.step}
                      </span>
                      <span className="font-display font-semibold text-sm sm:text-base tracking-normal">
                        {step.title}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 text-accent' : 'opacity-30 group-hover:translate-x-0.5'}`} />
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

                {/* Prominent High-Aesthetic Icon Badge */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl ${currentMeta.bg} border ${currentMeta.border} flex flex-col items-center justify-center p-3 shadow-md backdrop-blur-sm overflow-hidden group`}
                  >
                    {/* Subtle Gradient Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentMeta.glow} opacity-70 pointer-events-none`} />

                    {/* Ambient Dashed Orbit */}
                    <div className="absolute inset-1.5 rounded-2xl border border-dashed border-current opacity-20 pointer-events-none" />

                    {/* Main Icon Container */}
                    <div className="relative z-10 p-2.5 rounded-2xl bg-white shadow-sm border border-black/[0.06] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${currentMeta.color}`} />
                    </div>

                    {/* Phase Mini Status Pill */}
                    <div className="relative z-10 mt-2 px-2 py-0.5 rounded-full bg-white/95 border border-black/[0.08] shadow-2xs flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <span className="text-[10px] font-mono font-bold tracking-tight text-ink uppercase">
                        {currentMeta.badge}
                      </span>
                    </div>
                  </motion.div>
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

