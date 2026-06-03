import { useState, useEffect } from 'react';
import { Lang } from '../types';
import { Menu, X, Languages, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom-designed high-fidelity SVG flag components for superb cross-platform rendering
function SaudiFlag() {
  return (
    <svg className="w-4.5 h-3 shadow-xs rounded-sm inline-block flex-shrink-0 border border-[#005128]/25" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" rx="1.5" fill="#006C35" />
      {/* Simplified sword and inscription details */}
      <path d="M8 12.5h14l-3-1.5" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7.5s1.2-1.5 3-1.5 3 1.5 3 1.5" stroke="#ffffff" strokeWidth="0.95" strokeLinecap="round" />
    </svg>
  );
}

function UKFlag() {
  return (
    <svg className="w-4.5 h-3 shadow-xs rounded-sm inline-block flex-shrink-0 border border-[#001750]/25" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" rx="1.5" fill="#00247D" />
      {/* St Andrews Diagonal White Cross */}
      <path d="M0 0l30 20M30 0L0 20" stroke="#ffffff" strokeWidth="2" />
      {/* St Patrick Diagonal Red Cross */}
      <path d="M0 0l30 20M30 0L0 20" stroke="#CF142B" strokeWidth="1" />
      {/* St George Vertical & Horizontal White Cross */}
      <path d="M15 0v20M0 10h30" stroke="#ffffff" strokeWidth="4" />
      {/* St George Vertical & Horizontal Red Cross */}
      <path d="M15 0v20M0 10h30" stroke="#CF142B" strokeWidth="2.2" />
    </svg>
  );
}

interface NavbarProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  onNavigate: (sectionId: string) => void;
  onOpenQuickHelp: () => void;
}

export default function Navbar({ lang, setLang, onNavigate, onOpenQuickHelp }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const menuItems = [
    { id: 'solutions', labelAr: 'حلولنا', labelEn: 'Our Solutions' },
    { id: 'sectors', labelAr: 'قطاعات العمل', labelEn: 'Sectors' },
    { id: 'portfolio', labelAr: 'أعمالنا', labelEn: 'Our Work' },
    { id: 'clients', labelAr: 'شركاؤنا', labelEn: 'Partners' },
    { id: 'about', labelAr: 'من نحن', labelEn: 'About Us' },
    { id: 'faq', labelAr: 'الأسئلة الشائعة', labelEn: 'FAQs' },
    { id: 'stats', labelAr: 'إحصائيات', labelEn: 'Why Us' },
    { id: 'consultation', labelAr: 'طلب استشارة', labelEn: 'Get Appraisal' },
  ];

  const handleMenuClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      id="app-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer" onClick={() => onNavigate('hero')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-100 overflow-hidden group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 absolute animate-pulse text-sky-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-tight">
                {lang === 'ar' ? 'بيزنس ديفلوبرز' : 'Business Developers'}
              </span>
              <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'للحلول المتكاملة' : 'Integrated IT Solutions'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors cursor-pointer"
              >
                {lang === 'ar' ? item.labelAr : item.labelEn}
              </button>
            ))}
          </nav>

          {/* Extra Actions */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {/* AI Assistant Button */}
            <button
              id="ai-quick-help-nav"
              onClick={onOpenQuickHelp}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-500/10 to-indigo-600/15 text-indigo-700 hover:text-indigo-800 text-xs font-bold border border-indigo-200/50 hover:border-indigo-300 transition-all cursor-pointer shadow-3xs relative overflow-hidden group active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 group-hover:animate-spin" />
              <span>{lang === 'ar' ? 'المساعد الذكي' : 'AI Help'}</span>
            </button>

            {/* Lang Switch */}
            <button
              id="lang-toggle-desktop"
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
            >
              {lang === 'ar' ? <UKFlag /> : <SaudiFlag />}
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* CTA button */}
            <button
              id="cta-consult-nav"
              onClick={() => onNavigate('consultation')}
              className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
            >
              {lang === 'ar' ? 'إستشارة تقنية مجانية' : 'Free Strategy Call'}
            </button>
          </div>

          {/* Mobile hamburger icon */}
          <div className="flex items-center md:hidden space-x-2 rtl:space-x-reverse">
            {/* Direct AI Assist trigger on mobile header */}
            <button
              onClick={onOpenQuickHelp}
              className="flex items-center space-x-1 rtl:space-x-reverse px-2 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 cursor-pointer text-xs font-bold"
              title="AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
              <span className="text-[10px] font-bold">{lang === 'ar' ? 'ذكاء' : 'AI'}</span>
            </button>

            {/* Direct Lang switcher on mobile header */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-slate-200/60 cursor-pointer text-xs font-bold"
              title="Change Language"
            >
              {lang === 'ar' ? <UKFlag /> : <SaudiFlag />}
              <span className="text-[10px] font-bold uppercase tracking-wider">{lang === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            <button
              id="mobile-menu-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-drawer-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleMenuClick(item.id)}
                  className="block w-full py-2 px-3 text-right ltr:text-left text-base font-medium rounded-lg text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                >
                  {lang === 'ar' ? item.labelAr : item.labelEn}
                </button>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
                <button
                  id="mobile-ai-help"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuickHelp();
                  }}
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-gradient-to-r from-sky-50 to-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-sm shadow-2xs flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span>{lang === 'ar' ? 'المساعد التقني الذكي (AI)' : 'Smart AI Systems Assistant'}</span>
                </button>

                <button
                  id="mobile-cta-consult"
                  onClick={() => handleMenuClick('consultation')}
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-sky-600 text-white font-semibold text-sm shadow-sm"
                >
                  {lang === 'ar' ? 'طلب استشارة مجانية' : 'Request Consult'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
