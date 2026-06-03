import React, { useState, useEffect } from 'react';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
          } else {
            setScrollProgress(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once at start in case the page load is already scrolled down
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      id="scroll-progress-container"
      className="fixed top-0 left-0 right-0 w-full h-[4px] bg-slate-100/30 z-[999] pointer-events-none"
    >
      <div
        id="scroll-progress-fill"
        className="h-full bg-gradient-to-r from-sky-500 via-indigo-600 to-emerald-500 transition-all duration-75 ease-out shadow-xs shadow-sky-500/30"
        style={{
          width: `${scrollProgress}%`,
        }}
      />
    </div>
  );
}
