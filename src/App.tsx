import React, { useState, useEffect } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TechTicker } from './components/TechTicker';
import { SelectedWork } from './components/SelectedWork';
import { Services } from './components/Services';
import { About } from './components/About';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FeedbackWidget } from './components/FeedbackWidget';
import { PlaybookSection } from './components/PlaybookSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { initVisitorTracking, trackSectionView } from './utils/analytics';
import { initRefTracking, trackEvent } from './utils/sourceTracking';

export const App: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return window.location.hash === '#admin';
  });

  const [contactInitialMessage, setContactInitialMessage] = useState<string>('');

  useEffect(() => {
    // 1. Initialize source ref tracking (?ref=)
    initRefTracking();

    // 2. Track page_view event (once per session)
    trackEvent({ event: 'page_view' });

    // 3. Initialize session and heartbeat tracking
    const cleanup = initVisitorTracking();

    const handleLocationChange = () => {
      setIsAdminOpen(window.location.hash === '#admin');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut: Ctrl + Shift + A or Alt + A to toggle Admin Analytics
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('keydown', handleKeyDown);

    // Section scroll observer for analytics
    const sectionIds = ['work', 'checklist', 'services', 'about', 'process', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            trackSectionView(entry.target.id);
          }
        });
      },
      { threshold: 0.25 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      cleanup();
      observer.disconnect();
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToContact = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToWork = () => {
    const workElem = document.getElementById('work');
    if (workElem) {
      workElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToContactWithAnswers = (starterText: string) => {
    setContactInitialMessage(starterText);
    window.dispatchEvent(new CustomEvent('prefill_contact', { detail: { message: starterText } }));
    scrollToContact();
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  return (
    <div className="relative min-h-screen bg-canvas text-ink selection:bg-accent selection:text-white">
      {/* Subtle Noise Texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Minimal Editorial Navigation */}
      <Navbar onContactClick={scrollToContact} />

      {/* Main Content Sections */}
      <main>
        <Hero onStartProject={scrollToContact} onViewWork={scrollToWork} />
        <TechTicker />
        <SelectedWork />
        <PlaybookSection onNavigateToContactWithAnswers={handleNavigateToContactWithAnswers} />
        <Services />
        <About />
        <Process />
        <Contact initialMessage={contactInitialMessage} />
      </main>

      {/* Editorial Footer with Admin Link */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Persistent Floating Scroll-Triggered Feedback Widget */}
      <FeedbackWidget />

      {/* Admin Analytics & Lead Management App */}
      {isAdminOpen && <AdminDashboard onClose={handleCloseAdmin} />}
    </div>
  );
};

export default App;

