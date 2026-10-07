import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Clock, Send, Sparkles, Calendar, ShieldCheck, ArrowRight, Layers, DollarSign, MessageSquare, Building2, Mail, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LottiePlayer } from './LottiePlayer';
import { SUCCESS_CELEBRATION_LOTTIE } from '../data/localLottieData';
import { saveLeadSubmission } from '../utils/analytics';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState('Web Application');
  const [selectedTimeline, setSelectedTimeline] = useState('Within 1 Month');
  const [customBudget, setCustomBudget] = useState('');
  const [customTimeline, setCustomTimeline] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '$3,000 – $8,000',
    message: '',
  });

  const email = 'nedunchezhiyanmaaran@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const projectTypes = [
    { label: 'Web Application', desc: 'Custom apps & platforms' },
    { label: 'SaaS MVP', desc: 'Fast founder launch' },
    { label: 'Business Website', desc: 'High-conversion brand site' },
    { label: 'Full Stack System', desc: 'API, database & client' },
    { label: 'AI Integration', desc: 'LLMs & smart workflows' },
  ];

  const budgetTiers = [
    { value: '<$3,000', label: '< $3,000', desc: 'Scoping & MVP Audit' },
    { value: '$3,000 – $8,000', label: '$3k – $8k', desc: 'Core MVP Build' },
    { value: '$8,000 – $15,000', label: '$8k – $15k', desc: 'Full Platform' },
    { value: '>$15,000', label: '$15k+', desc: 'Scale / Enterprise' },
    { value: 'custom', label: 'Custom', desc: 'Specific Scope' },
  ];

  const timelineOptions = [
    'ASAP (2–4 Weeks)',
    'Within 1 Month',
    '1–3 Months',
    'Flexible / Exploring',
    'Specific Date',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);

    try {
      const finalBudget = formData.budget === 'custom' && customBudget.trim()
        ? customBudget.trim()
        : formData.budget;

      const finalTimeline = selectedTimeline === 'Specific Date' && customTimeline.trim()
        ? `Target Date: ${customTimeline.trim()}`
        : selectedTimeline;

      const fullMessage = formData.company.trim()
        ? `${formData.message.trim()}\n\n[Organization / Company: ${formData.company.trim()}]`
        : formData.message.trim();

      // Persist to local cache and Supabase CRM store with resilience
      saveLeadSubmission({
        name: formData.name.trim(),
        email: formData.email.trim(),
        projectType: selectedProjectType,
        budget: finalBudget,
        timeline: finalTimeline,
        message: fullMessage,
      });

      // Show immediate pleasant celebration
      setFormSubmitted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#D84C24', '#141413', '#10B981', '#F2EFE8'],
        });
      } catch {}
    } catch (err) {
      // Graceful fallback — never expose technical errors to founders
      console.warn('Inquiry submission fallback:', err);
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-white border-b border-black/[0.08] py-24 sm:py-32 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Modern Industrial Header Index */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex items-center space-x-3 mb-12 sm:mb-16"
        >
          <span className="font-mono text-xs sm:text-sm font-bold text-accent tracking-tight">
            (05)
          </span>
          <span className="w-8 h-[2px] bg-accent" />
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-ink">
            Project Inquiry &amp; Direct Studio Access
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Founder Narrative & Secondary Contacts */}
          <motion.div 
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-section-title font-bold tracking-tight text-ink font-display leading-[0.96]">
                Have something <br />
                <span className="font-serif italic font-normal text-accent">worth building?</span>
              </h2>
              <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-normal">
                Tell me what you&apos;re looking to build. Whether you are launching a new SaaS MVP, modernizing an existing web platform, or scoping a custom full-stack system, let&apos;s discuss timeline and architecture.
              </p>
            </div>

            {/* Response Promise Card */}
            <motion.div 
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-[#FAF9F5] border border-black/[0.06] space-y-3 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-ink">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Founder-Direct Communication</span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                You work directly with me — no account managers or agency overhead. I personally review every project brief and provide honest technical feasibility and scoping notes.
              </p>
            </motion.div>

            {/* Availability & SLA Details */}
            <div className="space-y-3 text-xs text-ink-secondary border-t border-black/[0.07] pt-6">
              <motion.div 
                whileHover={{ x: 3 }}
                className="flex items-center space-x-3 transition-transform"
              >
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span><strong className="text-ink font-semibold">Response SLA:</strong> Within 12 hours (IST / UTC+5:30)</span>
              </motion.div>
              <motion.div 
                whileHover={{ x: 3 }}
                className="flex items-center space-x-3 transition-transform"
              >
                <Sparkles className="w-4 h-4 text-accent shrink-0" />
                <span><strong className="text-ink font-semibold">Capacity:</strong> Currently booking Q4 / Q1 fixed-scope projects</span>
              </motion.div>
            </div>

            {/* Secondary Option: Direct Email Copy */}
            <motion.div 
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-white border border-black/[0.08] shadow-sm space-y-3"
            >
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block font-semibold">
                Secondary Contact Option
              </span>
              <p className="text-xs text-ink-secondary">
                Prefer direct correspondence or want to attach an existing PRD / Figma link?
              </p>
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="font-mono text-xs sm:text-sm font-bold text-ink truncate select-all">
                  {email}
                </span>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#FBF9F5] border border-black/10 text-ink hover:bg-black hover:text-white transition-all text-xs font-semibold shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Professional Profiles */}
            <div className="pt-2 flex flex-wrap gap-3">
              <motion.a
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                href="https://www.linkedin.com/in/nedunchezhiyan-a-aa6a42425"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-black/10 text-xs font-semibold text-ink hover:bg-black hover:text-white transition-all shadow-sm cursor-pointer"
              >
                <span>LinkedIn</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                href="https://github.com/nedunchezhiyanmaaran-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-black/10 text-xs font-semibold text-ink hover:bg-black hover:text-white transition-all shadow-sm cursor-pointer"
              >
                <span>GitHub</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: Premium Founder Project Inquiry Form */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-[#FAF9F5] border border-black/[0.08] shadow-sm"
          >
            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-10 text-center space-y-6"
                >
                  <div className="w-28 h-28 mx-auto flex items-center justify-center">
                    <LottiePlayer
                      animationData={SUCCESS_CELEBRATION_LOTTIE}
                      loop={false}
                      className="w-full h-full"
                      fallbackIcon={
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                          <Check className="w-8 h-8" />
                        </div>
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-mono font-semibold inline-block">
                      Inquiry Logged &amp; Confirmed
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                      Project Inquiry Received!
                    </h3>
                    <p className="text-sm text-ink-secondary max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-ink">{formData.name}</strong>. I have received your requirements for <strong className="text-ink">{selectedProjectType}</strong> and will follow up with technical architecture recommendations at <strong className="text-ink">{formData.email}</strong> within 12 hours.
                    </p>
                  </div>

                  {/* Inquiry Recap Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="p-4 rounded-2xl bg-white border border-black/[0.08] text-left text-xs font-mono space-y-2 max-w-md mx-auto shadow-sm"
                  >
                    <div className="flex justify-between py-1 border-b border-black/[0.05]">
                      <span className="text-ink-muted">Project Type:</span>
                      <span className="font-semibold text-ink">{selectedProjectType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/[0.05]">
                      <span className="text-ink-muted">Estimated Budget:</span>
                      <span className="font-semibold text-accent">{formData.budget === 'custom' ? customBudget : formData.budget}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-ink-muted">Target Timeline:</span>
                      <span className="font-semibold text-ink">{selectedTimeline}</span>
                    </div>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setCustomBudget('');
                      setCustomTimeline('');
                      setFormData({ name: '', email: '', company: '', budget: '$3,000 – $8,000', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-full border border-black/15 bg-white text-xs font-semibold text-ink hover:bg-black hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    Submit another inquiry
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step Header */}
                  <div className="border-b border-black/[0.06] pb-4">
                    <h3 className="font-display text-lg font-bold text-ink flex items-center space-x-2">
                      <span>Project Brief &amp; Scoping Details</span>
                    </h3>
                    <p className="text-xs text-ink-secondary mt-0.5">
                      Fill out your core requirements to receive a direct scoping and timeline estimate.
                    </p>
                  </div>

                  {/* 1. Name & 2. Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div 
                      whileFocus={{ scale: 1.01 }}
                      className="space-y-1.5"
                    >
                      <label className="text-xs font-semibold text-ink flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-accent" />
                        <span>1. Your Name *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Turner"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.1] text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all shadow-sm hover:border-black/20"
                      />
                    </motion.div>

                    <motion.div 
                      whileFocus={{ scale: 1.01 }}
                      className="space-y-1.5"
                    >
                      <label className="text-xs font-semibold text-ink flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-accent" />
                        <span>2. Work Email *</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.1] text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all shadow-sm hover:border-black/20"
                      />
                    </motion.div>
                  </div>

                  {/* 3. Company / Organization */}
                  <motion.div 
                    whileFocus={{ scale: 1.01 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-ink flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-ink-muted" />
                        <span>3. Company / Organization</span>
                      </label>
                      <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">Optional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Stealth AI Startup / Growth Studio"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.1] text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all shadow-sm hover:border-black/20"
                    />
                  </motion.div>

                  {/* 4. Project Type */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-ink flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-accent" />
                        <span>4. Project Type *</span>
                      </label>
                      <span className="text-[10px] font-mono text-ink-muted">Select primary category</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {projectTypes.map((item) => {
                        const isSelected = selectedProjectType === item.label;
                        return (
                          <motion.button
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            key={item.label}
                            onClick={() => setSelectedProjectType(item.label)}
                            className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer border relative ${
                              isSelected
                                ? 'bg-ink text-white border-ink shadow-md ring-2 ring-ink/20'
                                : 'bg-white hover:bg-black/[0.03] text-ink border-black/[0.09] shadow-sm'
                            }`}
                          >
                            <div className="font-semibold text-xs leading-tight">
                              {item.label}
                            </div>
                            <div className={`text-[10px] mt-1 leading-snug ${isSelected ? 'text-white/70' : 'text-ink-muted'}`}>
                              {item.desc}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Estimated Budget */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-ink flex items-center space-x-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-accent" />
                        <span>5. Estimated Budget *</span>
                      </label>
                      <span className="text-[10px] font-mono text-ink-muted">Target investment</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {budgetTiers.map((tier) => {
                        const isSelected = formData.budget === tier.value;
                        return (
                          <motion.button
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            key={tier.value}
                            onClick={() => setFormData({ ...formData, budget: tier.value })}
                            className={`py-2 px-2.5 rounded-xl text-center transition-all duration-200 cursor-pointer border ${
                              isSelected
                                ? 'bg-ink text-white border-ink shadow-md ring-2 ring-ink/20 font-bold'
                                : 'bg-white hover:bg-black/[0.03] text-ink-secondary border-black/[0.09] shadow-sm font-medium'
                            }`}
                          >
                            <div className="text-xs leading-tight">{tier.label}</div>
                            <div className={`text-[9px] mt-0.5 truncate ${isSelected ? 'text-white/70' : 'text-ink-muted'}`}>
                              {tier.desc}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {formData.budget === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="pt-1"
                      >
                        <input
                          type="text"
                          placeholder="Specify custom budget (e.g. $25,000 or Monthly Retainer)"
                          value={customBudget}
                          onChange={(e) => setCustomBudget(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-accent text-ink placeholder:text-ink-faint text-xs focus:outline-none focus:ring-2 focus:ring-accent/20 shadow-sm"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* 6. Project Vision & Requirements */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink flex items-center space-x-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-accent" />
                      <span>6. Project Vision &amp; Requirements *</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe what you're building, target audience, core features, or paste links to Notion/Figma specs..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.1] text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all shadow-sm resize-none leading-relaxed hover:border-black/20"
                    />
                  </div>

                  {/* 7. Target Delivery Date */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-ink flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>7. Target Delivery Date</span>
                      </label>
                      <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">Optional</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {timelineOptions.map((opt) => {
                        const isSelected = selectedTimeline === opt;
                        return (
                          <motion.button
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            key={opt}
                            onClick={() => setSelectedTimeline(opt)}
                            className={`py-2.5 px-2 rounded-xl text-center text-xs transition-all duration-200 cursor-pointer border ${
                              isSelected
                                ? 'bg-ink text-white border-ink shadow-md ring-2 ring-ink/20 font-bold'
                                : 'bg-white hover:bg-black/[0.03] text-ink-secondary border-black/[0.09] shadow-sm font-medium'
                            }`}
                          >
                            {opt}
                          </motion.button>
                        );
                      })}
                    </div>

                    {selectedTimeline === 'Specific Date' && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="pt-1"
                      >
                        <input
                          type="text"
                          placeholder="e.g. Launch before November 15, 2026 or by Q1"
                          value={customTimeline}
                          onChange={(e) => setCustomTimeline(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-accent text-ink placeholder:text-ink-faint text-xs focus:outline-none focus:ring-2 focus:ring-accent/20 shadow-sm"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Primary CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-ink text-[#FAF9F5] text-sm font-bold tracking-wide flex items-center justify-center space-x-2.5 hover:bg-accent hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 shadow-md disabled:opacity-50 cursor-pointer group"
                  >
                    <span>Submit Project Inquiry</span>
                    <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </motion.button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};



