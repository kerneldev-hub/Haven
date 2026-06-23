import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Disc as Discord, Linkedin, Shield, Circle, Activity } from 'lucide-react';
import { HavenLogo } from './HavenLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="global-footer" className="bg-background border-t border-border/30 text-foreground relative z-30 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-primary/5 rounded-t-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="container mx-auto max-w-7xl px-4 md:px-8 pt-20 pb-12">
        
        {/* Newsletter Section */}
        <div className="mb-16 p-8 rounded-2xl bg-muted/30 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
          <div className="max-w-xl relative z-10">
            <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Join the Haven Community</h3>
            <p className="text-sm text-muted-foreground">Subscribe to our newsletter to get updates on new community launches, features, and developer tools.</p>
          </div>
          <form className="flex w-full md:w-auto gap-2 relative z-10" onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md hover:bg-primary/90 transition-all hover:-translate-y-0.5"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Main Grid containing 5 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 pb-16 border-b border-white/5">
          
          {/* Column 1: Brand Info */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-6">
            <Link id="footer-logo-link" to="/" className="inline-block group hover:opacity-80 transition-opacity">
              <HavenLogo size={28} showWordmark={true} />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-medium">
              Where code, issues, and real-time coordination come together to turn ideas into reality. Built for the next generation of engineering.
            </p>
            <div className="flex items-center gap-4">
               <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-foreground hover:-translate-y-1 transition-all duration-300 border border-white/5 shadow-sm">
                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
               </a>
               <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-foreground hover:-translate-y-1 transition-all duration-300 border border-white/5 shadow-sm"><Github className="w-4 h-4"/></a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-foreground">
              Product
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/workspace" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Workspace
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/pricing" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Pricing
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/download" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Downloads
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/integrations" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Integrations
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-foreground">
              Resources
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/docs" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Documentation
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/docs/changelog" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Changelog
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/docs/blog" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Blog System
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    GitHub
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform Insights */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-foreground">
              Platform Insights
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/docs/community/subs" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Sub-Havens
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/docs/workspaces" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Workspaces
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/docs/channels" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Channels & Issues
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/docs/community/moderation" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Moderation
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 5: Compliance */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-foreground">
              Compliance
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/docs/privacy" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Privacy Policy
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/docs/terms" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Terms of Service
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/docs/payments" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors flex items-center group">
                  <span className="relative">
                    Payments Note
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-[13px] text-muted-foreground font-medium gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <span>&copy; {currentYear} HAVEN INC.</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-border"></span>
            <span>All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
