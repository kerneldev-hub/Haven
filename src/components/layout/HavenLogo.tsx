import React from 'react';

interface Props {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function HavenLogo({ size = 24, showWordmark = false, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Haven logo"
        className="drop-shadow-[0_2px_8px_rgba(2,132,199,0.2)]"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(15, 23, 42, 0.45)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0.85)" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#bg-grad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <path
          d="M9.5 8.5V23.5"
          stroke="url(#logo-grad)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M22.5 8.5V23.5"
          stroke="url(#logo-grad)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M9.5 14.5L16 9.5L22.5 14.5"
          stroke="url(#logo-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 19L16 14L22.5 19"
          stroke="url(#logo-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className="font-extrabold text-foreground tracking-tighter hover:text-primary transition-colors duration-300" style={{ fontSize: `${size * 0.7}px`, fontFamily: 'Inter, system-ui, sans-serif' }}>
          HAVEN
        </span>
      )}
    </div>
  );
}
