import React from 'react';

interface HavenLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export function HavenLogo({ className = '', size = 28, showWordmark = false }: HavenLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/20 blur-[10px] rounded-full scale-150"></div>
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-foreground shrink-0 relative z-10 transition-transform group-hover:scale-110 duration-300"
        >
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M12 2L2 7V17L12 22L22 17V7L12 2ZM4 8.2V16L12 20V12.2L4 8.2ZM14 20L22 16V8.2L14 12.2V20ZM20 7.1L12 3.1L4 7.1L12 11.1L20 7.1Z" 
            fill="currentColor"
          />
        </svg>
      </div>
      {showWordmark && (
        <span className="font-extrabold tracking-tighter text-foreground uppercase text-xl mt-0.5">
          HAVEN
        </span>
      )}
    </div>
  );
}
