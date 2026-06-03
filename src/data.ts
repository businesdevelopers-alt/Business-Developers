import { Solution, Sector, Project, FAQItem } from './types';

export const SOLUTIONS: Solution[] = [
  {
    id: 'digital-transformation',
    titleAr: 'استراتيجية التحول الرقمي',
    titleEn: 'Digital Transformation Strategy',
    descriptionAr: 'تمكين المؤسسات من إعادة صياغة نماذج أعمالها لتتوافق مع العصر الرقمي المتطور بكفاءة تامة.',
    descriptionEn: 'Empowering organizations to reshape their business models to align with the evolving digital era seamlessly.',
    iconName: 'Compass',
    featuresAr: [
      'صياغة خارطة طريق شاملة مخصصة لنمو الأعمال',
      'تحسين دقة العمليات التشغيلية وسرعة الخدمات',
      'تحليل الثغرات الهيكلية وتصميم الهوية الرقمية الجديدة للمنظمة',
      'إدارة التغيير الثقافي والتكنولوجي لفرق العمل'
    ],
    featuresEn: [
      'Formulating a comprehensive, custom roadmap for business growth',
      'Optimizing operational accuracy and service velocity',
      'Analyzing structural gaps and designing the organization\'s new digital identity',
      'Managing cultural and technological change for workforces'
    ],
    impactAr: 'تحسين بنسبة 40% في الكفاءة التشغيلية العامة وتسريع الوصول للأسواق.',
    impactEn: '40% improvement in overall operational efficiency and faster time-to-market.',
    detailsAr: 'نحن نقوم بدراسة متأنية لجميع النظم التقليدية الحالية، ثم نضع رؤية إستراتيجية طويلة الأجل تركز على استغلال التقنيات لزيادة الإنتاجية وخفض التكاليف وتحقيق التفوق التنافسي.',
    detailsEn: 'We carefully evaluate existing traditional systems, then establish a long-term strategic vision focused on leveraging technologies to increase productivity, lower costs, and achieve competitive superiority.'
  },
  {
    id: 'technical-modernization',
    titleAr: 'التحديث التقني',
    titleEn: 'Technical Modernization',
    descriptionAr: 'تحديث الأنظمة القديمة والإرث التقني لرفع المرونة والقدرة على مواكبة المتطلبات الحديثة.',
    descriptionEn: 'Modernizing legacy systems and tech debt to elevate agility and the ability to keep pace with modern requirements.',
    iconName: 'Zap',
    featuresAr: [
      'تحديث الأنظمة الموروثة (Legacy Apps) دون إيقاف التشغيل',
      'إعادة هيكلة الأكواد وتحسين أداء خوادم وقواعد البيانات',
      'تبني العمارة القائمة على الخدمات المصغرة (Microservices)',
      'تقليل النفقات المتعلقة بالصيانة التقنية والتراخيص القديمة'
    ],
    featuresEn: [
      'Modernizing legacy applications without operational downtime',
      'Refactoring codebases and optimizing database/server performance',
      'Adopting microservices-based architectures',
      'Reducing expenditures related to technical maintenance and obsolete licensing'
    ],
    impactAr: 'خفض تكاليف الصيانة التقنية بنسبة تصل إلى 25% مع مضاعفة سرعة النظام.',
    impactEn: 'Up to 25% reduction in maintenance costs while doubling system speed.',
    detailsAr: 'نساعد الشركات على نقل أنظمتها الحساسة من التقنيات العتيقة التي تسبب بطء العمليات إلى بنيات موثوقة مرنة ومفتوحة للتطور المستقبلي المستمر.',
    detailsEn: 'We help corporations migrate their mission-critical environments from outdated technologies that throttle operations to robust, flexible, and future-ready architectures.'
  },
  {
    id: 'ai-ml',
    titleAr: 'الذكاء الاصطناعي والتعلم الآلي',
    titleEn: 'Artificial Intelligence & Machine Learning',
    descriptionAr: 'دمج تقنيات الذكاء الاصطناعي والخوارزميات الذكية لأتمتة القرارات وابتكار تجارب عملاء فريدة.',
    descriptionEn: 'Integrating AI technologies and smart algorithms to automate decisions and innovate unique customer experiences.',
    iconName: 'Cpu',
    featuresAr: [
      'تطوير نماذج ذكاء اصطناعي مخصصة للتنبؤ بسلوكيات السوق',
      'معالجة اللغات الطبيعية (NLP) والتحليل الآلي للمستندات والدعم',
      'تطوير وتدريب المساعدين الأذكياء وروبوتات المحادثة المتقدمة',
      'رؤية الحاسوب والتحليل الآلي للصور ومقاطع الفيديو'
    ],
    featuresEn: [
      'Developing custom AI models to forecast market behaviors',
      'Natural Language Processing (NLP) and automated document / support analysis',
      'Developing and training advanced conversational agents and bots',
      'Computer vision and automated image/video intelligence extraction'
    ],
    impactAr: 'زيادة سرعة معالجة وتحليل البيانات بـ 10 أضعاف وتقليص الأخطاء البشرية.',
    impactEn: '10x increase in data processing speeds and heavy reduction in human errors.',
    detailsAr: 'من خلال تحويل بياناتك إلى خوارزميات نشطة، نفتح آفاقاً جديدة للتنبؤ بنسب الطلب، والكشف الأوتوماتيكي عن الاحتيال، وفرص التخصيص الدقيق للعملاء في ثوانٍ معدودة.',
    detailsEn: 'By turning raw datasets into active algorithms, we unlock new horizons for demand forecasting, automated fraud detection, and precision customer personalization in real-time.'
  },
  {
    id: 'cloud-computing',
    titleAr: 'حلول الحوسبة السحابية',
    titleEn: 'Cloud Computing Solutions',
    descriptionAr: 'تصميم وبناء بيئات سحابية هجينة ومتعددة توفر الحماية والقابلية للتوسع الفوري بمرونة متناهية.',
    descriptionEn: 'Designing and building hybrid and multi-cloud environments providing protection and instant scalability with ultimate agility.',
    iconName: 'Cloud',
    featuresAr: [
      'ترحيل آمن وسلس للبيانات إلى السحب العامة والهجينة',
      'إدارة البيئات السحابية المشتركة (AWS, Google Cloud, Azure)',
      'تطبيق حلول الحوسبة بدون خادم (Serverless Computing)',
      'مراقبة الإنفاق وتحسين استهلاك الموارد المادية السحابية'
    ],
    featuresEn: [
      'Secure and seamless data migration to public, private, and hybrid clouds',
      'Managing multi-cloud environments (AWS, Google Cloud, Azure)',
      'Implementing serverless computing paradigms',
      'Monitoring cloud spending and resource allocation sizing optimizations'
    ],
    impactAr: 'تحقيق توفير بنسبة 35% في نفقات البنية التحتية مع جاهزية تشغيل 99.99%.',
    impactEn: 'Achieving 35% cost savings on IT infrastructure with 99.99% system uptime.',
    detailsAr: 'نقدم خدمات الاستشارات السحابية، بدءاً من التخطيط والتنفيذ، لضمان حصول مؤسستك على مرونة السحابة الكاملة التي تتيح التوسع الفوري مع طفرات الاستخدام.',
    detailsEn: 'We deliver comprehensive cloud consultancy, from strategy to execution, ensuring your institution leverages cloud-native elasticity to scale instantly during traffic spikes.'
  },
  {
    id: 'data-analytics',
    titleAr: 'البيانات والتحليلات',
    titleEn: 'Data and Analytics',
    descriptionAr: 'بناء مخازن وبحيرات البيانات العملاقة وتحويلها لرسومات بيانية تفاعلية تدعم اتخاذ القرار.',
    descriptionEn: 'Building robust data warehouses and data lakes to convert massive raw structures into interactive, decision-support dashboards.',
    iconName: 'BarChart3',
    featuresAr: [
      'تأسيس بنية تحتية لبحيرات البيانات وهندسة خطوط النقل (ETL Pipelines)',
      'تطوير لوحات تحكم ذكية وتفاعلية لقياس مؤشرات الأداء (BI)',
      'التحليلات التنبئية والمتقدمة لسلاسل الإمداد ومؤشرات البيع',
      'حوكمة البيانات وضمان جودتها وحمايتها القانونية'
    ],
    featuresEn: [
      'Establishing data lakes and robust ETL data pipelines',
      'Developing interactive business intelligence dashboards (BI & KPIs)',
      'Predictive analytics for supply chains and transactional velocities',
      'Data governance, data quality framework installation, and standard compliance'
    ],
    impactAr: 'تمكين متخذي القرار من الوصول للحقائق التشغيلية أسرع بـ 5 أضعاف مع دقة تامة.',
    impactEn: 'Enabling decision-makers to access live facts 5x faster with accurate precision.',
    detailsAr: 'البيانات هي النفط الجديد؛ نركز على تحويل البيانات المبعثرة لدى منظمتك إلى ذكاء حقيقي يعزز قدرتك على فهم احتياجات العملاء واختصار الزمن الاستراتيجي.',
    detailsEn: 'Data is the new gold; we focus on capturing and processing disparate datasets across your organization into structured intelligence that boosts market responsiveness.'
  },
  {
    id: 'cybersecurity',
    titleAr: 'الأمن السيبراني وإدارة المخاطر',
    titleEn: 'Cybersecurity and Risk Management',
    descriptionAr: 'حماية الأصول الرقمية للمؤسسات والحد من التهديدات الأمنية عبر حلول استباقية صارمة.',
    descriptionEn: 'Safeguarding enterprise digital assets and mitigating active threats via robust, proactive security solutions.',
    iconName: 'ShieldAlert',
    featuresAr: [
      'تقييم الثغرات الأمنية واختبارات الاختراق الدورية لمختلف الأنظمة',
      'تطبيق نموذج الثقة الصفرية (Zero-Trust Security Client)',
      'مراقبة الأحداث الأمنية والاستجابة الفورية للحوادث على مدار الساعة',
      'الامتثال للمعايير الوطنية والدولية للأمن السيبراني'
    ],
    featuresEn: [
      'Vulnerability assessments and periodic system penetration tests',
      'Deploying zero-trust architecture frameworks',
      '24/7 Security Operations Center (SOC) monitoring and incident response',
      'Maintaining compliance with local regulations and international security standards'
    ],
    impactAr: 'تأمين بنسبة 100% للمعلومات الحساسة والمحافظة على سجل خالٍ من الاختراقات.',
    impactEn: '100% security enforcement for sensible records and retaining clean threat logs.',
    detailsAr: 'الأمان ليس مجرد خيار؛ إنه العمود الفقري لكل منصة ناجحة. نحن نبني دروعاً واقية تحمي بيانات عملائك وتمنع انقطاع الخدمات بسبب الهجمات الخبيثة.',
    detailsEn: 'Security is not an option; it is the spine of every digital platform. We build complex rings of defense protecting user keys and ensuring continuous system operability.'
  },
  {
    id: 'digital-experience',
    titleAr: 'منصات التجربة الرقمية',
    titleEn: 'Digital Experience Platforms',
    descriptionAr: 'تصميم قنوات اتصال رقمية ممتازة وتطبيقات ويب وهواتف ذكية تحوز إعجاب ورضا المستخدمين.',
    descriptionEn: 'Designing premium consumer channels, intuitive web, and mobile solutions capturing user satisfaction.',
    iconName: 'Smartphone',
    featuresAr: [
      'تصميم واجهات المستخدم (UI) وتجاري المستخدم (UX) بأسلوب عصري مريح',
      'تطوير تطبيقات الهواتف الذكية الهجينة والأصلية عالية الأداء',
      'بناء بوابات الخدمة الذاتية ومنصات التجارة الإلكترونية المعقدة',
      'لوحات تحفيز العملاء والتسويق الرقمي الرقمية الشاملة'
    ],
    featuresEn: [
      'Modern, highly comfortable UI and seamless UX design journeys',
      'Highly optimized hybrid and native mobile applications',
      'Constructing complex self-service portal systems and e-commerce platforms',
      'Interactive customer engagement and full digital loyalty platforms'
    ],
    impactAr: 'زيادة معدلات رضا واستبقاء المستخدمين بنسبة 45% وتحسين جودة التواصل المباشر.',
    impactEn: '45% surge in client retention scores and notable boost in user interaction quality.',
    detailsAr: 'نضمن لعملائك ومعامليك تجربة بصرية ووظيفية خالية من العوائق تعبر عن ريادتك وجدارة هويتك المؤسسية على شاشات الهواتف والويب.',
    detailsEn: 'We guarantee your clients and users a visually spectacular, frictionless journey representing your identity with unmatched premium styling on web and mobile views.'
  },
  {
    id: 'infrastructure-ops',
    titleAr: 'البنية التحتية التقنية والعمليات',
    titleEn: 'Technical Infrastructure & Operations',
    descriptionAr: 'تخطيط وتشغيل الشبكات المتقدمة ومراكز البيانات وتطبيقات الأتمتة والعمليات للتسليم السريع.',
    descriptionEn: 'Planning and operating advanced enterprise networks, modular datacenters, and DevOps automation tooling.',
    iconName: 'Server',
    featuresAr: [
      'تصميم وبناء البنية الأساسية المادية ومراكز البيانات الآمنة',
      'إدارة البنية كرمز (Infrastructure as Code - IaC)',
      'أتمتة تكامل ونشر البرمجيات (CI/CD Pipelines) لسرعة قصوى',
      'مراقبة البنية التحتية وحل المشكلات الاستباقي للحد من الأعطال'
    ],
    featuresEn: [
      'Designing and executing robust physical structures and datacenters',
      'Managing infrastructure through modern IaC methodologies',
      'Automating deployment and integration (CI/CD pipelines) for rapid flow',
      'Continuous hardware telemetry monitoring and real-time healing routines'
    ],
    impactAr: 'تسريع وقت تسليم التحديثات بمعدل 6 أضعاف وتقليص نسبة تعطل الأنظمة.',
    impactEn: '6x accelerated system release velocity and minimal system outages.',
    detailsAr: 'نؤسس البنى التحتية المتينة التي تستوعب النمو السريع لأعمالك، من خلال دمج الأتمتة والربط السلس بين فرق التطوير وفرق العمليات والشبكات.',
    detailsEn: 'We establish resilient engineering infrastructures that host massive business scaleups, harmonizing teams with streamlined code deployments and automation.'
  },
  {
    id: 'digital-government',
    titleAr: 'حلول الحكومة الرقمية',
    titleEn: 'Digital Government Solutions',
    descriptionAr: 'تسهيل تقديم الخدمات العامة إلكترونياً وبناء بوابات المواطنين الآمنة لخدمات حكومية مرنة.',
    descriptionEn: 'Facilitating public service delivery and styling secure citizen portals for responsive municipal e-governance.',
    iconName: 'Building2',
    featuresAr: [
      'رقمنة المعاملات الحكومية والتوقيع الإلكتروني والهويات الرقمية',
      'بوابات الخدمة الوطنية والبلدية الموحدة للمواطنين والمقيمين',
      'أنظمة ربط وتبادل البيانات الحكومية الآمنة المشتركة',
      'منصات الدفع الوطنية والفوترة الإلكترونية وتتبع الأثر التشريعي'
    ],
    featuresEn: [
      'Digitizing municipal paperwork, smart contracts, and digital national IDs',
      'Consolidated self-service citizens and residents portals',
      'Secure government data integration hubs and exchange backbones',
      'National payment gateways, e-invoicing databases, and legislative impact trackers'
    ],
    impactAr: 'تقليص مدد إنجاز المعاملات بنسبة 80% وتقليل المراجعات الحضورية.',
    impactEn: '80% processing turnaround time speedup and minimal in-person office visits.',
    detailsAr: 'نحن فخورون بتمكين الجهات الحكومية والبلدية ومساعدتها في تحقيق مستهدفات رؤية المملكة ورؤى التحول الرقمي الإقليمية من خلال رقمنة شاملة ومتطابقة مع معايير الحوكمة.',
    detailsEn: 'We are proud to enable government and municipal bodies to realize their digital transformation objectives through modern portal designs built to world-class regulatory standards.'
  }
];

