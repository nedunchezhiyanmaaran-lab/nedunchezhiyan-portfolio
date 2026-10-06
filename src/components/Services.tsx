import React from 'react';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { SERVICES } from '../data/portfolioData';

interface DeliverableParsed {
  title: string;
  detail: string;
}

const parseDeliverable = (raw: string): DeliverableParsed => {
  const match = raw.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return { title: match[1].trim(), detail: match[2].trim() };
  }
  return { title: raw, detail: '' };
};

const SERVICE_META = [
  {
    category: 'PRODUCT & ARCHITECTURE',
    timeline: '3–5 Weeks Delivery',
    accentColor: '#D84C24',
  },
  {
    category: 'FULL-STACK SYSTEMS',
    timeline: '4–8 Weeks Delivery',
    accentColor: '#1A56DB',
  },
  {
    category: 'PERFORMANCE & AUDITS',
    timeline: '1–2 Weeks Sprint',
    accentColor: '#059669',
  },
  {
    category: 'AI & AUTOMATION PIPELINES',
    timeline: '2–4 Weeks Delivery',
    accentColor: '#7C3AED',
  },
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="bg-[#F6F3EB] border-b border-black/[0.08] py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16 sm:space-y-20">
        {/* Section Header */}
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs uppercase tracking-widest text-accent font-bold font-mono">
              02 &middot; Engineering Capabilities
            </span>
          </div>

          <div className="max-w-4xl space-y-5">
            <h2 className="text-section-title font-bold tracking-tight text-ink font-display leading-[0.98]">
              Direct Technical Execution.{' '}
              <span className="text-accent font-serif italic font-normal block sm:inline">
                Product-minded engineering.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-ink-secondary max-w-2xl leading-relaxed font-sans font-normal pt-1">
              I collaborate directly with founders, product leaders, and engineering teams to translate product requirements into type-safe, sub-second web applications with zero agency fluff.
            </p>
          </div>
        </div>

        {/* Expansive Editorial Service Cards */}
        <div className="space-y-8">
          {SERVICES.map((service, idx) => {
            const meta = SERVICE_META[idx % SERVICE_META.length];

            return (
              <div
                key={service.id}
                className="p-8 sm:p-12 rounded-3xl sm:rounded-4xl bg-white border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)] hover:border-black/20 transition-all duration-300"
              >
                {/* Top Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-black/[0.06]">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xl sm:text-2xl font-bold text-accent">
                      {service.number}
                    </span>
                    <span className="text-black/20 font-mono">/</span>
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold text-ink">
                      {meta.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono text-ink-muted">
                      {meta.timeline}
                    </span>
                  </div>
                </div>

                {/* Two-Column Editorial Spread */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 items-start">
                  {/* Left Column: Title, Tagline & Deep Narrative */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-sm font-semibold text-accent font-sans">
                        {service.shortDesc}
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-normal">
                      {service.fullDesc}
                    </p>

                    <div className="pt-2">
                      <a
                        href="#contact"
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-black/[0.04] hover:bg-black text-ink hover:text-white text-xs font-semibold font-mono transition-all duration-200"
                      >
                        <span>Discuss Scope &amp; Timeline</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Architectural Deliverables & Stack */}
                  <div className="lg:col-span-7 space-y-6 lg:pl-8 lg:border-l lg:border-black/[0.08]">
                    {/* Deliverables Grid */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-widest text-ink-muted font-semibold">
                          Deliverables &amp; Core Output
                        </span>
                        <span className="text-[11px] font-mono text-accent font-medium">
                          Turnkey Handover
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.deliverables.map((item, i) => {
                          const parsed = parseDeliverable(item);
                          return (
                            <div
                              key={i}
                              className="p-4 rounded-2xl bg-[#FAF9F5] border border-black/[0.06] hover:border-black/15 hover:bg-white transition-all space-y-1"
                            >
                              <div className="flex items-start space-x-2">
                                <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                                <span className="text-xs font-bold text-ink block leading-snug">
                                  {parsed.title}
                                </span>
                              </div>
                              {parsed.detail && (
                                <p className="text-[11px] text-ink-muted pl-5 leading-normal">
                                  {parsed.detail}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="space-y-2 pt-2 border-t border-black/[0.06]">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block">
                        Technologies &amp; Architecture
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {service.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-[#F6F3EB] border border-black/[0.06] text-ink"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Collaboration Callout Banner */}
        <div className="p-8 sm:p-12 rounded-3xl sm:rounded-4xl bg-[#121211] text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold flex items-center justify-center sm:justify-start space-x-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Engagements</span>
            </span>
            <h4 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Have a custom project or technical audit in mind?
            </h4>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              Direct access with zero intermediaries. We define clear milestones, PRD specifications, and launch on schedule.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 px-6 py-3.5 rounded-full bg-accent text-white font-semibold text-xs hover:bg-white hover:text-black transition-all duration-300 shadow-md flex items-center space-x-2"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
