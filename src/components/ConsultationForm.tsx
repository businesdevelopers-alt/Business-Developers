import React, { useState, useEffect } from 'react';
import { Lang, ContactInquiry } from '../types';
import { SECTORS, SOLUTIONS } from '../data';
import { Send, CheckCircle2, Sparkles, Server, Terminal, HelpCircle, PhoneCall, Building, Cpu, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SuccessFeedbackModal from './SuccessFeedbackModal';

interface ConsultationFormProps {
  lang: Lang;
  preselectedSectorId?: string;
  preselectedSolutionId?: string;
}

export default function ConsultationForm({ lang, preselectedSectorId = '', preselectedSolutionId = '' }: ConsultationFormProps) {
  const isAr = lang === 'ar';
  
  const [formData, setFormData] = useState<ContactInquiry>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    sectorId: '',
    solutionId: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [mockProposal, setMockProposal] = useState<{
    stack: string[];
    phases: string[];
    duration: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync route pre-selections
  useEffect(() => {
    if (preselectedSectorId) {
      setFormData(prev => ({ ...prev, sectorId: preselectedSectorId }));
    }
  }, [preselectedSectorId]);

  useEffect(() => {
    if (preselectedSolutionId) {
      setFormData(prev => ({ ...prev, solutionId: preselectedSolutionId }));
    }
  }, [preselectedSolutionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.companyName) {
      alert(isAr ? 'الرجاء ملء الحقول الإجبارية (الاسم، البريد الإلكتروني، اسم المنشأة)' : 'Please fill out required fields (Name, Email, Company)');
      return;
    }

    // Generate dynamic tech stack recommendations based on selected credentials
    const sec = formData.sectorId || 'banking';
    const sol = formData.solutionId || 'digital-transformation';
    
    let generatedStack: string[] = ['Secure API Gateways', 'Kubernetes Containers', 'React Micro-Frontends', 'Tailwind CSS UI'];
    let generatedPhases: string[] = ['Business Discovery & Sizing', 'UI/UX Proto design', 'Scalable Deploy & QA'];
    let duration = '4-6 Months';

    if (sec === 'banking' || sec === 'government') {
      generatedStack = ['Zero-Trust Cryptographic Kernels', 'Apache Kafka Broker', 'Open-API Secure Gateways', 'Docker Swarm On-Premise'];
      generatedPhases = ['Regulatory Audits & Gap Sizing', 'Alpha Private-Network Sandbox', 'Integration Testing & Deployment'];
      duration = '6-9 Months';
    } else if (sol === 'ai-ml') {
      generatedStack = ['TensorFlow / PyTorch Servings', 'FastAPI Microservice Layer', 'Milvus Vector Search DB', 'Next.js Interactive Canvas'];
      generatedPhases = ['Historical Data Structuring', 'ML Model Sizing & Epoch Training', 'Live API Deployment & Feedback Loop'];
      duration = '3-5 Months';
    } else if (sol === 'cloud-computing') {
      generatedStack = ['AWS Lambda & Terraform IaC', 'DynamoDB / PostgreSQL Vault', 'Nginx Traffic Proxy Routing', 'CloudWatch Metric Monitors'];
      generatedPhases = ['Legacy Sizing and Backup Maps', 'Subnet Setup & Data Sync', 'Elastic High-Load testing'];
      duration = '2-4 Months';
    }

    setMockProposal({
      stack: generatedStack,
      phases: generatedPhases,
      duration
    });

    // Elegant analysis transition
    setIsAnalyzing(true);
    setAnalysisStep(0);

    const stepIntervals = [
      { step: 1, delay: 800 },
      { step: 2, delay: 1700 },
      { step: 3, delay: 2600 },
      { step: 4, delay: 3400 }
    ];

    stepIntervals.forEach(({ step, delay }) => {
      setTimeout(() => {
        if (step === 4) {
          setIsAnalyzing(false);
          setIsSubmitted(true);
          setIsModalOpen(true);
        } else {
          setAnalysisStep(step);
        }
      }, delay);
    });
  };

  const handleResetSubmit = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      companyName: '',
      sectorId: '',
      solutionId: '',
      message: ''
    });
    setIsSubmitted(false);
    setIsAnalyzing(false);
    setAnalysisStep(0);
    setMockProposal(null);
    setIsModalOpen(false);
  };

  return (
    <section id="consultation" className="py-20 bg-slate-50 relative scroll-mt-20">
      
      {/* Dynamic top gradient ring background support */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Card Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-sky-500/10 rounded-full blur-xl" />
              
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-widest text-sky-400 font-bold block">
                  {isAr ? 'تحديث وتطوير فوري' : 'Modernize Instantly'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black leading-tight">
                  {isAr ? 'ابدأ رحلة التمكين والنمو اليوم' : 'Kickstart Sizable Sector Growth'}
                </h3>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {isAr
                  ? 'بمجرد اختيارك للقطاع والحل المناسب، سنقوم برسم وتوليد البنية التحتية الافتراضية المناسبة لمشروعك، وتزويدك بتقرير تقني أولي مجاني فوري.'
                  : 'By entering your industrial profile and core needs, our platform automatically constructs an initial draft stack architecture outline for your strategy review.'}
              </p>

              {/* Direct touch details */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-sky-400 shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">{isAr ? 'مستشار مبيعات القطاعات' : 'Corporate Sector Line'}</span>
                    <span className="text-sm font-mono font-bold">+966 11 500 2030</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-sky-400 shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">{isAr ? 'المقر الرئيسي' : 'Headquarters'}</span>
                    <span className="text-sm font-semibold truncate block">
                      {isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro-trust callouts */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 space-y-3 shadow-sm">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wide block">
                {isAr ? 'ضمانات الخدمة المشتركة' : 'Our Service Standards'}
              </span>
              <ul className="text-xs space-y-2 text-slate-500">
                <li className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{isAr ? 'توقيع اتفاقية سرية تامة وموثقة (NDA)' : 'Enforced Confidentiality (NDA)'}</span>
                </li>
                <li className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{isAr ? 'دراسة تقنية ومالية مخصصة' : 'Tailored Sizing Assessments'}</span>
                </li>
                <li className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{isAr ? 'تسليم نماذج أولية سريعة' : 'Rapid Prototype Turnaround'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form and Submission Results (Dynamic Switcher) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {!isSubmitted && !isAnalyzing ? (
                
                // Form Fields
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {isAr ? 'طلب استشارة فنية وتصميم البنية المقترحة' : 'Formulate Enterprise Strategy Blueprint'}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      {isAr ? 'املأ الحقول التالية لتصميم معمارية أولية تتناسب مع طبيعة قطاعك.' : 'Complete the following coordinates to populate your initial custom architecture.'}
                    </p>
                  </div>

                  {/* 2x2 Grid inputs */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                        {isAr ? 'الاسم بالكامل *' : 'Your Full Name *'}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={isAr ? 'مثال: محمد السديري' : 'e.g. Liam Smith'}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                        {isAr ? 'البريد الإلكتروني المهني *' : 'Corporate Email Address *'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="address@company.com"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 text-sm focus:border-sky-500-custom focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                        {isAr ? 'اسم المنشأة / الجهة *' : 'Company / Sovereign Entity *'}
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder={isAr ? 'مثال: شركة التطوير العقاري' : 'e.g. Global Logistics Inc.'}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                        {isAr ? 'رقم الهاتف المباشر' : 'Direct Phone Number'}
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+966 50 000 0000"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Dropdowns */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                        {isAr ? 'قطاع العمل المستهدف' : 'Target Industry Sector'}
                      </label>
                      <select
                        name="sectorId"
                        value={formData.sectorId}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                      >
                        <option value="">{isAr ? '--- اختر القطاع المستهدف ---' : '--- Choose Sector ---'}</option>
                        {SECTORS.map(sec => (
                          <option key={sec.id} value={sec.id}>
                            {isAr ? sec.titleAr : sec.titleEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                        {isAr ? 'الحل التقني المطلوب' : 'Demanded Tech Solution'}
                      </label>
                      <select
                        name="solutionId"
                        value={formData.solutionId}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
                      >
                        <option value="">{isAr ? '--- اختر الحل المطلـوب ---' : '--- Choose Solution ---'}</option>
                        {SOLUTIONS.map(sol => (
                          <option key={sol.id} value={sol.id}>
                            {isAr ? sol.titleAr : sol.titleEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      {isAr ? 'تفاصيل إضافية / نبذة عن المشروع' : 'Additional Project Context / Requirements'}
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={isAr ? 'أدخل تفاصيل التحدي الحالي، عدد المستخدمين المتوقع، أو الميزانية التقديرية الحالية...' : 'Detail current workload factors, intended timelines, target scale parameters...'}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-300 resize-none"
                    />
                  </div>

                  {/* Submission triggers */}
                  <div>
                    <button
                      id="submit-consultation-btn"
                      type="submit"
                      className="w-full py-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base transition-all shadow-md shadow-sky-100 flex items-center justify-center space-x-2.5 rtl:space-x-reverse cursor-pointer"
                    >
                      <Send className="w-5 h-5" />
                      <span>{isAr ? 'توليد البنية المقترحة وإرسال الطلب' : 'Generate Technical Proposal & Submit'}</span>
                    </button>
                    <span className="block text-center text-[10px] text-slate-400 mt-2.5">
                      {isAr ? 'بتقديمك للطلب، يحصل فريقنا الفني على إشعار عاجل للتواصل معك خلال 4 ساعات عمل.' : 'Upon generating, our sector leads are prioritized to establish direct touch in under 4 business hours.'}
                    </span>
                  </div>
                </motion.form>
              ) : isAnalyzing ? (
                
                // Analyzing / Loading State Screen
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 px-4 sm:px-8 text-center space-y-8"
                >
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    {/* Ring glow animations */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-sky-500/30"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      className="absolute -inset-2 rounded-full border border-sky-400/20"
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-2 rounded-full border-2 border-t-sky-600 border-r-transparent border-b-transparent border-l-transparent"
                    />
                    <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center shadow-lg shadow-sky-100 relative">
                      <Cpu className="w-8 h-8 text-sky-600 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-3 max-w-md mx-auto">
                    <h4 className="text-xl font-bold font-sans text-slate-900 tracking-tight">
                      {isAr ? 'جاري حوسبة معايير التحول الفني...' : 'Synthesizing Architecture Vector...'}
                    </h4>
                    <p className="text-slate-500 text-xs sm:text-sm">
                      {isAr
                        ? 'يقوم محرك الذكاء الاصطناعي وهندسة الأنظمة لشركة بيزنس ديفلوبرز بتخطيط حزمة التقنيات المقترحة لقطاعكم.'
                        : 'Business Developers core systems mapper is dynamically rendering modular options tailor-fit to your target criteria.'}
                    </p>
                  </div>

                  {/* Step status logs */}
                  <div className="bg-slate-900 text-slate-300 rounded-xl p-4 text-left font-mono text-[11px] sm:text-xs max-w-lg mx-auto space-y-2.5 border border-slate-800 shadow-inner">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-slate-800 pb-2 text-slate-500">
                      <Terminal className="w-4 h-4 text-sky-400" />
                      <span>METRIC_COMPILATION_SHELL v2.4.0</span>
                    </div>

                    <div className="space-y-1.5 leading-snug">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">1. {isAr ? 'فحص متطلبات القطاع وسعة التشغيل' : 'Auditing industry constraints & sizing'}</span>
                        <motion.span
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className={`font-semibold ${analysisStep >= 1 ? 'text-emerald-400' : 'text-sky-400'}`}
                        >
                          {analysisStep >= 1 ? '✔ COMPLETE' : '⏳ ACTIVE'}
                        </motion.span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">2. {isAr ? 'مطابقة حزم البرمجيات والخوادم السحابية' : 'Matching micro-services & cloud pods'}</span>
                        <motion.span
                          className={`font-semibold ${analysisStep >= 2 ? 'text-emerald-400' : analysisStep === 1 ? 'text-sky-400' : 'text-slate-600'}`}
                        >
                          {analysisStep >= 2 ? '✔ COMPLETE' : analysisStep === 1 ? '⏳ PROCESSING' : '⧖ PENDING'}
                        </motion.span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">3. {isAr ? 'تجميع طبقات الحماية وتأمين قنوات الربط' : 'Compiling zero-trust shield adapters'}</span>
                        <motion.span
                          className={`font-semibold ${analysisStep >= 3 ? 'text-emerald-400' : analysisStep === 2 ? 'text-sky-400' : 'text-slate-600'}`}
                        >
                          {analysisStep >= 3 ? '✔ COMPLETE' : analysisStep === 2 ? '⏳ INJECTING' : '⧖ PENDING'}
                        </motion.span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className="bg-sky-500 h-1.5 rounded-full"
                          initial={{ width: "10%" }}
                          animate={{
                            width:
                              analysisStep === 0
                                ? "25%"
                                : analysisStep === 1
                                ? "55%"
                                : analysisStep === 2
                                ? "85%"
                                : "100%",
                          }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                
                // Result Output Block
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-3 pb-6 border-b border-slate-100">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 100, damping: 10 }}
                      className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm border border-emerald-100 relative"
                    >
                      <CheckCircle2 className="w-12 h-12" />
                      {/* Pulse effects */}
                      <motion.div
                        className="absolute -inset-1 rounded-full border-2 border-emerald-500/20"
                        animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-black text-slate-900 font-sans"
                    >
                      {isAr ? 'شكراً لك! تم توليد معمارية مشروعك بنجاح' : 'Success! Proposal Blueprint Generated'}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto"
                    >
                      {isAr
                        ? `مرحباً ${formData.name}، قمنا بتلقي تفاصيل طلبكم لشركة (${formData.companyName}) وجاري تعيين مهندس حلول متخصص لمراجعة المتطلبات.`
                        : `Hello ${formData.name}, your request parameters for (${formData.companyName}) have been stored. A target systems engineer is assigned for immediate review.`}
                    </motion.p>
                  </div>

                  {/* Draft Proposal Details layout */}
                  {mockProposal && (
                    <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 sm:p-6 space-y-6 font-mono text-xs sm:text-sm relative overflow-hidden">
                      <div className="absolute top-3 right-3 text-slate-700">
                        <Terminal className="w-6 h-6" />
                      </div>

                      {/* Header line */}
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-sky-400 border-b border-slate-800 pb-3 font-sans">
                        <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                        <span className="font-bold uppercase tracking-wider text-[11px]">
                          {isAr ? 'مسودة البنية التقنية وهيكلية العمل' : 'DRAFT TECH ARCHITECTURE BLUEPRINT'}
                        </span>
                      </div>

                      {/* Tech stack recommendations */}
                      <div className="space-y-2">
                        <span className="text-slate-400 text-[10px] uppercase block tracking-wider">
                          {isAr ? 'حزمة التقنيات المقترحة (Core Tech Stack)' : 'CORE TECH STACK'}
                        </span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {mockProposal.stack.map((tech, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.8, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ delay: 0.1 * i + 0.2 }}
                              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-sky-300 font-bold whitespace-nowrap"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Work phases */}
                      <div className="space-y-2.5">
                        <span className="text-slate-400 text-[10px] uppercase block tracking-wider">
                          {isAr ? 'مراحل التنفيذ المقدرة' : 'ESTIMATED WORKFLOW PHASES'}
                        </span>
                        <div className="space-y-1.5 pt-1">
                          {mockProposal.phases.map((phase, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 * idx + 0.4 }}
                              className="flex items-center space-x-2 rtl:space-x-reverse font-sans text-[11px]"
                            >
                              <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 font-mono flex items-center justify-center text-[10px] font-bold">
                                {idx + 1}
                              </span>
                              <span>{phase}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Duration timeline */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-900 font-sans text-xs">
                        <span className="text-slate-400">{isAr ? 'المدة التقديرية للتسليم:' : 'Est. Delivery Frame:'}</span>
                        <span className="text-sky-300 font-bold">{mockProposal.duration}</span>
                      </div>
                    </div>
                  )}

                  {/* Reset and review */}
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
                    <button
                      id="reopen-modal-btn"
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse shadow-md shadow-indigo-100"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{isAr ? 'عرض بطاقة التذكرة الكاملة وجدولة استشارة' : 'View Core Ticket & Schedule Now'}</span>
                    </button>

                    <button
                      id="reset-form-btn"
                      type="button"
                      onClick={handleResetSubmit}
                      className="px-6 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                    >
                      {isAr ? 'تقديم طلب جديد / تعديل المعطيات' : 'Revise Credentials / Configure New Request'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Reusable Success Feedback and Expectation Setting Modal */}
      <SuccessFeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
        formData={formData}
        mockProposal={mockProposal}
      />
    </section>
  );
}
