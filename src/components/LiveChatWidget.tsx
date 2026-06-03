import React, { useState, useEffect, useRef } from 'react';
import { Lang } from '../types';
import { 
  MessageSquare, 
  X, 
  Send, 
  ChevronDown, 
  CheckCheck, 
  Circle, 
  Sparkles,
  PhoneCall,
  Mail,
  User,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveChatWidgetProps {
  lang: Lang;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  status: 'sent' | 'read';
}

export default function LiveChatWidget({ lang }: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showTeaser, setShowTeaser] = useState(false);
  
  const isAr = lang === 'ar';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: 'welcome-1',
      sender: 'agent',
      text: isAr 
        ? 'أهلاً بك في منصة شركاء الأعمال الابتكارية (Business Developers) للحلول والأنظمة. 👋'
        : 'Welcome to Business Developers technical solutions ecosystem. 👋',
      timestamp: new Date(),
      status: 'read'
    },
    {
      id: 'welcome-2',
      sender: 'agent',
      text: isAr
        ? 'أنا المهندسة سارة، ومستعدة لمساعدتك الآن في محاكاة البنية البرمجية المناسبة لمشروعك، أو الإجابة عن مواصفات الأمان والدعم ومستويات الـ SLA المعتمدة لدينا. كيف يمكنني إرشادك اليوم؟'
        : 'I am Sarah, your dedicated Solutions Architect. I am ready to guide you through system infrastructure modeling, security compliances, and support SLAs. How can I assist you today?',
      timestamp: new Date(),
      status: 'read'
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Trigger conversational teaser bubble after a slight delay if closed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTeaser(true);
      }
    }, 4500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Handle switching languages dynamically update welcome messages
  useEffect(() => {
    // Retain user custom conversations, but translate empty histories
    if (messages.length <= 2) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'agent',
          text: isAr 
            ? 'أهلاً بك في منصة شركاء الأعمال الابتكارية (Business Developers) للحلول والأنظمة. 👋'
            : 'Welcome to Business Developers technical solutions ecosystem. 👋',
          timestamp: new Date(),
          status: 'read'
        },
        {
          id: 'welcome-2',
          sender: 'agent',
          text: isAr
            ? 'أنا المهندسة سارة، ومستعدة لمساعدتك الآن في محاكاة البنية البرمجية المناسبة لمشروعك، أو الإجابة عن مواصفات الأمان والدعم ومستويات الـ SLA المعتمدة لدينا. كيف يمكنني إرشادك اليوم؟'
            : 'I am Sarah, your dedicated Solutions Architect. I am ready to guide you through system infrastructure modeling, security compliances, and support SLAs. How can I assist you today?',
          timestamp: new Date(),
          status: 'read'
        }
      ]);
    }
  }, [lang, isAr]);

  // Scroll to bottom on updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Pre-configured suggestions
  const suggestions = [
    {
      labelAr: 'طلب تسعير نظام مخصص 💼',
      labelEn: 'Request Custom System Quote 💼',
      textAr: 'أريد معرفة كيفية الحصول على تسعير وتقدير تكاليف دقيق لتطوير نظام مخصص لشركتنا.',
      textEn: 'I want to know how to get a pricing and cost estimation for our custom system.'
    },
    {
      labelAr: 'مدة تسليم المشاريع ⏱',
      labelEn: 'Project Delivery Duration ⏱',
      textAr: 'ما هي الفترات الزمنية المعتادة لتسليم وبرمجة المنصات الرقمية الكبرى؟',
      textEn: 'What are the usual delivery times for major digital platforms?'
    },
    {
      labelAr: 'أمان وتشفير الحوسبة 🔒',
      labelEn: 'Information Security Standards 🔒',
      textAr: 'كيف تضمن اللوائح الأمنية والامتيازات حماية بياناتنا السحابية؟',
      textEn: 'How are cyber-security frameworks built to safeguard our cloud metrics?'
    }
  ];

  // Logic to calculate dynamic intelligent mock responses
  const getAgentResponse = (userText: string): string => {
    const textLow = userText.toLowerCase();

    // Cost / Pricing context
    if (textLow.includes('سعر') || textLow.includes('تكلف') || textLow.includes('تسعير') || textLow.includes('ميزان') || textLow.includes('cost') || textLow.includes('price') || textLow.includes('budget') || textLow.includes('pricing')) {
      return isAr 
        ? 'يسعدنا جداً تقديم هيكل مالي مرن يتناسب مع متطلبات نظامكم! أفضل خيار هو تعبئة بيانات قطاعكم في حاسبة "طلب استشارة" بالأسفل لتوليد مسودة فنية تسعيرية مباشرة، أو تفضل بترك رقم هاتفك وبريدك الإلكتروني هنا للمتابعة الفورية.'
        : 'We would be glad to draft a modular financial outline tailored for you. The fastest path is configuring your criteria in our "Get Appraisal" engine below to render an instant blueprint estimate, or please drop your contact info here to direct support.';
    }

    // Time / Delivery duration context
    if (textLow.includes('وقت') || textLow.includes('مدة') || textLow.includes('تاريخ') || textLow.includes('تسليم') || textLow.includes('شهور') || textLow.includes('time') || textLow.includes('duration') || textLow.includes('long') || textLow.includes('days') || textLow.includes('months')) {
      return isAr
        ? 'تتراوح فترات التنفيذ والإنتاج للحلول المتقدمة من 3 إلى 6 أشهر كمتوسط، ونلتزم بالإطلاق التدريجي والتسليم المتكرر بفضل منهجيات Agile التراكمية، ليصبح أول إصدار فعال متاحاً خلال أسابيع معدودة.'
        : 'Enterprise projects usually span 3 to 6 months. We deploy incrementally under Agile principles. This guarantees a functional staging deployment is ready for inspection in as little as 3 to 4 weeks.';
    }

    // Cybersecurity / cloud context
    if (textLow.includes('أمن') || textLow.includes('تشفي') || textLow.includes('حماي') || textLow.includes('سحاب') || textLow.includes('نظام') || textLow.includes('security') || textLow.includes('encrypt') || textLow.includes('safety') || textLow.includes('cloud') || textLow.includes('database')) {
      return isAr
        ? 'نهتم بأمن البيانات كأولوية قصوى؛ حيث نعتمد على مستويات تشفير AES-256، ومعايير توافق مع PCI-DSS لدعم بوابات المشتريات، واتصالات آمنة مشفرة بالكامل SSL/TLS، مدعومة بممارسات Zero-Trust على حواضن Kubernetes وبوبات الاستضافة.'
        : 'Security is paramount at Business Developers. We safeguard databases with AES-256 standards, leverage encrypted SSL/TLS channels for transactional and GIS feeds, and implement strict Zero-Trust pod architectures.';
    }

    // General default
    return isAr
      ? `شكراً لتوضيح هذه المتطلبات الفنية الرائعة! لقد تم حفظ تفاصيل المحادثة في نظام الرصد الداخلي للحلول الرقمية. مستشارونا مستعدون للمتابعة. هل تود الإدلاء بمعلومات التواصل كالهاتف لنسهل التواصل؟`
      : `Thank you for sharing your parameters! I have securely recorded this dialogue context in our internal consulting dashboard. A systems specialist will reach out. Would you like to supply your email/phone number for instant tracking?`;
  };

  const handleSend = (textToSend = messageText) => {
    if (!textToSend.trim()) return;

    // Add user message
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    setHasUnread(false);

    // Simulate double tick "read" status after 500ms
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => m.id === newMessage.id ? { ...m, status: 'read' as const } : m)
      );
    }, 600);

    // Trigger Typing response simulate
    setIsTyping(true);
    
    // Choose appropriate response content
    const responseText = getAgentResponse(textToSend);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: responseText,
        timestamp: new Date(),
        status: 'read'
      }]);
    }, 2000);
  };

  const handleQuickReply = (textAr: string, textEn: string) => {
    const selectedText = isAr ? textAr : textEn;
    handleSend(selectedText);
  };

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    setHasUnread(false);
    setShowTeaser(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Dynamic unread teaser popup */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`mr-0 mb-3 max-w-[280px] bg-white border border-slate-200 rounded-2xl shadow-xl p-4 cursor-pointer hover:border-sky-300 relative ${
              isAr ? 'mr-0 ml-12 text-right' : 'ml-0 mr-12 text-left'
            }`}
            onClick={handleOpenToggle}
          >
            {/* Quick close button for the teaser */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
              }}
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Avatar & teaser body */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1.5 pb-1.5 border-b border-slate-100">
              <div className="relative w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center border border-sky-100 text-sky-600 text-xs font-bold font-sans">
                BD
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
              </div>
              <span className="text-[11px] font-black text-slate-800">
                {isAr ? 'المهندسة سارة (مستشارة الفنيين)' : 'Sarah (Solutions Hub)'}
              </span>
            </div>
            
            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
              {isAr
                ? 'أهلاً بك! 👋 أحمل لك تحديثات سريعة حول البنى السحابية وتكاليف تشغيل الأنظمة. اسألني أي سؤال!'
                : 'Welcome! 👋 Reach out for real-time diagnostics, system sizing insights or price indexes.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat dialogue panel interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            id="BD-live-chat-panel"
            className={`w-[360px] sm:w-[380px] max-w-[calc(100vw-32px)] h-[540px] sm:h-[580px] bg-white border border-slate-200 shadow-2xl rounded-3xl flex flex-col justify-between overflow-hidden mb-4`}
          >
            {/* BRANDED INTERACTIVE HEADER */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 border-b border-slate-800 text-white flex items-center justify-between relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="flex items-center space-x-3 rtl:space-x-reverse relative">
                {/* Visual Avatar with Pulse Glow */}
                <div className="relative w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-sky-400 font-extrabold text-sm shadow-inner group">
                  <Cpu className="w-5 h-5 text-sky-400 animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                </div>

                <div className="text-right ltr:text-left space-y-0.5">
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-sans">
                    <span className="text-xs font-extrabold tracking-tight">
                      {isAr ? 'مستشار الحلول المتكاملة' : 'Sarah - Systems Advisor'}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse text-[10px] text-slate-400">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>{isAr ? 'مستعدة للإجابة فوراً' : 'Online / Ready'}</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <button
                  onClick={handleOpenToggle}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={isAr ? 'تصغير' : 'Minimize'}
                >
                  <ChevronDown className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={handleOpenToggle}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={isAr ? 'إغلاق' : 'Close'}
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* MESSAGES LOG VIEW */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              
              {/* Notice Banner */}
              <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200/50 text-center font-sans space-y-1">
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                  {isAr 
                    ? '⚡ محاكاة فورية مبرمجة خصيصاً للتوافق الفني' 
                    : '⚡ Automated Architecture Vector Simulation Sandbox'}
                </p>
                <p className="text-[9px] text-slate-400 leading-normal">
                  {isAr
                    ? 'جميع الرسائل يتم مراجعتها وتوليد مخطط لشركة بيزنس ديفلوبرز'
                    : 'System parameters map directly to target Solutions Engineers'}
                </p>
              </div>

              {messages.map((msg) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[85%] flex items-start space-x-2 rtl:space-x-reverse ${
                      isAgent ? '' : 'flex-row-reverse'
                    }`}>
                      {/* Short avatar for messages */}
                      <div className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                        isAgent ? 'bg-sky-50 border border-sky-200 text-sky-600' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isAgent ? 'S' : <User className="w-3 h-3" />}
                      </div>

                      <div className="space-y-1">
                        <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isAgent 
                            ? 'bg-white text-slate-900 rounded-tl-none shadow-sm border border-slate-100'
                            : 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                        }`}>
                          {msg.text}
                        </div>

                        {/* Status Check and Time footer */}
                        <div className={`flex items-center text-[9px] text-slate-400 gap-1 ${
                          isAgent ? 'justify-start' : 'justify-end'
                        }`}>
                          <span>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {!isAgent && (
                            <CheckCheck className={`w-3 h-3 ${
                              msg.status === 'read' ? 'text-sky-500' : 'text-slate-300'
                            }`} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Dot Bouncing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 rtl:space-x-reverse max-w-[85%]">
                    <div className="w-6 h-6 rounded-md bg-sky-50 border border-sky-200 text-sky-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                      S
                    </div>
                    <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1.5 rtl:space-x-reverse">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* PRE-FORMATTED SUGGESTIONS STRIP */}
            {messages.length <= 4 && (
              <div className="bg-slate-50 border-t border-slate-100 px-3 py-2 flex flex-col gap-1.5">
                <p className="text-[10px] text-slate-400 font-bold px-1 text-right ltr:text-left">
                  {isAr ? 'قد يساعدك البدء بالاقتراحات التالية:' : 'Or tap quick answers to start:'}
                </p>
                <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 scrollbar-thin">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(s.textAr, s.textEn)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-white border border-slate-200 hover:border-sky-400 hover:text-sky-600 rounded-full shadow-xs whitespace-nowrap cursor-pointer hover:bg-sky-50/20 active:scale-98 transition-all"
                    >
                      {isAr ? s.labelAr : s.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MESSAGE SEND CONTROLS FOOTER */}
            <div className="p-3 bg-white border-t border-slate-200/60 leading-none">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <input
                  id="chat-widget-input"
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={isAr ? 'اكتب رسالتك وسنرد فوراً...' : 'Write message and query details...'}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-sky-500/5 transition-all"
                />

                <button
                  id="chat-send-btn"
                  type="submit"
                  disabled={!messageText.trim()}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                    messageText.trim()
                      ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-100'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  title={isAr ? 'إرسال' : 'Send'}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Footnote of contact info */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 px-1">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-300" />
                  <span>support@businessdevelopers.com</span>
                </div>
                <div className="flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-slate-300" />
                  <span>+966 50 000 0000</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Circle Button */}
      <motion.button
        id="live-chat-floating-btn"
        onClick={handleOpenToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-sky-600/30 cursor-pointer overflow-hidden relative group"
        title={isAr ? 'محادثة مستشار الأنظمة' : 'Chat with Solutions Architect'}
      >
        {/* Animated outer glowing layer when closed */}
        {!isOpen && (
          <span className="absolute -inset-1.5 rounded-full border-2 border-white/20 group-hover:scale-110 transition-transform duration-500 animate-pulse pointer-events-none" />
        )}
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6" />
              {/* Unread dot signal */}
              {hasUnread && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-sky-600 rounded-full" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
