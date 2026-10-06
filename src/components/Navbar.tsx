import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  onContactClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'py-4 bg-[#FBF9F5]/85 backdrop-blur-md border-b border-black/[0.06]' : 'py-7 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Wordmark */}
          <a href="#" className="group flex items-center space-x-2 focus:outline-none">
            <span className="w-2.5 h-2.5 rounded-full bg-accent group-hover:scale-125 transition-transform duration-300" />
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-ink group-hover:text-accent transition-colors">
              NEDUNCHEZHIYAN
            </span>
            <span className="hidden md:inline-block font-serif italic text-sm text-ink-secondary ml-1">
              / full stack developer
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-9 text-sm font-medium text-ink-secondary">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="link-editorial hover:text-ink transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTA & Mobile Trigger */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onContactClick}
              className="hidden sm:inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-ink text-[#FAF9F5] text-xs font-semibold tracking-wide hover:bg-accent hover:scale-[1.02] transition-all duration-300 shadow-sm"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-black/5 text-ink transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#FBF9F5] pt-28 px-8 flex flex-col justify-between pb-10 md:hidden"
          >
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-ink-muted block font-mono">
                Index
              </span>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display text-3xl font-bold tracking-tight text-ink hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-3 pt-6 border-t border-black/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onContactClick();
                }}
                className="w-full py-4 rounded-full bg-ink text-[#FAF9F5] font-semibold text-sm flex items-center justify-center space-x-2"
              >
                <span>Let&apos;s Build Together</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <p className="text-center text-xs text-ink-muted">
                Available for worldwide remote contracts &amp; MVPs
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
