import React from 'react';
import { Lang } from '../types';
import { 
  Building2, 
  Coins, 
  Activity, 
  Truck, 
  Home, 
  Sparkles,
  ShieldCheck,
  Award,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface ClientTrustProps {
  lang: Lang;
}

interface PartnerLogo {
  id: string;
  nameAr: string;
  nameEn: string;
  subAr: string;
  subEn: string;
  logoColorClassName: string;
  bgLightClassName: string;
  // Sleek inline SVG custom icon path or representation
  logoSvg: React.ReactNode;
}

export default function ClientTrust({ lang }: ClientTrustProps) {
  const isAr = lang === 'ar';

  const partners: PartnerLogo[] = [
    {
      id: 'partner-finance',
      nameAr: 'منظومة الدفع سهل السحابية',
      nameEn: 'Sahl Digital Pay Ecosystem',
      subAr: 'الخدمات المصرفية الرقمية',
      subEn: 'Digital Banking Network',
      logoColorClassName: 'text-emerald-600',
      bgLightClassName: 'bg-emerald-50/50',
      logoSvg: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v8c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 13v8c0 1.66 4 3 9 3s9-1.34 9-3v-8" />
        </svg>
      )
    },
    {
      id: 'partner-municipal',
      nameAr: 'الأمانات العامة والبلديات',
      nameEn: 'Municipal Development Authority',
      subAr: 'بوابة وطنية موحدة للتراخيص',
      subEn: 'National Permitting Hub',
      logoColorClassName: 'text-sky-600',
      bgLightClassName: 'bg-sky-50/50',
      logoSvg: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1" />
          <path d="M19 21V10.5" />
          <path d="M5 21V10.5" />
          <path d="M12 21V13" />
        </svg>
      )
    },
    {
      id: 'partner-health',
      nameAr: 'شبكة سحابي للرعاية الصحية',
      nameEn: 'Cloud Health EHR Consortium',
      subAr: 'الأرشيف الطبي الموحد',
      subEn: 'Unified Medical Core',
      logoColorClassName: 'text-rose-600',
      bgLightClassName: 'bg-rose-50/50',
      logoSvg: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    },
    {
      id: 'partner-logistics',
      nameAr: 'مؤسسة مسار للنقل والإمداد',
      nameEn: 'Masar Logistical & Fleet Corp',
      subAr: 'إدارة أساطيل الحاويات الرقمية',
      subEn: 'Smart Cold-Chain Telementry',
      logoColorClassName: 'text-indigo-600',
      bgLightClassName: 'bg-indigo-50/50',
      logoSvg: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      id: 'partner-realestate',
      nameAr: 'الشركة الوطنية للتطوير العقاري',
      nameEn: 'National PropTech Developers',
      subAr: 'منصة الواقع المعزز والجولات ثلاثية الأبعاد',
      subEn: 'PropTech 3D Integration',
      logoColorClassName: 'text-amber-600',
      bgLightClassName: 'bg-amber-50/50',
      logoSvg: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: 'partner-tourism',
      nameAr: 'هيئة فعاليات ومواسم الترفيه',
      nameEn: 'Mawsem Sports & Tourism Org',
      subAr: 'محرك مبيعات التذاكر المليوني',
      subEn: 'High-Load Event Core',
      logoColorClassName: 'text-purple-600',
      bgLightClassName: 'bg-purple-50/50',
      logoSvg: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.886H3.82l4.912 3.57L6.82 18.342 12 14.772l5.18 3.57-1.912-5.886 4.912-3.57h-6.268L12 3z" />
        </svg>
      )
    }
  ];

  return (
    <section 
      id="clients" 
      className="py-20 bg-[#fafafa] relative scroll-mt-20 overflow-hidden"
    >
      {/* Decorative vector background */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-50/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-14">
        
        {/* Section Title Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full bg-slate-100 border border-slate-200/50 text-slate-700 text-xs font-bold leading-none">
            <Award className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>{isAr ? 'توافق كامل وثقة مستمرة' : 'Accredited Sovereign Trust'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            {isAr ? 'شركاء النجاح والثقة الرقمية' : 'Corporate Partners & Digital Trust'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
            {isAr
              ? 'مجموعة متميزة من الجهات الرسمية والقطاعات الكبرى التي اعتمدت على كفاءة خوادمنا لتشغيل ورقمنة معاملاتها الحيوية يومياً.'
              : 'Our high-load architectures, secure EHR pipelines, and payment structures securely power elite sovereign entities.'}
          </p>
        </div>

        {/* Ticker Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {partners.map((partner) => {
            const title = isAr ? partner.nameAr : partner.nameEn;
            const subtitle = isAr ? partner.subAr : partner.subEn;

            return (
              <motion.div
                key={partner.id}
                id={`partner-card-${partner.id}`}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 flex flex-col items-center text-center justify-between shadow-xs transition-shadow hover:shadow-md hover:border-slate-300 group"
              >
                {/* Logo Graphic Badge wrapper */}
                <div className={`w-14 h-14 rounded-xl ${partner.bgLightClassName} ${partner.logoColorClassName} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 mb-4 shadow-inner`}>
                  {partner.logoSvg}
                </div>

                {/* Company Name & Sector */}
                <div className="space-y-1 flex-1">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    {subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Highlight Trust Bar */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-right ltr:text-left">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-sky-400 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-extrabold">
                  {isAr ? 'ضمانات التشغيل وجاهزية الخدمة %99.9' : 'Guaranteed 99.9% Production Uptime'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isAr 
                    ? 'نطبق اتفاقيات مستوى خدمة (SLA) صارمة ودعم متواصل للمنظومات الحيوية.' 
                    : 'Governed by stringent SLA protocols and proactive vulnerability monitoring pipelines.'}
                </p>
              </div>
            </div>

            <button
              id="trust-scroller"
              onClick={() => {
                const el = document.getElementById('consultation');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer shadow-md shadow-indigo-600/20 active:scale-98"
            >
              <span>{isAr ? 'اطلب استشارة للبنية التقنية' : 'Schedule Infrastructure Audit'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
