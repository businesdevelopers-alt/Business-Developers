import React, { useState, useEffect, useRef } from 'react';
import { Lang } from '../types';
import { 
  X, 
  Sparkles, 
  Send, 
  HelpCircle, 
  Bot, 
  User, 
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Clock,
  Terminal,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface SuggestionItem {
  id: string;
  labelAr: string;
  labelEn: string;
  keywords: string[];
}

export default function QuickHelpModal({ isOpen, onClose, lang }: QuickHelpModalProps) {
  const isAr = lang === 'ar';
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested quick prompts with their matched keyword IDs
  const suggestions: SuggestionItem[] = [
    {
      id: 'pricing',
      labelAr: 'كم هي التكاليف والأسعار؟',
      labelEn: 'How much are the costs & pricing?',
      keywords: ['سعر', 'أسعار', 'تكلفة', 'ميزانية', 'كم', 'تكلف', 'pricing', 'price', 'cost', 'budget', 'fees']
    },
    {
      id: 'sla',
      labelAr: 'ما هي ضمانات الـ SLA والتشغيل؟',
      labelEn: 'What are SLA & uptime guarantees?',
      keywords: ['ضمان', 'تشغيل', 'دعم', 'صيانة', 'sla', 'support', 'uptime', 'guarantee', 'maintenance']
    },
    {
      id: 'security',
      labelAr: 'هل الأنظمة محمية ومطابقة للخصوصية؟',
      labelEn: 'Are systems secure & compliant?',
      keywords: ['حماية', 'أمان', 'تشفير', 'اختراق', 'خصوصية', 'امان', 'security', 'secure', 'privacy', 'standards', 'nda']
    },
    {
      id: 'tech',
      labelAr: 'ما هي لغات البرمجة والتقنيات المستخدمة؟',
      labelEn: 'What programming technologies do you use?',
      keywords: ['برمجة', 'تقنيات', 'لغات', 'قاعدة', 'سحابية', 'tech', 'languages', 'databases', 'frameworks', 'server']
    },
    {
      id: 'timeframe',
      labelAr: 'كم تستغرق مدة تنفيذ المشاريع؟',
      labelEn: 'How long does project delivery take?',
      keywords: ['وقت', 'مدة', 'زمن', 'متى', 'تاريخ', 'duration', 'time', 'delivery', 'weeks', 'months']
    },
    {
      id: 'services',
      labelAr: 'ما هي أهم خدماتكم التقنية؟',
      labelEn: 'What are your primary IT services?',
      keywords: ['خدمات', 'حلول', 'منتجات', 'ماذا', 'services', 'solutions', 'capabilities', 'do', 'offer']
    }
  ];

  // Matched automatic comprehensive database responses
  const responses = {
    pricing: {
      ar: 'أهلاً بكم. في "بيزنس ديفلوبرز" نصمم تكلفة مشاريعنا بدقة ومرونة متناهية. لا توجد باقات جاهزة مفروضة؛ بل نقوم بدراسة متطلبات التشغيل، حجم نقل البيانات، ومستوى الدعم والـ High-Load ومن ثم تقديم عرض مالي مخصص ومدروس يناسب الميزانية. لمعرفة عرض فوري لنظامكم، يرجى الانتقال إلى قسم "طلب استشارة" وتجربة حاسبة المتطلبات الذكية المتكاملة.',
      en: 'Welcome! At Business Developers, our pricing structures are fully bespoke. No rigid templates or forced packages. Instead, we comprehensively analyze your target platform architecture, transaction throughput loads, and SLA tier to deliver an customized cost assessment report. We invite you to utilize our "Get Appraisal" calculator form on the website for an immediate blueprint breakdown.'
    },
    sla: {
      ar: 'نعم، نلتزم في جميع حلولنا وصيانة الخوادم باتفاقية مستوى خدمة (SLA) رسمية وصارمة تضمن تشغيل المنظومة بنسبة 99.9%. يتضمن ذلك مراقبة استباقية للثغرات البرمجية والتحميل الزائد، بالإضافة إلى دعم فني تقني متاح على مدار 24 ساعة يومياً للتعامل مع أي طوارئ تشغيلية لضمان سلامة سير العمل.',
      en: 'Absolutely. All our cloud and server enterprise systems are governed by a formal, ironclad Service Level Agreement (SLA) guaranteeing 99.9% production availability with proactive vulnerability tracing. We deploy round-the-clock systems engineers to actively shield against failovers and ensure seamless operational continuity.'
    },
    security: {
      ar: 'تحظى حماية البيانات بأقصى درجات الحوكمة والسرية التقنية لدينا. نتبع معايير تشفير عسكرية صارمة للبيانات الثابتة والمتنقلة (AES-256 و TLS 1.3)، ونوقع اتفاقيات عدم إفشاء معلومات (NDA) ملزمة قانونياً عند بداية أي استكشاف. بالإضافة إلى ذلك، نقوم بعمل اختبارات اختراق دورية وتحصين ضد هجمات DDoS لجميع البنى التحتية التابعة لعملائنا.',
      en: 'Information Security is embedded at the root of our engineering. We secure databases utilizing AES-256 and TLS-1.3 pipelines and mandate rigorous, legally-binding Non-Disclosure Agreements (NDAs) during early discovery. Our cloud architectures undergo standard external audits and penetration test cycles to repel potential vulnerability vectors or DDoS threats.'
    },
    tech: {
      ar: 'بنيتنا البرمجية تعتمد على تقنيات حديثة وعالية الأداء. نعتمد بشكل أساسي على React و Typescript للواجهات، و Node.js/Python للخدمات الخلفية وقواعد البيانات الضخمة الآمنة (Cloud SQL و Spanner). للتشغيل السحابي، نوظف تقنيات الحاويات Docker على خوادم Kubernetes المدارة لتحقيق مرونة تشغيل لا متناهية وكفاءة توزيع الحمل مع الضغط العالي.',
      en: 'Our modern technology core optimized for zero overhead. We engineer dynamic front-ends using React & TypeScript, state back-ends with Node.js/TypeScript & Python Microservices, and rely on secure SQL/Spanner setups. Everything is decoupled in Docker containers and managed across production-grade Kubernetes engines to facilitate auto-scaling and ultra-low database latencies.'
    },
    timeframe: {
      ar: 'تختلف الجداول الزمنية قليلاً بناءً على تعقيد المتطلبات ونطاق العمل. كقاعدة عامة: نقوم بتسليم النسخ التجريبية والحلول الأولية (High-fidelity prototypes) في غضون 3 إلى 4 أسابيع. أما تطوير وتشغيل المنظومات الضخمة وحلول الأتمتة المترابطة بالكامل مع الهيئات ومنافذ الدفع فيستغرق عادةً من شهرين إلى 3 أشهر مع جدول تسليم دقيق لكل مرحلة.',
      en: 'Timelines vary objectively based on system scope grids. As an agile engineering practice: We deliver interactive, high-fidelity prototypes under 3 to 4 weeks. Fully integrated ecosystems incorporating sovereign APIs, banking networks, or ERP automated flows typically span 2 to 3 months, packaged with transparent sprint milestones and automated releases.'
    },
    services: {
      ar: 'نقدم خدمات برمجية وشركة حلول متكاملة تشمل: تصميم وتطوير الأنظمة والتطبيقات السحابية المخصصة، أتمتة الإجراءات وبناء أنظمة الـ ERP الخاصة بالمنشآت الكبرى، تأمين حوكمة وخصوصية خوادم البيانات الوطنية، وتطوير بوابات الدفع الإلكتروني المصرفية ونظم التذاكر الذكية عالية التحميل.',
      en: 'We specialize in elite computer system integration: High-load custom cloud and web applications, corporate ERP process automation, national sovereign data governance architectures, smart digital ticket engines, and secure e-pay banking transactions systems.'
    },
    unknown: {
      ar: 'لم أستطع تحديد سؤالكم بدقة من خلال الكلمات المستخدمة، ولكن من الرائع دائماً نقاش تفاصيلكم! يشمل تخصصنا الذكي: الأسعار والتكاليف، الضمان وخدمات الدعم الفني، آليات أمن وحماية البيانات، وجدولة تسليم المشاريع. يمكنك أيضاً كتابة كلمات مفتاحية مثل "سعر"، "أمان"، "برمجة"، "وقت" لنرشدكم مباشرة، أو النقر على أحد الاقتراحات الجاهزة بالأسفل.',
      en: "I'm still analyzing your precise intent, but I am fully versed in explaining our metrics! I can immediately address thoughts regarding our Bespoke Pricing, Ironclad SLA support, Sovereign Security, and exact Project Timelines. Simply type structural words or choose any of the ready suggestion pillars beneath."
    }
  };

  const initialMessage = (isAr: boolean): ChatMessage => ({
    id: 'msg-init',
    sender: 'ai',
    text: isAr
      ? 'أهلاً بكم في المساعد التقني الذكي لشركة "بيزنس ديفلوبرز". يسعدني الإجابة الفورية والآلية على أي استفسارات تخص خدمات مشاريعنا التقنية، الأسعار، الحماية، أو مدة التنفيذ. تفضل بكتابة سؤالك أو اختر أحد المواضيع الشائعة مباشرة!'
      : 'Greetings! I am the automated Systems Assistant for Business Developers. I can immediately address inquiries regarding our customized pricing, security compliance, SLA uptime protocols, and tech stacks. Please select below or type your inquiry!',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessages([initialMessage(isAr)]);
    }
  }, [isOpen, lang]);

  useEffect(() => {
    // Scroll smoothly to bottom
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const processQuery = (rawQuery: string) => {
    const q = rawQuery.toLowerCase();
    
    // Search tags keyword check
    let matchedId: 'pricing' | 'sla' | 'security' | 'tech' | 'timeframe' | 'services' | 'unknown' = 'unknown';

    for (const item of suggestions) {
      const matchFound = item.keywords.some(kw => q.includes(kw));
      if (matchFound) {
        matchedId = item.id as any;
        break;
      }
    }

    setIsAiTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const respObj = responses[matchedId];
      const answer = isAr ? respObj.ar : respObj.en;
      
      const newAiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newAiMsg]);
      setIsAiTyping(false);
    }, 1100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAiTyping) return;

    const userMsgText = inputText;
    setInputText('');

    const newUserMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    processQuery(userMsgText);
  };

  const handleSuggestionClick = (item: SuggestionItem) => {
    if (isAiTyping) return;

    const promptText = isAr ? item.labelAr : item.labelEn;

    const newUserMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsAiTyping(true);

    // Prompt responses mapping
    setTimeout(() => {
      const matchedKey = item.id as keyof typeof responses;
      const respObj = responses[matchedKey];
      const answer = isAr ? respObj.ar : respObj.en;

      const newAiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newAiMsg]);
      setIsAiTyping(false);
    }, 950);
  };

  const handleResetChat = () => {
    setMessages([initialMessage(isAr)]);
    setInputText('');
    setIsAiTyping(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="ai-quick-help-portal" className="fixed inset-0 z-[110] overflow-y-auto">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            id="ai-quick-help-backdrop"
          />

          <div className="flex min-h-screen items-center justify-center p-4 relative">
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              id="ai-quick-help-content"
              className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col h-[580px] overflow-hidden"
            >
              {/* Artistic Ambient Background Sparkle Grid */}
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sky-500/5 via-indigo-500/0 default-pointer-events-none pointer-events-none" />

              {/* MODAL HEADER */}
              <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 relative">
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-950/40 relative overflow-hidden shrink-0">
                    <Bot className="w-5 h-5 text-white animate-pulse" />
                    <Sparkles className="w-3.5 h-3.5 absolute -top-0.5 -right-0.5 text-sky-200" />
                  </div>
                  <div className="space-y-0.5 text-right rtl:text-right ltr:text-left">
                    <h3 className="text-sm sm:text-base font-black leading-tight">
                      {isAr ? 'المساعد التقني الذكي' : 'Smart Systems AI Assistant'}
                    </h3>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse gap-1 text-[10px] text-sky-300 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <span>{isAr ? 'يجيبك على الفور' : 'Instant Automated Response'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  {/* Reset Chat button */}
                  <button
                    id="ai-help-reset-btn"
                    onClick={handleResetChat}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:text-white text-slate-300 hover:border-slate-700 cursor-pointer transition-colors"
                    title={isAr ? 'إعادة المحادثة' : 'Reset Conversation'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Close button */}
                  <button
                    id="ai-help-close-btn"
                    onClick={onClose}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-800/40 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 hover:border-rose-900/60 cursor-pointer transition-all"
                    title={isAr ? 'إغلاق' : 'Close'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CHAT BUBBLES WINDOW */}
              <div 
                id="ai-chat-window"
                className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50"
              >
                {messages.map((msg) => {
                  const isAi = msg.sender === 'ai';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAi ? 'justify-start' : 'justify-end'} items-end space-x-2 rtl:space-x-reverse`}
                    >
                      {isAi && (
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-3xs mb-2">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      
                      <div className="max-w-[82%] space-y-1">
                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed border shadow-3xs ${
                            isAi 
                              ? 'bg-white text-slate-800 rounded-bl-xs border-slate-200' 
                              : 'bg-indigo-600 text-white rounded-br-xs border-indigo-700 font-medium'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <span className={`block text-[9px] text-slate-400 px-1 ${isAi ? 'text-left rtl:text-right' : 'text-right rtl:text-left'}`}>
                          {msg.timestamp}
                        </span>
                      </div>

                      {!isAi && (
                        <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-3xs mb-2">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Simulated Thinking Status Indicator */}
                {isAiTyping && (
                  <div className="flex justify-start items-center space-x-2 rtl:space-x-reverse">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-3xs">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 py-3 px-4 rounded-2xl rounded-bl-xs flex items-center space-x-1 rtl:space-x-reverse gap-1.5 text-slate-400 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* INTERACTIVE SUGGESTION CHIPS GRID BUTTONS */}
              <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 px-1 text-right ltr:text-left flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{isAr ? 'عناوين ومواضيع مقترحة للمساعدة الفورية' : 'EASY-TAP TOPICS FOR FASTER METRICS'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pb-1">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      id={`ai-help-tag-${item.id}`}
                      onClick={() => handleSuggestionClick(item)}
                      disabled={isAiTyping}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-slate-700 hover:text-indigo-700 bg-white cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isAr ? item.labelAr : item.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* TEXT FIELD INPUT CONTAINER */}
              <form 
                onSubmit={handleSubmit}
                className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
              >
                <div className="relative flex-1">
                  <input
                    id="ai-quick-input-field"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isAiTyping}
                    placeholder={isAr ? 'اكتب كلمتك أو استفسارك هنا (مثال: أسعار، حماية)...' : 'Type your query here (e.g., pricing, uptime)...'}
                    className={`w-full py-2.5 px-4 bg-slate-800 text-white placeholder-slate-400 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/30 text-xs sm:text-sm transition-all ${isAr ? 'text-right' : 'text-left'}`}
                  />
                  <div className={`absolute inset-y-0 ${isAr ? 'left-3' : 'right-3'} flex items-center default-pointer-events-none pointer-events-none text-slate-500`}>
                    <Terminal className="w-4 h-4" />
                  </div>
                </div>

                <button
                  id="ai-quick-send-btn"
                  type="submit"
                  disabled={!inputText.trim() || isAiTyping}
                  className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                    !inputText.trim() || isAiTyping
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-95'
                  }`}
                >
                  <Send className="w-4 h-4 rtl:rotate-185" />
                </button>
              </form>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
