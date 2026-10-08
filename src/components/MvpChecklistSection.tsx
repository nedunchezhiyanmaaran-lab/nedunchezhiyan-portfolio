import React, { useState } from 'react';
import { Sparkles, ChevronDown, Copy, Check, ShieldAlert, Download } from 'lucide-react';
import { logAnalyticsEvent } from '../utils/analytics';

interface MvpChecklistSectionProps {
  onOpenChecklistModal?: () => void;
}

interface ChecklistItemData {
  num: string;
  title: string;
  question: string;
  ruleOfThumb: string;
  trapToAvoid: string;
  example: string;
}

const CHECKLIST_ITEMS: ChecklistItemData[] = [
  {
    num: '01',
    title: 'Hyper-Specific User Definition',
    question: 'Who is the user? (one sentence)',
    ruleOfThumb: 'If you say "anyone" or "small businesses", you will build for no one. Pick one specific persona in one specific role with one daily headache.',
    trapToAvoid: 'Targeting multiple personas in V1 (e.g. both Buyers and Sellers). Start on the supply or demand bottleneck first.',
    example: '"Solo freelance developers managing 3+ concurrent client contracts with zero project manager."',
  },
  {
    num: '02',
    title: 'The Single Value Transaction',
    question: 'What is the ONE job your product does?',
    ruleOfThumb: 'Every high-converting MVP solves ONE painful bottleneck 10x faster than spreadsheets or messy Slack threads.',
    trapToAvoid: 'Building a multi-tool "operating system" before validating that users will pay for a single knife.',
    example: '"Transforms raw Figma wireframes into clean, validated Tailwind React components in 10 seconds."',
  },
  {
    num: '03',
    title: 'Screen Budget Limitation',
    question: 'What screens does the user see? (more than 5–6 means scope is bloated)',
    ruleOfThumb: 'A lean MVP strictly requires only 4 core views: 1) Clean Landing/Auth, 2) The Core Action Canvas, 3) Results/Dashboard, 4) Account Settings.',
    trapToAvoid: 'Designing 15 secondary screens (help centers, nested settings, profile customizers) before launching.',
    example: 'Screen 1: Upload spec. Screen 2: Real-time generation stream. Screen 3: Copy code & export.',
  },
  {
    num: '04',
    title: 'Ruthless Feature Elimination',
    question: 'What are the must-haves, and what can wait until later?',
    ruleOfThumb: 'If removing a proposed feature does not prevent the primary value transaction from completing, delete it from V1 immediately.',
    trapToAvoid: 'Confusing "nice to have when we have 1,000 users" with "needed to get our first 5 paying users".',
    example: 'Must-have: Instant JSON export. Wait for V2: Team collaboration workspaces & audit logs.',
  },
  {
    num: '05',
    title: 'The Concierge / Manual Shortcut',
    question: 'What can be done manually at first? (onboarding, invoices, approvals)',
    ruleOfThumb: 'Do things that do not scale. Handling complex billing or user setup via manual email/Stripe invoices saves 3 weeks of custom backend code.',
    trapToAvoid: 'Building automated self-serve workflows before you even know your onboarding drop-off points.',
    example: 'Instead of building an automated payment portal, send a Stripe payment link manually after demo.',
  },
  {
    num: '06',
    title: 'Heavy Infrastructure Filter',
    question: 'Do you need any of these? Payments, user roles, admin panel, emails, integrations',
    ruleOfThumb: 'Each item in this list typically adds 3 to 7 days of edge-case handling. Only build what is required to prove market demand.',
    trapToAvoid: 'Building multi-role permissions (Admin, Editor, Viewer, Guest) for a product with 0 teams signed up.',
    example: 'Keep single-user auth via Magic Link; skip custom RBAC until enterprise pilots request it.',
  },
  {
    num: '07',
    title: '30-Day Quantifiable Victory Metric',
    question: 'How will you know it worked in 30 days?',
    ruleOfThumb: 'Define a single binary metric before writing code (e.g. 5 paying customers, 25 weekly active users, or 50 completed workflows).',
    trapToAvoid: 'Vague vanity metrics like "1,000 page views" or "positive feedback from friends".',
    example: '"5 design agencies use the tool weekly to export at least 10 production screens."',
  },
  {
    num: '08',
    title: 'The Iron Triangle Constraint',
    question: 'What is fixed: budget or deadline?',
    ruleOfThumb: 'If the deadline is fixed (e.g. launch before end of month), cut feature scope. If budget is fixed, prioritize high-impact core architecture first.',
    trapToAvoid: 'Believing you can fix deadline, budget, and infinite scope simultaneously without burning out or shipping buggy code.',
    example: '"Fixed launch date in 3 weeks; whatever is not working by day 16 gets cut from the V1 release."',
  },
];

