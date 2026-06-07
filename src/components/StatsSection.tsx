import { GENERAL_STATS } from '../data';
import { Lang } from '../types';
import { 
  Briefcase, 
  Activity, 
  Cpu, 
  Building2 
} from 'lucide-react';

interface StatsProps {
  lang: Lang;
}

export default function StatsSection({ lang }: StatsProps) {
  const isAr = lang === 'ar';

  // Map each stat's index to a corresponding professional corporate icon
  const getIconForIndex = (index: number) => {
    switch (index) {
      case 0:
        return <Briefcase className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform duration-300" />;
      case 1:
        return <Activity className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />;
      case 2:
        return <Cpu className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />;
      case 3:
      default:
        return <Building2 className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform duration-300" />;
    }
  };

  return (
    <section id="stats" className="py-16 bg-[#fcfcfc] border-y border-slate-100 relative overflow-hidden">
      {/* Dynamic background aesthetics to elevate layout credibility */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GENERAL_STATS.map((stat, i) => (
            <div
              key={i}
              className="group p-6 bg-white border border-slate-100/90 rounded-2xl shadow-xs hover:shadow-md hover:border-sky-500/25 transition-all duration-300 flex items-center gap-5 cursor-default text-right rtl:text-right ltr:text-left"
            >
              {/* Icon slot container with custom shadow offsets */}
              <div className="p-3.5 bg-slate-50 rounded-xl group-hover:bg-slate-100/80 transition-colors duration-300 shrink-0">
                {getIconForIndex(i)}
              </div>

              {/* Data descriptors */}
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-800 font-mono tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs font-black text-slate-500 tracking-wide uppercase Cairo">
                  {isAr ? stat.labelAr : stat.labelEn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
