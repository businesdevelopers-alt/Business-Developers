import React, { useState } from 'react';
import { PROJECTS } from '../data';
import { Lang, Project } from '../types';
import { getIconComponent } from './Icons';
import { ExternalLink, Briefcase, Sparkles, Filter, Code, CheckCircle, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PortfolioSectionProps {
  lang: Lang;
}

export default function PortfolioSection({ lang }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const isAr = lang === 'ar';

  // Get unique sectors for filtering
  const sectors = ['all', ...Array.from(new Set(PROJECTS.map(p => isAr ? p.sectorAr : p.sectorEn)))];

  const filteredProjects = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => (isAr ? p.sectorAr : p.sectorEn) === activeFilter);

  return (
    <section id="portfolio" className="py-24 bg-slate-50 relative scroll-mt-10 overflow-hidden">
      
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-x-0 -top-40 h-[600px] bg-gradient-to-b from-sky-100/20 via-indigo-100/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Modern thin top gradient splitter line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold leading-none">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isAr ? 'روائع ابتكاراتنا التقنية' : 'Our Engineering Showcase'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            {isAr ? 'معرض أعمالنا التقنية' : 'Our Technical Works'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'مجموعة من الحلول الرقمية، الأنظمة السحابية وبوابات الخدمة الذاتية التي قمنا بتطويرها وتشغيلها لدعم التحول الرقمي المتكامل لعملائنا في مختلف القطاعات.'
              : 'A curated selection of robust cloud architectures, digital payment gateways, and municipal platforms built and deployed for our corporate clients.'}
          </p>
        </div>

        {/* Filter Selection Panel */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {sectors.map((sector) => {
            const isSelected = activeFilter === sector;
            const label = sector === 'all'
              ? (isAr ? 'الكل' : 'All Projects')
              : sector;

            return (
              <button
                key={sector}
                onClick={() => setActiveFilter(sector)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-100'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Grid of Projects */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const title = isAr ? project.titleAr : project.titleEn;
              const sector = isAr ? project.sectorAr : project.sectorEn;
              const desc = isAr ? project.descriptionAr : project.descriptionEn;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  key={project.id}
                  id={`project-card-${project.id}`}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between overflow-hidden group hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  {/* Top Graphic Border & Head */}
                  <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Badge / Sector and Icon row */}
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                          {sector}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {getIconComponent(project.iconName, 'w-5 h-5')}
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                        {title}
                      </h3>

                      {/* Brief description */}
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {desc}
                      </p>
                    </div>

                    {/* Tech Stacks section */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-slate-400">
                        <Code className="w-3.5 h-3.5 text-sky-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {isAr ? 'حزمة التقنيات المستخدمة' : 'Engineered Stack'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200/60 text-slate-600 text-[10px] font-mono font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Demo/Preview footer strip */}
                  <div className="bg-slate-50/50 hover:bg-slate-50 px-6 sm:px-7 py-4 border-t border-slate-100 flex items-center justify-between transition-colors">
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold tracking-tight font-mono">
                        {isAr ? 'حالة النظام: تشغيل كامل' : 'SYS_STATUS: LIVE'}
                      </span>
                    </div>

                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 rtl:space-x-reverse text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                      onClick={(e) => {
                        // Prevent default if we want to show a gorgeous modal or custom notification
                        // since we are inside an iframe. Let's make it a nice feedback loop.
                        e.preventDefault();
                        alert(
                          isAr 
                            ? `هذه مسودة تفاعلية لبيئة العرض الخاصة بمشروع (${title}). يتم نقلك الآن لأفضل نموذج متطابق.`
                            : `Opening safe inspection staging for (${title}). Sandbox preview URL: ${project.demoLink}`
                        );
                        window.open(project.demoLink, '_blank');
                      }}
                    >
                      <span>{isAr ? 'رابط عرض المشروع' : 'Live Preview'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Dynamic prompt to generate custom blueprint */}
        <div className="mt-20 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative space-y-6 max-w-2xl mx-auto">
            <Sparkles className="w-8 h-8 text-sky-400 mx-auto animate-pulse" />
            <h3 className="text-xl sm:text-2xl font-bold font-sans">
              {isAr ? 'ترغب في بناء نظام مخصص لشركتك؟' : 'Ready to Architect Your Own Platform?'}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'مستشارونا ومهندسو الأنظمة لدينا على استعداد لمساعدتك في صياغة أنسب حزم البرمجيات والخوادم لجميع احتياجات قطاعك العملي.'
                : 'Formulate an advanced architecture blueprint instantly by submitting your request parameters in our strategic engine below.'}
            </p>
            <div>
              <button
                onClick={() => {
                  const el = document.getElementById('consultation');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-sky-500/20 active:scale-98 cursor-pointer"
              >
                {isAr ? 'ابدأ محاكاة البنية وتوليد المخطط الآن' : 'Begin Free Architectural Mapping'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
