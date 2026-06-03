import { useState, useEffect } from 'react';
import { Lang, Client, ClientRequest } from '../types';
import { Menu, X, Languages, Sparkles, User, Bell, Check, ArrowRight, ArrowLeft } from 'lucide-react';
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

const getStatusLabel = (status: string, isAr: boolean) => {
  const arLabels: Record<string, string> = {
    pending: 'قيد الانتظار',
    reviewing: 'قيد المراجعة',
    planned: 'تم التخطيط والجدولة',
    approved: 'تم الاعتماد المالي',
    completed: 'مكتمل ونشط',
  };
  const enLabels: Record<string, string> = {
    pending: 'Review Pending',
    reviewing: 'Sizing & Review',
    planned: 'Planned / Scheduled',
    approved: 'Approved / Confirmed',
    completed: 'Completed & Live',
  };
  return isAr ? (arLabels[status] || status) : (enLabels[status] || status);
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    reviewing: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
    planned: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
    approved: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    completed: 'bg-teal-500/10 text-teal-500 border border-teal-500/20',
  };
  return colors[status] || 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
};

interface NavbarProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  onNavigate: (sectionId: string) => void;
  onOpenQuickHelp: () => void;
  currentClient: Client | null;
  onOpenClientPortal: () => void;
  requests?: ClientRequest[];
}

