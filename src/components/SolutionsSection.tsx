import { useState } from 'react';
import { SOLUTIONS } from '../data';
import { Lang, Solution } from '../types';
import { getIconComponent } from './Icons';
import { Check, X, ArrowLeft, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SolutionsSectionProps {
  lang: Lang;
  onNavigateToConsult: (solutionId: string) => void;
}

export default function SolutionsSection({ lang, onNavigateToConsult }: SolutionsSectionProps) {
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const isAr = lang === 'ar';

  return (
    <section id="solutions" className="py-20 bg-slate-50 relative scroll-mt-10">
      
      {/* Decorative patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointe-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full bg-sky-100/60 dark:bg-sky-950/30 text-sky-700 text-xs font-bold leading-none">
            <Activity className="w-3.5 h-3.5" />
            <span>{isAr ? 'منظومة حلولنا المتكاملة' : 'Our Integrated Solutions'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
            {isAr ? 'حلولنا المبتكرة للقطاعات' : 'Tailor-Made Technical Solutions'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'نهج فريد يدمج تكنولوجيا الغد بالبنية الحالية لتقديم حلول مستقرة وقابلة للتطور بمرونة كاملة.'
              : 'A unique fusion blending next-generation systems with modern workflows to deliver robust configurations.'}
          </p>
        </div>

        {/* 9 Solutions Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((sol, index) => {
            const title = isAr ? sol.titleAr : sol.titleEn;
            const desc = isAr ? sol.descriptionAr : sol.descriptionEn;

            return (
              <motion.div
                key={sol.id}
                id={`sol-card-${sol.id}`}
                whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between hover:border-sky-300 transition-all cursor-pointer group"
                onClick={() => setSelectedSolution(sol)}
              >
                <div className="space-y-4">
                  {/* Icon wrap */}
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
                    {getIconComponent(sol.iconName, 'w-6 h-6')}
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
                      {title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {desc}
                    </p>
                  </div>
                </div>

                {/* Read more footer */}
                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
                  <span>{isAr ? 'تفاصيل الحل والفوائد' : 'Sol. Features & Tech'}</span>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Slide-over Side Drawer for Solution Details */}
      <AnimatePresence>
        {selectedSolution && (
          <>
            {/* Backdrop */}
            <motion.div
              id="solution-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSolution(null)}
              className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-50"
            />

            {/* Slide Drawer */}
            <motion.div
              id={`solution-drawer-${selectedSolution.id}`}
              initial={{ x: isAr ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 ${
                isAr ? 'left-0' : 'right-0'
              } w-full max-w-lg bg-white shadow-2xl z-50 p-6 sm:p-8 overflow-y-auto border-l rtl:border-l-0 rtl:border-r border-slate-100 flex flex-col justify-between`}
            >
              <div>
                {/* Header block within drawer */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                      {getIconComponent(selectedSolution.iconName, 'w-5 h-5')}
                    </div>
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                      {isAr ? 'عن الحل التقني' : 'Service Outline'}
                    </span>
                  </div>
                  
                  <button
                    id="close-solution-drawer"
                    onClick={() => setSelectedSolution(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Major Info details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">
                      {isAr ? selectedSolution.titleAr : selectedSolution.titleEn}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {isAr ? selectedSolution.detailsAr : selectedSolution.detailsEn}
                    </p>
                  </div>

                  {/* Impact box */}
                  <div className="p-4 rounded-xl bg-gradient-to-tr from-sky-50 to-indigo-50 border border-sky-100/50">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sky-800 font-bold text-xs sm:text-sm mb-1.5">
                      <TrendingUp className="w-4 h-4 text-sky-600" />
                      <span>{isAr ? 'مؤشر أثر الأعمال المباشر' : 'Verified Business Impact'}</span>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                      {isAr ? selectedSolution.impactAr : selectedSolution.impactEn}
                    </p>
                  </div>

                  {/* Technical Features bullet point list */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 border-b pb-2">
                      {isAr ? 'الركائز والميزات التقنية الأساسية' : 'Key Advantages & Capabilities'}
                    </h4>
                    <ul className="space-y-2.5">
                      {(isAr ? selectedSolution.featuresAr : selectedSolution.featuresEn).map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 rtl:space-x-reverse text-xs sm:text-sm">
                          <div className="w-5 h-5 shrink-0 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-slate-600 font-medium leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-8 border-t border-slate-100 flex gap-4">
                <button
                  id="drawer-cta-consult"
                  onClick={() => {
                    setSelectedSolution(null);
                    onNavigateToConsult(selectedSolution.id);
                  }}
                  className="flex-1 py-3 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-all text-center shadow-md active:scale-98 cursor-pointer"
                >
                  {isAr ? 'طلب استشارة بهذا الحل' : 'Discuss This Solution'}
                </button>
                <button
                  id="drawer-cancel"
                  onClick={() => setSelectedSolution(null)}
                  className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all active:scale-98 cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}
