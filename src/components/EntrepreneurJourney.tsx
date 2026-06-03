import React, { useState } from 'react';
import { Lang, Client, ClientRequest } from '../types';
import { 
  Rocket, 
  Users, 
  Map, 
  Compass, 
  Award, 
  TrendingUp, 
  Layers, 
  Activity, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  HelpCircle, 
  Phone, 
  Shield, 
  Calendar, 
  DollarSign,
  Users2,
  FileCheck2,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EntrepreneurJourneyProps {
  lang: Lang;
  currentClient: Client | null;
  onAddRequest?: (req: Omit<ClientRequest, 'id' | 'createdAt' | 'clientEmail' | 'status'>) => void;
  onOpenClientPortal?: () => void;
}

export default function EntrepreneurJourney({ 
  lang, 
  currentClient, 
  onAddRequest,
  onOpenClientPortal
}: EntrepreneurJourneyProps) {
  const isAr = lang === 'ar';
  
  const [selectedPackage, setSelectedPackage] = useState<'launch' | 'growth' | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    name: currentClient?.name || '',
    email: currentClient?.email || '',
    phone: currentClient?.phone || '',
    companyName: currentClient?.companyName || '',
    notes: ''
  });
  const [bookSuccess, setBookSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync client profile details when they login or register
  if (currentClient && bookingFormData.email !== currentClient.email) {
    setBookingFormData({
      name: currentClient.name,
      email: currentClient.email,
      phone: currentClient.phone || '',
      companyName: currentClient.companyName,
      notes: bookingFormData.notes
    });
  }

  const pillars = [
    {
      id: 'support',
      titleAr: 'التواصل والدعم',
      titleEn: 'Communication & Support',
      descAr: 'منصة تفاعلية متطورة للتواصل المثمر والمباشر مع لفيف من الخبراء، والمستشارين، والمستثمرين المتخصصين.',
      descEn: 'An interactive platform to connect and build networks directly with leading experts, mentors, and investors.',
      icon: Users2,
      color: 'from-sky-500 to-sky-600'
    },
    {
      id: 'plan',
      titleAr: 'تطوير الخطة',
      titleEn: 'Plan Development',
      descAr: 'توجيه وإرشاد مخصص خطوة بخطوة لتطوير خطة عمل شاملة، ونموذج أعمال متكامل ذي قيم تشغيلية حقيقية.',
      descEn: 'Personalized guidance and advisory iterations to develop an executive business model and sustainable roadmap.',
      icon: FileCheck2,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'analyse',
      titleAr: 'تحليل الفكرة',
      titleEn: 'Idea Analysis',
      descAr: 'تحليل معمق لفكرتك وتحديد مواطن القوة ونقاط التحسين، وصياغة الاحتياجات الفنية والمالية بدقة.',
      descEn: 'Deep-dive analysis of your core value proposal, defining precise project needs and market demand alignment.',
      icon: Lightbulb,
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  const steps = [
    {
      num: '01',
      titleAr: 'من الفكرة إلى المفهوم',
      titleEn: 'From Idea to Concept',
      descAr: 'تحليل فكرتك الاستراتيجية، فحص فرضيات العمل وتحديد قيمتها السوقية المستهدفة بموضوعية وعلمية.',
      descEn: 'Analyzing your strategic idea, verifying assumptions, and pinpointing target market value with precision.'
    },
    {
      num: '02',
      titleAr: 'من المفهوم إلى النموذج',
      titleEn: 'From Concept to Prototype',
      descAr: 'تصميم نموذج عمل ذكي، وبناء تجربة عملاء واعدة ومميزة تلبي توقعات السوق التنافسي.',
      descEn: 'Designing lean business models and crafting an exceptional customer journey mapping real pains.'
    },
    {
      num: '03',
      titleAr: 'من النموذج إلى المنتج',
      titleEn: 'From Prototype to Product',
      descAr: 'تحويل النموذج الأولي المبدئي إلى منتج حقيقي أو خدمة قابلة للتطبيق والتشغيل الفني الفعلي.',
      descEn: 'Transitioning early blueprints into a fully functional product or service ready for deployment.'
    },
    {
      num: '04',
      titleAr: 'من المنتج إلى الريادة',
      titleEn: 'From Product to Scaling',
      descAr: 'تحقيق عوائد التوسع والاستدامة المؤسسية طويلة المدى مع توفير دعم وخبرات استرشادية مستمرة.',
      descEn: 'Attaining systemic expansion, solid financial metrics, and ongoing leadership support for stable scaling.'
    }
  ];

  const benefitsLaunch = [
    { ar: 'نظام إدارة شامل يوفّر رؤية متكاملة لمراحل المشروع، وتقدّمه، والمهام المرتبطة به.', en: 'Comprehensive management system providing complete visibility over project phases, tasks and deadlines.' },
    { ar: 'متابعة فردية من مرشد مختص، مع جلستين إرشاد أسبوعيًا تُفعّل حسب الحاجة.', en: 'One-on-one tailored follow-up by a dedicated mentor, with 2 coaching sessions per week activated on demand.' },
    { ar: 'وصول مباشر لقائمة مستشارين متخصصين مع إمكانية حجز الجلسات حسب الحاجة.', en: 'Direct access to our roster of certified specialists with multi-tier session booking integrations.' },
    { ar: 'أدوات ودليل لتصميم وبناء وتحليل المشروع من الصفر للريادة.', en: 'Interactive frameworks, checklists, and manuals to successfully design and model your startup.' },
    { ar: 'إمكانية رفع تقارير جاهزة لمنظومة مستثمرين داخل المنصة والتقديم على فرص تمويل.', en: 'Export and pitch institutional-grade progress reports straight to internal investors network.' },
    { ar: 'نظام متكامل لإدارة المهام والتنبيهات المترابطة داخل المنصة.', en: 'Integrated dashboard mapping task workflows, alerts, and critical milestone tracking.' },
    { ar: 'مكتبة معرفية تشمل مقالات، بودكاست، أدوات، ودورات افتراضية.', en: 'Ongoing access to i-be digital library of articles, podcasts, tools, and remote cohorts.' },
    { ar: 'مجتمع تفاعلي لتبادل المعرفة والخبرة مع رواد أعمال واعدين.', en: 'Interactive digital community for knowledge transfer and sharing lessons with fellow executives.' },
    { ar: 'فعاليات شهرية حصرية مع خبراء ومتخصصين وصناديق الاستثمار الجريء.', en: 'Monthly networking events and panel sit-downs with field experts, specialists and VC partners.' }
  ];

  const benefitsGrowth = [
    { ar: 'إمكانية إضافة حتى 5 أعضاء في الفريق وتوزيع الصلاحيات.', en: 'Add and organize up to 5 core team members under a single unified billing workspace.' },
    { ar: 'صلاحيات كاملة لإسناد المهام وتتبع التقدّم التشغيلي داخل الفريق.', en: 'Task delegation controls, detailed workflow analytics, and progress tracking per member.' },
    { ar: 'متابعة فردية من مرشد مختص، مع جلستين إرشاد أسبوعيًا تُفعّل حسب الحاجة.', en: 'One-on-one tailored follow-up by a dedicated mentor, with 2 coaching sessions per week activated on demand.' },
    { ar: 'وصول مباشر لقائمة مستشارين متخصصين مع إمكانية حجز الجلسات حسب الحاجة.', en: 'Direct access to our roster of certified specialists with multi-tier session booking integrations.' },
    { ar: 'أدوات ودليل لتصميم وبناء وتحليل المشروع بالكامل.', en: 'Complete bundle of design, build and analysis frameworks to structure high-performing ideas.' },
    { ar: 'إمكانية رفع تقارير جاهزة لمنظومة مستثمرين داخل المنصة والتقديم على فرص تمويل.', en: 'Direct, streamlined pitching module to upload project reports to local VC networks.' },
    { ar: 'نظام متكامل لإدارة المهام والتنبيهات للأعضاء والإدارة.', en: 'Integrated priority tasks layout, status alarms, and progress milestones charts.' },
    { ar: 'مكتبة معرفية تشمل مقالات، بودكاست، أدوات، ودورات افتراضية متطورة.', en: 'All-inclusive knowledge database of webinars, podcasts, resources and sandbox toolkits.' },
    { ar: 'مجتمع تفاعلي متكامل لتبادل المعرفة والخبرات.', en: 'Interactive ecosystem for fluid communication with leading developers and startup founders.' },
    { ar: 'فعاليات شهرية مع خبراء ومتخصصين في ريادة الأعمال.', en: 'Monthly fireside panels and executive roundtable networking access.' },
    { ar: 'خصم 20% حصري وللمؤسسة على مساحات العمل المشتركة التابعة لـ i-be.', en: 'Exclusive 20% discount on i-be premium co-working spaces, private desks, and meeting rooms.' }
  ];

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingFormData.name || !bookingFormData.phone || !bookingFormData.email) {
      alert(isAr ? 'برجاء تعبئة الاسم والبريد والجوال لإتمام الحجز.' : 'Please enter your name, email and phone number to complete booking.');
      return;
    }

    setIsSubmitting(true);
    const selectedPkgName = selectedPackage === 'launch' 
      ? (isAr ? 'باقة الانطلاق' : 'Launch Package (Monthly)') 
      : (isAr ? 'باقة النمو' : 'Growth Package (Monthly)');
    
    const priceText = selectedPackage === 'launch' ? '449' : '899';

    if (onAddRequest) {
      await onAddRequest({
        name: bookingFormData.name,
        companyName: bookingFormData.companyName || (isAr ? 'غير محدد' : 'Individual'),
        sectorId: 'retail', // baseline
        solutionId: 'corporate-innovation', // mapped to innovation
        message: isAr 
          ? `طلب حجز [رحلة رائد الأعمال - ${selectedPkgName}] بسعر ${priceText} ريال شهرياً. ملاحظات العميل: ${bookingFormData.notes || 'لا يوجد'}. هاتف التواصل: ${bookingFormData.phone}`
          : `Booking package requested: [i-be Route - ${selectedPkgName}] evaluated at ${priceText} SAR/monthly. Customer note: ${bookingFormData.notes || 'None'}. Contact mobile: ${bookingFormData.phone}`,
        phone: bookingFormData.phone
      });
    }

    setIsSubmitting(false);
    setBookSuccess(true);
    setTimeout(() => {
      setBookSuccess(false);
      setSelectedPackage(null);
      setBookingFormData({
        name: currentClient?.name || '',
        email: currentClient?.email || '',
        phone: currentClient?.phone || '',
        companyName: currentClient?.companyName || '',
        notes: ''
      });
    }, 4500);
  };

  return (
    <section id="entrepreneurship" className="py-20 bg-slate-900 text-white relative overflow-hidden scroll-mt-10">
      
      {/* Decorative Grids and Light Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent top-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Intro Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold leading-none border border-sky-500/20">
            <Rocket className="w-3.5 h-3.5 animate-pulse" />
            <span>{isAr ? 'ابدأ رحلتك الريادية بثقة مع i-be' : 'Launch Confidently with i-be Ecosystem'}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-pretty">
            {isAr ? 'انطلق في بيئة ريادية تدعم طموحاتك' : 'Launch in an Entrepreneurial Environment Supporting Ambitions'}
          </h2>
          
          <p className="text-sky-350 text-base sm:text-lg font-medium">
            {isAr ? 'خطوتك الأولى نحو الريادة التنافسية والنمو المستدام' : 'Your Progressive Step Towards Startup Leadership'}
          </p>
          
          <p className="text-slate-450 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            {isAr 
              ? 'نقدم لك الأدوات والإرشاد اللازمين لتحويل فكرتك إلى مشروع ريادي ناجح. من خلال فريقنا المتخصص ومجتمعنا المبتكر، ستجد الدعم الاستثنائي اللازم لتحقيق غاياتك.'
              : 'We provide you with the fundamental toolkit and elite mentorship interfaces needed to translate your concept into a thriving entrepreneurial project. Learn through our specialists. Find your path.'}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -6 }}
                className="bg-slate-850 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-sky-500/40 hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {isAr ? p.titleAr : p.titleEn}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                      {isAr ? p.descAr : p.descEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline Roadmap Section */}
        <div className="border-t border-slate-800 pt-16 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              {isAr ? 'رحلة رائد الأعمال في i-be' : 'Entrepreneur Journey Lifecycle inside i-be'}
            </h3>
            <p className="text-slate-450 text-sm">
              {isAr ? 'أربعة مستهدفات رئيسية ننتقل معك خلالها بثبات' : 'Four systematic building blocks scaling your startup.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Timeline horizontal background connector line */}
            <div className="hidden lg:block absolute top-12 left-12 right-12 h-0.5 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-emerald-500/25 z-0" />

            {steps.map((step, idx) => {
              return (
                <div key={idx} className="bg-slate-850/60 border border-slate-800 rounded-xl p-6 relative z-10 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Step circle accent */}
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                        {step.num}
                      </span>
                      <span className="text-[10px] text-sky-450 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-900/30 uppercase tracking-widest font-bold">
                        {isAr ? `المرحلة ${step.num}` : `Phase ${step.num}`}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">
                        {isAr ? step.titleAr : step.titleEn}
                      </h4>
                      <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                        {isAr ? step.descAr : step.descEn}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Packages & Pricing Section */}
        <div className="border-t border-slate-800 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-emerald-450 text-xs font-bold uppercase tracking-widest">
              {isAr ? 'باقات مدروسة تلائم تطلعاتك' : 'Affordable Venture Packages'}
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              {isAr ? 'استكشف باقاتنا المميزة الكبرى' : 'Explore Our Premium Bundled Packages'}
            </h3>
            <p className="text-slate-400 text-sm">
              {isAr ? 'نظم إدارية متكاملة، شبكة متسعة، وجلسات إرشاد وتوجيه مخصصة' : 'All comprehensive mentorship options, workspace facilities and investment channels.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* Package 1: Launch */}
            <div className="bg-slate-850 border border-slate-850 hover:border-sky-500/40 rounded-2xl p-8 flex flex-col justify-between transition-all hover:shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-sky-500/5 to-transparent pointer-events-none rounded-tr-2xl" />
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center justify-between">
                    <span>{isAr ? 'باقة الانطلاق' : 'Launch Package'}</span>
                    <span className="text-xs font-normal text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-900/30">
                      {isAr ? 'شهري' : 'Monthly'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr ? 'مثالية لرواد الأعمال المبتدئين في طور الفكرة وصياغة النماذج.' : 'Best for early-stage entrepreneurs mapping ideas and defining products.'}
                  </p>
                </div>

                {/* Price Display */}
                <div className="py-4 border-y border-slate-800">
                  <div className="flex items-baseline space-x-1 rtl:space-x-reverse">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">449</span>
                    <span className="text-sm text-slate-400">{isAr ? 'ر.س' : 'SAR'}</span>
                    <span className="text-xs text-slate-500 font-normal">/ {isAr ? 'شهرياً' : 'monthly'}</span>
                  </div>
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span>{isAr ? 'السعر شامل لضريبة القيمة المضافة بالكامل' : 'All prices are VAT inclusive.'}</span>
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-3.5 text-xs">
                  <span className="text-slate-450 font-semibold block uppercase tracking-wider">
                    {isAr ? 'مزايا ومنافع الباقة:' : 'Package Inclusions & Benefits:'}
                  </span>
                  <ul className="space-y-3">
                    {benefitsLaunch.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-slate-350">
                        <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <span className="text-[12px] leading-relaxed select-none">
                          {isAr ? benefit.ar : benefit.en}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-8 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedPackage('launch')}
                  className="w-full text-center py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-md hover:shadow-sky-500/10 cursor-pointer active:scale-98"
                >
                  {isAr ? 'احجز الآن' : 'Book Launch Now'}
                </button>
              </div>
            </div>

            {/* Package 2: Growth */}
            <div className="bg-slate-850 border border-slate-850 hover:border-indigo-500/40 rounded-2xl p-8 flex flex-col justify-between transition-all hover:shadow-xl relative overflow-hidden group ring-1 ring-inset ring-indigo-500/20">
              {/* Popularity Badge */}
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none rounded-tr-2xl" />
              <div className="absolute -top-3 left-8 bg-indigo-600 border border-indigo-400 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                {isAr ? 'الباقة الأكثر طلباً' : 'Most Popular'}
              </div>

              <div className="space-y-6 pt-2">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center justify-between">
                    <span>{isAr ? 'باقة النمو' : 'Growth Package'}</span>
                    <span className="text-xs font-normal text-indigo-450 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/30">
                      {isAr ? 'شهري' : 'Monthly'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr ? 'مثالية للفرق والمجموعات الريادية التي تمتلك نموذجاً وتتطلع للتوسع.' : 'Excellent for active teams of co-founders looking to build stable ventures.'}
                  </p>
                </div>

                {/* Price Display */}
                <div className="py-4 border-y border-slate-800">
                  <div className="flex items-baseline space-x-1 rtl:space-x-reverse">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">899</span>
                    <span className="text-sm text-slate-400">{isAr ? 'ر.س' : 'SAR'}</span>
                    <span className="text-xs text-slate-500 font-normal">/ {isAr ? 'شهرياً' : 'monthly'}</span>
                  </div>
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span>{isAr ? 'السعر شامل لضريبة القيمة المضافة بالكامل' : 'All prices are VAT inclusive.'}</span>
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-3.5 text-xs">
                  <span className="text-slate-450 font-semibold block uppercase tracking-wider">
                    {isAr ? 'مزايا ومنافع الباقة:' : 'Package Inclusions & Benefits:'}
                  </span>
                  <ul className="space-y-3">
                    {benefitsGrowth.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-slate-350">
                        <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-[12px] leading-relaxed select-none">
                          {isAr ? benefit.ar : benefit.en}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-8 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedPackage('growth')}
                  className="w-full text-center py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition-all shadow-md hover:shadow-indigo-500/15 cursor-pointer active:scale-98"
                >
                  {isAr ? 'احجز الآن' : 'Book Growth Now'}
                </button>
              </div>
            </div>

          </div>

          {/* Quick Consultation footer call-out */}
          <div className="mt-16 text-center max-w-xl mx-auto bg-slate-850/40 rounded-xl p-6 border border-slate-800/80">
            <h4 className="text-sm sm:text-base font-bold text-white mb-2">
              {isAr ? 'هل تبحث عن متطلبات مخصصة بالكامل لمؤسستك؟' : 'Looking for complete enterprise setups?'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {isAr 
                ? 'نحن هنا لمساندتك وتزويد رواد أعمالك بأمهر الحزم والمنتجات المخصصة. تواصل معنا اليوم لمناقشة خارطة طريق خاصة.' 
                : 'Inquire today to orchestrate specialized sandboxes for your teams or institutional venture cohorts.'}
            </p>
            <a 
              href="#consultation" 
              className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline transition-all"
            >
              <span>{isAr ? 'تواصل معنا الآن للابتكار والمشورة' : 'Contact Us / Inquire Today'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
            </a>
          </div>
        </div>

      </div>

      {/* Booking Dialogue Overlay Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              {/* Header block */}
              <div className="bg-slate-850 p-6 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-sky-450 uppercase tracking-widest block">
                    {isAr ? 'خطوتك الأولى نحو الريادة' : 'Your First Step Towards Leadership'}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">
                    {isAr ? 'تأكيد حجز الباقة المميزة' : 'Confirm Package Reservation'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPackage(null)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-450 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold font-mono px-1">X</span>
                </button>
              </div>

              {/* Feedback Success State */}
              {bookSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h5 className="text-base font-bold text-white">
                    {isAr ? 'تم تسجيل وتأكيد رغبتك بالحجز بنجاح!' : 'Booking Request Filed Successfully!'}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr 
                      ? 'نشكرك على ثقتك في باقاتنا وبيئتنا المبتكرة. لقد قمنا بتسجيل طلبك وإدراجه في لوحة تتبع العمليات بمركز العملاء. سيتواصل مرشدك المخصص خلال أقل من 12 ساعة لتفعيل الباقة.'
                      : 'We registered your request on our secure database records. A structured inquiry tracking ID has been created inside your Client Portal. Your dedicated mentor will call you in less than 12 hours.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookSubmit} className="p-6 space-y-4 text-xs font-medium">
                  
                  {/* Selected Plan Details Indicator */}
                  <div className="bg-slate-850/50 p-4 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-400 block">{isAr ? 'الباقة المحددة:' : 'Selected Package:'}</span>
                      <span className="font-extrabold text-white text-sm">
                        {selectedPackage === 'launch' 
                          ? (isAr ? 'باقة الانطلاق (شهرية)' : 'Launch Package (Monthly)') 
                          : (isAr ? 'باقة النمو (شهرية)' : 'Growth Package (Monthly)')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-450 block">{isAr ? 'تكلفة الاشتراك:' : 'Subscription Cost:'}</span>
                      <span className="text-lg font-bold text-emerald-400 font-mono">
                        {selectedPackage === 'launch' ? '449' : '899'} {isAr ? 'ر.س' : 'SAR'}
                      </span>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 block">{isAr ? 'اسم رائد الأعمال الكامل *' : 'Full Name *'}</label>
                      <input 
                        type="text" 
                        required
                        value={bookingFormData.name}
                        onChange={(e) => setBookingFormData(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-xs"
                        placeholder={isAr ? 'مثال: عبد الله بن حمد' : 'e.g. Abdullah bin Hamad'}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 block">{isAr ? 'رقم هاتف التواصل *' : 'Contact Number *'}</label>
                      <input 
                        type="tel" 
                        required
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData(p => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-xs"
                        placeholder={isAr ? 'مثال: 055555555' : 'e.g. 055555555'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 block">{isAr ? 'اسم المنشأة أو المشروع' : 'Entity / Project Name'}</label>
                      <input 
                        type="text"
                        value={bookingFormData.companyName}
                        onChange={(e) => setBookingFormData(p => ({ ...p, companyName: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-xs"
                        placeholder={isAr ? 'اختياري' : 'Optional'}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 block">{isAr ? 'البريد الإلكتروني للعمل *' : 'Business Email *'}</label>
                      <input 
                        type="email" 
                        required
                        value={bookingFormData.email}
                        onChange={(e) => setBookingFormData(p => ({ ...p, email: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-xs"
                        placeholder={isAr ? 'مثال: mail@startup.sa' : 'e.g. mail@startup.sa'}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 block">{isAr ? 'ملاحظات وتطلعات المشروع' : 'Project details & expectations'}</label>
                    <textarea 
                      rows={2}
                      value={bookingFormData.notes}
                      onChange={(e) => setBookingFormData(p => ({ ...p, notes: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-xs resize-none"
                      placeholder={isAr ? 'اكتب تطلعاتك أو وصفاً سريعاً لفكرتك وقطاعها...' : 'Tell us briefly about your idea and goals...'}
                    />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 text-center py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all text-xs cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (isAr ? 'جاري إرسال طلبكم...' : 'Registering Request...') : (isAr ? 'تأكيد وحجز الباقة الآن' : 'Confirm Book & Register')}
                    </button>
                    {!currentClient && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPackage(null);
                          if (onOpenClientPortal) onOpenClientPortal();
                        }}
                        className="text-center py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all text-xs cursor-pointer"
                      >
                        {isAr ? 'تسجيل دخول العملاء لتسريع التفعيل' : 'Sign In as Client first'}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
