import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '../components/ui/components';
import { 
  Github, ArrowRight, Shield, Laptop, Lock, Mail, KeyRound, 
  CheckCircle2, RefreshCw, Fingerprint, ShieldCheck, Globe, UserPlus
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { HavenLogo } from '../components/layout/HavenLogo';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDefaultSignup = location.pathname.includes('signup');

  const [isSignupView, setIsSignupView] = useState(isDefaultSignup);
  const [activeTab, setActiveTab] = useState<'magic-link' | 'password'>('magic-link');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePrimaryAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (activeTab === 'magic-link') {
        setIsSent(true);
      } else {
        // Successful password login -> redirect to /workspace
        localStorage.setItem('haven_session', 'active');
        localStorage.setItem('haven_user', email ? email.split('@')[0] : 'gamerdzbba7');
        navigate('/workspace');
      }
    }, 1500);
  };

  const handleGatewayAuth = (provider: string) => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('haven_session', 'active');
      localStorage.setItem('haven_user', 'gamerdzbba7');
      navigate('/workspace');
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4 py-12 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Top Brand Header */}
      <div className="w-full max-w-lg items-center flex flex-col mb-10 text-center relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <Link to="/" className="mb-6 hover:scale-105 transition-transform duration-300">
           <HavenLogo size={36} showWordmark={true} />
        </Link>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-3">
           {isSignupView ? 'Deploy a new Node' : 'Connect to Haven'}
        </h1>
        <p className="text-muted-foreground text-base max-w-md font-medium px-4">
           {isSignupView ? 'Create your operational workspace and start managing infrastructure instantly.' : 'Sign in securely or authenticate via developer node integrations.'}
        </p>
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-stretch relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Left Column: Primary Auth Core */}
        <div className="lg:col-span-7 bg-card/60 backdrop-blur-xl border border-border/60 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <div className="bg-muted/10 py-5 px-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {isSignupView ? <UserPlus className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5 text-primary" />}
                <span className="text-sm font-extrabold uppercase tracking-wider">Identity Access Gateway</span>
              </div>
            </div>

            <div className="p-8 pb-4">
              <h2 className="text-2xl font-extrabold tracking-tight mb-2">
                 {isSignupView ? 'Create Account' : 'Access Control'}
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                 {isSignupView ? 'Enter your details below to initialize a new local instance.' : 'Enter your credentials below to authenticate into the Haven Network.'}
              </p>
            </div>

            <div className="px-8 pb-8">
              {/* Tab Toggles */}
              <div className="flex border-b border-border/40 mb-8 font-bold text-sm select-none relative">
                <button 
                  onClick={() => { setActiveTab('magic-link'); setIsSent(false); setErrorMessage(''); }}
                  className={`pb-3 px-4 relative z-10 transition-colors ${activeTab === 'magic-link' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Magic Link
                  {activeTab === 'magic-link' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]"></span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('password'); setIsSent(false); setErrorMessage(''); }}
                  className={`pb-3 px-4 relative z-10 transition-colors ${activeTab === 'password' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                   {isSignupView ? 'Password Sign Up' : 'Password Sign-In'}
                   {activeTab === 'password' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]"></span>}
                </button>
              </div>

              {isSent ? (
                <div className="py-10 text-center flex flex-col items-center justify-center p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[1.5rem] animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 shadow-inner ring-1 ring-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="font-extrabold text-2xl text-foreground tracking-tight mb-3">Check your inbox</h3>
                  <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-8">
                    We have sent a secure authorization link to <strong className="text-foreground">{email}</strong>. Click the link to complete authentication.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsSent(false)} className="bg-background shadow-sm rounded-xl font-bold h-10 px-4">
                    <RefreshCw className="w-4 h-4 mr-2" /> Try a different email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePrimaryAuthSubmit} className="space-y-5 animate-in fade-in">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                      <input 
                        type="email" 
                        placeholder="developers@haven.sh" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 h-12 rounded-2xl border border-white/10 bg-background/50 shadow-inner text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-background transition-all font-medium"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {activeTab === 'password' && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pl-1 pr-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Password</label>
                        {!isSignupView && <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</a>}
                      </div>
                      <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
                        <input 
                          type="password" 
                          placeholder="••••••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-4 h-12 rounded-2xl border border-white/10 bg-background/50 shadow-inner text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-background transition-all font-medium"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <p className="text-sm font-semibold text-red-500 mt-2 px-1">{errorMessage}</p>
                  )}

                  <Button type="submit" className="w-full h-14 font-extrabold text-base shadow-xl rounded-2xl flex items-center justify-center gap-2 mt-4 hover:scale-[1.02] transition-transform" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Authenticating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {activeTab === 'magic-link' ? 'Send Magic Link' : (isSignupView ? 'Create Account' : 'Secure Sign In')}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-background text-center relative z-10 flex flex-col sm:flex-row justify-center items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">
              {isSignupView ? 'Already have a secure node? ' : "Don't have an account? "}
            </span>
            <button onClick={() => setIsSignupView(!isSignupView)} className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                {isSignupView ? 'Sign in instead' : 'Deploy a new node'}
            </button>
          </div>
        </div>

        {/* Right Column: Secure Identity Gateways */}
        <div className="lg:col-span-5 bg-card/40 backdrop-blur-md border border-border/40 shadow-xl rounded-[2.5rem] flex flex-col justify-between overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-overlay"></div>
          <div className="relative z-10">
            <div className="bg-muted/10 py-5 px-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Federated Identity</span>
              </div>
            </div>

            <div className="p-6 pb-4">
              <h3 className="text-xl font-bold tracking-tight mb-2">Providers</h3>
              <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                Authenticate instantly via secure high-trust identity nodes or directory protocols.
              </p>
            </div>

            <div className="space-y-6 px-6 pb-6">
              
              {/* Primary SSO Section */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="h-12 text-sm font-bold bg-background/50 hover:bg-background border-white/5 shadow-inner transition-colors flex items-center justify-start px-4 text-foreground rounded-[1rem]" onClick={() => handleGatewayAuth('microsoft')}>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 23 23" fill="currentColor">
                      <path d="M0 0h11v11H0z" fill="#f25022"/><path d="M12 0h11v11H12z" fill="#7fba00"/><path d="M0 12h11v11H0z" fill="#00a4ef"/><path d="M12 12h11v11H12z" fill="#ffb900"/>
                    </svg>
                    Continue with Microsoft
                  </Button>
                  <Button variant="outline" className="h-12 text-sm font-bold bg-background/50 hover:bg-background border-white/5 shadow-inner transition-colors flex items-center justify-start px-4 text-foreground rounded-[1rem]" onClick={() => handleGatewayAuth('google')}>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg> Continue with Google
                  </Button>
                </div>
              </div>

              {/* Developer Git Nodes */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 block pl-1">Development Nodes</span>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 text-sm font-bold bg-background/50 hover:bg-background border-white/5 shadow-inner transition-colors flex items-center justify-center rounded-[1rem]" onClick={() => handleGatewayAuth('github')}>
                    <Github className="w-5 h-5 mr-2" /> GitHub
                  </Button>
                  <Button variant="outline" className="h-12 text-sm font-bold bg-background/50 hover:bg-background border-white/5 shadow-inner transition-colors flex items-center justify-center rounded-[1rem] hover:text-orange-500" onClick={() => handleGatewayAuth('gitlab')}>
                    <Globe className="w-5 h-5 mr-2 shrink-0" /> GitLab
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-white/5 bg-background/50 text-center relative z-10 px-6">
            <span className="text-[11px] font-bold text-muted-foreground flex items-center justify-center gap-1.5 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Transport Layer Enabled
            </span>
          </div>
        </div>

      </div>

      {/* Mini Auth Footer */}
      <div className="mt-12 flex flex-col items-center gap-4 text-center max-w-lg px-4 relative z-10 animate-in fade-in duration-1000 delay-300 fill-mode-both">
        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
          By connecting to our access nodes, you authorize secure webhook synchronization with our <a href="#" className="font-bold text-foreground hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-foreground hover:underline">Privacy Policy</a>.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-bold text-[11px] uppercase tracking-widest">
          <Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
          <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <a href="https://github.com/haven" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
        </div>
      </div>
    </div>
  );
}