export const SECTORS: Sector[] = [
  {
    id: 'banking',
    titleAr: 'الخدمات المصرفية والمالية والتأمين',
    titleEn: 'Banking, Financial Services & Insurance (BFSI)',
    descriptionAr: 'تسريع إيقاع المعاملات وتحديث المنظومة المصرفية نحو التكنولوجيا المالية الحديثة وحماية الودائع والبيانات المالية.',
    descriptionEn: 'Accelerating transactional workflows, modernizing legacies into Fintech paradigms, and protecting crucial financial data.',
    iconName: 'Coins',
    challengesAr: [
      'امتثال صارم للوائح المالية والمصرفية المعقدة',
      'بطء الأنظمة المصرفية القديمة وصعوبة تحديثها',
      'التهديد المتواصل بالهجمات السيبرانية والاحتيال المالي المعقد'
    ],
    challengesEn: [
      'Strict adherence to complex financial rules and audits',
      'Sluggish legacy banking infrastructure preventing custom modern products',
      'Continuous threat vectors for digital fraud and complex payment attacks'
    ],
    solutionsProvidedAr: [
      'تحديث كود القطاع المصرفي الأساسي (Core Banking Modernization)',
      'إدماج خوارزميات الذكاء الاصطناعي لاكتشاف حالات الاحتيال فورياً',
      'بناء محافظ رقمية آمنة وبوابات دفع ذاتية ومفتوحة للشركاء'
    ],
    solutionsProvidedEn: [
      'Core banking system modernization with modular architectures',
      'Real-time fraud prevention using advanced AI intelligence models',
      'Designing consumer-facing secure digital wallets and open-banking APIs'
    ],
    caseStudyTitleAr: 'مشروع التحول البنكي الرقمي المتكامل',
    caseStudyTitleEn: 'Integrated Regional Banking Migration Project',
    caseStudyDescAr: 'قمنا بدعم أحد أهم المصارف الاستثمارية لإعادة بناء بوابة خدماته الفردية بسحابة آمنة بالكامل، مما مكنه من رقمنة طلبات التمويل والقروض ليرتفع رضا العملاء ومعدلات المعاملات المنجزة يومياً.',
    caseStudyDescEn: 'We enabled a prominent investment bank to migrate its consumer portal to a highly secure cloud setting, automating loan approval pipelines and dramatically increasing daily successful transactions.',
    metrics: [
      { labelAr: 'زيادة المعاملات الرقمية', labelEn: 'Digital Transaction Surge', value: '+300%' },
      { labelAr: 'تقليص وقت مراجعة القروض', labelEn: 'Loan Approval Speedup', value: 'from 5 days to 4 mins' },
      { labelAr: 'معدل الحماية من الاحتيال', labelEn: 'Fraud Prevention Rate', value: '99.98%' }
    ]
  },
  {
    id: 'government',
    titleAr: 'القطاع الحكومي والعسكري',
    titleEn: 'Government & Military Sector',
    descriptionAr: 'بناء جسور آمنة للغاية لتداول البيانات السرية وتسهيل تقديم خدمات واضحة للمواطنين والقطاعات العسكرية والمدنية.',
    descriptionEn: 'Creating ultra-secure communications, protecting classified intelligence, and streamlining civil service automation.',
    iconName: 'Milestone',
    challengesAr: [
      'الحاجة لمستويات مفرطة من الأمان والسرية التامة للبيانات',
      'صعوبة تكامل قواعد البيانات بين الوزارات والجهات السيادية والمدنية',
      'توفير تجربة خدماتية سهلة وسريعة للمواطنين للحد من البيروقراطية'
    ],
    challengesEn: [
      'Need for absolute data protection and air-gapped system isolation models',
      'Integration friction between historic databases of various ministries',
      'Delivering citizen-centric portals that strip away historic bureaucratical delays'
    ],
    solutionsProvidedAr: [
      'تأسيس أنظمة تبادل البيانات الحكومية الآمنة الفائقة التشفير',
      'تسهيل سحابة وطنية مغلقة (Federated Private Gov Cloud)',
      'بوابات تفاعلية ذكية للخدمات المدنية للمواطنين لتقليص الأوراق'
    ],
    solutionsProvidedEn: [
      'Deploying state-level, multi-layer encrypted secure integration grids',
      'Building federated private clouds for strict data isolation governance',
      'Constructing responsive paperless portals for consolidated civic registry flows'
    ],
    caseStudyTitleAr: 'البوابة الرقمية الموحدة للخدمات الكبرى',
    caseStudyTitleEn: 'National Citizen Service Platform Implementation',
    caseStudyDescAr: 'تطوير منصة وطنية مركزية توفر 120 خدمة حكومية ومحلية متكاملة لخدمة 5 ملايين مواطن بسلاسة وبسرية تامة متماشية مع المعايير الحكومية الصارمة.',
    caseStudyDescEn: 'Designing and deploying a massive centralized portal coordinating 120 municipal and state services for over 5 million users with 100% security alignment and zero downtown.',
    metrics: [
      { labelAr: 'نسبة الأوراق المستغنی عنها', labelEn: 'Paper Consumption Drop', value: '92%' },
      { labelAr: 'زمن المعاملات الأساسية', labelEn: 'Citizen Case Solving Time', value: '1.2 mins' },
      { labelAr: 'مستويات رضا المواطنين', labelEn: 'Citizen Satisfaction Score', value: '4.8 / 5' }
    ]
  },
  {
    id: 'healthcare',
    titleAr: 'الرعاية الصحية',
    titleEn: 'Healthcare & Lifesciences',
    descriptionAr: 'ابتكار بوابات المرضى وتوحيد السجلات الطبية الإلكترونية للحد من الفروقات وزيادة فعالية الرعاية والدقة والتشخيص.',
    descriptionEn: 'Innovating patient experience paths, unifying electronic medical archives, and optimizing medical diagnostic precision.',
    iconName: 'Activity',
    challengesAr: [
      'تشتت السجلات الطبية الإلكترونية وغياب تكامل التاريخ الطبي للمرضى',
      'الحفاظ على السرية الفائقة للمعلومات الصحية وحقوق الخصوصية والامتثال للوائح HIPAA',
      'الضغط الكبير على الكوادر الطبية والممرضين وصعوبة جدولة المواعيد مسبقاً'
    ],
    challengesEn: [
      'Highly fragmented patient records across multiple clinics and hospitals',
      'Enforcing rigorous patient healthcare confidentiality rules (e.g. HIPAA equivalents)',
      'Extreme logistical stress on healthcare workers and scheduling systems'
    ],
    solutionsProvidedAr: [
      'بناء منصات السجلات الصحية الإلكترونية الموحدة القابلة للتكامل اللحظي',
      'تطوير بوابات متقدمة للمرضى لحجز المواعيد والاستشارات الطبية عن بعد',
      'دمج أدوات الذكاء الاصطناعي لتحليل الأشعة الطبية واكتشاف الأمراض الاستباقي'
    ],
    solutionsProvidedEn: [
      'Unified electronic health records (EHR) databases with instant secure interoperability',
      'Constructing telehealth interfaces and online consult booking systems',
      'AI assistant layers to check X-Rays and flag priority anomalies in real-time'
    ],
    caseStudyTitleAr: 'المنظومة السحابية الموحدة للمستشفيات',
    caseStudyTitleEn: 'Multi-Center Hospital Management Cloud',
    caseStudyDescAr: 'الربط الرقمي التام لمجموعة مستشفيات وعيادات تضم أكثر من 200 طبيب، ما سمح بتبادل التاريخ المرضي فورياً والتنبؤ بنسب الإشغال في غرف الطوارئ بدقة متقدّمة.',
    caseStudyDescEn: 'Unifying hospital clusters containing over 200 clinics onto a secure medical cloud network, achieving instant file synchronization and accurate forecasting of ICU room demand.',
    metrics: [
      { labelAr: 'معدل دقة تشخيص التقارير', labelEn: 'Diagnosis Flag Accuracy', value: '98.7%' },
      { labelAr: 'فترة الانتظار في الطوارئ', labelEn: 'Emergency Waiting Time Reduc.', value: '-40%' },
      { labelAr: 'سرعة سحب تاريخ المريض', labelEn: 'File Retrieval Latency', value: '0.3 sec' }
    ]
  },
  {
    id: 'logistics',
    titleAr: 'النقل والمواصلات',
    titleEn: 'Transportation & Logistics',
    descriptionAr: 'تحسين سلاسل الإمداد ومراقبة الأساطيل ومسارات النقل مدعوماً بتقنيات إنترنت الأشياء والبيانات والتحليلات الجغرافية والسرعة.',
    descriptionEn: 'Optimizing distribution logistics, tracking active fleet elements, and planning geo-routes backed by raw IoT data engines.',
    iconName: 'Truck',
    challengesAr: [
      'تعقيد مسارات التوصيل وتقلبات أسعار الوقود ومواعيد الاستلام والتسليم',
      'صعوبة تتبع حركة المركبات والشاحنات وحالة البضائع الحساسة لحظة بلحظة',
      'ضياع الوقت والجهد التشغيلي بسبب التنسيق اليدوي مع السائقين والموردين'
    ],
    challengesEn: [
      'Route optimization friction and volatility in trip fuel/time costs',
      'Zero fleet predictability and lack of cargo state alerts during transit',
      'Lost productivity overheads due to manual coordination with shipping hubs'
    ],
    solutionsProvidedAr: [
      'تطوير أنظمة تتبع ذكية للأساطيل باستخدام مستشعرات إنترنت الأشياء',
      'لوحات تحكم ذكية لتوقع وحساب المسارات الأقصر لتوفير الانبعاثات والوقود',
      'أتمتة طلبات الاستلام والشحن وإرسال الفواتير الإلكترونية اللحظية لشركاء سلسلة التوريد'
    ],
    solutionsProvidedEn: [
      'Developing telemetry monitoring engines for fleets leveraging IoT',
      'Interactive route planners powered by geo-algorithms to save fuel',
      'Automated dispatch schedules and immediate invoicing integrations'
    ],
    caseStudyTitleAr: 'نظام إدارة الأسطول واللوجستيات الذكي لـ 1500 شاحنة',
    caseStudyTitleEn: 'Smart Logistics and Fleet Operation Hub for 1,500 Trucks',
    caseStudyDescAr: 'تمكنا من هيكلة نظام لوجيستي ذكي لشركة شحن إقليمية كبرى، مما أسهم في تتبع موقع وحالة الشحنات والأغذية المبردة بدقة متناهية، وتوفير استهلاك الوقود الإجمالي بشكل كبير.',
    caseStudyDescEn: 'Deploying a custom dispatching and cooling containment monitoring program for a large shipper, protecting food freshness and slashing transit times across borders.',
    metrics: [
      { labelAr: 'توفير التكاليف التشغيلية للوقود', labelEn: 'Fuel & Operations Savings', value: '18%' },
      { labelAr: 'تحديد دقيق لموقع الشحنة', labelEn: 'ETA Precision Accuracy', value: '99.2%' },
      { labelAr: 'سرعة معالجة مستندات الشحنات', labelEn: 'Waybill Invoicing Speedup', value: '10x' }
    ]
  },
  {
    id: 'retail',
    titleAr: 'البيع بالتجزئة',
    titleEn: 'Retail & E-Commerce',
    descriptionAr: 'دمج قنوات البيع التقليدية والإلكترونية (Omnichannel) وتقديم توصيات ذكية مخصصة تزيد المبيعات وتجذب الولاء.',
    descriptionEn: 'Merging traditional storefront counters and e-commerce layers (Omnichannel) and presenting automated recommended baskets.',
    iconName: 'ShoppingBag',
    challengesAr: [
      'المنافسة الشرسة مع المنصات العالمية الكبرى وصعوبة جذب ولاء العميل',
      'تشتت بيانات المخزون بين المستودعات والمتاجر التقليدية للتجزئة',
      'حاجة المستهلكين لتجارب مخصصة تعكس رغباتهم الحقيقية بشكل فوري'
    ],
    challengesEn: [
      'Heavy pressure from global massive portals, making margins slim',
      'Stock synchronization gaps between traditional storefront shelves and databases',
      'Consumer expectation for tailored shopping journeys'
    ],
    solutionsProvidedAr: [
      'بناء منصات تجارة إلكترونية موحدة وخارقة السرعة ذات واجهات حديثة شابة',
      'ربط دقيق ولحظي للمخازن بجميع قنوات البيع بالاستعانة بالسحابة والـ API',
      'أنظمة تحليلات وتنبؤات ذكية وتخصيص تجربة الشراء المبني على الذكاء الاصطناعي'
    ],
    solutionsProvidedEn: [
      'Creating lightning-fast custom head-less commerce solutions',
      'Synchronizing actual warehouse assets to all sales portals instantly via server endpoints',
      'AI recommendation layers based on dynamic transactional profiles'
    ],
    caseStudyTitleAr: 'تأسيس المنظومة الموحدة لعملاق التجزئة',
    caseStudyTitleEn: 'Enterprise Omnichannel Redesign for Retail Chain',
    caseStudyDescAr: 'شيدت بيزنس ديفلوبرز البوابة والموقع الرقمي الموحد لعلامة تجارية كبرى مدمجة تخدم قطاع التجزئة، وربطه بكافة نقاط البيع في 45 فرعاً بشكل لحظي لحوكمة المخزون بالكامل.',
    caseStudyDescEn: 'We designed the full suite digital commerce backend for a massive retail brand, syncing points-of-sale in 45 geographic locations directly with online inventories.',
    metrics: [
      { labelAr: 'تحول نسبة المبيعات عبر المنصة', labelEn: 'E-commerce Revenue Jump', value: '+140%' },
      { labelAr: 'دقة التحكم في كميات المخازن', labelEn: 'Inventory Tracking Accuracy', value: '99.9%' },
      { labelAr: 'زيادة حجم سلة المشتريات', labelEn: 'Average Basket Cargo Value', value: '+35%' }
    ]
  },
  {
    id: 'realestate',
    titleAr: 'العقارات',
    titleEn: 'Real Estate & PropTech',
    descriptionAr: 'منصات تسويق ذكية، جولات افتراضية ثلاثية الأبعاد، إدارة الأصول والممتلكات وأنظمة تحليلات الفرص الاستثمارية بدقة.',
    descriptionEn: 'Interactive PropTech hubs, virtual walkthroughs, unified asset management, and investment yield analyzers.',
    iconName: 'Home',
    challengesAr: [
      'بطء وبيروقراطية المعاملات العقارية التقليدية والتحقق من صكوك الملكية',
      'صعوبة تواصل المشترين الدوليين مع العقارات على أرض الواقع وتقييم حالتها',
      'غياب التحليلات الشفافة للعوائد الاستثمارية مقارنة باتجاهات نمو الأسعار'
    ],
    challengesEn: [
      'Slow turnaround for property contract validations and deed verification',
      'Friction for out-of-city buyers to inspect physical real estate spaces',
      'Lack of clear projection metrics on real estate yields across various sectors'
    ],
    solutionsProvidedAr: [
      'بناء بوابات عقارية متطورة تدعم الجولات ثلاثية الأبعاد والواقع الافتراضي',
      'برمجيات إدارة العقارات الشاملة وإصدار عقود الإيجار والتحصيل والتقييم الذكي',
      'أنظمة التقييم والتحليل التنبئي للأسواق والفرص الاستثمارية السنوية للشركات'
    ],
    solutionsProvidedEn: [
      'Constructing immersive portals sporting active 3D and VR walk-through tools',
      'Modern property management suites with automated billing and asset evaluation',
      'Strategic yield prediction systems built directly on historical geographical growth'
    ],
    caseStudyTitleAr: 'منصة الاستثمار والوساطة العقارية الكبرى',
    caseStudyTitleEn: 'Next-Generation Corporate Asset Management Portal',
    caseStudyDescAr: 'تطوير تطبيق عقاري مؤسسي يربط المطورين والمستثمرين، متضمناً جولات ثلاثية الأبعاد تفاعلية، ومؤشرات مالية دقيقة عن نمو الأراضي والشقق السكنية في العاصمة.',
    caseStudyDescEn: 'Architecting an enterprise property-match engine helping developers transact with institutional buyers, complete with active calculations on asset appreciation.',
    metrics: [
      { labelAr: 'تقليص وقت بيع وتوقيع الوحدات', labelEn: 'Average Listing Time Drop', value: '-50%' },
      { labelAr: 'زيادة الصفقات عبر المنصة', labelEn: 'Digital Deals Flow Rate', value: '+75%' },
      { labelAr: 'نسبة المستثمرين الدوليين الجدد', labelEn: 'Foreign Direct Investment Leads', value: '42%' }
    ]
  },
  {
    id: 'stec',
    titleAr: 'الرياضة والسياحة والترفيه والثقافة (STEC)',
    titleEn: 'Sports, Tourism, Entertainment & Culture (STEC)',
    descriptionAr: 'منظومات ذكية لحجز التذاكر وإجراء الحشود وتحسين تجربة الزوار في المواسم الثقافية والسياحية والبطولات الرياضية.',
    descriptionEn: 'Smart ticketing ecosystems, crowd flow simulators, and immersive visitor journeys during major events, tournaments, and festivals.',
    iconName: 'Sparkles',
    challengesAr: [
      'الزيادات المفاجئة في أعداد زوار المهرجانات والمواسم والضغط على الخوادم والبوابات والشبكة',
      'صعوبة تخصيص الهوية السياحية بما يتناسب مع رغبات واهتمامات السياح المتنوعين',
      'تعقد خدمات التفويج والربط مع شركات الطيران والفنادق والأماكن الترفيهية يدوياً'
    ],
    challengesEn: [
      'Massive server traffic spikes during high-profile ticket launches crash web servers',
      'Inefficient tourist recommendation logic that fails to cater to global demographics',
      'Manual, convoluted scheduling across transport, hotels, and attractions'
    ],
    solutionsProvidedAr: [
      'تطوير محركات حجز تذاكر متطورة ومقاومة للازدحامات الشديدة في أوقات الذروة',
      'بناء تطبيقات مرشد سياحي شخصي مدعوم بالكامل بالذكاء الاصطناعي والمواقع الجغرافية لرسم مسار الرحلات',
      'بوابات رقمنة التراخيص وتصاريح المعارض والبطولات والاتحادات بأساليب متطورة'
    ],
    solutionsProvidedEn: [
      'Creating resilient, auto-scalable scheduling engines that swallow million-user ticket rushes',
      'AI-personalized tourism guides offering tailored itineraries based on user moods',
      'Expedited digital licensing and registration dashboards for organizers and athletic federations'
    ],
    caseStudyTitleAr: 'نظام ومحرك تذاكر المهرجانات الوطنية والمواسم السياحية',
    caseStudyTitleEn: 'National Cultural Heritage Festival Registration Hub',
    caseStudyDescAr: 'قمنا ببناء المنصة والبنية التحتية لحجز المهرجانات الكبرى بالدولة، حيث تمكن النظام من معالجة أكثر من 1.2 مليون معاملة حجز تذاكر وتذاكر ترفيهية في يوم واحد دون أي تباطؤ.',
    caseStudyDescEn: 'Building the integrated high-volume reservation network for major national festivals, safely processing over 1.2 million ticketholders in a single launch day without error.',
    metrics: [
      { labelAr: 'إدارة تدفق آمن للحشود يومياً', labelEn: 'Daily Visitor Flow Managed', value: '+300,000' },
      { labelAr: 'مقاومة الضغط الأقصى للخوادم', labelEn: 'Peak API Load Durability', value: '100%' },
      { labelAr: 'معدل تقييم تجربة السائح الإيجابي', labelEn: 'Satisfactory Trip Reviews Rate', value: '94.6%' }
    ]
  }
];

