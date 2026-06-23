import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Search, Menu, X, Sun, Moon, Bell, MessageSquare, Star, Code } from 'lucide-react';
import { Button } from '../ui/components';
import { HavenLogo } from './HavenLogo';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true); // default high-trust dark look
  const [scrolled, setScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionUser, setSessionUser] = useState('gamerdzbba7');

  useEffect(() => {
    const session = localStorage.getItem('haven_session');
    const user = localStorage.getItem('haven_user');
    setIsAuthenticated(session === 'active');
    if (user) setSessionUser(user);
    
    // Listen for custom events to handle real-time session changes if needed
    const handleStorageChange = () => {
      const activeSession = localStorage.getItem('haven_session');
      const activeUser = localStorage.getItem('haven_user');
      setIsAuthenticated(activeSession === 'active');
      if (activeUser) setSessionUser(activeUser);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/workspace?tab=home' },
    { label: 'Workspace', path: '/workspace?tab=workspace' },
    { label: 'AI', path: '/workspace?tab=ai' },
    { label: 'Community', path: '/workspace?tab=community' },
    { label: 'Apps', path: '/workspace?tab=apps' }
  ];

  const notifications = [
    { id: 1, type: 'mention', user: 'Alex', content: 'mentioned you in Gaming Lounge', time: '5m ago', icon: MessageSquare, color: 'text-primary' },
    { id: 2, type: 'community', user: 'System', content: 'New Anime community quest available!', time: '1h ago', icon: Star, color: 'text-amber-500' },
    { id: 3, type: 'project', user: 'Sarah', content: 'merged PR #42 in React-Data-Fetch', time: '2h ago', icon: Code, color: 'text-emerald-500' },
  ];

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-500 flex justify-center px-4 md:px-8",
      scrolled ? "pt-4" : "pt-6"
    )}>
      {/* Floating Pill Navbar Container */}
      <div className={cn(
        "w-full max-w-7xl rounded-2xl flex items-center justify-between px-6 h-16 transition-all duration-500",
        scrolled 
          ? "bg-background/70 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] supports-[backdrop-filter]:bg-background/50" 
          : "bg-transparent border border-transparent"
      )}>
        
        {/* Brand Logo */}
        <div className="flex items-center gap-10">
          <Link id="logo-nav-link" to="/" className="flex items-center space-x-2 group hover:opacity-80 transition-opacity">
            <HavenLogo size={24} showWordmark={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex items-center space-x-8 text-[13px] font-bold tracking-wide uppercase text-muted-foreground">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path.startsWith('/#') && isHome);
              return (
                <Link
                  key={link.label}
                  id={`nav-link-${link.label.toLowerCase()}`}
                  to={link.path}
                  className={cn(
                    "transition-all duration-300 relative px-4 py-2 rounded-full",
                    isActive ? "text-background bg-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  onClick={() => {
                    if (link.path.includes('#')) {
                      const id = link.path.split('#')[1];
                      const element = document.getElementById(id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Global Action Utility Rail */}
        <div className="hidden md:flex items-center space-x-5">
          
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  <button className="text-xs text-primary font-semibold hover:underline">Mark all read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className="p-4 border-b border-border/50 hover:bg-muted/10 transition-colors cursor-pointer flex gap-3">
                        <div className={`mt-0.5 w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 ${notif.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-bold text-foreground mr-1">{notif.user}</span>
                            <span className="text-muted-foreground">{notif.content}</span>
                          </p>
                          <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">{notif.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="p-3 bg-muted/20 text-center border-t border-border">
                  <button className="text-xs font-bold text-muted-foreground hover:text-foreground">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to={`/u/${sessionUser}`} className="text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 px-3.5 h-9 rounded-xl bg-card border border-border shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>@{sessionUser}</span>
              </Link>
              <Button size="sm" variant="outline" className="h-9 text-xs rounded-xl hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20" onClick={() => {
                localStorage.removeItem('haven_session');
                setIsAuthenticated(false);
                window.location.reload();
              }}>
                Logout
              </Button>
            </div>
          ) : (
            <Button id="nav-signup-button" asChild size="sm" className="h-9 px-5 text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-white/10 bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 duration-300">
              <Link to="/login?mode=signup">Join Haven</Link>
            </Button>
          )}

        </div>

        {/* Mobile menu trigger button */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="relative mr-2">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="p-3 border-b border-border flex justify-between items-center bg-muted/20">
                  <h3 className="font-bold text-sm">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className="p-3 border-b border-border/50 flex gap-3">
                        <div className={`mt-0.5 w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 ${notif.color}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-xs">
                            <span className="font-bold text-foreground mr-1">{notif.user}</span>
                            <span className="text-muted-foreground">{notif.content}</span>
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">{notif.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          <button 
            id="theme-switcher-mobile"
            onClick={() => setIsDark(!isDark)}
            className="inline-flex items-center justify-center rounded-lg text-muted-foreground h-9 w-9 hover:bg-white/5 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            id="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg text-muted-foreground h-9 w-9 border border-border/50 bg-card/50 backdrop-blur hover:bg-muted/50 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      <div className={cn(
        "fixed inset-x-4 top-24 rounded-2xl border border-white/10 bg-background/95 backdrop-blur-2xl p-6 shadow-2xl transition-all duration-300 lg:hidden transform origin-top",
        mobileMenuOpen ? "scale-y-100 opacity-100 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "scale-y-95 opacity-0 pointer-events-none"
      )}>
        <div className="space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              id={`mobile-nav-link-${link.label.toLowerCase()}`}
              to={link.path}
              onClick={() => {
                setMobileMenuOpen(false);
                if (link.path.includes('#')) {
                  const id = link.path.split('#')[1];
                  setTimeout(() => {
                    const element = document.getElementById(id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 50);
                }
              }}
              className="block text-sm font-bold text-foreground px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        <div className="border-t border-white/5 mt-4 pt-6 flex flex-col gap-3">
          {isAuthenticated ? (
            <>
              <Link 
                id="mobile-profile-link"
                to={`/u/${sessionUser}`} 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-sm font-bold text-primary py-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl border border-primary/20"
              >
                My Profile (@{sessionUser})
              </Link>
              <Button 
                className="w-full text-sm font-bold h-12 rounded-xl" 
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('haven_session');
                  setIsAuthenticated(false);
                  setMobileMenuOpen(false);
                  window.location.reload();
                }}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link 
                id="mobile-signin-link"
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-sm font-bold text-muted-foreground py-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl border border-white/5"
              >
                Log in to Dashboard
              </Link>
              <Button id="mobile-signup-button" asChild className="w-full text-sm font-bold shadow-lg h-12 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                <Link to="/login?mode=signup">Join Haven Workspace</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
