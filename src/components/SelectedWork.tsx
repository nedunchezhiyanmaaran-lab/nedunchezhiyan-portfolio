import React, { useState } from 'react';
import { ArrowUpRight, Compass, Star, QrCode, Bot, Sparkles } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import type { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { trackProjectInteraction } from '../utils/analytics';

export const SelectedWork: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleOpenProject = (proj: Project) => {
    trackProjectInteraction(proj.id, 'view_modal');
    setSelectedProject(proj);
  };

  const travelProject = PROJECTS[0];
  const jameenProject = PROJECTS[1];
  const crmProject = PROJECTS[2];

  return (
    <section id="work" className="bg-white border-b border-black/[0.08] py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="space-y-4 mb-20 sm:mb-24">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs sm:text-sm font-bold text-accent tracking-tight">
              (01)
            </span>
            <span className="w-8 h-[2px] bg-accent" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-ink">
              Selected Work &amp; Case Studies
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-section-title font-bold tracking-tight text-ink font-display">
              Featured Case Studies.
            </h2>
            <p className="text-sm sm:text-base text-ink-secondary max-w-md leading-relaxed">
              Production web applications built with rigorous full-stack craftsmanship, bespoke design, and reliable cloud deployments.
            </p>
          </div>
        </div>

      <div className="space-y-36">
        {/* =========================================================================
            PROJECT 01: ROAMORA LUXURY TRAVEL (Cinematic Ocean Luxury)
           ========================================================================= */}
        <div className="group space-y-8">
          {/* Top Metadata Bar */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-black/[0.08] pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
                01 / Travel &amp; Hospitality Tech
              </span>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink">
                Roamora Travel Platform
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={travelProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-ink text-[#FAF9F5] text-xs font-semibold hover:bg-accent transition-all duration-300"
              >
                <span>Live Website</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleOpenProject(travelProject)}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-ink text-xs font-semibold transition-colors"
              >
                <span>Case Study</span>
              </button>
            </div>
          </div>

          {/* Cinematic Visual Canvas (Rounded 4xl, immersive) */}
          <div
            onClick={() => handleOpenProject(travelProject)}
            className="relative rounded-3xl sm:rounded-5xl overflow-hidden bg-gradient-to-br from-[#061826] via-[#0A2540] to-[#04121F] text-white p-8 sm:p-14 cursor-pointer shadow-xl transition-transform duration-500 hover:scale-[1.008]"
          >
            {/* Background Ambient Glow */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Showcase Narrative */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-cyan-300 text-xs font-medium">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Curated Luxury Destinations &amp; Escapes</span>
                </div>

                <h4 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Handcrafted Journeys, Boutique Villas &amp; Real-Time Concierge.
                </h4>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                  Engineered with Next.js &amp; TypeScript, featuring dynamic destination category filters, direct WhatsApp concierge integration, and lightning-fast package search.
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Vercel'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Visual Composition */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black/40 backdrop-blur-md p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                    <span className="text-cyan-300 font-mono">travel-agency-kohl-three.vercel.app</span>
                    <span className="flex items-center space-x-1 text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>4.9 / 5.0 Luxury Rating</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-white/50 block text-[10px] uppercase">Destination Search</span>
                      <span className="font-semibold text-white">Maldives, Bali, Swiss Alps</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-white/50 block text-[10px] uppercase">Concierge Desk</span>
                      <span className="font-semibold text-white">24/7 WhatsApp Assist</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-white font-semibold block text-sm">Overwater Villa Package</span>
                      <span className="text-cyan-300/80 text-xs">Private plunge pool &middot; 7 Nights</span>
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs">
                      Enquire &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PROJECT 02: JAMEEN RESTAURANT & DINING (Gold Luxury Hospitality)
           ========================================================================= */}
        <div className="group space-y-8">
          {/* Top Metadata Bar */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-black/[0.08] pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-600 font-semibold">
                02 / Hospitality Tech &amp; Dining
              </span>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink">
                Jameen Dining &amp; QR Ordering
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={jameenProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-ink text-[#FAF9F5] text-xs font-semibold hover:bg-amber-600 transition-all duration-300"
              >
                <span>Live Website</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleOpenProject(jameenProject)}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-ink text-xs font-semibold transition-colors"
              >
                <span>Case Study</span>
              </button>
            </div>
          </div>

          {/* Cinematic Visual Canvas (Gold/Dark Luxury) */}
          <div
            onClick={() => handleOpenProject(jameenProject)}
            className="relative rounded-3xl sm:rounded-5xl overflow-hidden bg-gradient-to-br from-[#120F08] via-[#1A160C] to-[#0A0804] text-white p-8 sm:p-14 cursor-pointer shadow-xl transition-transform duration-500 hover:scale-[1.008]"
          >
            {/* Background Ambient Glow */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Visual Composition */}
              <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/20 bg-black/50 backdrop-blur-md p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                    <span className="text-amber-400 font-mono">jameen-xi.vercel.app/customer</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] border border-amber-500/30">
                      Table #07 Active
                    </span>
                  </div>

                  <div className="flex space-x-2 text-xs overflow-x-auto pb-1">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-semibold">Biryani</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white/80">Tandoori</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white/80">Chinese</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white/80">Grill</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block">Special Mutton Dum Biryani</span>
                        <span className="text-white/50 text-[11px]">Seeraga Samba slow-cooked with spiced meat</span>
                      </div>
                      <span className="text-amber-400 font-mono font-bold">₹380</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block">Charcoal Chicken Tikka</span>
                        <span className="text-white/50 text-[11px]">Clay oven roasted with mint chutney</span>
                      </div>
                      <span className="text-amber-400 font-mono font-bold">₹320</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Showcase Narrative */}
              <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-amber-300 text-xs font-medium">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Contactless Dining &amp; Menu Catalog</span>
                </div>

                <h4 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Instant QR Table Sessions &amp; Zero-Latency Cart Sync.
                </h4>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                  Crafted with Next.js and React, enabling patrons to browse rich culinary catalogs across Biryani, Tandoor, and Grills, customize orders, and manage live table sessions.
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PROJECT 03: ACMECRM (Enterprise SaaS & AI Pipeline)
           ========================================================================= */}
        <div className="group space-y-8">
          {/* Top Metadata Bar */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-black/[0.08] pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">
                03 / Enterprise SaaS &amp; AI CRM
              </span>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink">
                AcmeCRM AI Sales Platform
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={crmProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-ink text-[#FAF9F5] text-xs font-semibold hover:bg-blue-600 transition-all duration-300"
              >
                <span>Live Platform</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleOpenProject(crmProject)}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-ink text-xs font-semibold transition-colors"
              >
                <span>Case Study</span>
              </button>
            </div>
          </div>

          {/* Cinematic Visual Canvas (Enterprise Navy / Slate SaaS Glow) */}
          <div
            onClick={() => handleOpenProject(crmProject)}
            className="relative rounded-3xl sm:rounded-5xl overflow-hidden bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0A0F1D] text-white p-8 sm:p-14 cursor-pointer shadow-xl transition-transform duration-500 hover:scale-[1.008]"
          >
            {/* Background Ambient Glow */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Showcase Narrative */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/15 backdrop-blur-md border border-blue-400/20 text-blue-300 text-xs font-medium">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Interactive Pipeline &amp; Deal Management</span>
                </div>

                <h4 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Dynamic Kanban Deals, AI Scoring &amp; Real-Time Pipeline.
                </h4>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                  Built end-to-end with Next.js 14 and TypeScript. Features optimistic drag-and-drop deal progression, contact management, and interactive deal probability analytics.
                </p>

                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Visual Composition (SaaS Pipeline & AI Deal Card) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-400/20 bg-slate-950/60 backdrop-blur-md p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                    <span className="text-blue-400 font-mono">acme-crm-frontend.vercel.app</span>
                    <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Pipeline Active</span>
                    </span>
                  </div>

                  {/* Kanban Pipeline Stages Simulation */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-white/50 block text-[10px] uppercase font-mono">Qualified</span>
                      <span className="font-semibold text-white block">14 Deals</span>
                      <span className="text-blue-300 font-mono text-[11px]">$84,000</span>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/25 space-y-1">
                      <span className="text-blue-300 block text-[10px] uppercase font-mono font-semibold">Proposal</span>
                      <span className="font-semibold text-white block">8 Deals</span>
                      <span className="text-emerald-300 font-mono text-[11px]">$122,500</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/25 space-y-1">
                      <span className="text-emerald-300 block text-[10px] uppercase font-mono font-semibold">Won</span>
                      <span className="font-semibold text-white block">19 Deals</span>
                      <span className="text-emerald-300 font-mono text-[11px]">$240,000</span>
                    </div>
                  </div>

                  {/* AI Smart Lead Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-500/30 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold block text-sm">Enterprise SaaS License</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono flex items-center space-x-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>AI Score: 94%</span>
                        </span>
                      </div>
                      <span className="text-white/60 text-xs">Acme Global &middot; Primary Stakeholder Signed</span>
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-blue-500 text-white font-bold text-xs font-mono">
                      $45,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

