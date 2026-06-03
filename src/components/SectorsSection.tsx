import { useState } from 'react';
import { SECTORS } from '../data';
import { Lang, Sector } from '../types';
import { getIconComponent } from './Icons';
import { Check, X, Shield, ArrowUpRight, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SectorsSectionProps {
  lang: Lang;
  onNavigateToConsult: (sectorId: string) => void;
}

export default function SectorsSection({ lang, onNavigateToConsult }: SectorsSectionProps) {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const isAr = lang === 'ar';

  return (
    <section id="sectors" className="py-20 bg-white relative scroll-mt-10">
      
      {/* Absolute top grid accent lines */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold leading-none">
            <Award className="w-3.5 h-3.5" />
            <span>{isAr ? 'قطاعات حيوية نُمكّنها' : 'Empowering Sovereign Industries'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
            {isAr ? 'قطاعات العمل والخبرة' : 'Diverse Sector Expertise'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'نحن ملتزمون بخدمة مجموعة متنوعة من الصناعات، بعد اكتساب فهم عميق للتحديات والفرص الخاصة بكل قطاع لضمان تحقيق غاياتها الحيوية.'
              : 'Our systems host rich capabilities serving a collection of sovereign, administrative, and consumer industries.'}
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SECTORS.map((sector) => {
            const title = isAr ? sector.titleAr : sector.titleEn;
            const desc = isAr ? sector.descriptionAr : sector.descriptionEn;

            return (
              <motion.div
                key={sector.id}
                id={`sector-card-${sector.id}`}
                whileHover={{ y: -4, shadow: '0 10px 20px -5px rgba(0, 0, 0, 0.04)' }}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-all cursor-pointer"
                onClick={() => setSelectedSector(sector)}
              >
                <div className="space-y-4">
                  {/* Category icon */}
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    {getIconComponent(sector.iconName, 'w-5.5 h-5.5')}
                  </div>

                  {/* Body Text */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3">
                      {desc}
                    </p>
                  </div>
                </div>

                {/* More Details Action Link */}
                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span className="hover:underline">{isAr ? 'المزيد من التفاصيل' : 'Learn More'}</span>
                  <div className="flex items-center space-x-0.5 rtl:space-x-reverse text-indigo-500">
                    {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Magnificent Detailed Sector Case Dashboard Modal */}
      <AnimatePresence>
        {selectedSector && (
          <>
            {/* Backdrop cover */}
            <motion.div
              id="sector-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSector(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              {/* Central Dashboard Modal */}
              <motion.div
                id={`sector-modal-${selectedSector.id}`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col"
              >
                {/* Header with gradient strip */}
                <div className="relative bg-slate-900 text-white px-6 py-8 sm:px-8 overflow-hidden shrink-0">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600" />
                  <div className="absolute -right-32 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl" />
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-2">
                      <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded bg-white/10 text-sky-300 text-xs font-bold uppercase tracking-wider">
                        {getIconComponent(selectedSector.iconName, 'w-3.5 h-3.5 text-sky-400')}
                        <span>{isAr ? 'تحليل قطاعي' : 'Sector Deep Dive'}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black">
                        {isAr ? selectedSector.titleAr : selectedSector.titleEn}
                      </h3>
                    </div>
                    
                    <button
                      id="close-sector-modal"
                      onClick={() => setSelectedSector(null)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Main Content Area (Scrollable scroll-container) */}
                <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
                  
                  {/* Performance metrics display */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedSector.metrics.map((metric, index) => {
                      const metricLabel = isAr ? metric.labelAr : metric.labelEn;
                      return (
                        <div
                          key={index}
                          className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50 text-center relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 p-3 flex border-l-4 border-indigo-500 h-full" />
                          <span className="text-2xl font-extrabold text-indigo-700 tracking-tight font-mono block mb-1">
                            {metric.value}
                          </span>
                          <span className="text-[11px] sm:text-xs font-bold text-slate-500 leading-tight">
                            {metricLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Challenge vs Solution Dual Columns */}
                  <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* Column 1: Challenges (العوائق والصعوبات) */}
                    <div className="p-5 rounded-2xl bg-red-50/30 border border-red-100/50 space-y-4">
                      <h4 className="font-bold text-red-950 flex items-center space-x-2 rtl:space-x-reverse text-sm sm:text-base">
                        <Shield className="w-5 h-5 text-red-600 shrink-0" />
                        <span>{isAr ? 'التحديات والمصاعب المحددة' : 'Identified Obstacles & Painpoints'}</span>
                      </h4>
                      <ul className="space-y-2.5">
                        {(isAr ? selectedSector.challengesAr : selectedSector.challengesEn).map((challenge, idx) => (
                          <li key={idx} className="flex items-start space-x-2 rtl:space-x-reverse text-xs sm:text-sm text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                            <span className="leading-relaxed font-medium">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 2: Solutions Delivered (ما قدمناه من حلول) */}
                    <div className="p-5 rounded-2xl bg-emerald-50/20 border border-emerald-100/50 space-y-4">
                      <h4 className="font-bold text-emerald-950 flex items-center space-x-2 rtl:space-x-reverse text-sm sm:text-base">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{isAr ? 'عروض وحلول بيزنس ديفلوبرز' : 'Our Digital Solutions Engine'}</span>
                      </h4>
                      <ul className="space-y-2.5">
                        {(isAr ? selectedSector.solutionsProvidedAr : selectedSector.solutionsProvidedEn).map((solLine, idx) => (
                          <li key={idx} className="flex items-start space-x-2 rtl:space-x-reverse text-xs sm:text-sm text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                            <span className="leading-relaxed font-semibold">{solLine}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Elaborate Case Study Section */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-indigo-900 font-extrabold text-sm sm:text-base">
                      <ArrowUpRight className="w-5 h-5 text-indigo-600 shrink-0" />
                      <span>
                        {isAr ? `قصة نجاح: ${selectedSector.caseStudyTitleAr}` : `Case Study: ${selectedSector.caseStudyTitleEn}`}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                      {isAr ? selectedSector.caseStudyDescAr : selectedSector.caseStudyDescEn}
                    </p>
                  </div>

                </div>

                {/* Footer and Navigation */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {isAr
                      ? 'جميع الحلول تدمج تقارير كفاءة تشغلية مبرهنة'
                      : 'All integrations conform to verified performance frameworks'}
                  </span>
                  
                  <div className="flex gap-2.5 w-full sm:w-auto">
                    <button
                      id="modal-cta-consult"
                      onClick={() => {
                        setSelectedSector(null);
                        onNavigateToConsult(selectedSector.id);
                      }}
                      className="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all text-center active:scale-98 cursor-pointer"
                    >
                      {isAr ? 'حجز جلسة عمل للقطاع' : 'Request Consult For Industry'}
                    </button>
                    
                    <button
                      id="modal-close"
                      onClick={() => setSelectedSector(null)}
                      className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs sm:text-sm transition-all cursor-pointer"
                    >
                      {isAr ? 'إغلاق' : 'Dismiss'}
                    </button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}
