import React from 'react';
import { ShieldCheck, Terminal, Code2, Database, Cpu, Compass } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="bg-white border-b border-black/[0.08] py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Label */}
        <div className="flex items-center space-x-3 mb-16">
          <span className="font-mono text-xs sm:text-sm font-bold text-accent tracking-tight">
            (03)
          </span>
          <span className="w-8 h-[2px] bg-accent" />
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-ink">
            Product &amp; Architecture Philosophy
          </span>
        </div>

      {/* Editorial Spread Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Statement & Product Stance */}
        <div className="lg:col-span-6 space-y-10">
          <h2 className="text-section-title font-bold tracking-tight text-ink font-display leading-[0.98]">
            I don&apos;t just write code.{' '}
            <span className="text-accent block mt-2">
              I architect products that scale.
            </span>
          </h2>

          <div className="space-y-6 text-base sm:text-lg text-ink-secondary leading-relaxed font-normal">
            <p>
              I am Nedunchezhiyan, an independent Full Stack Developer with deep <strong className="text-ink font-semibold">product thinking, system architecture, and PRD formulation</strong> skills. I partner with founders, product leaders, and engineering teams to <strong className="text-ink font-semibold">build new web applications from scratch</strong> and <strong className="text-ink font-semibold">revamp, modernize, and scale existing products</strong>.
            </p>
            <p>
              Whether you need a rapid zero-to-one MVP launch, a complete UI/UX overhaul of a legacy dashboard, or deep performance optimization to remove technical debt, I draft concrete PRDs, model clean data schemas, design type-safe APIs, and deliver resilient software built for long-term growth.
            </p>
          </div>

          {/* Working Tenets */}
          <div className="pt-8 border-t border-black/[0.08] space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block">
              Core Principles
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <span className="text-accent font-bold font-mono text-xs block">01. PRD &amp; PRODUCT STRATEGY</span>
                <p className="text-ink-secondary text-xs leading-relaxed">
                  Clarify user personas, functional specs, and edge-cases upfront to guarantee smooth execution without scope creep.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-accent font-bold font-mono text-xs block">02. ROBUST ARCHITECTURE</span>
                <p className="text-ink-secondary text-xs leading-relaxed">
                  Type-safe frontend, modular APIs, resilient database schemas, and sub-second load times engineered from day one.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Full Technical & Product Competencies */}
        <div className="lg:col-span-6 space-y-10 lg:pl-10 lg:border-l lg:border-black/[0.08]">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted">
              Technical &amp; Product Disciplines
            </span>
            <h3 className="font-display text-2xl font-bold text-ink">
              End-to-end product execution stack.
            </h3>
          </div>

          <div className="space-y-7">
            {/* Product & Architecture Layer */}
            <div className="space-y-2 pb-5 border-b border-black/[0.06]">
              <div className="flex items-center space-x-2 text-sm text-ink font-bold font-display">
                <Compass className="w-4 h-4 text-accent" />
                <span>Product Strategy &amp; System Architecture</span>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed">
                PRD Drafting &middot; Information Architecture &middot; Data Flow Modeling &middot; User Journey Mapping &middot; API Contract Design &middot; Scalability Planning
              </p>
            </div>

            {/* Frontend Layer */}
            <div className="space-y-2 pb-5 border-b border-black/[0.06]">
              <div className="flex items-center space-x-2 text-sm text-ink font-bold font-display">
                <Code2 className="w-4 h-4 text-accent" />
                <span>Frontend &amp; Client Engineering</span>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed">
                React 18 &middot; Next.js 14 &middot; TypeScript &middot; Tailwind CSS &middot; Framer Motion &middot; TanStack Query &middot; Accessible Semantic HTML
              </p>
            </div>

            {/* Backend Layer */}
            <div className="space-y-2 pb-5 border-b border-black/[0.06]">
              <div className="flex items-center space-x-2 text-sm text-ink font-bold font-display">
                <Terminal className="w-4 h-4 text-accent" />
                <span>Backend &amp; API Engineering</span>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Node.js &middot; FastAPI (Python) &middot; Express &middot; RESTful APIs &middot; WebSockets &middot; Role-Based Authorization &amp; JWT
              </p>
            </div>

            {/* Database Layer */}
            <div className="space-y-2 pb-5 border-b border-black/[0.06]">
              <div className="flex items-center space-x-2 text-sm text-ink font-bold font-display">
                <Database className="w-4 h-4 text-accent" />
                <span>Database &amp; Persistence</span>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed">
                PostgreSQL &middot; Supabase (Auth, Storage, Realtime) &middot; MongoDB &middot; Prisma ORM &middot; Redis Cache
              </p>
            </div>

            {/* AI & Automation */}
            <div className="space-y-2 pb-5 border-b border-black/[0.06]">
              <div className="flex items-center space-x-2 text-sm text-ink font-bold font-display">
                <Cpu className="w-4 h-4 text-accent" />
                <span>AI Pipelines &amp; Workflows</span>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed">
                OpenAI &amp; Anthropic LLM Integration &middot; Vector Search &middot; RAG Pipelines &middot; Function Calling Tooling
              </p>
            </div>

            {/* Deployment & DevOps */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-ink font-bold font-display">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>DevOps &amp; Zero-Downtime Cloud</span>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Vercel &middot; Docker &middot; GitHub Actions CI/CD &middot; AWS S3 &middot; Lighthouse 95+ Audit Benchmarks
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};
