import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Users, ShoppingBag, User } from 'lucide-react';
import { motion } from 'motion/react';

interface TabItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function MobileNav() {
  const location = useLocation();
  const [sessionUser, setSessionUser] = useState('gamerdzbba7');

  useEffect(() => {
    const user = localStorage.getItem('haven_user');
    if (user) {
      setSessionUser(user);
    }
    
    const handleStorageChange = () => {
      const activeUser = localStorage.getItem('haven_user');
      if (activeUser) {
        setSessionUser(activeUser);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const tabs: TabItem[] = [
    { label: 'Home', path: '/workspace?tab=home', icon: Home },
    { label: 'Spaces', path: '/workspace?tab=workspace', icon: Layers },
    { label: 'Community', path: '/workspace?tab=community', icon: Users },
    { label: 'Marketplace', path: '/workspace?tab=apps', icon: ShoppingBag },
    { label: 'Profile', path: `/u/${sessionUser}`, icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07080c]/85 backdrop-blur-xl border-t border-zinc-800/80 py-2.5 px-3 flex items-center justify-around shadow-[0_-12px_40px_rgba(0,0,0,0.6)] select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        
        // Check if active: matches exact url, path param state, or profile sub-path
        const isProfileActive = tab.label === 'Profile' && location.pathname.startsWith('/u/');
        const isHomeActive = tab.label === 'Home' && (location.pathname === '/' || (location.pathname === '/workspace' && location.search.includes('tab=home')));
        const isSpacesActive = tab.label === 'Spaces' && location.pathname === '/workspace' && location.search.includes('tab=workspace');
        const isCommunityActive = tab.label === 'Community' && (location.pathname === '/community' || (location.pathname === '/workspace' && location.search.includes('tab=community')));
        const isAppsActive = tab.label === 'Marketplace' && location.pathname === '/workspace' && (location.search.includes('tab=apps') || location.search.includes('tab=plugins'));
        
        const isActive = isProfileActive || isHomeActive || isSpacesActive || isCommunityActive || isAppsActive;

        return (
          <Link
            key={tab.label}
            to={tab.path}
            id={`mobile-tab-${tab.label.toLowerCase()}`}
            className="flex-1 py-1 flex flex-col items-center justify-center relative transition-colors focus:outline-none"
          >
            {/* Active Indicator Hover Glow Accent */}
            {isActive && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute -top-1 w-12 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_12px_#6366f1]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            <div 
              className={`flex flex-col items-center justify-center gap-1.5 transition-all ${
                isActive 
                  ? 'text-indigo-400 font-bold scale-105' 
                  : 'text-zinc-400 hover:text-indigo-300'
              }`}
            >
              <div className="relative">
                {isActive && (
                  <span className="absolute inset-0 bg-indigo-500/10 rounded-full blur-md opacity-70" />
                )}
                <Icon 
                  className={`w-5.5 h-5.5 transition-transform ${
                    isActive ? 'stroke-[2.5px] scale-110 text-indigo-400' : 'stroke-[1.8px]'
                  }`} 
                />
              </div>
              <span className={`text-[10px] tracking-wide font-medium mt-0.5 uppercase transition-all ${isActive ? 'text-indigo-400' : 'text-zinc-500 font-mono'}`}>
                {tab.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
