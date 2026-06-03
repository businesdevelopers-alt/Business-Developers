import { Lang } from '../types';
import { Award, ShieldAlert, Sparkles, Target, Zap, Users } from 'lucide-react';

interface AboutProps {
  lang: Lang;
}

export default function AboutSection({ lang }: AboutProps) {
  const isAr = lang === 'ar';

  const values = [
    {
      icon: <Target className="w-6 h-6 text-sky-600" />,
      titleAr: 'الفهم العميق للقطاعات',
      titleEn: 'Deep Industry Understanding',
      descAr: 'لا ننتج حلولاً عشوائية؛ بل ندرس التحديات التنظيمية والفرص التشغيلية الخاصة بكل قطاع لنصنع حلولاً دقيقة ومنتجة.',
      descEn: 'We do not deliver bulk setups. We study regulatory hurdles and operational targets of each unique sector first.'
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-600" />,
      titleAr: 'جودة تكنولوجية عالمية',
      titleEn: 'World-Class Quality Standards',
      descAr: 'نقدم مجموعات متكاملة من تقنيات تكنولوجيا المعلومات ذات الجودة العالمية تضمن الاستقرار وتمنع الأعطال ومقاومة التهديدات.',
      descEn: 'We provide integrated packages of world-class IT technologies guaranteeing system stability and resistance to active malware.'
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      titleAr: 'تسريع الابتكار والنمو',
      titleEn: 'Accelerated Market Innovation',
      descAr: 'نقوم بتقليص فترات التطوير وتمكين الهيئات والشركات من إطلاق منتجاتها الرقمية والتفاعل المباشر مع العملاء بسرعة فائقة.',
      descEn: 'We slash deployment turnarounds, empowering entities to release products and trigger immediate interaction.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 relative scroll-mt-20">
      
      {/* Decorative smooth circle lights */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'عن بيزنس ديفلوبرز' : 'About Business Developers'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {isAr ? 'رواد صياغة وتشييد البنية الرقمية الذكية' : 'Architecting Sovereign Digital Ecosystems'}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isAr
                ? 'تأسست شركة بيزنس ديفلوبرز انطلاقاً من رؤية واضحة تهدف لتمكين الشركات والحكومات من ممارسة أعمالها بأقصى طاقة ممكنة. من خلال دمج الخبرات الاستشارية المتقدمة بالحلول البرمجية الأكثر قوة وموثوقية.'
                : 'Business Developers was established with a clear mandate to empower corporations and governments to realize their full sovereign potential, connecting advisory excellence with robust software setups.'}
            </p>

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'تحت إشراف صفوة من خبراء عمارة النظم والأمن السيبراني، نضمن الحفاظ على رريادتك التشغيلية وتجربتك التنافسية في سوق عالمي سريع التغير.'
                : 'Guided by system architects and cyber defense experts, we ensure your operational excellence remains robust in highly volatile global markets.'}
            </p>

            <div className="pt-4 flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                <div className="w-9 h-9 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-700">AR</div>
                <div className="w-9 h-9 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">SA</div>
                <div className="w-9 h-9 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">EN</div>
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                {isAr ? 'مستشارون معتمدون في دول مجلس التعاون' : 'Certified Enterprise Architects'}
              </div>
            </div>
          </div>

          {/* Right Column Core values cards */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid sm:grid-cols-1 gap-6">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse group"
                >
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {val.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-slate-900">
                      {isAr ? val.titleAr : val.titleEn}
                    </h4>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                      {isAr ? val.descAr : val.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
