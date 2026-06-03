import React from 'react';
import { Lang, Project } from '../types';
import { 
  X, 
  ExternalLink, 
  Code2, 
  TrendingUp, 
  AlertTriangle, 
  Cpu, 
  CheckCircle, 
  ShieldCheck, 
  Globe, 
  ArrowRight,
  Server,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getIconComponent } from './Icons';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  lang: Lang;
}

interface ProjectExtendedData {
  challenges: { ar: string[]; en: string[] };
  solutions: { ar: string[]; en: string[] };
  metrics: { value: string; labelAr: string; labelEn: string; icon: string }[];
  stackDetails: { name: string; descriptionAr: string; descriptionEn: string }[];
}

// Complete rich detailed data map mapped by project index key
const EXTENDED_PROJECT_DATA: Record<string, ProjectExtendedData> = {
  'sahl-pay': {
    challenges: {
      ar: [
        'تشتت وصعوبة دمج قنوات الدفع الكثيرة والمتزامنة مع أجهزة نقاط البيع اللاسلكية بنظام دفع موحد وسهل مراقبته.',
        'الزمن المستهلك العالي في تشفير وإرسال الفواتير الإلكترونية اللحظية وضمان مطابقتها المالية التامة.',
        'الارتفاع الكبير في هجمات سرقة البطاقات واحتيال معالجة العمليات في البيئات السحابية المشتركة.'
      ],
      en: [
        'Inability to easily secure and synchronize offline legacy POS wireless hardware counters with dynamic payment channels.',
        'High compute overheads in generating and streaming cryptographically sealed invoices in sub-second timelines.',
        'Rampant transactional fraud vectors and malicious routing patterns hijacking cloud-hosted payment paths.'
      ]
    },
    solutions: {
      ar: [
        'تطوير محرك حوكمة دفع موحد يربط المحافظ الإلكترونية بنقاط البيع عن طريق اتصالات NFC التلامسية بشكل آمن.',
        'برمجة خطوط أتمتة لإصدار وتثبيت شهادات الفواتير الرقمية في وقت قياسي يقل عن عشر الثانية.',
        'بناء جدران أمان متوافقة بالكامل مع مستويات التراخيص المصرفية الصارمة وحظر الأنشطة المشبوهة فورياً.'
      ],
      en: [
        'Architected a centralized digital bridge handshake coordinating e-wallets and physical POS via NFC wireless protocols.',
        'Engineered an sub-second electronic invoicing ledger confirming tax compliance in real-time.',
        'Implemented PCI-DSS Level 1 compliant tokenization algorithms to mask sensitive credit details instantly.'
      ]
    },
    metrics: [
      { value: 'under 0.12s', labelAr: 'سرعة معالجة العمليات المالية', labelEn: 'Average Transaction Speed', icon: 'Zap' },
      { value: '99.99%', labelAr: 'معدل نجاح الدفع وصيرورة البيانات', labelEn: 'Successful Transaction Rate', icon: 'CheckCircle' },
      { value: 'PCI-DSS L1', labelAr: 'معدل الأمان والامتثال المالي', labelEn: 'Security Compliance Audits', icon: 'ShieldCheck' }
    ],
    stackDetails: [
      { name: 'React', descriptionAr: 'لبناء واجهات مستخدم سلسة وعصرية لإتمام الدفع وسحب الفواتير.', descriptionEn: 'For responsive customer frontends and interactive transaction bookkeeping logs.' },
      { name: 'Node.js', descriptionAr: 'النواة البرمجية غير المتزامنة عالية الكفاءة لمعالجة الطلبات المتزامنة.', descriptionEn: 'The non-blocking scalable backend routing platform handling high-frequency webhooks.' },
      { name: 'PostgreSQL', descriptionAr: 'قاعدة بيانات علائقية متينة لضمان موثوقية السجلات المالية التامة (ACID).', descriptionEn: 'ACID-compliant storage securing every single transaction state sequence.' },
      { name: 'Kubernetes', descriptionAr: 'للتوزيع التلقائي للأداء وتوسيع السعات تبعاً للاستخدام العالي في الأعياد.', descriptionEn: 'Automated horizontal scaling managing traffic during peak sales sessions.' }
    ]
  },
  'balady-portal': {
    challenges: {
      ar: [
        'البطء الشديد في دورات إصدار تراخيص البناء، حيث كانت الطلبات تستغرق أسابيع بين اللجان البلدية.',
        'غياب التوافقية الجغرافية الجوية والخرائط الذكية التي تعزز دقة التأكد من السلامة العمرانية.',
        'صعوبة تواصل المواطنين والمستثمرين مع الأنظمة الحكومية بسبب تعقيد النمذجة التقليدية التنافسية.'
      ],
      en: [
        'Multi-week manual bottlenecks across municipal queues delaying real estate construction projects.',
        'Inability to cross-reference proposed blueprints against geo-spatial zoning limits dynamically.',
        'Complex registration forms reducing citizen engagement and driving up physical office support visits.'
      ]
    },
    solutions: {
      ar: [
        'تنفيذ خوارزميات أتمتة لدراسة مستندات الترخيص وحساب المتطلبات وإصدار الفاتورة البلدية فورياً بصورة موحدة.',
        'دمج الخرائط الجغرافية GIS والمسح الطبوغرافي الجوي لمعاينة صلاحية وملاءمة قطعة الأرض آلياً.',
        'هيكلة بوابات مستخدمين تفاعلية ذات خطى واضحة ميسرة تمنع الخروج العشوائي من مرحلة التسجيل.'
      ],
      en: [
        'Integrated rules-engine blueprints verifying property guidelines data autonomously under 24 hours.',
        'Fused professional GIS servers to validate real-world topographic parameters and public facility bounds.',
        'Revamped citizen onboarding flow with an step-by-step interactive portal designed around clear user goals.'
      ]
    },
    metrics: [
      { value: 'under 24h', labelAr: 'مدة إصدار الترخيص البلدي المعتمد', labelEn: 'Average License Issuing Cycle', icon: 'Clock' },
      { value: '94%', labelAr: 'نسبة أتمتة الإجراءات إلكترونياً بالكامل', labelEn: 'Process Automated Ratio', icon: 'Cpu' },
      { value: '100% paperless', labelAr: 'نسبة تقليل استهلاك ومراجعة المعاملات الورقية', labelEn: 'Paper Consumption Reduc.', icon: 'ShieldCheck' }
    ],
    stackDetails: [
      { name: 'Next.js', descriptionAr: 'لتقديم بوابات سريعة ملائمة للمواطنين مع تحسين محركات البحث الفيدرالية.', descriptionEn: 'Delivering hyper-fast static views and documentation maps with lightning loadouts.' },
      { name: 'Go (Golang)', descriptionAr: 'اللغة المترجمة المستعملة لكتابة محرك احتساب وتوليد الرخص عالي السرعة.', descriptionEn: 'High-speed compiled microservices verifying licensing calculations with minimal overhead.' },
      { name: 'PostgreSQL', descriptionAr: 'لحفظ وتدقيق الفهارس الجغرافية الثقيلة ومعلومات السجل العقاري والمواطنين.', descriptionEn: 'Housing high-integrity land registry fields, ownership indices, and tax audits.' },
      { name: 'GIS Server', descriptionAr: 'الأنظمة الخرائطية التي تتحقق آلياً من موانع البناء والحرم السكاني والمسافات.', descriptionEn: 'Geospatial mapping engine conducting complex boundary math checks.' }
    ]
  },
  'sehaty-cloud': {
    challenges: {
      ar: [
        'تشتت خطير لبيانات وصور المرضى التاريخية بأجهزة مختلفة لدى المراكز الصحية، مما يقلل جودة إنقاذ الحالات.',
        'الحجم الضخم لملفات الأشعة الطبية العادية (DICOM) والتي يصعب نقلها وحفظها معاً في نظام الويب التقليدي.',
        'التهديد المستمر الخاص باختراق السجلات الصحية الشخصية الحساسة للعملاء مما يخالف التشريعات الوطنية.'
      ],
      en: [
        'Scattered historical electronic healthcare records (EHR) resulting in redundant diagnoses and medical hazards.',
        'Massive multi-gigabyte medical imaging files (DICOM) suffering extreme latencies and timeouts in web previews.',
        'High risk of breaches on highly sensible citizen health archives violating national data protection acts.'
      ]
    },
    solutions: {
      ar: [
        'بناء أرشيف وطني سحابي موحد يربط ملف المريض برقم هويته مع تدفق فوري للبيانات.',
        'تطوير نظام لضغط وعرض ملفات الأشعة وصور الرنين لحظياً على متصفحات الويب بدقة بالغة وبأقل حجم ممكن.',
        'تطبيق نظام أمان ذو ثقة صفرية تشمل تشفير البيانات الثابتة بقوة AES-256 وحمايتها التامة.'
      ],
      en: [
        'Formulated a private medical cloud network binding electronic health files to standard national IDs.',
        'Engineered an sub-second streaming viewer translating raw DICOM telemetry metadata directly in web rendering engines.',
        'Deployed strict multi-signature encryption locks safeguarding health data pools against malicious access.'
      ]
    },
    metrics: [
      { value: '0.3 sec', labelAr: 'زمن استرجاع وعرض ملف المريض الطبي', labelEn: 'Average File Retrieval Speed', icon: 'Zap' },
      { value: '100% HIPAA', labelAr: 'الالتزام بمعايير الخصوصية والأمان الصحية', labelEn: 'Privacy Protocol Compliance', icon: 'ShieldCheck' },
      { value: '35% drop', labelAr: 'نسبة توفير التكرار في الفحوصات والتحاليل', labelEn: 'Diagnostic Overlap Reduction', icon: 'TrendingUp' }
    ],
    stackDetails: [
      { name: 'TypeScript', descriptionAr: 'لأمن البيانات وضمان سلامة الكود من الثغرات في التعامل مع المنظومات الحرجة.', descriptionEn: 'Enforcing robust, clean data shapes to prevent error conditions in medical operations.' },
      { name: 'FastAPI', descriptionAr: 'إطار ويب فائق السرعة والخفة بالبايثون للربط مع مجمعات التحاليل والمشافي.', descriptionEn: 'Minimalist python layout streaming metadata with maximum efficiency.' },
      { name: 'MongoDB', descriptionAr: 'قاعدة بيانات وثائقية مرنة لتخزين السير الطبية المتغيرة لكل مريض بدون قيود.', descriptionEn: 'Highly elastic document storage capable of tracking complex medical historical forms.' },
      { name: 'HL7 FHIR', descriptionAr: 'البروتوكول العالمي القياسي لتسهيل التبادل المشترك الآمن بين الأطباء والأشعة.', descriptionEn: 'Global semantic specification for modern digital health integration.' }
    ]
  },
  'masar-fleet': {
    challenges: {
      ar: [
        'الغياب التام لرؤية وتنسيق حركة مئات الشاحنات الكبيرة مع زيادة تكلفة الفاقد والوقود والمواعيد.',
        'تلف مستمر لحاويات الأدوية والأغذية المبردة بسبب عدم وجود مراقبة دقيقة ومباشرة لدرجات الحرارة.',
        'الصعوبة البالغة في رسم مسارات الشحن وتحاشي الاختناقات الجوية والطبوغرافية لضمان التسليم السريع.'
      ],
      en: [
        'Zero geographical predictability for massive logistics flees, driving up logistics costs.',
        'Loss of critical refrigerated payload sets (perishable foods/vaccines) due to hidden transit sensor gaps.',
        'Convoluted route coordination forcing trucks to burn excessive diesel fuel in unexpected gridlocks.'
      ]
    },
    solutions: {
      ar: [
        'ربط الشاحنات بمستشعرات إنترنت أشياء (IoT) تجمع بيانات الموقع والسرعة وتيار الحرارة وترسلها فوراً لسيرفر السحاب.',
        'تأسيس شاشات تحذير تلمح وتطلق تنبيهات مبكرة عند اقتراب درجات الحرارة من النطاقات الخاطئة للحفظ.',
        'تطبيق خوارزميات توجيه جغرافية متقدمة تحسب مسافات الشاحنات واستهلاكات وقود السائقين آلياً.'
      ],
      en: [
        'Deployed lightweight IoT telemetry shields transmitting diagnostic data packets directly over networks.',
        'Constructed smart visual triggers monitoring live cooling compartment states and warning operators dynamically.',
        'Engineered fuel-aware routing software calculating topographical gradients to find the cleanest, fastest loops.'
      ]
    },
    metrics: [
      { value: '18% save', labelAr: 'نسبة التوفير في استهلاك وقود الأسطول', labelEn: 'Total Fuel & Gas Reductions', icon: 'TrendingUp' },
      { value: '99.2%', labelAr: 'دقة وتطابق المواعيد المتوقعة للوصول', labelEn: 'ETA Predictive Accuracy', icon: 'CheckCircle' },
      { value: '100% safe', labelAr: 'المحافظة التامة على الشحنات المبردة الحساسة', labelEn: 'Cold-Chain Integrity Rate', icon: 'ShieldCheck' }
    ],
    stackDetails: [
      { name: 'Vue 3', descriptionAr: 'لبناء لوحة تحكم حركة تتبع سريعة الرندرة وخفيفة للخرائط والشاحنات.', descriptionEn: 'The core reactive rendering layer feeding real-time geofence arrays to dispatcher screens.' },
      { name: 'InfluxDB', descriptionAr: 'قاعدة بيانات زمنية فائقة الكفاءة مسؤولة عن التخاطب مع مليارات القراءات المكررة.', descriptionEn: 'Optimized time-series database capturing massive streams of continuous sensor metrics.' },
      { name: 'Apache Kafka', descriptionAr: 'محرك طوابير وتدفق البيانات الحية للمواقع المتزامنة للشاحنات بسلامة تامة.', descriptionEn: 'High-throughput event logs processing incoming location telemetry without queues bottlenecks.' },
      { name: 'Mapbox API', descriptionAr: 'لعرض الخرائط الدقيقة ثنائية وثلاثية الأبعاد وحساب خطوط المسارات المثلى.', descriptionEn: 'Rich vector tile interface for drawing clean, gorgeous geographical pathings.' }
    ]
  },
  'aqar-tech': {
    challenges: {
      ar: [
        'عزوف وتحوف المستثمرين العقاريين (وخصوصاً المقيمين بالخارج) عن شراء العقارات استناداً للصور التقليدية ثنائية الأبعاد.',
        'عدم المقدرة على التنبؤ دقيقاً وبوضوح بعوائد الإيجار العقاري ومكاسب إعادة البيع المستقبلية للمشاريع وتنوعها.',
        'الزمن الطويل المطلوب لتحميل ونقل ملفات النماذج ثلاثية الأبعاد الكبيرة للمتصفحات العادية.'
      ],
      en: [
        'Distant foreign buyers hesitant to invest in off-plan housing arrays supported only by flat static pictures.',
        'Absence of transparency on real estate capital appreciation or historical rental yield metrics across capital sectors.',
        'Extreme loading lags when downloading large interactive 3D structures in standard modern browsers.'
      ]
    },
    solutions: {
      ar: [
        'دمج تكنولوجيا التوائم الرقمية (Digital Twins) وتوطين الجولات التفاعلية ثلاثية الأبعاد بملحقات الواقع الافتراضي.',
        'برمجة لوحات تحكم مالية تسحب مؤشرات التداول التاريخية وتعرض حساباً حقيقياً للعوائد العقارية بالمدينة.',
        'توظيف شبكات التوزيع العالمية اللامركزية وضغط النماذج ثلاثية الأبعاد ببروتوكولات وشرائح ذكية سريعة.'
      ],
      en: [
        'Rendered full-scale digital properties within browsers, allowing immersive 3D/VR inspection workflows.',
        'Engineered an robust investment prediction hub pulling public sales logs to chart accurate valuation curves.',
        'Optimized 3D geometry meshes into compressed nodes served efficiently via dynamic global CDN caches.'
      ]
    },
    metrics: [
      { value: '-50% time', labelAr: 'تقليص متوسط بقاء الوحدة العقارية بالأنظمة', labelEn: 'Average Time-on-Market Drop', icon: 'Clock' },
      { value: '42%', labelAr: 'نسبة نمو وتوافق صفقات الاستثمار الأجنبي', labelEn: 'Foreign Direct Investments', icon: 'Globe' },
      { value: '97%', labelAr: 'دقة حساب وصواب عوائد الإيجار السنوية المتوقعة', labelEn: 'Yield Projection Accuracy', icon: 'CheckCircle' }
    ],
    stackDetails: [
      { name: 'Three.js', descriptionAr: 'المحرك المسؤول عن رندرة النماذج ثلاثية الأبعاد والتحكم في الإضاءة والخامات.', descriptionEn: 'Harnessing hardware WebGL capabilities to display smooth 3D architectures directly inside views.' },
      { name: 'React', descriptionAr: 'لبناء الواجهة الماليّة التفاعليّة وحساب العوائد وقوائم التصفية.', descriptionEn: 'Managing dynamic search metrics and real estate inventory filtering tables smoothly.' },
      { name: 'Redis', descriptionAr: 'لتخزين مؤقت وسريع لقراءات وأوراق ومباني العقارات الأكثر زيارة.', descriptionEn: 'Flash-speed caching mechanism to load hot property coordinates under milliseconds.' },
      { name: 'WebXR', descriptionAr: 'تكنولوجيا متقدمة تسمح لزوار الأنظمة بارتداء نظارات الواقع الافتراضي للدخول للغرف.', descriptionEn: 'Standard virtual and augmented reality protocol for complete immersive walk-ins.' }
    ]
  },
  'mawsem-ticketing': {
    challenges: {
      ar: [
        'الانهيار المتكرر لخوادم حجز التذاكر فور انطلاق مبيعات الفعاليات الحصرية بسبب تدفق ملايين الزوار بدفعة واحدة.',
        'انتشار البوتات وعمليات غسيل التذاكر وإعادة بيعها في السوق السوداء بأسعار تضر بالمواطنين والسياح.',
        'البطء في التحقق من صحة التذاكر عند بوابات الدخول للملاعب مما يسبب تكدس الزوار ومخاطر سلامة الحشود.'
      ],
      en: [
        'Standard ticketing backends folding under million-user concurrent traffic rushes during high-profile events.',
        'Automated web scalpers and buy-bots cornering ticket supplies to manipulate pricing on black markets.',
        'Severe crowd bottlenecks at stadium gates due to slow barcode validation databases latency.'
      ]
    },
    solutions: {
      ar: [
        'تطوير محرك حجز تذاكر يعتمد على الطوابير الدوارة غير المتزامنة والمحوسبة لتحمل أقصى ضغط دون خسارة عمليات الدفع.',
        'دمج آليات ذكية تتحقق من الهوية الرقمية للمشتري وتكتشف البوتات والبطاقات المزيفة آلياً قبل الشراء.',
        'توليد تذاكر رقمية مشفرة برمز QR ديناميكي يتغير كل 10 ثوان لحماية التذاكر من النسخ والتزوير.'
      ],
      en: [
        'Engineered memory-safe asynchronous ticketing queues designed around lightning atomic operations.',
        'Integrated robotic behavioral barriers filtering bot patterns and enforcing strict ticket purchase limits.',
        'Pioneered dynamic cryptographic QR tags refreshing key configurations inside smartphone wallets every 10 seconds.'
      ]
    },
    metrics: [
      { value: '150k / sec', labelAr: 'قدرة تحمل الطلبات المتزامنة للخوادم', labelEn: 'Peak API Load Durability', icon: 'Server' },
      { value: '99.9%', labelAr: 'نسبة الوقاية ومنع عمليات الشراء عبر البوتات', labelEn: 'Scalper Bot Prevention Rate', icon: 'ShieldCheck' },
      { value: 'under 0.4s', labelAr: 'سرعة توليد التذكرة والتحقق على بوابة الدخول', labelEn: 'Gate Validation Turnaround', icon: 'Zap' }
    ],
    stackDetails: [
      { name: 'Svelte', descriptionAr: 'واجهة خفيفة ذات زمن تحميل صغير للغاية لتجنب بطء حجز تذكرة العميل.', descriptionEn: 'Highly performant UI framework with zero client bundle overhead ideal for fast updates.' },
      { name: 'Rust', descriptionAr: 'اللغة الأقوى في الأداء والآمنة للذاكرة لكتابة خوارزميات الحجز وحركة الطوابير المتزامنة.', descriptionEn: 'The core computational language powering hyper-fast transactions logic with extreme safety.' },
      { name: 'Redis Cluster', descriptionAr: 'عناقيد ذاكرة تخزين مؤقتة سريعة للتنظيم والسيطرة على مقاعد الحجز اللحظية.', descriptionEn: 'Distributed in-memory storage arrays keeping ticket allocation states coherent.' },
      { name: 'Cloudflare', descriptionAr: 'لحماية المنظومة من الهجمات وحجب الخدمات DDoS وحقن الأكواد الضارة.', descriptionEn: 'Dynamic traffic scrubbing and perimeter security defense against botnets orchestrations.' }
    ]
  }
};

