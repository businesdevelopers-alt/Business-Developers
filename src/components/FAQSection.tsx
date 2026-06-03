import React, { useState, useMemo } from 'react';
import { FAQS } from '../data';
import { Lang, FAQItem } from '../types';
import { HelpCircle, ChevronDown, Search, Sparkles, MessageSquare, HelpCircle as QuestionIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQSectionProps {
  lang: Lang;
}

export default function FAQSection({ lang }: FAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isAr = lang === 'ar';

  // Toggle single accordion function
  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Extract unique categories for filter tabs
  const categories = useMemo(() => {
    const list = FAQS.map(faq => isAr ? faq.categoryAr : faq.categoryEn);
    return ['all', ...Array.from(new Set(list))];
  }, [isAr]);

  // Filter and search FAQs
  const filteredFaqs = useMemo(() => {
    return FAQS.filter(faq => {
      // Category filter
      const categoryMatch = activeCategory === 'all' || 
        (isAr ? faq.categoryAr : faq.categoryEn) === activeCategory;

      // Text search match
      const query = searchQuery.toLowerCase().trim();
      if (!query) return categoryMatch;

      const questionText = (isAr ? faq.questionAr : faq.questionEn).toLowerCase();
      const answerText = (isAr ? faq.answerAr : faq.answerEn).toLowerCase();
      const category = (isAr ? faq.categoryAr : faq.categoryEn).toLowerCase();

      return categoryMatch && (
        questionText.includes(query) || 
        answerText.includes(query) || 
        category.includes(query)
      );
    });
  }, [searchQuery, activeCategory, isAr]);

  return (
    <section 
      id="faq" 
      className="py-24 bg-white relative scroll-mt-20 overflow-hidden"
    >
      {/* Decorative accent blurs */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
      
      {/* Sleek top separator line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-xs font-bold leading-none">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'الأسئلة الشائعة والمعايير' : 'Fidelity & Knowledge Core'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
            {isAr ? 'الأسئلة الأكثر شيوعاً' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {isAr
              ? 'إجابات شاملة حول كيفية قيادتنا لمشروعات التحول الرقمي وتأمين قنوات الربط ونسب التوافر التقني المضمونة لشركائنا.'
              : 'Detailed operational guidelines addressing security compliances, cloud integrations, and core service delivery timelines.'}
          </p>
        </div>

        {/* Real-time Search and Filter Panel Row */}
        <div className="space-y-6 mb-12">
          {/* Search Bar Container */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              id="faq-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في محتوى الأسئلة أو الحلول...' : 'Search answers, technologies or security protocols...'}
              className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:bg-white rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                id="faq-search-clear"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 end-0 pe-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer text-xs font-bold"
              >
                {isAr ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>

          {/* Horizontal Category Pill Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const isSelected = activeCategory === category;
              const label = category === 'all' 
                ? (isAr ? 'الكل' : 'All Categories') 
                : category;

              return (
                <button
                  key={category}
                  id={`faq-tab-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => {
                    setActiveCategory(category);
                    setExpandedId(null); // Collapsing active ones on filter change to prevent weird scroll states
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs Accordion Block */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredFaqs.length > 0 ? (
              <motion.div 
                layout 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredFaqs.map((faq, index) => {
                  const isExpanded = expandedId === faq.id;
                  const question = isAr ? faq.questionAr : faq.questionEn;
                  const answer = isAr ? faq.answerAr : faq.answerEn;
                  const category = isAr ? faq.categoryAr : faq.categoryEn;

                  return (
                    <motion.div
                      layout
                      key={faq.id}
                      id={`faq-card-${faq.id}`}
                      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isExpanded
                          ? 'bg-slate-50 border-sky-200 shadow-md shadow-sky-50/40'
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                      }`}
                    >
                      {/* Accordion Toggle Header */}
                      <button
                        id={`faq-trigger-${faq.id}`}
                        onClick={() => toggleAccordion(faq.id)}
                        className="w-full px-5 py-4 sm:py-5 flex items-start justify-between text-right ltr:text-left font-sans font-bold text-slate-900 gap-4 cursor-pointer focus:outline-none"
                      >
                        <div className="space-y-1.5 flex-1 pr-2">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold text-[9px] uppercase tracking-wider">
                            {category}
                          </span>
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-950 hover:text-sky-600 transition-colors leading-snug">
                            {question}
                          </h4>
                        </div>
                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          isExpanded 
                            ? 'bg-sky-50 text-sky-600 rotate-180' 
                            : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'
                        }`}>
                          <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                        </div>
                      </button>

                      {/* Expandable Panel Body */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            id={`faq-panel-${faq.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="border-t border-slate-200/60 overflow-hidden"
                          >
                            <div className="px-5 py-4 sm:py-5 bg-slate-50/50 text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3">
                              <p className="leading-relaxed text-slate-700">
                                {answer}
                              </p>
                              <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-sky-600 font-sans text-[11px] font-bold">
                                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                <span>
                                  {isAr 
                                    ? 'تم التأكيد والمطابقة طبقا لمعايير شركة بيزنس ديفلوبرز' 
                                    : 'Validated under Business Developers specifications'}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              // Empty Search Result Indicator
              <motion.div
                id="faq-empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 max-w-md mx-auto space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <QuestionIcon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {isAr ? 'لم نجد أي إجابات مطابقة' : 'No matching results found'}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {isAr
                    ? 'جرب البحث بكلمة مفتاحية مختلفة مثل "أمن"، "حماية"، "مدة"، أو "دعم".'
                    : 'Try looking for general terms such as "cybersecurity", "support", "timeline", or "API".'}
                </p>
                <button
                  id="faq-reset-filters-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer shadow-sm"
                >
                  {isAr ? 'إعادة ضبط البحث' : 'Reset Search'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic CTA at bottom of FAQ */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 max-w-xl mx-auto">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-indigo-600">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-800">
                {isAr ? 'هل لديك سؤال غير مدرج؟' : 'Still have questions?'}
              </span>
            </div>
            <button
              id="faq-scroller-cta"
              onClick={() => {
                const el = document.getElementById('consultation');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-extrabold text-sky-600 hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer decoration-sky-200 hover:underline underline-offset-4"
            >
              {isAr ? 'تواصل مع مهندس حلول مباشرة ⟵' : 'Talk with a solution architect directly ⟵'}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
