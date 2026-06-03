import { GENERAL_STATS } from '../data';
import { Lang } from '../types';

interface StatsProps {
  lang: Lang;
}

export default function StatsSection({ lang }: StatsProps) {
  const isAr = lang === 'ar';

  return (
    <section id="stats" className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {GENERAL_STATS.map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 border-r ltr:border-r-0 ltr:border-l last:border-0 border-slate-100"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-700 font-mono tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500">
                {isAr ? stat.labelAr : stat.labelEn}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
