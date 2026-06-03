import React, { useState } from 'react';
import { Lang } from '../types';
import { 
  FileText, 
  TrendingUp, 
  Award, 
  Coins, 
  Network, 
  ShieldAlert, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Check, 
  Sliders, 
  Clock, 
  DollarSign, 
  Printer, 
  FileCheck,
  Building,
  UserCheck,
  Briefcase,
  ExternalLink,
  PhoneCall,
  Info,
  ArrowLeftRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesMarketProps {
  lang: Lang;
}

interface ServiceItem {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: React.ElementType;
  descriptionAr: string;
  descriptionEn: string;
  category: 'plans' | 'structures' | 'financials';
  basePriceSAR: number;
  baseDays: number;
  featuresAr: string[];
  featuresEn: string[];
  deliverablesAr: string[];
  deliverablesEn: string[];
  detailsAr: string;
  detailsEn: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'feasibility',
    titleAr: 'دراسة جدوى شاملة',
    titleEn: 'Comprehensive Feasibility Study',
    icon: Award,
    descriptionAr: 'تحليل مالي وفني وتسويقي متكامل لربحية المشروع وفرصه واستقراره في الأسواق المحلية والإقليمية.',
    descriptionEn: 'Rigorous financial, technical, and marketing study evaluating profit margins and viability in local markets.',
    category: 'plans',
    basePriceSAR: 12500,
    baseDays: 14,
    featuresAr: [
      'دراسة العرض والطلب وحجم الفجوة التسويقية بمؤشرات محلية دقيقة.',
      'تحديد آلات وخطوط الإنتاج والتسلسل التشغيلي الأمثل.',
      'هيكلة الاحتياجات الرأسمالية والتقديرات التمويلية للسنوات الخمس الأولى.'
    ],
    featuresEn: [
      'Supply and demand matching with domestic localized metrics.',
      'Machinery, operational pipelines, and layout specifications.',
      'Capital budget modeling and financing paths for a 5-year outlook.'
    ],
    deliverablesAr: [
      'تقرير دراسة السوق والتحليل التنافسي التفصيلي.',
      'التقرير الفني وتخطيط القدرات التشغيلية والمواقع المعتمدة.',
      'النموذج المالي لحساب مؤشرات NPV, IRR, ROI وفترة الاسترداد.'
    ],
    deliverablesEn: [
      'Comprehensive Market Analysis and Competitive Mapping.',
      'Technical Plan specifying operational inputs and layout blueprints.',
      'Financial assessment calculating NPV, IRR, ROI and Payback bounds.'
    ],
    detailsAr: 'نصيغ دراسات جدوى معتمدة ومطابقة لمتطلبات الصناديق التمويلية والبنوك وبوابات الاستثمار الوطنية، مما يمنح مشروعك الضمان والقبول الفعلي.',
    detailsEn: 'We deliver certified feasibility parameters complying fully with municipal, central banking, and ministry investment platforms.'
  },
  {
    id: 'business-plan',
    titleAr: 'خطة عمل استراتيجية (Business Plan)',
    titleEn: 'Strategic Business Plan',
    icon: FileText,
    descriptionAr: 'خارطة طريق وحوكمة متطورة للمستثمرين لرسم نموذج العمل التشغيلي والتحصيل التسويقي بنظم مرنة.',
    descriptionEn: 'A visionary roadmap outlining organizational structures, market approaches, and milestones for venture backers.',
    category: 'plans',
    basePriceSAR: 9800,
    baseDays: 10,
    featuresAr: [
      'تصميم نموذج العمل التجاري (Business Model Canvas) وتحليل القيمة.',
      'رسم الهيكل الوظيفي وخطط التدرج التشغيلي وإدارة الموارد البشرية.',
      'تأسيس مؤشرات الأداء الاستراتيجية (OKRs & KPIs) لجميع الأقسام.'
    ],
    featuresEn: [
      'Business Model Canvas formulation and value proposition design.',
      'Personnel scaling matrices and Human Resources operational roadmap.',
      'Strategic Objectives mapping via corporate OKRs and divisional KPIs.'
    ],
    deliverablesAr: [
      'مستند خطة العمل الفاخر المناسب للعروض التقديمية الاستثمارية.',
      'العرض الاستثماري التفاعلي (Pitch Deck) بأسلوب بصري مذهل.',
      'تحليل SWOT ومصفوفة الأطراف المعنية وخارطة طريق المراحل الكبرى.'
    ],
    deliverablesEn: [
      'Premium investor-ready Business Plan document (PDF/Word).',
      'Dynamic Pitch Deck tailored to aggregate venture capital leads.',
      'Detailed SWOT Matrix and strategic growth phases timeline.'
    ],
    detailsAr: 'نحدد خطة عملك بدقة استراتيجية تبسط لشركائك فهم القيمة التشغيلية والمخاطر المخطط لها، لضمان اتخاذ قرار جريء ومستمر.',
    detailsEn: 'Articulating business core loops and milestones so that partners instantly align around long-term growth.'
  },
  {
    id: 'marketing-plan',
    titleAr: 'خطة تسويق وحملات انتشار شاملة',
    titleEn: 'Dynamic Marketing & Growth Plan',
    icon: TrendingUp,
    descriptionAr: 'استراتيجية تسويقية ذكية لزيادة حصتك السوقية وخفض تكاليف الاستحواذ بالاعتماد على أدق قنوات التحول الرقمي.',
    descriptionEn: 'Data-driven marketing architecture designed to optimize acquisition loops and grow organic customer footprints.',
    category: 'plans',
    basePriceSAR: 7500,
    baseDays: 8,
    featuresAr: [
      'تسييل وتوزيع هويات شخصيات العملاء المستهدفة (Buyer Personas).',
      'صياغة خطة المزيج التسويقي الحديث الرقمي والعضوي (7Ps/4Ps).',
      'تصميم خطط التسويق بالمحتوى والتحسين لمحركات البحث SEO.'
    ],
    featuresEn: [
      'Frictionless customer persona segregation and painpoints tracking.',
      'Omnichannel marketing mix parameters (Classic & Digital 7Ps layout).',
      'Search engine search optimization roadmap and content creation plans.'
    ],
    deliverablesAr: [
      'دليل استراتيجية التسويق والانتشار ودورات الاستبقاء الجذابة.',
      'تقويم ومخطط حملات الإعلانات المدفوعة ربع السنوي.',
      'لوحة قياس وتحليل نفقات الحملات ومؤشرات العائد على الإنفاق ROAS.'
    ],
    deliverablesEn: [
      'Integrated Positioning and Growth Strategy Playbook.',
      'Quarterly budget distributions and active campaigns timeline.',
      'Real-time tracking mock metrics dashboard detailing CAC and ROAS bounds.'
    ],
    detailsAr: 'لا نعتمد على العبارات العامة؛ نضع أرقاماً، مؤشرات أداء، وخطة واقعية واضحة بميزانيتها لتتمكن من إطلاق حملاتك فورياً ومتابعة عوائدها بدقة.',
    detailsEn: 'Forgoing vague phrases, we lay out actual budgets, schedules, and conversion funnels ready for client launch.'
  },
  {
    id: 'financial-plan',
    titleAr: 'خطة مالية ونمذجة سيناريوهات استثمارية',
    titleEn: 'Financial Plan & Cashflow Modeling',
    icon: Coins,
    descriptionAr: 'بناء نموذج رياضي تفاعلي مرن متعدد الاحتمالات لقياس تدفقات الخزينة وتوقعات التقارب المالي.',
    descriptionEn: 'Constructing dynamic sheets tracking P&L, balance states, and investment dilution rules for multiple market scenarios.',
    category: 'financials',
    basePriceSAR: 15400,
    baseDays: 12,
    featuresAr: [
      'نمذجة القوائم المالية الأساسية المتوقعة (دخل، مادية، تدفقات).',
      'تحليل حساسية ومطاطية الإيرادات ضد سيناريوهات الأزمات المختلفة.',
      'هيكلة جولات التمويل وحوكمة وتوزيع حصص الشركاء (Cap Table).'
    ],
    featuresEn: [
      'Projections of primary financial directories (P&L, Balance, Cashflow sheets).',
      'Sensitivity computations stressing revenues against diverse market shifts.',
      'Structuring equity dilution maps and seed round allocation metrics.'
    ],
    deliverablesAr: [
      'نموذج مالي تفاعلي مرن ومفتوح المصدر بلغة Excel.',
      'فولدر تحليلات مالية موجه للمراجعين والمستثمرين الجادين.',
      'خطة تسعير وهياكل هوامش الأرباح الإجمالية ومؤشرات السيولة.'
    ],
    deliverablesEn: [
      'Fully editable dynamic financial forecasting spreadsheets (Excel/Sheets).',
      'Comprehensive valuation booklet for institutional funding board reviews.',
      'Pricing strategy outlines, profit margins breakdown, and coverage parameters.'
    ],
    detailsAr: 'نقدم لك نموذجاً مالياً ذكياً بيافطة تفاعلية يمكنك استخدامها لتغيير المتغيرات كنسبة النمو، التوظيف، وتكلفة الإيرادات لتحصل على النتائج في ثوانٍ.',
    detailsEn: 'A high-integrity mathematical asset designed for quick stress testing of growth models.'
  },
  {
    id: 'organizational-structure',
    titleAr: 'الهياكل التنظيمية وحوكمة الصلاحيات',
    titleEn: 'Organizational Strategy & Structuring',
    icon: Network,
    descriptionAr: 'تصميم هيكلية الأقسام الإدارية والتشغيلية، وصياغة حوكمة الاتصالات وقنوات اتخاذ القرار.',
    descriptionEn: 'Designing optimized reporting hierarchies and RACI models to drive extreme corporate execution speed.',
    category: 'structures',
    basePriceSAR: 8400,
    baseDays: 7,
    featuresAr: [
      'تصميم ورسم هيكل الأقسام الفيدرالية والإقليمية المعاصرة.',
      'صياغة مصفوفة توزيع المهام والمسؤوليات التشاركية (RACI Matrix).',
      'أتمتة ورقمنة بوابات اتخاذ القرار الإداري وسلسلة الصلاحيات.'
    ],
    featuresEn: [
      'Designing modern departmental and divisional reporting layout structures.',
      'Delineating clear execution bounds via RACI assignment mapping.',
      'Digital administrative approval loops and delegation procedures.'
    ],
    deliverablesAr: [
      'كتيب الهيكل التنظيمي للمركز والأطراف شامل خطوط الترابط.',
      'بطاقات الوصف الوظيفي لكل شاغر والجاهزية ومؤشرات نجاحه الإدارية.',
      'مصفوفة الصلاحيات المالية والإدارية المفصلة للقيادات العليا والوسطى.'
    ],
    deliverablesEn: [
      'Visual organizational charts and line-management diagrams (PDF).',
      'Job descriptions and performance indicators for key departmental leads.',
      'Financial and structural delegation policies and approval charts.'
    ],
    detailsAr: 'نحول الفوضى الإدارية وتداخل المهام إلى عملية انسيابية واضحة وسريعة المسؤوليات، لتقليص زمن إرساء المبادرات وتبني التكنولوجيا.',
    detailsEn: 'Abolishing structural blockages by engineering highly modular reporting channels.'
  },
  {
    id: 'risk-management',
    titleAr: 'دراسة المخاطر واستمرارية الأعمال',
    titleEn: 'Risk Matrix & Continuity Framework',
    icon: ShieldAlert,
    descriptionAr: 'تقييم مكامن الخلل في الموارد، والتقنيات، وسلاسل الإمداد، وصياغة خطة مناعة قوية للطوارئ.',
    descriptionEn: 'Evaluating vulnerabilities in technology, hardware, and networks, detailing backup recovery protocols.',
    category: 'structures',
    basePriceSAR: 11000,
    baseDays: 9,
    featuresAr: [
      'هيكلة سجل وحصر المخاطر بأسلوب رصد استباقي ومبتكر.',
      'صياغة بروتوكولات حوكمة الاستجابة لتعثر السيولة أو تراجع المبيعات.',
      'تصميم خطط الاستجابة الرقمية للتعافي من الكوارث وحماية السواحل الحوسبية.'
    ],
    featuresEn: [
      'Structuring risk inventories and continuous vulnerability dashboards.',
      'Action plans responding to sudden liquidity drop or resource blocks.',
      'Devising business-continuity protocols and digital recovery blueprints.'
    ],
    deliverablesAr: [
      'سجل المخاطر وتصنيفات الأثر والتكرار بالدقة الاستشارية.',
      'سيناريوهات وسياسات الطوارئ وإرجاع الخدمات للعمل المستمر.',
      'دليل التدريب والتوعية لفرق التنفيذ والأقسام لإدارة الأزمات.'
    ],
    deliverablesEn: [
      'Comprehensive corporate Risk Matrix mapped by occurrence and gravity.',
      'Step-by-step Emergency Response Manual and backup actions ledger.',
      'Operational workforce training guidelines for crisis resolution.'
    ],
    detailsAr: 'نحمي منظمتك من المفاجآت الصادمة عبر بناء أنظمة حماية دفاعية تضمن استمرارية خدماتك وحماية مصالح مساهميك تحت أقسى ظروف الاقتصاد.',
    detailsEn: 'Hardening structural immunity guarantees that services remain operational regardless of market shifts.'
  }
];