export const GENERAL_STATS = [
  { value: '150+', labelAr: 'مشروع رقمي ناجح', labelEn: 'Successful Digital Projects' },
  { value: '99.9%', labelAr: 'جاهزية تشغيل الأنظمة', labelEn: 'System Operational Uptime' },
  { value: '9+', labelAr: 'حلول تقنية رائدة', labelEn: 'Leading Tech Solutions' },
  { value: '7', labelAr: 'قطاعات وطنية كبرى', labelEn: 'Major Sovereign Industries' }
];

export const PROJECTS: Project[] = [
  {
    id: 'sahl-pay',
    titleAr: 'منظومة سهل باي (Sahl Pay)',
    titleEn: 'Sahl Pay Ecosystem',
    sectorAr: 'الخدمات المالية والمصرفية',
    sectorEn: 'Banking & Financial Services',
    descriptionAr: 'منصة دفع رقمية متكاملة لربط أنظمة نقاط البيع وحوكمة الفواتير الفورية وإدارة المحافظ مع دعم كامل لمعايير الحماية والتشفير والاتصالات القريبة NFC.',
    descriptionEn: 'An integrated digital payment platform connecting POS terminals, processing real-time electronic invoices, and managing mobile wallets with full compliance.',
    demoLink: 'https://sahlpay.businessdevelopers.com',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Kubernetes', 'PCI-DSS', 'NFC Sync'],
    iconName: 'Coins'
  },
  {
    id: 'balady-portal',
    titleAr: 'بوابة بلدي الذكية لتراخيص البناء والتشغيل',
    titleEn: 'Balady Municipal Licensing Portal',
    sectorAr: 'القطاع الحكومي والبلدي',
    sectorEn: 'Government & Municipal Sector',
    descriptionAr: 'منظومة تفاعلية موحدة لرقمنة وإصدار تراخيص البناء والتشغيل والربط الجغرافي الذكي لتقليص مدة دراسة ومعالجة الطلبات إلى أقل من 24 ساعة بمعدلات أمان فائقة.',
    descriptionEn: 'A unified portal digitizing the issuance of municipal construction & operational permits, integrated with geographic GIS mapping to shrink cycle times down to 24 hours.',
    demoLink: 'https://balady.businessdevelopers.com',
    techStack: ['Next.js', 'Go', 'PostgreSQL', 'GIS Server', 'Docker', 'Microservices'],
    iconName: 'Building2'
  },
  {
    id: 'sehaty-cloud',
    titleAr: 'منصة سحابي صحتي الموحدة للأرشيف الطبي',
    titleEn: 'Sehaty Cloud Unified EHR Network',
    sectorAr: 'الرعاية الصحية والعيادات',
    sectorEn: 'Healthcare & Lifesciences',
    descriptionAr: 'منظومة سحابية وطالبية لربط الملفات الطبية الموحدة (EHR) وتسهيل الاستعلام الفوري للأطباء والأشعة الرقمية، مع الحفاظ الكامل على سرية وخصوصية سجلات المرضى.',
    descriptionEn: 'A secure cloud network standardizing Electronic Health Records (EHR) and digital radiology across medical centers, offering continuous availability and top privacy compliance.',
    demoLink: 'https://sehaty.businessdevelopers.com',
    techStack: ['TypeScript', 'FastAPI', 'MongoDB', 'DICOM', 'HL7 FHIR', 'Zero-Trust'],
    iconName: 'Activity'
  },
  {
    id: 'masar-fleet',
    titleAr: 'نظام إدارة لوجستيات الأسطول وتتبع الشحنات',
    titleEn: 'Masar Fleet Telematics & Logistical Hub',
    sectorAr: 'النقل والإمداد اللوجستي',
    sectorEn: 'Transportation & Logistics',
    descriptionAr: 'منصة تعتمد على حساسات إنترنت الأشياء (IoT) لتوفير تتبع لحظي شامل لحركة أسطول الشحن، وحالة الحاويات المبردة، وخوارزميات تحديد المسارات الأوفر استهلاكاً للوقود.',
    descriptionEn: 'An IoT-driven tracking terminal and routing engine delivering real-time telemetry on shipping fleet trucks, ambient cargo cooling, and automated fuel efficiency analytics.',
    demoLink: 'https://masar.businessdevelopers.com',
    techStack: ['Vue 3', 'Python', 'InfluxDB', 'Apache Kafka', 'Mapbox API', 'IoT Shields'],
    iconName: 'Truck'
  },
  {
    id: 'aqar-tech',
    titleAr: 'بوابة عقار تك للجولات الافتراضية ثلاثية الأبعاد',
    titleEn: 'Aqar Tech 3D PropTech Platform',
    sectorAr: 'الاستثمار والتطوير العقاري',
    sectorEn: 'Real Estate & PropTech',
    descriptionAr: 'حل عقاري مبتكر يمكّن المستثمرين من معاينة العقارات عبر تقنيات الواقع الافتراضي والتجول الافتراضي ثلاثي الأبعاد، مع أدوات مدمجة لحساب العوائد الاستثمارية التنبئية.',
    descriptionEn: 'A state-of-the-art brokerage PropTech portal with immersive 3D digital-twin tours and dynamic visual panels graphing yearly appreciation values.',
    demoLink: 'https://aqar.businessdevelopers.com',
    techStack: ['React', 'Three.js', 'Express', 'Redis', 'WebXR', 'AWS Cloudfront'],
    iconName: 'Home'
  },
  {
    id: 'mawsem-ticketing',
    titleAr: 'محرك تذاكر الفعاليات والمهرجانات الوطنية',
    titleEn: 'Mawsem High-Load Event Ticketing Engine',
    sectorAr: 'الرياضة والسياحة والمهرجانات',
    sectorEn: 'Sports, Tourism & Festivals (STEC)',
    descriptionAr: 'منظومة لحجز وتنظيم مبيعات التذاكر صُممت لتحمل ازدحامات الزائرين الكثيفة، معالجة أكثر من مليون تذكرة يومياً، والربط مع الهويات الرقمية لخدمة سياحية متميزة ومحصنة.',
    descriptionEn: 'An auto-scalable ticket distribution core engineered to withstand heavy, concurrent traffic spikes, handling millions of requests with digital identity cross-checking.',
    demoLink: 'https://mawsem.businessdevelopers.com',
    techStack: ['Svelte', 'Rust', 'Redis Cluster', 'Nginx Proxy', 'Google Cloud', 'Cloudflare'],
    iconName: 'Sparkles'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    categoryAr: 'منهجية العمل',
    categoryEn: 'Work Methodology',
    questionAr: 'ما هي المدة الزمنية المتوقعة لتنفيذ مشاريع التحول الرقمي؟',
    questionEn: 'What is the expected timeline for digital transformation projects?',
    answerAr: 'تختلف المدد الزمنية حسب نطاق العمل والأنظمة المستهدفة. غالباً ما تستغرق المشاريع المتوسطة من 3 إلى 6 أشهر، بينما تتطلب مشاريع الأنظمة المعقدة وبناء البنى التحتية الكبرى من 6 إلى 12 شهراً، ونتبع في ذلك منهجية عمل رشيقة (Agile) لتسليم مخرجات دورية كل أسبوعين.',
    answerEn: 'Timelines vary depending on scope and target systems. Mid-sized projects typically span 3 to 6 months, while high-scale core architectures require 6 to 12 months. We employ Agile methodologies to deliver functional increments every two weeks.'
  },
  {
    id: 'faq-2',
    categoryAr: 'الربط والتكامل',
    categoryEn: 'Integration & Compatibility',
    questionAr: 'هل تدعم أنظمتكم التكامل والربط مع الأنظمة الحكومية والبنكية القائمة؟',
    questionEn: 'Do your systems support integration with existing government and banking portals?',
    answerAr: 'نعم، جميع حلولنا مصممة لمعمارية الربط المفتوح (API-first). ندعم التكامل الكامل مع الأنظمة الوطنية مثل بوابات "بلدي"، والربط مع الأنظمة البنكية الحاصلة على توافقية PCI-DSS، والربط الجغرافي GIS وغيرها من المنظومات الحكومية والخاصة بسلاسة وأمان.',
    answerEn: 'Yes, all of our applications are designed with an API-first architecture. We support full integration with national government portals, global and local banking networks compliant with PCI-DSS, GIS engines, and other legacy enterprise suites.'
  },
  {
    id: 'faq-3',
    categoryAr: 'أمن المعلومات',
    categoryEn: 'Cybersecurity',
    questionAr: 'كيف تضمنون أمن وسرية البيانات في البنى التحتية السحابية؟',
    questionEn: 'How do you guarantee data security and privacy in cloud infrastructures?',
    answerAr: 'نطبق معايير أمان صارمة تعتمد على مبدأ "الثقة الصفرية" (Zero-Trust)، ونلتزم بحوكمة تشفير البيانات الحساسة أثناء نقلها وفي وضعها الساكن، مع توفير جدران حماية متطورة وتصنيفات وصول متعددة المستويات تتوافق مع التوجيهات الوطنية للأمن السيبراني.',
    answerEn: 'We implement state-of-the-art security patterns rooted in a Zero-Trust approach. We mandate encryption for sensitive data both in transit and at rest, alongside multi-level access control frameworks that comply fully with national cybersecurity authorities.'
  },
  {
    id: 'faq-4',
    categoryAr: 'حزمة التقنيات',
    categoryEn: 'Technology Stack',
    questionAr: 'ما هي التقنيات التي تعتمدون عليها في تصميم البرمجيات المخصصة؟',
    questionEn: 'What technologies do you rely on for custom software development?',
    answerAr: 'نعتمد على حزم تقنية حديثة وقابلة للتوسع؛ مثل React وNext.js وSvelte في الواجهات الأمامية، ولغات سريعة وآمنة مثل Node.js (TypeScript) وGo وPython وRust في المنظومات الخلفية، بجوار قواعد بيانات سحابية وحلول حاويات متطورة كـ Kubernetes وDocker.',
    answerEn: 'We utilize robust, highly scalable tech stacks including React, Next.js, and Svelte for frontend presentation, paired with Node.js, Go, Python, and Rust for high-load server APIs, alongside Docker and Kubernetes orchestration.'
  },
  {
    id: 'faq-5',
    categoryAr: 'الدعم والمتابعة',
    categoryEn: 'Support & SLAs',
    questionAr: 'هل تقدمون خدمات صيانة ودعم فني بعد إطلاق وتشغيل النظام؟',
    questionEn: 'Do you provide maintenance and support services post-launch?',
    answerAr: 'بالتأكيد، نحن لا نكتفي بالإطلاق بل نوفر باقات دعم فني وصيانة مرنة على مدار الساعة (SLA). تشمل خدماتنا متابعة حيوية الخوادم، وإجراء ترقيات الأمان الدورية المعتمدة، وتحسين الأداء لضمان بقاء جاهزية نظامكم بنسبة 99.9%.',
    answerEn: 'Absolutely. We offer comprehensive, round-the-clock Support-Level Agreements (SLAs). Our services include proactive continuous server health monitoring, regular security patches, and performance optimizations to guarantee a 99.9% uptime.'
  }
];

