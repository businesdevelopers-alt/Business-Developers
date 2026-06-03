import { useState } from 'react';
import { Lang } from '../types';
import { Sparkles, Linkedin, Twitter, Mail, ShieldAlert, Copy, Check, PhoneCall } from 'lucide-react';

interface FooterProps {
  lang: Lang;
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ lang, onNavigate }: FooterProps) {
  const isAr = lang === 'ar';
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);

  const handleCopy = (type: 'email' | 'phone', text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => {
        setCopiedType(null);
      }, 2000);
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Logo & Description */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer" onClick={() => onNavigate('hero')}>
              <div className="relative w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-sky-100" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-white tracking-tight leading-tight">
                  {isAr ? 'بيزنس ديفلوبرز' : 'Business Developers'}
                </span>
                <span className="text-[9px] text-sky-400 font-bold uppercase tracking-wider">
                  {isAr ? 'لأنظمة تكنولوجيا المعلومات' : 'IT System Solutions'}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {isAr
                ? 'مجموعة متكاملة من تقنيات تكنولوجيا المعلومات ذات الجودة العالمية تخدم مختلف القطاعات لتحقيق النمو الأمثل والكفاءة والأمان.'
                : 'A global class of integrated IT architectures supporting sovereign municipal and enterprise sectors for security and scale.'}
            </p>
          </div>

          {/* Quick links map */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-slate-200">
              {isAr ? 'روابط الوصول السريع' : 'Navigation'}
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              <button onClick={() => onNavigate('solutions')} className="text-right ltr:text-left hover:text-white transition-colors cursor-pointer">
                {isAr ? 'خدماتنا وحلولنا' : 'Solutions'}
              </button>
              <button onClick={() => onNavigate('sectors')} className="text-right ltr:text-left hover:text-white transition-colors cursor-pointer">
                {isAr ? 'القطاعات المدعومة' : 'Native Sectors'}
              </button>
              <button onClick={() => onNavigate('portfolio')} className="text-right ltr:text-left hover:text-white transition-colors cursor-pointer">
                {isAr ? 'معرض أعمالنا' : 'Our Work'}
              </button>
              <button onClick={() => onNavigate('clients')} className="text-right ltr:text-left hover:text-white transition-colors cursor-pointer">
                {isAr ? 'شركاء النجاح' : 'Our Partners'}
              </button>
              <button onClick={() => onNavigate('faq')} className="text-right ltr:text-left hover:text-white transition-colors cursor-pointer">
                {isAr ? 'الأسئلة الشائعة' : 'FAQs'}
              </button>
              <button onClick={() => onNavigate('about')} className="text-right ltr:text-left hover:text-white transition-colors cursor-pointer">
                {isAr ? 'من نحن وقيمنا' : 'About Governance'}
              </button>
            </div>
          </div>

          {/* Compliance & standards */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-200">
              {isAr ? 'الامتثال والمعايير الوطنية' : 'Regulation & Standards'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'تلتزم منصاتنا برؤية المملكة 2030، وتوجهات الأمن السيبراني ولائحة حماية البيانات والخصوصية الإقليمية.'
                : 'All system endpoints are engineered in deep compliance with cyber-governance guidelines and regional privacy boards.'}
            </p>
          </div>

          {/* Direct channels */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-slate-200">
              {isAr ? 'قنوات التواصل المؤسسية' : 'Corporate Channels'}
            </h4>
            <div className="flex space-x-3.5 rtl:space-x-reverse text-slate-400">
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white transition-all" title="LinkedIn">
                <Linkedin className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white transition-all" title="Twitter">
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a href="mailto:info@businessdevelopers.sa" className="p-2.5 rounded-lg bg-slate-800 hover:bg-sky-600 hover:text-white transition-all" title="Email Us">
                <Mail className="w-4.5 h-4.5" />
              </a>
            </div>

            <div className="pt-3 border-t border-slate-800/60 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-sans">
                {isAr ? 'نسخ بيانات الاتصال السريع' : 'Copy Quick Contact Info'}
              </span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy('email', 'info@businessdevelopers.sa')}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-[11px] text-slate-300 transition-all cursor-pointer group w-full text-right ltr:text-left"
                >
                  <span className="flex items-center gap-1.5 font-mono overflow-hidden">
                    <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">info@businessdevelopers.sa</span>
                  </span>
                  <span className="text-[10px] text-sky-400 font-bold flex items-center gap-1 shrink-0">
                    {copiedType === 'email' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-emerald-400">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-400 shrink-0" />
                        <span>{isAr ? 'نسخ' : 'Copy'}</span>
                      </>
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy('phone', '+966 11 500 2030')}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-[11px] text-slate-300 transition-all cursor-pointer group w-full text-right ltr:text-left"
                >
                  <span className="flex items-center gap-1.5 font-mono overflow-hidden">
                    <PhoneCall className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">+966 11 500 2030</span>
                  </span>
                  <span className="text-[10px] text-sky-400 font-bold flex items-center gap-1 shrink-0">
                    {copiedType === 'phone' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-emerald-400">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-400 shrink-0" />
                        <span>{isAr ? 'نسخ' : 'Copy'}</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono">
              IP-Ingress Proxy: Secure Tunnel 3000
            </div>
          </div>

        </div>

        {/* Horizontal dividing line */}
        <div className="border-t border-slate-800/80 my-8" />

        {/* Lower row */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <span>
            {isAr
              ? 'حقوق الطبع والنشر © 2026 بيزنس ديفلوبرز. جميع الحقوق محفوظة.'
              : 'Copyright © 2026 Business Developers. All Rights Reserved.'}
          </span>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <a href="#" className="hover:underline">{isAr ? 'سياسة الخصوصية' : 'Privacy Code'}</a>
            <a href="#" className="hover:underline">{isAr ? 'شروط الخدمة والاستخدام' : 'Compliance Terms'}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