export default function ServicesMarket({ lang }: ServicesMarketProps) {
  const isAr = lang === 'ar';
  const [filter, setFilter] = useState<'all' | 'plans' | 'structures' | 'financials'>('all');
  
  // Dynamic Cost Estimator State
  const [estimatorService, setEstimatorService] = useState<string>('feasibility');
  const [organizationSize, setOrganizationSize] = useState<'startup' | 'sme' | 'enterprise'>('sme');
  const [targetIndustry, setTargetIndustry] = useState<string>('fintech');
  const [timelineUrgency, setTimelineUrgency] = useState<'normal' | 'urgent'>('normal');

  // Custom User Request Wizard State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientStage, setClientStage] = useState('funded');
  const [clientGoals, setClientGoals] = useState('');
  
  // Interactive Final Proposal proposal generator
  const [generatedProposal, setGeneratedProposal] = useState<any | null>(null);

  // Compare tracking state
  const [compareList, setCompareList] = useState<ServiceItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleToggleCompare = (service: ServiceItem) => {
    setCompareList((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        if (prev.length >= 2) {
          return [prev[0], service];
        }
        return [...prev, service];
      }
    });
  };

  // Filter handlers
  const filteredServices = filter === 'all' 
    ? SERVICES_DATA 
    : SERVICES_DATA.filter(s => s.category === filter);

  // Calculate dynamic outputs of the estimator based on inputs
  const calculateEstimates = () => {
    const service = SERVICES_DATA.find(s => s.id === estimatorService) || SERVICES_DATA[0];
    
    // Multipliers for organization scale
    let scaleMultiplier = 1.0;
    if (organizationSize === 'startup') scaleMultiplier = 0.8;
    if (organizationSize === 'enterprise') scaleMultiplier = 2.4;

    // Multipliers for industry complexity
    let industryMod = 1.0;
    if (targetIndustry === 'fintech') industryMod = 1.25;
    if (targetIndustry === 'healthcare') industryMod = 1.2;
    if (targetIndustry === 'military' || targetIndustry === 'government') industryMod = 1.45;
    if (targetIndustry === 'retail') industryMod = 1.05;

    // Timelines and Urgency multipliers
    let speedFee = 1.0;
    let computedDays = Math.ceil(service.baseDays * (organizationSize === 'enterprise' ? 1.6 : 0.9));
    
    if (timelineUrgency === 'urgent') {
      speedFee = 1.35; // +35% price
      computedDays = Math.max(3, Math.ceil(computedDays * 0.55)); // 45% faster
    }

    const estimatedPrice = Math.round(service.basePriceSAR * scaleMultiplier * industryMod * speedFee);

    return {
      price: estimatedPrice,
      days: computedDays,
      serviceTitle: isAr ? service.titleAr : service.titleEn,
      serviceIcon: service.icon
    };
  };

  const calculated = calculateEstimates();

  // Wizard Launch Handler
  const handleLaunchRequest = (service: ServiceItem) => {
    setSelectedService(service);
    setEstimatorService(service.id);
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  // Submit Request Handler: Generates a premium proposal and dynamic itemized invoice mockup
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientCompany) {
      alert(isAr ? 'الرجاء ملء الخانات الأساسية لمواصلة التقديم.' : 'Please enter key fields to generate proposal.');
      return;
    }

    const activeService = selectedService || SERVICES_DATA.find(s => s.id === estimatorService) || SERVICES_DATA[0];
    
    // Dynamic generation
    const { price, days } = calculateEstimates();
    const referenceNumber = 'BD-' + Math.floor(100000 + Math.random() * 900000);
    const issuanceDate = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mockProposal = {
      referenceNumber,
      issuanceDate,
      clientName,
      clientEmail,
      clientCompany,
      clientPhone,
      clientGoals: clientGoals || (isAr ? 'لا يوجد متطلبات إضافية' : 'No custom options noted'),
      serviceTitle: isAr ? activeService.titleAr : activeService.titleEn,
      serviceIcon: activeService.icon,
      originalBase: activeService.basePriceSAR,
      estimatedPrice: price,
      days,
      timelineUrgency,
      organizationSize,
      targetIndustry,
      deliverables: isAr ? activeService.deliverablesAr : activeService.deliverablesEn,
      details: isAr ? activeService.detailsAr : activeService.detailsEn
    };

    setGeneratedProposal(mockProposal);
    setWizardStep(3); // Step 3: Interactive Bill & Proposal Document Screen
  };

  const handlePrintProposal = () => {
    window.print();
  };

  return (
    <section id="services-market" className="py-24 bg-white relative overflow-hidden transition-all">
      {/* Decorative vectors */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Dynamic graphic grids overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-sky-500" />
            <span>{isAr ? 'بوابة التخطيط المتكاملة وسوق الخدمات' : 'Integrated Planning Portal & Services Hub'}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {isAr ? 'سوق الخدمات الاستشارية وهندسة الخطط' : 'Corporate Services & Planning Marketplace'}
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isAr 
              ? 'تجاوز الأساليب التقليدية المجهولة للحصول على دراسة جدوى، خطط عمل، أو حوكمة متينة. تصفح كتالوج خدماتنا، احصل على تقدير تائه للأسعار فوري، واطلب عرضاً هندسياً مخصصاً لمشروعك خلال لحظات.'
              : 'Ditch legacy custom quotes. Explore our verified strategic plans, calculate pricing directly matched with your market vertical scale, and render initial project blueprints instantly.'}
          </p>
        </div>

        {/* Categories Tab selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer border transition-all ${
              filter === 'all'
                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {isAr ? 'الكل' : 'All Plans'}
          </button>
          
          <button
            onClick={() => setFilter('plans')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer border transition-all ${
              filter === 'plans'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {isAr ? 'دراسات الجدوى وخطط النمو' : 'Feasibility & Growth Plans'}
          </button>

          <button
            onClick={() => setFilter('financials')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer border transition-all ${
              filter === 'financials'
                ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {isAr ? 'الخطط المالية والنمذجة والشركاء' : 'Financial Modeling & Capital Pools'}
          </button>

          <button
            onClick={() => setFilter('structures')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer border transition-all ${
              filter === 'structures'
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {isAr ? 'الهياكل التشغيلية والتنظيمية والمخاطر' : 'Operational Structures & Governance'}
          </button>
        </div>

        {/* 2-Column Core Layout: Left column is the interactive marketplace items, Right column is the realtime price estimator calculator */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Services Cards List (Left Column: 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-bold text-indigo-700 tracking-wider uppercase mb-2">
              {isAr ? `الخطط والهياكل المتاحة (${filteredServices.length} خدمات)` : `Available Frameworks & Structures (${filteredServices.length} options)`}
            </div>

            <div className="grid gap-6">
              {filteredServices.map((service) => {
                const IconComponent = service.icon;
                return (
                  <motion.div
                    layout
                    key={service.id}
                    className="p-6 bg-slate-50/50 hover:bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xl rounded-2xl flex flex-col sm:flex-row items-start gap-5 transition-all relative group"
                  >
                    {/* Floating Accent category tag */}
                    <span className="absolute top-4 ltr:right-4 rtl:left-4 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 rounded px-2 py-0.5">
                      {isAr 
                        ? (service.category === 'plans' ? 'دراسات وغايات' : service.category === 'financials' ? 'نموذج مالي' : 'هيكل إداري')
                        : service.category}
                    </span>

                    {/* Compare Selection Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleCompare(service)}
                      className={`absolute top-4 ltr:left-4 rtl:right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                        compareList.some(s => s.id === service.id)
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs scale-105'
                          : 'bg-slate-150 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border-transparent'
                      }`}
                    >
                      <ArrowLeftRight className="w-3 h-3 shrink-0" />
                      <span>
                        {compareList.some(s => s.id === service.id)
                          ? (isAr ? 'محدد للمقارنة' : 'In Compare')
                          : (isAr ? 'مقارنة' : 'Compare')}
                      </span>
                    </button>

                    {/* Left side circular vector and Icon */}
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/50 text-slate-700 group-hover:bg-gradient-to-tr group-hover:from-sky-500 group-hover:to-indigo-600 group-hover:border-transparent group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow-3xs duration-350">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Core details of Service */}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-sky-600 transition-colors">
                          {isAr ? service.titleAr : service.titleEn}
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                          {isAr ? service.descriptionAr : service.descriptionEn}
                        </p>
                      </div>

                      {/* Expandable Key Deliverables */}
                      <div className="grid gap-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest text-right ltr:text-left flex items-center space-x-1.5 rtl:space-x-reverse">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          <span> {isAr ? 'عناوين ومستخرجات الخطة الفنية' : 'Key Core Deliverables'}</span>
                        </span>
                        
                        <div className="grid sm:grid-cols-1 gap-2 pl-1">
                          {(isAr ? service.deliverablesAr : service.deliverablesEn).map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-600">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Explaining note text */}
                      <p className="text-[11px] text-slate-500 italic leading-relaxed pt-1.5 border-t border-slate-100 font-sans">
                        {isAr ? service.detailsAr : service.detailsEn}
                      </p>

                      {/* Action trigger & base values display */}
                      <div className="pt-3 border-t border-slate-200/65 flex flex-wrap items-center justify-between gap-3 bg-white/40 p-3 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="text-right ltr:text-left">
                            <span className="block text-[10px] text-slate-400 font-bold uppercase">{isAr ? 'يبدأ من السعر' : 'EST. BASE PRICE'}</span>
                            <span className="text-[#005128]/90 font-mono text-sm font-extrabold pb-0.5">{isAr ? `﷼ ${service.basePriceSAR.toLocaleString()}` : `SAR ${service.basePriceSAR.toLocaleString()}`}</span>
                          </div>
                          
                          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                          
                          <div className="text-right ltr:text-left hidden sm:block">
                            <span className="block text-[10px] text-slate-400 font-bold uppercase">{isAr ? 'المدة الأساسية' : 'TIMEFRAME'}</span>
                            <span className="text-slate-700 font-mono text-xs font-bold">{isAr ? `${service.baseDays} يوماً عمل` : `${service.baseDays} Work Days`}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedService(service);
                              setEstimatorService(service.id);
                            }}
                            className="px-3.5 py-1.5 text-xs text-indigo-700 hover:text-indigo-800 bg-indigo-50 border border-indigo-100 hover:border-indigo-200 hover:bg-indigo-100 transition-all rounded-lg font-bold cursor-pointer"
                          >
                            {isAr ? 'تخصيص السعر المباشر بالآلة' : 'Stress Price On Tool'}
                          </button>

                          <button
                            onClick={() => handleLaunchRequest(service)}
                            className="px-4 py-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800 transition-all rounded-lg font-bold flex items-center space-x-1 rtl:space-x-reverse cursor-pointer shadow-xs active:scale-97"
                          >
                            <span>{isAr ? 'شراء وتفويض الخدمة' : 'Secure Proposal'}</span>
                            <ChevronRight className="w-3.5 h-3.5 select-none" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Interactive Estimator Tool (Right Column: 5 cols) */}
          <div className="lg:col-span-5 sticky top-28 bg-white border border-slate-200 shadow-xl rounded-3xl p-6 md:p-8 space-y-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-sky-500/10 to-indigo-600/10 rounded-bl-3xl blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] text-sky-600 font-extrabold uppercase tracking-widest font-mono flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-sky-500 animate-spin" />
                  <span>{isAr ? 'الآلة الاستشارية التفاعلية' : 'Interactive Sizing Calculator'}</span>
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {isAr ? 'تخصيص المخططات والتكلفة الفورية' : 'Dynamic Scoping Cost Engine'}
                </h3>
              </div>
            </div>

            <div className="space-y-5">
              
              {/* Select Service Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {isAr ? 'نوع الخطة أو الهيكل الإداري المطلوب:' : 'Select Target Strategy Plan:'}
                </label>
                <select
                  value={estimatorService}
                  onChange={(e) => setEstimatorService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-500 transition-colors"
                >
                  {SERVICES_DATA.map((s) => (
                    <option key={s.id} value={s.id}>
                      {isAr ? s.titleAr : s.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organization Size Multiplier */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {isAr ? 'حجم المنظمة ومستوى التعقيد الهيكلي:' : 'Organization Scale & Structure Weight:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'startup', labelAr: 'ناشئة / متناهية صغر', labelEn: 'Startup' },
                    { key: 'sme', labelAr: 'متوسطة / ريادية', labelEn: 'SME Business' },
                    { key: 'enterprise', labelAr: 'شركات كبرى / قابضة', labelEn: 'Corp/Enterprise' }
                  ].map((sz) => (
                    <button
                      key={sz.key}
                      type="button"
                      onClick={() => setOrganizationSize(sz.key as any)}
                      className={`p-2.5 border text-[10px] font-bold rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        organizationSize === sz.key
                          ? 'border-indigo-600 bg-indigo-50/75 text-indigo-700 shadow-3xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>{isAr ? sz.labelAr : sz.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Industries options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {isAr ? 'قطاع وتصنيف نشاط العميل:' : 'Target Core Business Sector:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'fintech', labelAr: 'التقنية المالية والتمويل (Fintech)', labelEn: 'Fintech / Banking' },
                    { key: 'healthcare', labelAr: 'الرعاية والخدمات الطبية', labelEn: 'Medical / Clinics' },
                    { key: 'government', labelAr: 'مشاريع حكومية وبلدية', labelEn: 'Municipal / State' },
                    { key: 'retail', labelAr: 'التجارة والبيع بالتجزئة والتجزئة', labelEn: 'Retail / Commerce' }
                  ].map((ind) => (
                    <button
                      key={ind.key}
                      type="button"
                      onClick={() => setTargetIndustry(ind.key)}
                      className={`p-2.5 text-[10px] font-semibold text-right ltr:text-left border rounded-xl transition-all cursor-pointer flex flex-col justify-between ${
                        targetIndustry === ind.key
                          ? 'border-sky-500 bg-sky-50/50 text-sky-800 shadow-3xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>{isAr ? ind.labelAr : ind.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgent Delivery Timeline speed switch */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {isAr ? 'السرعة المطلوبة لإيداع وتسليم الملفات:' : 'Timeline Speed Requirement:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'normal', labelAr: 'طبيعي (دراسة متأنية)', labelEn: 'Normal Strategy' },
                    { key: 'urgent', labelAr: 'مستعجل (+35% تكلفة إضافية)', labelEn: 'Urgent Strategy (+35%)' }
                  ].map((urg) => (
                    <button
                      key={urg.key}
                      type="button"
                      onClick={() => setTimelineUrgency(urg.key as any)}
                      className={`p-2.5 text-[10px] font-semibold border rounded-xl text-center transition-all cursor-pointer ${
                        timelineUrgency === urg.key
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 shadow-3xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {isAr ? urg.labelAr : urg.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Computed output banner displaying realtime estimates */}
              <div className="p-5.5 bg-slate-950 text-white rounded-2xl relative overflow-hidden flex flex-col gap-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/15 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isAr ? 'التقديرات المتولدة للخدمة' : 'DYNAMIC METRIC ESTIMATES'}</span>
                  <div className="py-0.5 px-2 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-bold tracking-widest uppercase">
                    {isAr ? 'صلاحية 30 يوماً' : '30-DAY PRICE SECURE'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10 items-center">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isAr ? 'زمن إيداع الملفات' : 'DELIVERY TIME'}</span>
                    </span>
                    <span className="block text-lg font-extrabold text-white font-mono">
                      {isAr ? `${calculated.days} يوماً عمل` : `${calculated.days} Work Days`}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-left ltr:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-end gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#00a850]" />
                      <span>{isAr ? 'القيمة التقريبية' : 'EST. RETENTION'}</span>
                    </span>
                    <span className="block text-2xl font-black text-sky-400 font-mono tracking-tight leading-none pb-1">
                      {isAr ? `﷼ ${calculated.price.toLocaleString()}` : `SAR ${calculated.price.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 relative z-10">
                  <button
                    onClick={() => {
                      const associated = SERVICES_DATA.find(s => s.id === estimatorService) || SERVICES_DATA[0];
                      handleLaunchRequest(associated);
                    }}
                    className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 text-slate-950 font-black text-xs cursor-pointer tracking-wider uppercase transition-all shadow-md active:scale-97 hover:scale-102 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <FileCheck className="w-4 h-4 text-slate-950" />
                    <span>{isAr ? 'اعتماد الطلب وتوليد مسودة العرض' : 'Confirm & Request custom proposal'}</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Features Comparison Matrix Grid */}
        <div className="mt-24 p-6 sm:p-10 bg-slate-50/75 border border-slate-200Rounded rounded-3xl space-y-8">
          <div className="max-w-xl text-center sm:text-right ltr:sm:text-left space-y-1">
            <h3 className="font-extrabold text-slate-950 text-xl tracking-tight">
              {isAr ? 'مقارنة محتويات ونطاقات الخطط الأساسية' : 'Key Core Plans Scope Matrix'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'نوضح لك مخرجات وسياقات كل خطة لتختار الأنسب لنمو أعمالك وثباتها.' : 'Track deliverables side-by-side to target the correct advisory track.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-semibold text-right ltr:text-left text-slate-700 min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] text-slate-400 tracking-wider uppercase bg-slate-100">
                  <th className="p-4">{isAr ? 'المخرجات والعناصر الأساسية' : 'STRUCTURE / KEY SCOPE'}</th>
                  <th className="p-4">{isAr ? 'دراسة جدوى' : 'FEASIBILITY'}</th>
                  <th className="p-4">{isAr ? 'خطة عمل' : 'BUSINESS PLAN'}</th>
                  <th className="p-4">{isAr ? 'خطة تسويق' : 'MARKETING PLAN'}</th>
                  <th className="p-4">{isAr ? 'خطة مالية' : 'FINANCIAL MODEL'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {[
                  { nameAr: 'تحليل دقيق للسوق والمنافسين المحليين والمنافسة والعرض والطلب', nameEn: 'Competitor mapping and local supply-demand study', col1: true, col2: true, col3: true, col4: false },
                  { nameAr: 'نمذجة التوقعات والقوائم المالية لخمسة سنوات كاملة بالتفصيل', nameEn: '5-year detailed spreadsheet projection', col1: true, col2: true, col3: false, col4: true },
                  { nameAr: 'تخطيط الموارد التشغيلية والترخيص والآلات والموقع فكرياً', nameEn: 'Technical, machinery, zoning and licensing layout', col1: true, col2: false, col3: false, col4: false },
                  { nameAr: 'كتابة نموذج العمل واستراتيجيات التوسع الإداري والنمو والتوظيف', nameEn: 'Organizational expansion and personnel scaling targets', col1: false, col2: true, col3: true, col4: false },
                  { nameAr: 'المزيج التسويقي للإعلانات والتقويم السنوي وقنوات الوصول', nameEn: 'Advertising scheduling and annual channels mapping', col1: false, col2: false, col3: true, col4: false },
                  { nameAr: 'تحليل حساسية الإيرادات وجداول تخفيف وسيناريوهات الاستثمار', nameEn: 'P&L sensitivity models and Cap Table structuring', col1: true, col2: false, col3: false, col4: true },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-100/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{isAr ? row.nameAr : row.nameEn}</td>
                    <td className="p-4">{row.col1 ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <span className="text-slate-300">-</span>}</td>
                    <td className="p-4">{row.col2 ? <Check className="w-4.5 h-4.5 text-indigo-500" /> : <span className="text-slate-300">-</span>}</td>
                    <td className="p-4">{row.col3 ? <Check className="w-4.5 h-4.5 text-sky-500" /> : <span className="text-slate-300">-</span>}</td>
                    <td className="p-4">{row.col4 ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <span className="text-slate-300">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Multistep Interactive Proposal & Configuration Wizard Modal */}
      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 z-[150] overflow-y-auto" id="services-wizard-portal">
            
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWizardOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            />

            <div className="flex min-h-screen items-center justify-center p-4 relative sm:p-6 md:p-8">
              <motion.div
                initial={{ scale: 0.95, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 30, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[640px]"
                id="services-wizard-container"
              >
                
                {/* Wizard Upper progress indicator bar */}
                <div className="px-6 py-4 border-b border-indigo-50/80 bg-slate-50 flex items-center justify-between shrink-0 font-sans">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-indigo-700">
                    <Sparkles className="w-4.5 h-4.5" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">
                      {isAr ? 'محرك حجز وتفويض الخطط الذكي' : 'Integrated Plan Booking Portal'}
                    </span>
                  </div>
                  
                  {/* Step flags */}
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-mono text-[10px] font-bold">
                    <span className={`px-2 py-0.5 rounded-full ${wizardStep === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
                    <span className="text-slate-300">/</span>
                    <span className={`px-2 py-0.5 rounded-full ${wizardStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
                    <span className="text-slate-300">/</span>
                    <span className={`px-2 py-0.5 rounded-full ${wizardStep === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</span>
                  </div>
                </div>

                {/* Wizard main contents */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                  
                  {/* STEP 1: Core Customer and Company parameters */}
                  {wizardStep === 1 && (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">{isAr ? 'البيانات الأساسية' : 'PRIMARY INFORMATION'}</span>
                        <h4 className="text-lg font-black text-slate-900">
                          {isAr ? `نطاق المشروع لـ (${selectedService ? (isAr ? selectedService.titleAr : selectedService.titleEn) : 'الخدمة'})` : `Configuring scope details for your plan`}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isAr ? 'الرجاء تزويدنا بالبيانات والكيان التجاري لنقوم بحساب المتطلبات وتهيئة مسودة الفاتورة المعتمدة.' : 'Provide organization attributes to yield itemized quote sheets.'}
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-slate-700">{isAr ? 'اسم التواصل والمسؤول:' : 'Full Contact Name:'}</label>
                            <input
                              type="text"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder={isAr ? 'مثال: أ. فيصل الغامدي' : 'e.g., Salman Rashid'}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-slate-700">{isAr ? 'عنوان البريد الإلكتروني:' : 'Contact Email:'}</label>
                            <input
                              type="email"
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              placeholder="client@company.com"
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-slate-700">{isAr ? 'اسم المنظمة أو العلامة المقترحة:' : 'Company / Venture Name:'}</label>
                            <input
                              type="text"
                              value={clientCompany}
                              onChange={(e) => setClientCompany(e.target.value)}
                              placeholder={isAr ? 'مثال: شركة نمو العقارية' : 'e.g., Numow Logistics Ltd.'}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-slate-700">{isAr ? 'رقم الهاتف الجوال:' : 'Phone Number:'}</label>
                            <input
                              type="tel"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="+966 50 000 0000"
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        {/* Startup stage options */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-slate-700">{isAr ? 'حالة تمويل المشروع والكيان الحالي:' : 'Current Venture Stage / Funding Counter:'}</label>
                          <select
                            value={clientStage}
                            onChange={(e) => setClientStage(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="idea">{isAr ? 'مسودة فكرة أو دراسة استكشافية أولية' : 'Idea Phrase / Exploration stage'}</option>
                            <option value="funded">{isAr ? 'شركة ناشئة ممولة (بجولة البذرة أو ملاك استثماري)' : 'Funded Startup (Seed / Angel rounds)'}</option>
                            <option value="operational">{isAr ? 'كيان تجاري قائم برخص تشغيل فعلية وسجلات' : 'Operational entity with active commerce license'}</option>
                            <option value="holding">{isAr ? 'علامة كبرى قابضة أو قطاع تمويلي سيادي' : 'Consolidated corporate holds or Sovereign structures'}</option>
                          </select>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* STEP 2: Scoping parameters & specific objectives */}
                  {wizardStep === 2 && (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">{isAr ? 'التخصيص والسيناريو' : 'SCOPING DETAILS'}</span>
                        <h4 className="text-base font-bold text-slate-900">
                          {isAr ? 'صف لنا تطلعاتك وأهدافك الرئيسية:' : 'Detail special requirements & parameters:'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isAr ? 'ما هي المخرجات الأساسية التي تريد التركيز عليها في هذه الخطة أو الهيكل الإداري؟' : 'Which visual sectors or bookkeeping guidelines are top-priority?'}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5 animate-fade-in">
                          <label className="block text-xs font-semibold text-slate-700">
                            {isAr ? 'نطاق المتطلبات العميقة والأهداف الكبرى للمشروع:' : 'Provide optional extra notes:'}
                          </label>
                          <textarea
                            value={clientGoals}
                            onChange={(e) => setClientGoals(e.target.value)}
                            rows={4}
                            placeholder={isAr ? 'أدخل تفاصيل إضافية مثل: استهداف ترخيص بلدي، إعداد عرض تقديمي، جولة تمويل، وغيرها...' : 'Target licensing boards, dynamic custom sheets limits, structures...'}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 resize-none font-sans"
                          />
                        </div>

                        {/* Interactive Scope Summary Badge */}
                        <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 space-y-3 font-sans">
                          <span className="text-[9px] font-extrabold text-indigo-700 tracking-wider uppercase block">{isAr ? 'مسودة تهيئة النظير المطبق' : 'STRESSED SCOPING OVERVIEW'}</span>
                          
                          <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600">
                            <div>
                              <span className="text-slate-400 block">{isAr ? 'الخدمة الأساسية:' : 'Plan Selected:'}</span>
                              <strong className="text-slate-900">{isAr ? (selectedService ? selectedService.titleAr : calculated.serviceTitle) : calculated.serviceTitle}</strong>
                            </div>
                            
                            <div>
                              <span className="text-slate-400 block">{isAr ? 'مستوى الحجم:' : 'Weight Modifier:'}</span>
                              <strong className="text-slate-900 uppercase">{organizationSize}</strong>
                            </div>

                            <div>
                              <span className="text-slate-400 block">{isAr ? 'القطاع المستهدف:' : 'Sizing Scale:'}</span>
                              <strong className="text-slate-900 uppercase">{targetIndustry}</strong>
                            </div>

                            <div>
                              <span className="text-slate-400 block">{isAr ? 'زمن الايداع والسرعة:' : 'Deployment Speed:'}</span>
                              <strong className="text-emerald-700 uppercase font-black">{timelineUrgency}</strong>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* STEP 3: Generative interactive proposal document with mock print/download controls */}
                  {wizardStep === 3 && generatedProposal && (
                    <div className="space-y-4" id="services-printed-proposal">
                      
                      {/* Interactive Invoice / Proposal design */}
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-5 relative font-sans shadow-inner">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent pointer-events-none" />
                        
                        {/* Proposal Title Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
                          <div className="space-y-1">
                            <h5 className="font-extrabold text-sm text-slate-500 tracking-widest uppercase">
                              {isAr ? 'عرض فني ومالي مبدئي معتمد' : 'APPROVED INITIAL BUSINESS PROPOSAL'}
                            </h5>
                            <h4 className="text-lg font-black text-slate-950">
                              {generatedProposal.serviceTitle}
                            </h4>
                          </div>

                          <div className="text-right ltr:text-left">
                            <span className="block text-[10px] text-indigo-700 font-bold tracking-widest">{generatedProposal.referenceNumber}</span>
                            <span className="block text-[10px] text-slate-400">{generatedProposal.issuanceDate}</span>
                          </div>
                        </div>

                        {/* Customer attributes detailed */}
                        <div className="grid sm:grid-cols-2 gap-3 text-[11px] text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-150">
                          <div>
                            <span className="text-slate-400">{isAr ? 'مقدم إلى:' : 'Prepared For:'}</span>
                            <strong className="block text-slate-800 text-xs mt-0.5">{generatedProposal.clientName}</strong>
                            <span className="block text-[10px] text-slate-500">{generatedProposal.clientCompany}</span>
                          </div>

                          <div>
                            <span className="text-slate-400">{isAr ? 'تفاصيل التواصل:' : 'Contact Handles:'}</span>
                            <span className="block text-slate-700 text-[10px] mt-0.5">{generatedProposal.clientEmail}</span>
                            <span className="block text-slate-700 text-[10px]">{generatedProposal.clientPhone || '-'}</span>
                          </div>
                        </div>

                        {/* Scope details & key deliverables */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{isAr ? 'عناصر وبنود نطاق العمل المتفق عليها' : 'VERIFIED MILESTONES & SPECIFICATION'}</span>
                          <div className="grid gap-1.5 pl-1.5">
                            {generatedProposal.deliverables.map((dl: string, index: number) => (
                              <div key={index} className="flex items-start space-x-2 rtl:space-x-reverse text-xs text-slate-700 leading-relaxed">
                                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px] shrink-0 flex items-center justify-center mt-0.5">✓</span>
                                <span>{dl}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Additional client custom requirements */}
                        {clientGoals && (
                          <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-1">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">{isAr ? 'متطلبات وملاحظات العميل الخاصة:' : 'Client Custom Directives:'}</span>
                            <p className="text-xs text-slate-600 italic leading-relaxed">{generatedProposal.clientGoals}</p>
                          </div>
                        )}

                        {/* Final pricing matrices block */}
                        <div className="p-4 bg-slate-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
                          
                          <div className="space-y-1 shrink-0 text-center sm:text-right ltr:sm:text-left">
                            <span className="block text-[9px] text-slate-400 font-bold uppercase">{isAr ? 'زمن الايداع وعقود التسليم' : 'Agreed Delivery Timeline'}</span>
                            <strong className="text-slate-100 text-sm font-bold flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-emerald-400" />
                              <span>{isAr ? `${generatedProposal.days} يوماً عمل` : `${generatedProposal.days} Working Days`}</span>
                            </strong>
                          </div>

                          <div className="text-center sm:text-left ltr:sm:text-right">
                            <span className="block text-[9px] text-slate-400 font-bold uppercase">{isAr ? 'اجمالي تكلفة الاحتفاظ والخدمة' : 'TOTAL ITEM VALUE (SAR)'}</span>
                            <strong className="text-sky-300 text-xl font-extrabold block">
                              {isAr ? `﷼ ${generatedProposal.estimatedPrice.toLocaleString()}` : `SAR ${generatedProposal.estimatedPrice.toLocaleString()}`}
                            </strong>
                            <span className="text-[8px] text-slate-500 uppercase">{isAr ? 'شاملة الضرائب وحقوق البوابة' : 'INCLUDES PROCESSING AND PLATFORM FEES'}</span>
                          </div>
                        </div>

                        {/* Approved Seal badge and Sign off */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white/50 p-2 border border-slate-150 rounded-xl">
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold uppercase text-[9px]">
                            <UserCheck className="w-4 h-4" />
                            <span>{isAr ? 'اعتماد الكود والاستشاري' : 'Secured and verified seal'}</span>
                          </div>
                          <span className="font-mono text-[9px] text-slate-400">BOARD AUTH SIGNED</span>
                        </div>

                      </div>
                    </div>
                  )}

                </div>

                {/* Wizard Lower button bar with step directionals */}
                <div className="p-4 bg-slate-50 border-t border-slate-200/60 flex items-center justify-between shrink-0 font-sans">
                  
                  {wizardStep === 3 ? (
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      {isAr ? 'تعديل البيانات' : 'Modify Scope'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (wizardStep === 1) setIsWizardOpen(false);
                        else setWizardStep(wizardStep - 1);
                      }}
                      className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      {wizardStep === 1 ? (isAr ? 'تراجع' : 'Cancel') : (isAr ? 'الخطوة السابقة' : 'Back Step')}
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    
                    {wizardStep < 2 ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (wizardStep === 1 && (!clientName || !clientEmail || !clientCompany)) {
                            alert(isAr ? 'الرجاء كتابة اسم ورسالة جهة العمل للمتابعة.' : 'Fill primary client metadata first.');
                            return;
                          }
                          setWizardStep(wizardStep + 1);
                        }}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                      >
                        {isAr ? 'التالي: نطاق التخصيص' : 'Scoping custom directives'}
                      </button>
                    ) : wizardStep === 2 ? (
                      <button
                        type="button"
                        onClick={handleSubmitRequest}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 animate-spin text-indigo-200" />
                        <span>{isAr ? 'توليد ومراجعة مسودة العرض المبدئي' : 'Generate customized initial proposal'}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePrintProposal}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Printer className="w-4 h-4" />
                          <span>{isAr ? 'طباعة العرض الفني' : 'Print Proposal'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsWizardOpen(false);
                            alert(
                              isAr
                                ? 'تم الحفظ والتحقق من العرض الفني والمالي بنجاح. سيقوم أحد مستشارينا المعتمدين بالاتصال بكم خلال 24 ساعة لمباشرة الخطوات العملية وتصدير العقود.'
                                : 'Initial Proposal validated and secure. A senior business consultant will follow up in 24 hours.'
                            );
                            setGeneratedProposal(null);
                          }}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                        >
                          {isAr ? 'اعتماد وجدولة المكالمة' : 'Finalize & Book Call'}
                        </button>
                      </div>
                    )}

                  </div>
                </div>

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* Floating Compare Deck bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-950/95 backdrop-blur-md text-white border border-slate-800 rounded-2xl py-3 px-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg w-[calc(100vw-2rem)]"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="bg-indigo-600 rounded-xl p-2 shrink-0">
                <ArrowLeftRight className="w-4 h-4 text-white" />
              </div>
              <div className="text-right ltr:text-left">
                <span className="text-slate-400 text-[9px] uppercase font-bold tracking-widest block font-sans">
                  {isAr ? 'مقارنة الحلول الاستشارية' : 'Compare Advisory Track'}
                </span>
                <span className="text-white text-xs font-bold leading-none font-sans">
                  {isAr 
                    ? `مقارنة ${compareList.length} من أصل 2 مضافتين` 
                    : `${compareList.length} of 2 services selected`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 w-full sm:w-auto shrink-0">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {compareList.map((service) => {
                  const SvcIcon = service.icon;
                  return (
                    <div 
                      key={service.id} 
                      title={isAr ? service.titleAr : service.titleEn}
                      className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-slate-300 shadow-sm relative group shrink-0"
                    >
                      <SvcIcon className="w-3.5 h-3.5" />
                      <button
                        type="button"
                        onClick={() => handleToggleCompare(service)}
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full text-white p-0.5 hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                {compareList.length === 2 ? (
                  <button
                    type="button"
                    onClick={() => setIsCompareOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer animate-pulse shrink-0"
                  >
                    {isAr ? 'قارن الآن' : 'Compare Now'}
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">
                    {isAr ? 'اختر خدمة ثانية' : 'Select another'}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setCompareList([])}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-Side Comparison Modal */}
      <AnimatePresence>
        {isCompareOpen && compareList.length === 2 && (
          <div className="fixed inset-0 z-[160] overflow-y-auto" id="services-compare-portal">
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCompareOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            />

            <div className="flex min-h-screen items-center justify-center p-4 relative sm:p-6">
              <motion.div
                initial={{ scale: 0.95, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 30, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                id="services-compare-container"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-indigo-50/80 bg-slate-50 flex items-center justify-between shrink-0 font-sans">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-indigo-700">
                    <ArrowLeftRight className="w-4.5 h-4.5" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">
                      {isAr ? 'تحليل مقارنة خطط الأعمال والخدمات' : 'Service Planning Comparison Matrix'}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setIsCompareOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Compare view content */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-slate-150">
                    {compareList.map((service, index) => {
                      const SvcIcon = service.icon;
                      return (
                        <div key={service.id} className={`space-y-6 ${index === 1 ? 'md:pl-6 rtl:md:pr-6 md:border-l rtl:md:border-r rtl:md:border-l-0 border-slate-150' : ''}`}>
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md">
                              <SvcIcon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1 text-right ltr:text-left">
                              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">
                                {service.category === 'plans' 
                                  ? (isAr ? 'دراسات وغايات' : 'Feasibility & Growth') 
                                  : service.category === 'financials'
                                  ? (isAr ? 'نموذج مالي واستثمار' : 'Financials & Capital')
                                  : (isAr ? 'هيكل إداري وتشغيلي' : 'Operations & RACI')}
                              </span>
                              <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
                                {isAr ? service.titleAr : service.titleEn}
                              </h4>
                            </div>
                          </div>

                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed min-h-[48px] text-right ltr:text-left">
                            {isAr ? service.descriptionAr : service.descriptionEn}
                          </p>

                          {/* Quick Metrics */}
                          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-150 text-right ltr:text-left">
                            <div>
                              <span className="text-slate-400 text-[10px] font-bold uppercase block">{isAr ? 'السعر التأسيسي' : 'BASE PRICE'}</span>
                              <strong className="text-emerald-800 text-sm font-extrabold pb-0.5 font-mono">
                                {isAr ? `﷼ ${service.basePriceSAR.toLocaleString()}` : `SAR ${service.basePriceSAR.toLocaleString()}`}
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-bold uppercase block">{isAr ? 'المدة الزمنية المتوقعة' : 'EXPECTED TIMELINE'}</span>
                              <strong className="text-slate-800 text-xs font-bold leading-none font-mono">
                                {isAr ? `${service.baseDays} يوماً عمل` : `${service.baseDays} Work Days`}
                              </strong>
                            </div>
                          </div>

                          {/* Typical Outcomes / Features comparison */}
                          <div className="space-y-3">
                            <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5 rtl:justify-start">
                              <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span>{isAr ? 'الميزات والخصائص الهندسية' : 'Core Features & Frameworks'}</span>
                            </h5>
                            <div className="space-y-2 text-right ltr:text-left">
                              {(isAr ? service.featuresAr : service.featuresEn).map((feature, fIdx) => (
                                <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Deliverables / Typical Outcomes */}
                          <div className="space-y-3">
                            <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5 rtl:justify-start">
                              <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span>{isAr ? 'مخرجات الخطة والحل الفعلي' : 'Deliverables & Outcomes'}</span>
                            </h5>
                            <div className="space-y-2 text-right ltr:text-left">
                              {(isAr ? service.deliverablesAr : service.deliverablesEn).map((del, dIdx) => (
                                <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700 font-semibold leading-relaxed">
                                  <span className="text-emerald-500 text-[11px] shrink-0">✓</span>
                                  <span>{del}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Detailed Explanation / Bottom Notes */}
                          <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100/40 text-[11px] text-slate-500 italic leading-relaxed font-sans text-right ltr:text-left">
                            {isAr ? service.detailsAr : service.detailsEn}
                          </div>

                          {/* Quick Select CTA inside compare modal */}
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsCompareOpen(false);
                                handleLaunchRequest(service);
                              }}
                              className="w-full text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer tracking-wider transition-all shadow-md active:scale-97 flex items-center justify-center space-x-1.5 rtl:space-x-reverse"
                            >
                              <span>{isAr ? `تخصيص وحجز (${isAr ? service.titleAr : service.titleEn})` : `Scope & Book This Solution`}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recommendations / Helpful guide at the bottom of dynamic match */}
                  <div className="bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden font-sans border border-slate-800 text-right ltr:text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-sky-400 font-extrabold uppercase tracking-widest block">{isAr ? 'توصيات الجدوى التشغيلية' : 'COLLABORATIVE ARCHITECT recommendation'}</span>
                        <h5 className="text-xs sm:text-sm font-bold">
                          {isAr 
                            ? 'هل تريد دمج هذه الحلول المتقاربة للاستفادة الكاملة من كفاءة خطة النمو؟'
                            : 'Unsure which workflow fits your specific industry regulatory compliance guidelines?'}
                        </h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {isAr 
                            ? 'نقوم بدمج وتنسيق دراسات الجدوى والنمذجة المالية مع الهيكل التنظيمي في عرض مجمع وحوكمة صلبة بأسعار حصرية.'
                            : 'Bundling studies guarantees aligned capital tables, organizational flows, and operational timelines under one vision.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsCompareOpen(false);
                          setSelectedService(null);
                          setWizardStep(1);
                          setIsWizardOpen(true);
                          const titles = compareList.map(s => isAr ? s.titleAr : s.titleEn).join(" + ");
                          setClientGoals(isAr ? `توليف باقة مجمعة تغطي الخدمتين معاً: ${titles}.` : `We want to bundle both: ${titles}. Requesting pricing structure.`);
                        }}
                        className="px-4 py-2 bg-sky-400 hover:bg-sky-500 text-slate-950 text-xs font-black rounded-lg transition-all shrink-0 cursor-pointer text-center"
                      >
                        {isAr ? 'طلب استشارة مجمعة' : 'Request Combined Bundle'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