export default function Navbar({ 
  lang, 
  setLang, 
  onNavigate, 
  onOpenQuickHelp,
  currentClient,
  onOpenClientPortal,
  requests = []
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notification States
  const [bellOpen, setBellOpen] = useState(false);
  const [seenStatuses, setSeenStatuses] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('bd_seen_request_statuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update seenStatuses of any un-stored request to its current database status so they aren't spammed with old updates
  useEffect(() => {
    if (currentClient && requests.length > 0) {
      const myRequests = requests.filter(
        (r) => r.clientEmail.toLowerCase() === currentClient.email.toLowerCase()
      );
      
      let changed = false;
      const nextSeen = { ...seenStatuses };
      myRequests.forEach((req) => {
        if (nextSeen[req.id] === undefined) {
          nextSeen[req.id] = req.status;
          changed = true;
        }
      });
      if (changed) {
        setSeenStatuses(nextSeen);
        localStorage.setItem('bd_seen_request_statuses', JSON.stringify(nextSeen));
      }
    }
  }, [currentClient, requests]);

  // Handle outside clicks to cleanly dismiss notification popover dropdown lists
  useEffect(() => {
    if (!bellOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('#navbar-notification-dropdown') &&
        !target.closest('#navbar-bell-trigger') &&
        !target.closest('#navbar-notification-dropdown-mobile') &&
        !target.closest('#navbar-bell-trigger-mobile')
      ) {
        setBellOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [bellOpen]);

  // Calculate list of unread status update notifications of the logged-in client
  const notifications = currentClient && requests
    ? requests
        .filter((r) => r.clientEmail.toLowerCase() === currentClient.email.toLowerCase())
        .filter((r) => seenStatuses[r.id] && seenStatuses[r.id] !== r.status)
        .map((r) => ({
          request: r,
          oldStatus: seenStatuses[r.id],
          newStatus: r.status,
        }))
    : [];

  const markAsRead = (requestId: string, currentStatus: string) => {
    const nextSeen = { ...seenStatuses, [requestId]: currentStatus };
    setSeenStatuses(nextSeen);
    localStorage.setItem('bd_seen_request_statuses', JSON.stringify(nextSeen));
  };

  const markAllAsRead = () => {
    const nextSeen = { ...seenStatuses };
    notifications.forEach((n) => {
      nextSeen[n.request.id] = n.newStatus;
    });
    setSeenStatuses(nextSeen);
    localStorage.setItem('bd_seen_request_statuses', JSON.stringify(nextSeen));
  };

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const menuItems = [
    { id: 'solutions', labelAr: 'حلولنا', labelEn: 'Our Solutions' },
    { id: 'sectors', labelAr: 'قطاعات العمل', labelEn: 'Sectors' },
    { id: 'services-market', labelAr: 'سوق الخدمات', labelEn: 'Services Market' },
    { id: 'entrepreneurship', labelAr: 'رحلة الريادة', labelEn: 'Venture Journey' },
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
              className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-500/10 to-indigo-600/15 text-indigo-700 hover:text-indigo-800 text-xs font-bold border border-indigo-200/50 hover:border-indigo-300 transition-all cursor-pointer shadow-3xs relative overflow-hidden group active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 group-hover:animate-spin" />
              <span>{lang === 'ar' ? 'المساعد الذكي' : 'AI Help'}</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 h-4.5 px-1.5 rounded bg-indigo-600/10 text-[9px] text-indigo-600 dark:text-indigo-400 font-mono tracking-tight select-none">
                <span className="text-[8px]">Ctrl</span>
                <span>+</span>
                <span>K</span>
              </kbd>
            </button>

            {/* Notification Bell (Desktop) */}
            {currentClient && (
              <div className="relative">
                <button
                  id="navbar-bell-trigger"
                  onClick={() => setBellOpen(!bellOpen)}
                  className={`p-2 rounded-lg text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 border transition-all cursor-pointer relative active:scale-95 flex items-center justify-center ${
                    bellOpen ? 'bg-slate-50 dark:bg-slate-800 border-sky-400/50' : 'border-slate-200'
                  }`}
                  aria-label="Notifications"
                >
                  <Bell className={`w-4 h-4 ${notifications.length > 0 ? 'text-sky-600 animate-pulse' : 'text-slate-600'}`} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white ring-2 ring-white animate-bounce">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Dropdown containing actual updates */}
                <AnimatePresence>
                  {bellOpen && (
                    <motion.div
                      id="navbar-notification-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 sm:w-[26rem] bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 text-right rtl:text-right ltr:text-left translate-x-[15%] sm:translate-x-0"
                    >
                      {/* Brand Header */}
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 justify-start">
                          <Bell className="w-3.5 h-3.5 text-sky-600" />
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider font-sans">
                            {lang === 'ar' ? 'تحديثات الشركاء' : 'Partner Alerts'}
                          </span>
                        </div>
                        {notifications.length > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] text-sky-600 hover:text-sky-700 font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>{lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
                          </button>
                        )}
                      </div>

                      {/* Notification Scroll viewport */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800/60 font-sans">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                              <Check className="w-5 h-5 text-emerald-500" />
                            </div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-350">
                              {lang === 'ar' ? 'أنت على اطلاع بكل التحديثات!' : 'All caught up!'}
                            </p>
                            <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                              {lang === 'ar'
                                ? 'سيتم تنبيهك هنا فور تغيير حالة أي من طلبات تتبع التحول التقني المرفوعة.'
                                : 'You will see live notifications key-synced here whenever a developer schedules or approves your technical lifecycles.'}
                            </p>
                          </div>
                        ) : (
                          notifications.map((notif) => {
                            const req = notif.request;
                            return (
                              <div
                                key={req.id}
                                className="p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all flex justify-between items-start gap-3 relative border-r-4 border-sky-500 text-right rtl:text-right ltr:text-left"
                              >
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 justify-start rtl:justify-end">
                                    <span className="text-[9px] font-bold font-mono text-sky-600 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/30 px-1.5 py-0.2 rounded-md">
                                      #{req.id}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-mono">{req.createdAt}</span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                    {lang === 'ar' ? `المشروع: ${req.companyName}` : `Project: ${req.companyName}`}
                                  </p>
                                  
                                  {/* Shift display */}
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1 justify-start">
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${getStatusColor(notif.oldStatus)}`}>
                                      {getStatusLabel(notif.oldStatus, lang === 'ar')}
                                    </span>
                                    {lang === 'ar' ? <ArrowLeft className="w-3 h-3 text-slate-400" /> : <ArrowRight className="w-3 h-3 text-slate-400" />}
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getStatusColor(notif.newStatus)}`}>
                                      {getStatusLabel(notif.newStatus, lang === 'ar')}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => markAsRead(req.id, notif.newStatus)}
                                  className="p-1 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 dark:text-slate-500 border border-slate-150 transition-all cursor-pointer shrink-0"
                                  title={lang === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                      
                      {/* Footer actions */}
                      <div className="bg-slate-50 dark:bg-slate-950/60 px-4 py-2 text-center border-t border-gray-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            setBellOpen(false);
                            onOpenClientPortal();
                          }}
                          className="text-[10px] text-slate-500 hover:text-sky-600 font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{lang === 'ar' ? 'عرض تتبع مراحل الحلول بالتفصيل ➔' : 'View detailed solution trackers ➔'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Client Area Button */}
            <button
              id="client-portal-nav-btn"
              onClick={onOpenClientPortal}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-3xs active:scale-98 ${
                currentClient
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/20'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <User className={`w-3.5 h-3.5 ${currentClient ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>
                {currentClient
                  ? (lang === 'ar' ? `لوحة الشركاء: ${currentClient.name}` : `Partner Panel: ${currentClient.name}`)
                  : (lang === 'ar' ? 'منطقة العملاء' : 'Client Area')}
              </span>
              {currentClient && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              )}
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
          <div className="flex items-center md:hidden space-x-2 rtl:space-x-reverse animate-fade-in">
            {/* Direct Mobile Notification Bell */}
            {currentClient && (
              <div className="relative">
                <button
                  id="navbar-bell-trigger-mobile"
                  onClick={() => setBellOpen(!bellOpen)}
                  className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 border transition-all cursor-pointer relative active:scale-95 flex items-center justify-center ${
                    bellOpen ? 'bg-slate-50 dark:bg-slate-800 border-sky-400/50' : 'border-slate-200/60'
                  }`}
                  aria-label="Notifications"
                >
                  <Bell className={`w-3.5 h-3.5 ${notifications.length > 0 ? 'text-sky-600 animate-pulse' : 'text-slate-600'}`} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8.5px] font-extrabold text-white ring-1.5 ring-white">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Dropdown containing actual updates on mobile */}
                <AnimatePresence>
                  {bellOpen && (
                    <motion.div
                      id="navbar-notification-dropdown-mobile"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 text-right rtl:text-right ltr:text-left origin-top-right -translate-x-[45%] sm:-translate-x-[60%]"
                    >
                      {/* Brand Header */}
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 justify-start">
                          <Bell className="w-3.5 h-3.5 text-sky-600" />
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider font-sans">
                            {lang === 'ar' ? 'تحديثات الشركاء' : 'Partner Alerts'}
                          </span>
                        </div>
                        {notifications.length > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] text-sky-600 hover:text-sky-700 font-bold transition-all flex items-center gap-1 cursor-pointer font-sans"
                          >
                            <Check className="w-3 h-3" />
                            <span>{lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
                          </button>
                        )}
                      </div>

                      {/* Notification Scroll viewport */}
                      <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800/60 font-sans">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center flex flex-col items-center justify-center space-y-2">
                            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                              <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-350">
                              {lang === 'ar' ? 'أنت على اطلاع بكل التحديثات!' : 'All caught up!'}
                            </p>
                            <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                              {lang === 'ar'
                                ? 'سيتم تنبيهك هنا فور تغيير حالة أي من طلبات تتبع التحول التقني المرفوعة.'
                                : 'You will see live notifications key-synced here whenever a developer schedules or approves your technical lifecycles.'}
                            </p>
                          </div>
                        ) : (
                          notifications.map((notif) => {
                            const req = notif.request;
                            return (
                              <div
                                key={req.id}
                                className="p-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all flex justify-between items-start gap-2.5 relative border-r-4 border-sky-500 text-right rtl:text-right ltr:text-left"
                              >
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <div className="flex items-center gap-1 justify-start rtl:justify-end">
                                    <span className="text-[8.5px] font-bold font-mono text-sky-600 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/30 px-1 py-0.1 rounded">
                                      #{req.id}
                                    </span>
                                    <span className="text-[8px] text-slate-400 font-mono">{req.createdAt}</span>
                                  </div>
                                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                                    {lang === 'ar' ? `المشروع: ${req.companyName}` : `Project: ${req.companyName}`}
                                  </p>
                                  
                                  {/* Shift display */}
                                  <div className="flex flex-wrap items-center gap-1 mt-0.5 justify-start">
                                    <span className={`px-1 py-0.2 rounded text-[8.5px] font-semibold ${getStatusColor(notif.oldStatus)}`}>
                                      {getStatusLabel(notif.oldStatus, lang === 'ar')}
                                    </span>
                                    {lang === 'ar' ? <ArrowLeft className="w-2.5 h-2.5 text-slate-400" /> : <ArrowRight className="w-2.5 h-2.5 text-slate-400" />}
                                    <span className={`px-1 py-0.2 rounded text-[8.5px] font-bold ${getStatusColor(notif.newStatus)}`}>
                                      {getStatusLabel(notif.newStatus, lang === 'ar')}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => markAsRead(req.id, notif.newStatus)}
                                  className="p-1 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 dark:text-slate-500 border border-slate-150 transition-all cursor-pointer shrink-0"
                                  title={lang === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                      
                      {/* Footer actions */}
                      <div className="bg-slate-50 dark:bg-slate-950/60 px-4 py-2 text-center border-t border-gray-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            setBellOpen(false);
                            onOpenClientPortal();
                          }}
                          className="text-[10px] text-slate-500 hover:text-sky-600 font-semibold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{lang === 'ar' ? 'عرض مصفوفة الحلول ➔' : 'View solution matrix ➔'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

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
                  id="mobile-client-portal"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenClientPortal();
                  }}
                  className={`w-full text-center py-2.5 px-4 rounded-lg font-bold text-sm shadow-2xs flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer transition-all ${
                    currentClient
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-800'
                      : 'bg-slate-100 border border-slate-200 text-slate-800'
                  }`}
                >
                  <User className={`w-4 h-4 ${currentClient ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>
                    {currentClient
                      ? (lang === 'ar' ? `لوحة الشريك: ${currentClient.name}` : `Partner Hub: ${currentClient.name}`)
                      : (lang === 'ar' ? 'منطقة العملاء ومتابعة الطلبات' : 'Client Area & Lifecycle')}
                  </span>
                  {currentClient && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  )}
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
