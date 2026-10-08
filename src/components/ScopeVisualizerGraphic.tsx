import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Zap, ShieldCheck, Clock, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';

interface ScopeFeature {
  id: string;
  name: string;
  category: 'core' | 'v2';
  days: number;
  selected: boolean;
}

export const ScopeVisualizerGraphic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'radar' | 'simulator'>('radar');

  // Interactive scope simulator features
  const [features, setFeatures] = useState<ScopeFeature[]>([
    { id: 'auth', name: 'Magic Link / Google Auth', category: 'core', days: 2, selected: true },
    { id: 'core-flow', name: 'Single Core Transaction / Workflow', category: 'core', days: 5, selected: true },
    { id: 'db', name: 'Postgres DB + Type-Safe API', category: 'core', days: 3, selected: true },
    { id: 'dashboard', name: 'Results Dashboard & Export', category: 'core', days: 3, selected: true },
    { id: 'billing', name: 'Stripe Checkout & Webhooks', category: 'v2', days: 4, selected: false },
    { id: 'roles', name: 'Multi-Tenant RBAC & Team Roles', category: 'v2', days: 8, selected: false },
    { id: 'ai', name: 'Custom AI Agent Integration', category: 'v2', days: 7, selected: false },
    { id: 'notifs', name: 'Multi-Channel Push & SMS Matrix', category: 'v2', days: 5, selected: false },
  ]);

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f))
    );
  };

  const totalDays = features
    .filter((f) => f.selected)
    .reduce((acc, f) => acc + f.days, 0);

  const selectedCount = features.filter((f) => f.selected).length;
  const isLean = totalDays <= 16;
  const scopeHealth = Math.max(30, Math.min(98, 100 - (totalDays - 12) * 3));

  return (
    <div className="w-full rounded-3xl bg-[#141413] text-[#FAF9F5] border border-white/10 p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.35)] relative overflow-hidden font-sans">
      {/* Subtle warm orange ambient backdrop */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tabs */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="font-sans text-xs text-white/70 font-semibold">
            Scope Telemetry
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1 rounded-lg text-xs font-sans transition-all flex items-center space-x-1.5 ${
              activeTab === 'radar'
                ? 'bg-accent text-white shadow-sm font-semibold'
                : 'text-white/60 hover:text-white font-medium'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1 rounded-lg text-xs font-sans transition-all flex items-center space-x-1.5 ${
              activeTab === 'simulator'
                ? 'bg-accent text-white shadow-sm font-semibold'
                : 'text-white/60 hover:text-white font-medium'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Simulator</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Visual Graphic */}
      <div className="relative z-10 min-h-[260px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeTab === 'radar' ? (
            /* ================= VIEW 1: ANIMATED ARCHITECTURE FLOW ================= */
            <motion.div
              key="radar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Animated Scope Radar Matrix */}
              <div className="relative h-44 rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden flex items-center justify-center">
                {/* SVG Concentric Radar Grid */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#D84C24" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#D84C24" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Concentric rings */}
                  <circle cx="50%" cy="50%" r="28%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
                  <circle cx="50%" cy="50%" r="48%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
                  <circle cx="50%" cy="50%" r="68%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />

                  {/* Radar Sweep Animation */}
                  <g className="origin-center">
                    <line
                      x1="50%"
                      y1="50%"
                      x2="95%"
                      y2="50%"
                      stroke="rgba(216,76,36,0.5)"
                      strokeWidth="1.5"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 150 88"
                        to="360 150 88"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                    </line>
                  </g>

                  {/* Flow Connecting Curve */}
                  <path
                    d="M 40 88 Q 110 30 180 88 T 320 88"
                    stroke="#D84C24"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="6 6"
                    className="opacity-60"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-24"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>

                {/* Animated Node Points */}
                <div className="relative z-10 flex items-center justify-between w-full px-6 max-w-sm">
                  {/* Node 1 */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md shadow-md">
                      <Layers className="w-4 h-4 text-white/80" />
                    </div>
                    <span className="text-[11px] font-sans text-white/70 font-medium">1. Problem</span>
                  </div>

                  {/* Arrow pulse */}
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  </motion.div>

                  {/* Node 2: Core Job */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent flex items-center justify-center text-accent shadow-[0_0_20px_rgba(216,76,36,0.35)]">
                      <Zap className="w-5 h-5 text-accent animate-bounce" />
                    </div>
                    <span className="text-[11px] font-sans text-accent font-semibold">2. ONE Job</span>
                  </div>

                  {/* Arrow pulse */}
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  </motion.div>

                  {/* Node 3: Release */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                      <ShieldCheck className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-[11px] font-sans text-white font-medium">3. Ship (14d)</span>
                  </div>
                </div>
              </div>

              {/* Status Metrics Ribbon */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                  <div className="text-[11px] font-sans text-white/50 mb-0.5">
                    Target Cycle
                  </div>
                  <div className="text-sm font-sans font-bold text-white">
                    10–14 Days
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                  <div className="text-[11px] font-sans text-white/50 mb-0.5">
                    Max Screens
                  </div>
                  <div className="text-sm font-sans font-bold text-accent">
                    ≤ 4 Screens
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                  <div className="text-[11px] font-sans text-white/50 mb-0.5">
                    Launch Risk
                  </div>
                  <div className="text-sm font-sans font-bold text-white">
                    Minimal
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ================= VIEW 2: INTERACTIVE SCOPE SIMULATOR ================= */
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs font-sans text-white/70">
                <span>Toggle features to test scope impact:</span>
                <span className="text-accent font-semibold">
                  {isLean ? '✓ Lean & Fast' : 'Scope Exceeds 16 Days'}
                </span>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 gap-2">
                {features.map((feat) => (
                  <button
                    key={feat.id}
                    onClick={() => toggleFeature(feat.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs font-sans flex items-start justify-between ${
                      feat.selected
                        ? 'bg-accent/20 border-accent text-white'
                        : 'bg-white/[0.02] border-white/10 text-white/50 hover:border-white/20'
                    }`}
                  >
                    <div className="pr-2 leading-tight">
                      <div className="font-medium text-white">{feat.name}</div>
                      <div className="text-[10px] font-sans text-white/50 mt-0.5">
                        +{feat.days}d · {feat.category === 'core' ? 'Core' : 'V2'}
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full shrink-0 border flex items-center justify-center mt-0.5 ${
                      feat.selected
                        ? 'bg-accent border-accent text-white'
                        : 'border-white/20'
                    }`}>
                      {feat.selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Dynamic Scope Gauge */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-[11px] font-sans text-white/50">Est. Build Timeline</div>
                    <div className="text-sm font-sans font-bold text-white">
                      ~{totalDays} Working Days <span className="text-white/40 font-normal">({selectedCount} features)</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-sans text-white/50">Scope Score</div>
                  <div className="text-sm font-sans font-bold text-accent">
                    {scopeHealth}%
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pro-Tip Footer Ribbon */}
        <div className="pt-3 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60 font-sans">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="font-medium text-white/80">Architecture Rule:</span>
          </span>
          <span className="text-white/80">
            &ldquo;Cut until it hurts, then cut 20% more.&rdquo;
          </span>
        </div>
      </div>
    </div>
  );
};

