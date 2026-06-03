import React, { useState } from 'react';
import { Lang } from '../types';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Bell, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsletterSubscriptionProps {
  lang: Lang;
}

export default function NewsletterSubscription({ lang }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isAr = lang === 'ar';

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage(isAr ? 'يرجى إدخال بريدك الإلكتروني.' : 'Please enter your email address.');
      setStatus('error');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage(isAr ? 'صيغة البريد الإلكتروني غير صحيحة.' : 'Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Simulate API request to subscribe newsletter
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section 
      id="newsletter" 
      className="py-16 bg-white border-t border-slate-100 relative overflow-hidden"
    >
      {/* Dynamic ambient backgrounds */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-sky-50/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-50/35 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-slate-800 shadow-xl">
          {/* Subtle tech background grids */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            
            {/* Context Content Column */}
            <div className="space-y-4 text-center md:text-right ltr:md:text-left md:max-w-md">
              <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-bold">
                <Bell className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
                <span>{isAr ? 'النشرة البريدية التقنية' : 'Technology Insight Dispatch'}</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                {isAr ? 'ابقَ في طليعة الابتكار الرقمي' : 'Stay Ahead of the Digital Frontier'}
              </h3>
              
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {isAr
                  ? 'انضم إلى نشرتنا لتبسيط البنى السحابية المعقدة، والاطلاع على أسعار الحلول، ومخططات الأنظمة الرائدة دورياً.'
                  : 'Subscribe to receive clean structural architecture blueprints, security compliance guides, and system sizing updates.'}
              </p>
            </div>

            {/* Input Action Column */}
            <div className="w-full md:max-w-sm">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success-state"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3 font-sans"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {isAr ? 'شكراً لتسجيلك معنا!' : 'You are subscribed!'}
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        {isAr
                          ? 'لقد تم إدراج بريدك في لائحة التحديثات التقنية لشركة بيزنس ديفلوبرز.'
                          : 'You will receive our systems reports and pricing telemetry indexes next.'}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form-state"
                    onSubmit={handleSubscribe}
                    className="space-y-3"
                  >
                    <div className="relative">
                      {/* Icon Prefix */}
                      <div className={`absolute inset-y-0 ${isAr ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-slate-400`}>
                        <Mail className="w-4 h-4" />
                      </div>

                      <input
                        id="newsletter-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === 'error') setStatus('idle');
                        }}
                        disabled={status === 'loading'}
                        placeholder={isAr ? 'أدخل بريدك الإلكتروني الموفر...' : 'Enter your email address...'}
                        className={`w-full py-3.5 ${isAr ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} bg-white/5 border text-xs sm:text-sm text-white placeholder-slate-400 rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                          status === 'error' 
                            ? 'border-rose-500/50 focus:ring-rose-500/10' 
                            : 'border-slate-800 focus:border-indigo-500 focus:bg-white/10 focus:ring-indigo-500/10'
                        }`}
                      />
                    </div>

                    <button
                      id="newsletter-submit-btn"
                      type="submit"
                      disabled={status === 'loading'}
                      className={`w-full py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer ${
                        status === 'loading'
                          ? 'bg-indigo-600/50 text-white/70 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10 active:scale-98'
                      }`}
                    >
                      {status === 'loading' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2 h-2 rounded-full bg-white animate-bounce" />
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{isAr ? 'اشترك في النشرة المحدثة' : 'Subscribe to Updates'}</span>
                        </>
                      )}
                    </button>

                    {/* Feedback Messages */}
                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 text-rose-400 text-[11px] px-1 font-sans justify-center md:justify-start"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMessage}</span>
                      </motion.div>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Secure statement */}
              <div className="flex items-center justify-center md:justify-start gap-1 text-[10px] text-slate-500 pt-3 px-1 font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>
                  {isAr 
                    ? 'خصوصية مطلقة ولا غمر للرسائل المزعجة.' 
                    : 'Unsubscribe anytime. Your encryption criteria are guarded.'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