export default function ProjectDetailsModal({ isOpen, project, onClose, lang }: ProjectDetailsModalProps) {
  if (!project) return null;

  const isAr = lang === 'ar';
  const data = EXTENDED_PROJECT_DATA[project.id];

  const title = isAr ? project.titleAr : project.titleEn;
  const sector = isAr ? project.sectorAr : project.sectorEn;
  const summary = isAr ? project.descriptionAr : project.descriptionEn;

  // Custom function to get correct icon in React modal
  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className={className} />;
      case 'CheckCircle': return <CheckCircle className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Clock': return <TrendingUp className={className} />; // Fallback or appropriate icon
      case 'Cpu': return <Cpu className={className} />;
      case 'Server': return <Server className={className} />;
      default: return <TrendingUp className={className} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="project-details-portal" className="fixed inset-0 z-[120] overflow-y-auto">
          {/* Backdrop screen blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            id="project-details-backdrop"
          />

          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 relative">
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              id="project-details-content"
              className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto lg:h-[680px]"
            >
              {/* Left Column: Dark Brand aesthetic with title & stats */}
              <div className="w-full md:w-[35%] bg-slate-950 p-6 sm:p-8 text-white relative flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r rtl:md:border-r-0 rtl:md:border-l border-slate-900 shrink-0">
                {/* Visual Ambient Background Star and grid design */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative space-y-6 z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[10px] font-bold tracking-wider uppercase">
                      {sector}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-sky-400 flex items-center justify-center">
                      {getIconComponent(project.iconName, 'w-5 h-5')}
                    </div>
                  </div>

                  <div className="space-y-3 mr-1 ltr:mr-0 rtl:mr-1">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                      {title}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {summary}
                    </p>
                  </div>
                </div>

                {/* Vertical aligned key success metrics */}
                {data?.metrics && (
                  <div className="relative z-10 space-y-4 pt-10 mt-auto">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right ltr:text-left">
                      {isAr ? 'مؤشرات الأداء المحققة' : 'SOCIETAL & TECH METRICS'}
                    </div>
                    <div className="space-y-3.5">
                      {data.metrics.map((m, idx) => (
                        <div 
                          key={idx}
                          className="p-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl flex items-center space-x-3 rtl:space-x-reverse transition-all"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                            {renderIcon(m.icon, 'w-4 h-4')}
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <span className="block text-sm font-extrabold text-sky-300 font-mono tracking-tight text-right ltr:text-left">{m.value}</span>
                            <span className="block text-[10px] text-slate-400 truncate text-right ltr:text-left">{isAr ? m.labelAr : m.labelEn}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Scrollable white panel detailing Challenges, Solutions, Stack */}
              <div className="w-full md:w-[65%] flex flex-col justify-between h-auto md:h-full relative bg-slate-50/20">
                {/* Header action panel with nice Close button */}
                <div className="px-6 py-4 border-b border-indigo-50/80 bg-white flex items-center justify-between shrink-0">
                  <span className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full">
                    {isAr ? 'تفاصيل هندسة المشروع والتشغيل الفعلي' : 'CASE ARCHITECTURE & METRICS DETAILED'}
                  </span>
                  
                  <button
                    id="project-detail-close-btn"
                    onClick={onClose}
                    className="p-1 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable details of Challenges and Steps */}
                <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
                  
                  {/* CLIENT CHALLENGES TAB SECTION */}
                  {data?.challenges && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="p-1 rounded bg-amber-50 text-amber-600 border border-amber-100">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {isAr ? 'التحديات ومصاعب قطاع العميل' : 'Client Challenges & Roadblocks'}
                        </h3>
                      </div>
                      <div className="grid gap-2.5">
                        {(isAr ? data.challenges.ar : data.challenges.en).map((challenge, index) => (
                          <div 
                            key={index} 
                            className="p-3 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 rounded-xl flex items-start space-x-2.5 rtl:space-x-reverse transition-all font-sans"
                          >
                            <span className="w-5 h-5 rounded-full bg-amber-100/50 text-amber-800 text-xs font-bold shrink-0 flex items-center justify-center mt-0.5">
                              {index + 1}
                            </span>
                            <p className="text-slate-700 text-xs leading-relaxed">
                              {challenge}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HOW WE UNIQUE SOLVED IT */}
                  {data?.solutions && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="p-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {isAr ? 'كيف طوعنا الحلول وحققنا الهدف؟' : 'How We Architected The Solution'}
                        </h3>
                      </div>
                      <div className="grid gap-2.5">
                        {(isAr ? data.solutions.ar : data.solutions.en).map((sol, index) => (
                          <div 
                            key={index} 
                            className="p-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-xl flex items-start space-x-2.5 rtl:space-x-reverse transition-all font-sans"
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-100/50 text-emerald-800 text-xs font-bold shrink-0 flex items-center justify-center mt-0.5">
                              {index + 1}
                            </span>
                            <p className="text-slate-700 text-xs leading-relaxed">
                              {sol}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailing of Technologies in depth */}
                  {data?.stackDetails && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="p-1 rounded bg-sky-50 text-sky-600 border border-sky-100">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {isAr ? 'تفصيل حزمة التقنيات المستخدمة' : 'Technologies Stack Breakdown'}
                        </h3>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-3">
                        {data.stackDetails.map((tech, idx) => (
                          <div 
                            key={idx}
                            className="p-3.5 bg-white border border-slate-200/60 rounded-xl flex flex-col justify-between hover:border-sky-300 hover:shadow-2xs transition-all font-sans"
                          >
                            <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-100 text-sky-700 text-[10px] font-mono font-bold w-fit mb-2">
                              {tech.name}
                            </span>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              {isAr ? tech.descriptionAr : tech.descriptionEn}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer bar with external URL triggers */}
                <div className="p-4 bg-slate-50 border-t border-slate-200/60 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between shrink-0 font-sans">
                  <div className="flex items-center justify-center space-x-1.5 rtl:space-x-reverse text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {isAr ? 'منصة آمنة 100% لفحص البيانات' : 'Fully Sandbox Inspected'}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      id="project-detail-prev-btn"
                      onClick={() => {
                        alert(
                          isAr 
                            ? `هذه مسودة تفاعلية لبيئة العرض الخاصة بمشروع (${title}). يتم نقلكم إلى أفضل نموذج الآن.`
                            : `Redirecting you to checkout sandboxed environment for (${title}).`
                        );
                        window.open(project.demoLink, '_blank');
                      }}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse transition-all shadow-md shadow-indigo-100"
                    >
                      <span>{isAr ? 'زيارة نموذج العرض المباشر' : 'Explore Live Prototype'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      {isAr ? 'إغلاق المجلد' : 'Close Details'}
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
