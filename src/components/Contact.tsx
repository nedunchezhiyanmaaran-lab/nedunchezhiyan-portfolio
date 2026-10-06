import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Mail, Clock, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LottiePlayer } from './LottiePlayer';
import { SUCCESS_CELEBRATION_LOTTIE } from '../data/localLottieData';
import { saveLeadSubmission } from '../utils/analytics';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState('Web Application');
  const [customBudget, setCustomBudget] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '$3k - $8k',
    message: '',
  });

  const email = 'nedunchezhiyanmaaran@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Save lead to persistent CRM telemetry store
    saveLeadSubmission({
      name: formData.name,
      email: formData.email,
      projectType: selectedProjectType,
      budget: customBudget ? customBudget : formData.budget,
      timeline: '2-4 Weeks',
      message: formData.message + (formData.company ? ` (Company: ${formData.company})` : ''),
    });

    setFormSubmitted(true);
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#E84E25', '#141413', '#F2EFE8'],
      });
    } catch {
      // ignore
    }
  };

  const projectTypes = [
    'Web Application',
    'SaaS MVP',
    'Business Website',
    'Full Stack System',
    'AI Integration',
  ];

  return (
    <section id="contact" className="bg-white border-b border-black/[0.08] py-28 sm:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header Label */}
        <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-16">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs uppercase tracking-widest text-accent font-bold font-mono">
            05 &middot; Start a Project
          </span>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Direct Narrative */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <h2 className="text-section-title font-bold tracking-tight text-ink font-display leading-[0.96]">
              Have something <br />
              <span className="font-serif italic font-normal text-accent">worth building?</span>
            </h2>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-normal">
              Tell me what you&apos;re working on. Whether you need a web platform built from scratch or high-impact full-stack execution, let&apos;s talk specifics.
            </p>
          </div>

          {/* Email Copy Card */}
          <div className="p-6 rounded-3xl bg-white border border-black/[0.08] shadow-sm space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block">
              Direct Inbox
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs sm:text-sm font-bold text-ink truncate select-all">
                {email}
              </span>
              <button
                onClick={copyEmail}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#FBF9F5] border border-black/10 text-ink hover:bg-black hover:text-white transition-all text-xs font-semibold shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Availability Details */}
          <div className="space-y-3 text-xs text-ink-secondary">
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-accent" />
              <span>Typical response time: Within 12 hours</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-accent" />
              <span>Accepting freelance contracts &amp; fixed-scope builds</span>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/nedunchezhiyan-a-aa6a42425"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-black/10 text-xs font-semibold text-ink hover:bg-black hover:text-white transition-all shadow-sm"
            >
              <span>LinkedIn Profile</span>
              <span className="text-accent">&rarr;</span>
            </a>
            <a
              href="https://github.com/nedunchezhiyanmaaran-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-black/10 text-xs font-semibold text-ink hover:bg-black hover:text-white transition-all shadow-sm"
            >
              <span>GitHub Repositories</span>
              <span className="text-accent">&rarr;</span>
            </a>
          </div>
        </div>

        {/* Right Column: Sleek Studio Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl sm:rounded-4xl bg-white border border-black/[0.08] shadow-sm">
          <AnimatePresence mode="wait">
            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 text-center space-y-5"
              >
                <div className="w-32 h-32 mx-auto flex items-center justify-center">
                  <LottiePlayer
                    animationData={SUCCESS_CELEBRATION_LOTTIE}
                    loop={false}
                    className="w-full h-full"
                    fallbackIcon={
                      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                        <Check className="w-8 h-8" />
                      </div>
                    }
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                    Inquiry Received!
                  </h3>
                  <p className="text-sm text-ink-secondary max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-ink">{formData.name}</strong>. I will review your project requirements and follow up with technical recommendations within 12 hours.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setCustomBudget('');
                    setFormData({ name: '', email: '', company: '', budget: '$3k - $8k', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full border border-black/15 text-xs font-semibold text-ink hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  Send another inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Project Classification Chips */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-widest text-ink font-semibold block">
                    Project Classification
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setSelectedProjectType(type)}
                        className={`px-4 py-2 rounded-full text-xs transition-all duration-200 ${
                          selectedProjectType === type
                            ? 'bg-ink text-white font-semibold shadow-sm'
                            : 'bg-[#FBF9F5] hover:bg-black/5 text-ink-secondary border border-black/[0.06]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-ink-secondary block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-black/[0.08] text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-ink-secondary block">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-black/[0.08] text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-ink-secondary block">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Studio"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-black/[0.08] text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-ink-secondary block">
                      Estimated Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-black/[0.08] text-ink text-sm focus:outline-none focus:border-accent transition-colors cursor-pointer"
                    >
                      <option value="<$3k">&lt; $3,000</option>
                      <option value="$3k - $8k">$3,000 – $8,000</option>
                      <option value="$8k - $15k">$8,000 – $15,000</option>
                      <option value=">$15k">$15,000+</option>
                      <option value="custom">Custom / Other Amount</option>
                    </select>

                    {formData.budget === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-2"
                      >
                        <input
                          type="text"
                          placeholder="Specify custom budget (e.g. $25,000 or Retainer)"
                          value={customBudget}
                          onChange={(e) => setCustomBudget(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-accent text-ink placeholder:text-ink-faint text-xs focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-ink-secondary block">
                    Project Vision &amp; Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Briefly describe what you are building, target delivery date, and existing infrastructure..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FBF9F5] border border-black/[0.08] text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-ink text-[#FAF9F5] text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 hover:bg-accent transition-all duration-300 shadow-md hover:scale-[1.01]"
                >
                  <span>Submit Project Inquiry</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </section>
  );
};
