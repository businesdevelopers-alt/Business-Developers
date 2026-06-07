import { useId } from 'react';

interface BSDLogoProps {
  variant?: 'icon' | 'full' | 'horizontal';
  className?: string; // Appended to the root element
  size?: number | string; // Used for icon size or width bounds
  color?: string; // Text/primary color, defaults to deep navy on light and sky-blue on dark
}

export default function BSDLogo({
  variant = 'icon',
  className = '',
  size,
  color,
}: BSDLogoProps) {
  const maskId = useId();

  // Color classes: By default, we use current color. 
  // For the icon parts, we can use a deep navy shape or customizable current color.
  const fillColor = color || 'currentColor';

  if (variant === 'icon') {
    const iconSize = size || 40;
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-all duration-300`}
      >
        <defs>
          <mask id={`${maskId}-icon-mask`}>
            {/* White rect includes everything */}
            <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
            {/* Black cutouts for the sharp horizontal (9 o'clock) and vertical (6 o'clock) gaps */}
            <rect x="5" y="47.5" width="42" height="5" fill="#000000" />
            <rect x="47.5" y="53" width="5" height="42" fill="#000000" />
          </mask>
        </defs>

        {/* Inner solid circular sector (Pacman-like) - covers top, right, and bottom-right (270 degrees) */}
        <path
          d="M 50 50 L 35 50 A 15 15 0 1 1 50 65 L 50 50 Z"
          fill={fillColor}
        />

        {/* Concentric Arcs Group with sharp mask cuts */}
        <g mask={`url(#${maskId}-icon-mask)`}>
          {/* Middle layer: split into clockwise (top-right) and counter-clockwise (bottom-left) */}
          <path
            d="M 23 50 A 27 27 0 1 1 50 77"
            fill="none"
            stroke={fillColor}
            strokeWidth="5.5"
            strokeLinecap="butt"
          />
          <path
            d="M 23 50 A 27 27 0 0 0 50 77"
            fill="none"
            stroke={fillColor}
            strokeWidth="5.5"
            strokeLinecap="butt"
          />

          {/* Outer layer: split into clockwise (top-right) and counter-clockwise (bottom-left) */}
          <path
            d="M 11 50 A 39 39 0 1 1 50 89"
            fill="none"
            stroke={fillColor}
            strokeWidth="5.5"
            strokeLinecap="butt"
          />
          <path
            d="M 11 50 A 39 39 0 0 0 50 89"
            fill="none"
            stroke={fillColor}
            strokeWidth="5.5"
            strokeLinecap="butt"
          />
        </g>
      </svg>
    );
  }

  if (variant === 'horizontal') {
    // Elegant left-icon, right-text side-by-side view, perfect for Navbar
    return (
      <div className={`flex items-center space-x-2.5 rtl:space-x-reverse ${className}`}>
        {/* The Icon */}
        <div className="shrink-0">
          <BSDLogo variant="icon" size={size || 40} color={color} />
        </div>
        
        {/* Brand Text Columns */}
        <div className="flex flex-col select-none">
          <span 
            className="font-extrabold text-[16px] sm:text-[17px] tracking-tight leading-tight"
            style={{ color: color || 'inherit' }}
          >
            بيزنس ديفلوبرز
          </span>
          <span className="text-[9.5px] uppercase tracking-wider font-extrabold opacity-80 text-sky-600 dark:text-sky-400">
            Business Developers
          </span>
        </div>
      </div>
    );
  }

  // Full representation (large symbol on top, stylized "BSD" + "BUSINESS DEVELOPERS" below)
  const fullWidth = size || 240;
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* Large symbol header */}
      <BSDLogo variant="icon" size={130} color={color} />

      {/* Decorative spacing */}
      <div className="mt-4 mb-2 flex flex-col items-center">
        {/* Stylized Logo text (BSD) */}
        <div className="flex items-center justify-center space-x-3.5 rtl:space-x-reverse mb-1 select-none">
          {/* Stem/B representing the logo symbol itself in small form */}
          <BSDLogo variant="icon" size={28} color={color} />
          
          {/* Stencil "S" */}
          <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="shrink-0">
            <path
              d="M 22 2 H 6 A 4 4 0 0 0 2 6 V 10 A 4 4 0 0 0 6 14 H 18 A 4 4 0 0 1 22 18 V 22 A 4 4 0 0 1 18 26 H 2"
              fill="none"
              stroke={fillColor}
              strokeWidth="5.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Stencil "D" */}
          <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="shrink-0">
            <path
              d="M 4 2 H 12 A 11 11 0 0 1 22 13 V 15 A 11 11 0 0 1 12 26 H 4 V 2"
              fill="none"
              stroke={fillColor}
              strokeWidth="5.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Elegant horizontal gap inside the loop of D */}
            <line x1="8" y1="14" x2="21" y2="14" stroke="#ffffff" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Underline Subheader: BUSINESS DEVELOPERS */}
        <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase opacity-90 select-none pb-2 border-b-2 border-current/20 px-4 min-w-[180px]">
          BUSINESS DEVELOPERS
        </div>
      </div>
    </div>
  );
}
