import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Send,
  Sparkles,
  AlertCircle,
  FileText,
  ChevronDown,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitChecklistForm } from '../lib/api';
import { logAnalyticsEvent } from '../utils/analytics';
import { downloadChecklistPdf } from '../utils/generatePdf';

interface ChecklistPageProps {
  onBackToHome: () => void;
  onNavigateToContact?: () => void;
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

export const ChecklistPage: React.FC<ChecklistPageProps> = ({
  onBackToHome,
}) => {
  const [refSource, setRefSource] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState('');
  const [honeypot, setHoneypot] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Read ?ref= or ?source= from URL
    try {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref') || params.get('source') || params.get('utm_source');
      if (refParam) {
        setRefSource(refParam.trim());
      }
    } catch {
      // Ignore
    }

    // Scroll to top on load
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client validation
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!idea.trim()) {
      setErrorMsg('Please describe what you are building in one sentence.');
      return;
    }

    setIsLoading(true);

    const result = await submitChecklistForm({
      name,
      email,
      idea,
      ref: refSource,
      honeypot,
    });

    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      logAnalyticsEvent('contact_submit', `📋 Checklist Lead Captured: ${name} (${refSource || 'Direct'})`, email);
      
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#D84C24', '#141413', '#FBF9F5', '#10B981'],
        });
      } catch {
        // Ignore
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMsg(result.error || 'Failed to submit. Please try again.');
    }
  };

  const handleDownloadPdf = () => {
    downloadChecklistPdf({
      founderName: name.trim() || undefined,
      projectIdea: idea.trim() || undefined,
    });
    logAnalyticsEvent('section_read', '📋 Downloaded MVP Scoping PDF Document');
  };

  const handleCopyPrompt = (item: ChecklistItemData, index: number) => {
    const textToCopy = `Question #${item.num}: ${item.question}\nMy Answer: [Write here]\nProject: ${idea || 'My MVP'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-ink py-10 px-4 sm:px-6 lg:px-10 selection:bg-accent selection:text-white font-sans">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto mb-8 print:hidden flex items-center justify-between border-b border-black/[0.08] pb-4">
        <button
          onClick={onBackToHome}
          className="group inline-flex items-center space-x-2 text-xs font-sans text-ink-secondary hover:text-accent font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-accent" />
          <span>Back to Main Portfolio</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-sans tracking-normal text-ink-secondary font-semibold">
            NEDUNCHEZHIYAN · PRODUCT ARCHITECTURE
          </span>
        </div>
      </div>

      {/* Main Layout */}
      <main className="max-w-4xl mx-auto space-y-8">
        {/* Header Framing */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-sans font-semibold tracking-normal">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Founder Scoping Blueprint</span>
            {refSource && (
              <span className="text-ink-muted text-xs font-normal border-l border-black/15 pl-2 lowercase">
                ref: {refSource}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink tracking-tight leading-[1.1]">
            Cut until it hurts, <br />
            <span className="text-accent">
              then ship in 14 days.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
            Most first-time founders burn months of runway building secondary features nobody asked for. Use this 8-point engineering framework to isolate your product&apos;s true core.
          </p>
        </div>

        {/* Content Box */}
        <div className="w-full">
            {!isSubmitted ? (
              /* ================= STEP 1: LEAD CAPTURE FORM ================= */
              <div className="p-6 sm:p-10 rounded-3xl bg-white border border-black/10 shadow-[0_20px_50px_rgba(20,20,19,0.06)] space-y-8 animate-in fade-in duration-300">
                
                <div className="space-y-2 border-b border-black/[0.08] pb-5">
                  <span className="text-xs font-sans text-accent font-semibold block">
                    Step 1 of 1 · Instant Access
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
                    Unlock the Scoping Blueprint
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                    Fill out the 3 quick details below to view the interactive checklist and scoping rules instantly on screen.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-accent text-ink text-xs font-sans flex items-center space-x-3">
                    <AlertCircle className="w-4 h-4 shrink-0 text-accent" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot Spam Filter */}
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

                  {/* Field 1: Name */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-sans text-ink font-semibold">
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
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF8F3] border border-black/10 text-ink placeholder:text-ink-muted text-sm font-sans focus:outline-none focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>

                  {/* Field 2: Email */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-sans text-ink font-semibold">
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
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF8F3] border border-black/10 text-ink placeholder:text-ink-muted text-sm font-sans focus:outline-none focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>

                  {/* Field 3: Idea */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-sans text-ink font-semibold">
                      <span>03. What are you building? (one sentence)</span>
                      <span className="text-accent">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. An automated invoicing tool for freelance designers that syncs Stripe receipts to Notion..."
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF8F3] border border-black/10 text-ink placeholder:text-ink-muted text-sm font-sans focus:outline-none focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-2xl bg-accent text-white font-sans font-semibold text-sm hover:bg-ink hover:text-white transition-all duration-300 shadow-md flex items-center justify-center space-x-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Unlocking Scoping Blueprint...</span>
                      </>
                    ) : (
                      <>
                        <span>Send me the checklist</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs font-sans text-ink-muted">
                    🔒 Zero spam guarantee. Instant access on this screen immediately.
                  </p>
                </form>
              </div>
            ) : (
              /* ================= STEP 2: UNLOCKED CHECKLIST ================= */
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Success Banner */}
                <div className="p-5 rounded-2xl bg-white border border-accent/30 flex items-center justify-between gap-4 print:hidden shadow-xs">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-xs sm:text-sm font-sans text-ink">
                      Checklist unlocked for <strong>{name}</strong>! Your concept has been saved.
                    </span>
                  </div>

                  <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-white hover:bg-ink font-sans text-xs font-semibold transition-colors shrink-0 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>Download PDF</span>
                  </button>
                </div>

                {/* Checklist Document Card */}
                <div className="p-6 sm:p-9 rounded-3xl bg-white border border-black/10 shadow-[0_20px_50px_rgba(20,20,19,0.06)] space-y-6 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
                  
                  {/* Document Header */}
                  <div className="space-y-3 pb-5 border-b border-black/[0.08] print:border-black/20">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-sans font-semibold print:border-black print:text-black">
                        <FileText className="w-3.5 h-3.5" />
                        <span>The 8 Core MVP Principles</span>
                      </div>
                      <span className="text-xs font-sans text-ink-secondary print:text-black/60">
                        Founder: <strong className="text-ink font-semibold">{name}</strong>
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink print:text-black tracking-tight">
                      Free MVP Scoping Framework
                    </h2>

                    {idea && (
                      <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-black/[0.08] text-xs font-sans text-ink-secondary print:text-black">
                        &ldquo;{idea}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* The 8 Questions with Modern Western Editorial Styling */}
                  <div className="space-y-3.5">
                    {CHECKLIST_ITEMS.map((item, idx) => {
                      const isExpanded = expandedIndex === idx;
                      return (
                        <div
                          key={item.num}
                          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                            isExpanded
                              ? 'bg-[#FAF8F3] border-accent shadow-sm'
                              : 'bg-white border-black/[0.08] hover:border-black/20'
                          } print:border-gray-200 print:bg-white`}
                        >
                          {/* Item Bar Header */}
                          <div
                            onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                            className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                          >
                            <div className="flex items-start space-x-3.5">
                              <span className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/25 text-accent font-sans text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 print:bg-gray-100 print:text-black">
                                {item.num}
                              </span>

                              <div className="space-y-1">
                                <span className="text-xs font-sans text-accent font-semibold block print:text-black">
                                  {item.title}
                                </span>
                                <h3 className="font-display font-bold text-ink print:text-black text-base sm:text-lg leading-snug tracking-tight">
                                  {item.question}
                                </h3>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center text-ink-secondary hover:text-ink shrink-0 mt-1 print:hidden"
                              aria-label="Toggle Details"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-accent' : ''
                                }`}
                              />
                            </button>
                          </div>

                          {/* Expandable Editorial Insight Section */}
                          {(isExpanded || typeof window === 'undefined') && (
                            <div className="px-5 pb-5 pt-1 space-y-3.5 border-t border-black/[0.06] text-xs sm:text-sm font-sans">
                              {/* Rule of thumb */}
                              <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] space-y-1">
                                <div className="text-xs font-sans text-accent font-semibold">
                                  ⚡ Engineer&apos;s Rule of Thumb
                                </div>
                                <p className="text-ink-secondary leading-relaxed">
                                  {item.ruleOfThumb}
                                </p>
                              </div>

                              {/* Trap to Avoid */}
                              <div className="p-3.5 rounded-xl bg-white border border-black/10 space-y-1 text-ink">
                                <div className="text-xs font-sans text-accent font-semibold flex items-center space-x-1.5">
                                  <ShieldAlert className="w-3.5 h-3.5 text-accent" />
                                  <span>Common Scope Trap to Avoid</span>
                                </div>
                                <p className="text-ink-secondary leading-relaxed text-xs">
                                  {item.trapToAvoid}
                                </p>
                              </div>

                              {/* Concrete Example */}
                              <div className="text-xs text-ink-secondary font-sans leading-relaxed pl-1 flex items-center justify-between">
                                <span>Example: <strong className="text-ink font-semibold">{item.example}</strong></span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyPrompt(item, idx);
                                  }}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-black/5 hover:bg-accent hover:text-white text-ink text-xs font-sans font-medium transition-colors shrink-0 ml-2 print:hidden"
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

                  {/* Print-Only Footer */}
                  <div className="hidden print:block pt-6 border-t border-black/20 text-xs font-sans text-black/60 text-center">
                    Nedunchezhiyan · Full-Stack Product Engineer · nedunchezhiyancdurai@gmail.com
                  </div>
                </div>

              </div>
            )}
          </div>
      </main>
    </div>
  );
};