export const MvpChecklistSection: React.FC<MvpChecklistSectionProps> = ({
  onOpenChecklistModal,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyPrompt = (item: ChecklistItemData, index: number) => {
    const textToCopy = `Question #${item.num}: ${item.question}\nMy Answer: [Write here]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(index);
    logAnalyticsEvent('section_read', `📋 Checklist: Copied Question #${item.num}`);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleTriggerModal = () => {
    logAnalyticsEvent('section_read', '📋 Clicked Get Scoping Checklist Modal');
    if (onOpenChecklistModal) {
      onOpenChecklistModal();
    }
  };

  return (
    <section id="checklist" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 border-t border-black/[0.08] bg-[#FAF8F3] relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-sans font-semibold tracking-normal">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Founder Architecture Blueprint</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink tracking-tight leading-[1.1]">
              Free MVP Scoping Framework
            </h2>

            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
              Before hiring an agency or writing code, filter your product through these 8 engineering principles to avoid scope creep and launch in weeks, not months.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleTriggerModal}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white border border-black/15 text-ink hover:border-accent hover:text-accent font-sans text-xs font-semibold transition-all shadow-sm group"
            >
              <span>Get Free PDF Checklist</span>
              <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-accent" />
            </button>
          </div>
        </div>

        {/* The 8 Checklist Principles */}
        <div className="space-y-3.5">
          {CHECKLIST_ITEMS.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={item.num}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-white border-accent shadow-sm'
                    : 'bg-white/80 border-black/10 hover:border-black/25'
                }`}
              >
                {/* Item Header */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start space-x-3.5">
                    <span className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/25 text-accent font-sans text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {item.num}
                    </span>

                    <div className="space-y-1">
                      <span className="text-xs font-sans text-accent font-semibold block">
                        {item.title}
                      </span>
                      <h3 className="font-display font-bold text-ink text-base sm:text-lg leading-snug tracking-tight">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center text-ink-secondary hover:text-ink shrink-0 mt-1"
                    aria-label="Toggle Details"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-accent' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Expandable Pro-Tip & Rule of Thumb */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 space-y-3.5 border-t border-black/[0.06] text-xs sm:text-sm font-sans animate-in fade-in duration-200">
                    {/* Rule of thumb */}
                    <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-black/10 space-y-1">
                      <div className="text-xs font-sans text-accent font-semibold">
                        ⚡ Engineer&apos;s Rule of Thumb
                      </div>
                      <p className="text-ink-secondary leading-relaxed">
                        {item.ruleOfThumb}
                      </p>
                    </div>

                    {/* Trap to Avoid */}
                    <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-black/10 space-y-1 text-ink">
                      <div className="text-xs font-sans text-accent font-semibold flex items-center space-x-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-accent" />
                        <span>Common Scope Trap to Avoid</span>
                      </div>
                      <p className="text-ink-secondary leading-relaxed text-xs">
                        {item.trapToAvoid}
                      </p>
                    </div>

                    {/* Example & Copy */}
                    <div className="text-xs text-ink-secondary font-sans leading-relaxed pl-1 flex items-center justify-between">
                      <span>Example: <strong className="text-ink font-semibold">{item.example}</strong></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPrompt(item, idx);
                        }}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-black/5 hover:bg-accent hover:text-white text-ink text-xs font-sans font-medium transition-colors shrink-0 ml-2"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-accent" />
                            <span className="text-accent font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};


