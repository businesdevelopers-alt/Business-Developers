import React, { useState } from 'react';
import { Lang, ContactInquiry } from '../types';
import { 
  X, 
  Check, 
  Calendar, 
  Copy, 
  CheckCheck, 
  FileText, 
  Clock, 
  Phone, 
  Sparkles, 
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SuccessFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  formData: ContactInquiry;
  mockProposal: {
    stack: string[];
    phases: string[];
    duration: string;
  } | null;
}

export default function SuccessFeedbackModal({
  isOpen,
  onClose,
  lang,
  formData,
  mockProposal
}: SuccessFeedbackModalProps) {
  const [copied, setCopied] = useState(false);
  const [showCalendarMock, setShowCalendarMock] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const isAr = lang === 'ar';

  // Fallbacks or defaults
  const clientName = formData.name || (isAr ? 'عميلنا العزيز' : 'Valued Client');
  const companyName = formData.companyName || (isAr ? 'منشأتكم الموقرة' : 'Your Corporation');
  const ticketId = React.useMemo(() => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `BD-RFQ-${randomNum}`;
  }, [isOpen]);

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookDiscovery = () => {
    setShowCalendarMock(true);
  };

  const submitCalendarBooking = () => {
    setFeedbackSuccess(true);
    setTimeout(() => {
      setShowCalendarMock(false);
      setFeedbackSuccess(false);
    }, 2800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="success-modal-portal" className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop blur overlay with fade-in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            id="success-modal-backdrop"
          />

          {/* Centering container */}
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8 relative">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              id="success-modal-content"
              className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-right rtl:text-right ltr:text-left flex flex-col"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/5 via-transparent to-transparent pointer-events-none" />

              {/* Close Button at corner */}
              <button
                id="success-modal-close-btn"
                onClick={onClose}
                className="absolute top-5 right-5 ltr:left-5 ltr:right-auto p-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors z-10"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Body Container with scrolling compatibility */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[85vh]">
                
                {/* Header Success Ring Animation & Badge */}
                <div className="text-center space-y-3 pb-4 border-b border-slate-100">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-emerald-500/20"
                    />
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                      <Check className="w-6 h-6 stroke-[3.5]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-wider">
                      {isAr ? 'بوابة المعالجة الرسمية' : 'OFFICIAL PROCESSING HUB'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-sans tracking-tight">
                      {isAr ? 'تم استلام وتوليد مسودة نظامكم بنجاح!' : 'Your Custom Draft Blueprint is Ready!'}
                    </h3>
                  </div>
                </div>

                {/* Core Context Dialogue */}
                <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/50 space-y-3">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse text-slate-800">
                    <HeartHandshake className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span className="font-sans font-bold text-sm sm:text-base">
                      {isAr 
                        ? `مرحباً ${clientName}، نسعد بشراكتكم` 
                        : `Greetings ${clientName}, ready for transition`}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {isAr
                      ? `تم تسجيل طلبكم بنجاح باسم منشأتكم الموقرة (${companyName}). بموجب معايير حوكمة الأعمال لشركة بيزنس ديفلوبرز (Business Developers)، قمنا بربط متطلباتكم مع مهندس قطاعات متخصص لبناء العرض الفني المتكامل.`
                      : `Your configuration for (${companyName}) has been securely queued. Business Developers governing guidelines mandate checking current platform guidelines before proceeding to direct drafting with specialists.`}
                  </p>

                  {/* Unique Ticket ID Box */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/40 text-xs">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-slate-400 font-medium">{isAr ? 'رقم التذكرة التعريفي:' : 'Unique Reference ID:'}</span>
                      <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {ticketId}
                      </span>
                    </div>

                    <button
                      id="modal-copy-ticket-btn"
                      onClick={handleCopyTicket}
                      className="inline-flex items-center justify-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 cursor-pointer font-bold transition-all text-[11px] font-sans"
                    >
                      {copied ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isAr ? 'نسخ رقم التذكرة' : 'Copy Ticket ID'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submited Proposal Snapshot if available */}
                {mockProposal && (
                  <div className="border border-slate-200 rounded-3xl p-5 sm:p-6 bg-slate-950 text-slate-100 space-y-4 font-mono text-xs overflow-hidden relative shadow-inner">
                    <div className="absolute top-4 right-4 text-slate-800">
                      <FileText className="w-12 h-12" />
                    </div>

                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-sky-400 font-sans font-bold border-b border-white/10 pb-2.5">
                      <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-wider">{isAr ? 'مستخرج مواصفات البنية الرقمية المبدئية' : 'GENERATED TECHNICAL SNAPSHOT'}</span>
                    </div>

                    {/* Stack summary */}
                    <div className="space-y-1.5">
                      <span className="text-slate-400 text-[9px] uppercase tracking-wider block">{isAr ? 'مكونات النظام المقترحة:' : 'PROPOSED ARTIFACTS:'}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {mockProposal.stack.map((item, index) => (
                          <span key={index} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-black text-sky-300">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Timeline summary */}
                    <div className="flex items-center justify-between text-[11px] pt-3.5 border-t border-white/5 font-sans">
                      <span className="text-slate-400">{isAr ? 'الجدولة الزمنية التقديرية:' : 'Draft Sizing Timeline:'}</span>
                      <span className="font-bold text-sky-300">{mockProposal.duration}</span>
                    </div>
                  </div>
                )}

                {/* EXPECTED NEXT STEPS (Actionable Timeline) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider font-sans">
                    {isAr ? 'ماذا سيحدث بعد ذلك؟ (خطوات العمل المعتمدة)' : 'EXPECTED NEXT STEPS & MILESTONES'}
                  </h4>

                  <div className="grid sm:grid-cols-3 gap-4 font-sans">
                    {/* Step 1 */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3 hover:border-slate-200 transition-colors">
                      <div className="space-y-1.5">
                        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black">
                          1
                        </span>
                        <h5 className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {isAr ? 'تسجيل فوري بالنظام' : 'Immediate Registry'}
                        </h5>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {isAr
                            ? 'تمت حوسبة العرض وإضافته لنظام التذاكر للمتابعة الفورية.'
                            : 'Form coordinates mapped and indexed onto internal CRM ledger instantly.'}
                        </p>
                      </div>
                      <div className="flex items-center text-[9px] text-slate-400 gap-1 pt-1.5 border-t border-slate-200/40">
                        <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{isAr ? 'تم في الحال' : 'Finished Now'}</span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3 hover:border-slate-200 transition-colors">
                      <div className="space-y-1.5">
                        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black">
                          2
                        </span>
                        <h5 className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {isAr ? 'مهندس حلول متخصص' : 'Systems Architect'}
                        </h5>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {isAr
                            ? 'نقوم بتعيين مهندس خبير لتخصيص متطلبات قطاعكم وصياغة مصفوفة العمل.'
                            : 'Dedicated specialist analyzes compliance grids and draft requirements.'}
                        </p>
                      </div>
                      <div className="flex items-center text-[9px] text-slate-400 gap-1 pt-1.5 border-t border-slate-200/40">
                        <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{isAr ? 'خلال ساعتين عمل' : 'Within 2 Hours'}</span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3 hover:border-slate-200 transition-colors">
                      <div className="space-y-1.5">
                        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black">
                          3
                        </span>
                        <h5 className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {isAr ? 'مكالمة استكشافية' : 'Discovery Alignment'}
                        </h5>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {isAr
                            ? 'مكالمة بـ 15 دقيقة لقفل نطاق العمل النهائي ومناقشة تفاصيل التكلفة.'
                            : 'Brief 15min audit session to lock integration points and final pricing SLA.'}
                        </p>
                      </div>
                      <div className="flex items-center text-[9px] text-emerald-600 font-bold gap-1 pt-1.5 border-t border-slate-200/40">
                        <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{isAr ? 'خلال 4 ساعات' : 'Within 4 Hours'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTON PANEL FOR FASTER CONVERSION */}
                <div className="pt-2">
                  <AnimatePresence mode="wait">
                    {!showCalendarMock ? (
                      <motion.div
                        key="actions-main"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col sm:flex-row items-center justify-end gap-3"
                      >
                        <button
                          id="modal-book-discovery-btn"
                          onClick={handleBookDiscovery}
                          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer active:scale-98"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>{isAr ? 'حجز موعد استشارة مباشر الآن' : 'Schedule Discovery Call Now'}</span>
                        </button>

                        <button
                          id="modal-done-btn"
                          onClick={onClose}
                          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer text-center"
                        >
                          {isAr ? 'تم، العودة للموقع' : 'Done, Close Hub'}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="actions-calendar"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                          <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center space-x-1.5 rtl:space-x-reverse">
                            <Calendar className="w-4.5 h-4.5 text-indigo-600" />
                            <span>{isAr ? 'حجز استشارة فنية فورية' : 'Reserve Fast Integration Audit'}</span>
                          </h5>
                          <button
                            onClick={() => setShowCalendarMock(false)}
                            className="text-xs font-semibold text-slate-400 hover:text-slate-600 border border-slate-200 rounded-md px-2 py-0.5 bg-white cursor-pointer"
                          >
                            {isAr ? 'تراجع' : 'Back'}
                          </button>
                        </div>

                        {feedbackSuccess ? (
                          <div className="py-4 text-emerald-600 font-bold text-xs sm:text-sm space-y-1">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                              <CheckCheck className="w-5 h-5" />
                            </div>
                            <p>{isAr ? 'تم تأكيد موعدكم بنجاح وتم إرسال رابط هاتف الدعوة!' : 'Booking confirmed! Check your email for coordinates.'}</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-slate-500 text-[11px] leading-relaxed">
                              {isAr
                                ? 'يرجى اختيار الفترة الزمنية المفضلة لديكم اليوم ليقوم أحد خبرائنا بالاتصال المباشر عبر الهاتف المرفوع:'
                                : 'Select your optimal window for today. A system specialist will dial your supplied contact number directly.'}
                            </p>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <button
                                onClick={submitCalendarBooking}
                                className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-400 text-[11px] sm:text-xs font-bold text-slate-800 transition-all cursor-pointer text-center"
                              >
                                {isAr ? 'صباحاً (10:00 - 12:00)' : 'Morning (10:00 - 12:00)'}
                              </button>
                              <button
                                onClick={submitCalendarBooking}
                                className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-400 text-[11px] sm:text-xs font-bold text-slate-800 transition-all cursor-pointer text-center"
                              >
                                {isAr ? 'ظهراً (01:00 - 03:00)' : 'Midday (13:00 - 15:00)'}
                              </button>
                              <button
                                onClick={submitCalendarBooking}
                                className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-400 text-[11px] sm:text-xs font-bold text-slate-800 transition-all cursor-pointer text-center"
                              >
                                {isAr ? 'مساءً (04:00 - 06:00)' : 'Evening (16:00 - 18:00)'}
                              </button>
                              <button
                                onClick={submitCalendarBooking}
                                className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-[11px] sm:text-xs font-bold text-slate-800 transition-all cursor-pointer text-center"
                              >
                                {isAr ? 'أي وقت متاح' : 'Any Slot Today'}
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Branded Bottom Footer Ribbon */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-bold text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{isAr ? 'مستند مشفر خاضع لحماية الخصوصية والـ NDA والامتثال للمعاير الوطنية السلمانية' : 'Encrypted with NDA & sovereign compliance privacy protection'}</span>
                </div>
                <div className="font-bold text-slate-400">
                  Business Developers © 2026
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
