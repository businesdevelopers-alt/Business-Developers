import { Lang } from '../types';
import { ArrowRight, ArrowLeft, Sparkles, Server, Cpu, ShieldCheck } from 'lucide-react';

interface HeroProps {
  lang: Lang;
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ lang, onNavigate }: HeroProps) {
  const isAr = lang === 'ar';

  return (
    <section
      id="hero-section"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden grid-bg-effect"
    >
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-8 text-center ltr:text-left rtl:text-right">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-100/80 dark:border-sky-900/50 text-sky-700 dark:text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isAr
                  ? 'شريك التحول الرقمي الموثوق لمختلف القطاعات'
                  : 'Reliable Digital Transformation Partner Across Industries'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              {isAr ? (
                <>
                  شركة تقنية معلومات <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-700">
                    تبتكر لكل قطاع
                  </span>
                </>
              ) : (
                <>
                  Information Technology <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-700">
                    Engineered For Sectors
                  </span>
                </>
              )}
            </h1>

            {/* Description Paragraph */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {isAr
                ? 'أسست شركة بيزنس ديفلوبرز مجموعة واسعة من الحلول لخدمة مختلف القطاعات. بعد اكتساب فهم عميق للتحديات والفرص الخاصة بكل صناعة، نقدم حلولًا مخصصة للقطاعات تدفع النمو والكفاءة والابتكار، مما يمكّن الشركات والحكومات من تحقيق إمكاناتها الكاملة.'
                : 'Business Developers established a wide range of custom solutions serving diverse industries. Backed by deep understanding of industry challenges, we deliver tailored formulas propelling efficiency, growth, and sovereign innovation.'}
            </p>

            {/* Dual Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-explore-solutions-btn"
                onClick={() => onNavigate('solutions')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-base transition-all shadow-md shadow-sky-100 hover:shadow-lg flex items-center justify-center space-x-2 rtl:space-x-reverse active:scale-98 cursor-pointer"
              >
                <span>{isAr ? 'استكشف حلولنا التقنية' : 'View Core Solutions'}</span>
                {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>

              <button
                id="hero-sectors-btn"
                onClick={() => onNavigate('sectors')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
              >
                {isAr ? 'قطاعات العمل والتحول' : 'Explore Native Sectors'}
              </button>
            </div>

            {/* Quick trust metrics line */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-500 text-xs">
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{isAr ? 'مطابق لأعلى معايير الأمن والأيزو' : 'ISO & Cyber-Security Compliant'}</span>
              </div>
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <Server className="w-4 h-4 text-sky-500" />
                <span>{isAr ? 'تشغيل محلي وسحابي هجين' : 'Hybrid Cloud/On-Prem Deployments'}</span>
              </div>
            </div>

          </div>

          {/* Right Column Interactive Console Layout */}
          <div className="lg:col-span-5 h-full relative flex items-center justify-center">
            
            <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600" />
              
              {/* Fake dashboard headers */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-xs font-mono text-slate-400 ml-2">mesh-node-03.db</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono font-medium animate-pulse">
                  {isAr ? 'نشط وآمن' : 'SYS_ONLINE'}
                </span>
              </div>

              {/* Graphical illustration of IT Sector Connectivity */}
              <div className="space-y-4 font-sans">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                    <span>{isAr ? 'معدل كفاءة التحول الرقمي' : 'Digital Transformation Health'}</span>
                    <span className="font-semibold text-sky-600">98.4%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-500 to-sky-600 rounded-full" style={{ width: '98.4%' }} />
                  </div>
                </div>

                {/* Mock live stream lines */}
                <div className="text-xs space-y-2">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">
                    {isAr ? 'الأنشطة الأخيرة للقطاعات' : 'Recent sector deployments'}
                  </span>
                  
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/40 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-medium text-slate-700 truncate max-w-[180px]">
                        {isAr ? 'ربط السجلات الطبية السحابية' : 'Healthcare EHR Cloud Sync'}
                      </span>
                    </div>
                    <span className="font-mono text-slate-400 text-[10px]">12ms</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-indigo-50/40 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="font-medium text-slate-700 truncate max-w-[180px]">
                        {isAr ? 'فحص معاملات الدفع المصرفية بالـ AI' : 'BFSI AI Fraud Check'}
                      </span>
                    </div>
                    <span className="font-mono text-slate-400 text-[10px]">4ms</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-sky-50/40 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="w-2 h-2 rounded-full bg-sky-500" />
                      <span className="font-medium text-slate-700 truncate max-w-[180px]">
                        {isAr ? 'أتمتة معاملات الخدمة البلدية' : 'Gov Paperless Automation'}
                      </span>
                    </div>
                    <span className="font-mono text-slate-400 text-[10px]">80ms</span>
                  </div>
                </div>

                {/* Simulated telemetry values */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 text-center">
                    <span className="block text-[10px] text-slate-400">{isAr ? 'القطاعات النشطة' : 'Active Sectors'}</span>
                    <span className="text-xl font-bold text-slate-800">7 / 7</span>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 text-center">
                    <span className="block text-[10px] text-slate-400">{isAr ? 'جهوزية السحب' : 'Cloud Availability'}</span>
                    <span className="text-xl font-bold text-slate-800">99.99%</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Glowing sphere behind the card to capture professional modern atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 to-indigo-500/20 rounded-full blur-2xl -z-20 scale-90" />
          </div>

        </div>
      </div>
    </section>
  );
}
