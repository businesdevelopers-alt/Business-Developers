import { useState, useEffect } from 'react';
import { Lang } from './types';
import ScrollProgressBar from './components/ScrollProgressBar';
import Navbar from './components/Navbar';
import QuickHelpModal from './components/QuickHelpModal';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import ClientTrust from './components/ClientTrust';
import SolutionsSection from './components/SolutionsSection';
import SectorsSection from './components/SectorsSection';
import ServicesMarket from './components/ServicesMarket';
import AboutSection from './components/AboutSection';
import PortfolioSection from './components/PortfolioSection';
import FAQSection from './components/FAQSection';
import ConsultationForm from './components/ConsultationForm';
import NewsletterSubscription from './components/NewsletterSubscription';
import Footer from './components/Footer';
import LiveChatWidget from './components/LiveChatWidget';

export default function App() {
  const [lang, setLang] = useState<Lang>('ar'); // Defaulting to Arabic as requested by user's content layout
  const [preselectedSectorId, setPreselectedSectorId] = useState<string>('');
  const [preselectedSolutionId, setPreselectedSolutionId] = useState<string>('');
  const [isQuickHelpOpen, setIsQuickHelpOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener for Quick Help Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        const isEditable = document.activeElement?.getAttribute('contenteditable') === 'true';
        
        // Ignore shortcut if typing inside message fields, inputs or textareas
        if (activeTag === 'input' || activeTag === 'textarea' || isEditable) {
          return;
        }
        
        e.preventDefault();
        setIsQuickHelpOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (sectionId: string, customSectorId?: string, customSolutionId?: string) => {
    if (customSectorId !== undefined) {
      setPreselectedSectorId(customSectorId);
    }
    if (customSolutionId !== undefined) {
      setPreselectedSolutionId(customSolutionId);
    }

    const ele = document.getElementById(sectionId);
    if (ele) {
      ele.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigateToConsultWithSector = (sectorId: string) => {
    handleNavigate('consultation', sectorId, '');
  };

  const handleNavigateToConsultWithSolution = (solutionId: string) => {
    handleNavigate('consultation', '', solutionId);
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen text-slate-900 bg-[#fafafa] selection:bg-sky-500 selection:text-white transition-all duration-300 ${
        lang === 'ar' ? 'text-right' : 'text-left'
      }`}
    >
      {/* Scroll indicator overlay */}
      <ScrollProgressBar />

      {/* AI-powered Quick Help automated assistant portal */}
      <QuickHelpModal
        isOpen={isQuickHelpOpen}
        onClose={() => setIsQuickHelpOpen(false)}
        lang={lang}
      />

      {/* Dynamic light grids for ambient background modern aesthetics */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-sky-100/10 via-indigo-100/5 to-transparent pointer-events-none" />

      {/* Main app navigation wrapper */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onNavigate={(id) => handleNavigate(id)}
        onOpenQuickHelp={() => setIsQuickHelpOpen(true)}
      />

      {/* Core Landing sections */}
      <main className="relative">
        <Hero
          lang={lang}
          onNavigate={(id) => handleNavigate(id)}
        />
        
        <StatsSection lang={lang} />

        <ClientTrust lang={lang} />

        <SolutionsSection
          lang={lang}
          onNavigateToConsult={handleNavigateToConsultWithSolution}
        />

        <SectorsSection
          lang={lang}
          onNavigateToConsult={handleNavigateToConsultWithSector}
        />

        <ServicesMarket lang={lang} />

        <PortfolioSection lang={lang} />

        <AboutSection lang={lang} />

        <FAQSection lang={lang} />

        <ConsultationForm
          lang={lang}
          preselectedSectorId={preselectedSectorId}
          preselectedSolutionId={preselectedSolutionId}
        />
      </main>

      {/* Lead Capture Newsletter updates banner */}
      <NewsletterSubscription lang={lang} />

      {/* Corporate Footprint footer */}
      <Footer
        lang={lang}
        onNavigate={(id) => handleNavigate(id)}
      />

      {/* Floating support live-chat system */}
      <LiveChatWidget lang={lang} />
    </div>
  );
}
