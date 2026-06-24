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
      >
        <rect width="32" height="32" rx="8" className="fill-primary/10" />
        <path
          d="M8 22V10M8 16H16M16 22V10M22 10C22 10 24 12 24 16C24 20 22 22 22 22"
          className="stroke-primary"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className="font-extrabold text-foreground tracking-tight" style={{ fontSize: `${size * 0.65}px` }}>
          Haven
        </span>
      )}
    </div>
  );
}
