import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [istTime, setIstTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setIstTime(now.toLocaleTimeString('en-US', options) + ' IST (UTC+5:30)');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#121211] text-[#FAF9F5] pt-24 pb-14 border-t border-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Top Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 border-b border-white/10">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold block">
              Build &middot; Ship &middot; Elevate
            </span>
            <h2 className="text-section-title font-bold tracking-tight text-white font-display">
              NEDUNCHEZHIYAN
            </h2>
            <p className="text-sm text-white/70">
              Freelance Full Stack Developer &middot; Product Architect
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="space-y-1 font-mono text-xs">
              <span className="text-white/40 uppercase text-[10px] tracking-widest block font-bold">Local Time</span>
              <span className="text-white font-semibold">{istTime || '14:30:00 IST'}</span>
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all text-xs font-semibold text-white"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Nav Links */}
        <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm text-white/70">
          <div className="space-y-3">
            <span className="text-white font-bold text-xs uppercase tracking-wider block font-mono">
              Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li><a href="#work" className="hover:text-white transition-colors">01. Selected Work</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">02. Services &amp; Capabilities</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">03. About &amp; Architecture</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">04. Methodology</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">05. Contact</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-white font-bold text-xs uppercase tracking-wider block font-mono">
              Live Projects
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://travel-agency-kohl-three.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex items-center space-x-1"
                >
                  <span>Roamora Travel</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://jameen-xi.vercel.app/customer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex items-center space-x-1"
                >
                  <span>Jameen Dining</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://acme-crm-frontend.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex items-center space-x-1"
                >
                  <span>AcmeCRM Platform</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-white font-bold text-xs uppercase tracking-wider block font-mono">
              Connect
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/nedunchezhiyanmaaran-lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-2"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/nedunchezhiyan-a-aa6a42425"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center space-x-2"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:nedunchezhiyanmaaran@gmail.com"
                  className="hover:text-white transition-colors flex items-center space-x-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-white font-bold text-xs uppercase tracking-wider block font-mono">
              System &amp; Admin
            </span>
            <p className="text-xs text-white/50 leading-relaxed">
              Crafted with Instrument Sans &amp; Plus Jakarta Sans. Real-time telemetry engine active.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin || (() => { window.location.hash = 'admin'; })}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-accent text-white text-xs font-mono transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:bg-white animate-pulse" />
                <span>Admin Analytics &rarr;</span>
              </button>
            </div>
            <span className="text-[11px] text-white/40 block pt-1 font-mono">
              &copy; {new Date().getFullYear()} Nedunchezhiyan. (Ctrl+Shift+A)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
