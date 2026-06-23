import React, { useState } from 'react';

interface Integration {
  name: string;
  slug: string;
  color?: string;
  url: string;
}

const integrations: Integration[] = [
  { name: "FreeCodeCamp", slug: "freecodecamp", url: "https://www.freecodecamp.org" },
  { name: "Docker", slug: "docker", url: "https://www.docker.com" },
  { name: "Steam", slug: "steam", url: "https://store.steampowered.com" },
  { name: "GitHub", slug: "github", url: "https://github.com" },
  { name: "Google", slug: "google", url: "https://google.com" },
  { name: "Cloudflare", slug: "cloudflare", url: "https://www.cloudflare.com" },
  { name: "Baserow", slug: "baserow", url: "https://baserow.io" },
  { name: "Android", slug: "android", url: "https://www.android.com" },
  { name: "Tor", slug: "torproject", url: "https://www.torproject.org" },
  { name: "Firebase", slug: "firebase", url: "https://firebase.google.com" },
  { name: "Supabase", slug: "supabase", url: "https://supabase.com" },
  { name: "Microsoft", slug: "microsoft", url: "https://www.microsoft.com" },
  { name: "Oracle", slug: "oracle", url: "https://www.oracle.com" },
  { name: "Resend", slug: "resend", url: "https://resend.com" },
  { name: "Windows", slug: "windows", url: "https://www.microsoft.com/windows" }
];

export default function IntegratesWithEcosystem() {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (name: string) => {
    setFailedImages((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  return (
    <section className="py-12 border-y border-border/30 bg-muted/5 relative overflow-hidden" id="integrates-marquee">
      <div className="absolute inset-0 bg-transparent bg-[radial-gradient(100%_100%_at_50%_0%,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <p className="text-center text-xs font-bold text-muted-foreground mb-8 tracking-widest uppercase">
          Integrates with your ecosystem
        </p>
        
        <div className="w-full relative">
          {/* Edge Gradients for smooth fade in/out */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex overflow-hidden w-full relative z-0 opacity-80 hover:opacity-100 transition-opacity duration-500">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {/* Duplicate structure for endless marquee scroll */}
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-x-12 md:gap-x-20 px-6 md:px-10 shrink-0">
                  {integrations.map((item, idx) => {
                    const isFailed = failedImages[item.name];
                    return (
                      <a
                        key={`${item.name}-${i}-${idx}`}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center filter grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 ease-out cursor-pointer py-4 group relative h-16 min-w-[32px]"
                        aria-label={`Visit ${item.name}`}
                      >
                        {/* Elegant Tooltip */}
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-card border border-border text-xs rounded-xl font-mono shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 text-foreground">
                          <span className="font-semibold text-foreground">{item.name}</span>
                          <span className="text-[10px] text-muted-foreground block text-center">Open Integration</span>
                        </div>
                        
                        {/* Fallback styling vs. Logo display */}
                        {isFailed ? (
                          <span className="text-sm font-semibold text-muted-foreground hover:text-foreground font-mono tracking-tight px-3 py-1 bg-white/5 border border-white/15 rounded-xl block shadow-inner">
                            {item.name}
                          </span>
                        ) : (
                          <img
                            src={`https://cdn.simpleicons.org/${item.slug}/a1a1aa`}
                            alt={item.name}
                            onError={() => handleImageError(item.name)}
                            className="h-7 md:h-8 max-w-[140px] object-contain transition-all duration-300 hover:brightness-150 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            loading="lazy"
                          />
                        )}
                      </a>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
