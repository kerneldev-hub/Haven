import React, { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/components';
import { 
  Code, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  Sparkles, 
  Info, 
  Terminal, 
  HelpCircle, 
  ShieldCheck, 
  ArrowLeft,
  Coins,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['React', 'UI/UX']);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Store user preferences
      localStorage.setItem('haven_onboarded_user', 'true');
      localStorage.setItem('haven_username_preset', username || 'guest_creator');
      localStorage.setItem('haven_bio_preset', bio || 'Building open source on Haven.');
      localStorage.setItem('haven_interests_preset', JSON.stringify(selectedInterests));
      navigate('/workspace');
    }
  };

  const handlePrev = () => {
    setStep(Math.max(1, step - 1));
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Coaching tips that match the current card level
  const stepCoachingTips = [
    {
      step: 1,
      title: "Initialize Secure Node Identity",
      subtitle: "Workspace Layer 1",
      description: "Establishing a premium identity ensures correct reputation routing. Your bio automatically seeds the personalized Gemini prompt profiles inside Haven.",
      bulletPoints: [
        "Identities are secured client-side",
        "Bios tune the intelligence parameters",
        "Reputation and badges map to this handle"
      ]
    },
    {
      step: 2,
      title: "Seed Attention Parameters",
      subtitle: "Workspace Layer 2",
      description: "Selecting tags triggers the compile-time loading of sandboxed plugins, community subfeeds, and specific automated workflow blocks tailored to your skill vectors.",
      bulletPoints: [
        "Interests drive feed sorting algorithms",
        "Guides plugin recommendation engines",
        "Auto-subscribes to regional nodes"
      ]
    },
    {
      step: 3,
      title: "Establish Decentralized Sync",
      subtitle: "Workspace Layer 3",
      description: "Peer-to-peer sync channels drop you directly into active regional clusters with shared assets, live voice-chat rooms, and high-performance WebSockets.",
      bulletPoints: [
        "No master databases, total serverless freedom",
        "Instant mock payment gateways built-in",
        "Secure digital wallets sync automatically"
      ]
    }
  ];

  const currentCoach = stepCoachingTips[step - 1];

  const workspaceFeatures = [
    {
      id: 'haven_intel',
      title: 'HAVEN Intelligence Engine',
      summary: 'Central serverless Gemini orchestration layers that automate notes summary, developer flows, and operations routing.'
    },
    {
      id: 'automation_trigger',
      title: 'Haven Automations System',
      summary: 'Build high-performance web triggers, local event pipelines, and notification hooks with zero complex servers.'
    },
    {
      id: 'chargily_checkout',
      title: 'Unified Checkout Gateway',
      summary: 'Local Algeria EDAHABIA/CIB checkout via Chargily Pay combined with secure USDT web3 payment verifiers.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 md:p-8 bg-zinc-950 text-foreground relative overflow-hidden select-none">
      {/* Visual Glare Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Grid Wrapper */}
      <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* LEFT COLUMN: ARCHITECTURAL COMPANION & INSTRUCTION GUIDE */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-border/50 bg-card/40 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] relative overflow-hidden shadow-xl">
          <div className="space-y-6">
            {/* Header branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/20 text-primary">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block font-bold">HAVEN WORKSPACE CONTROLLER</span>
                <span className="text-sm font-black font-sans text-foreground">Node Compilation Terminal</span>
              </div>
            </div>

            {/* Coach Voice Module */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-primary/10 text-primary rounded-lg text-xs font-mono font-bold uppercase tracking-wider">{currentCoach.subtitle}</span>
                <span className="text-xs text-muted-foreground font-mono font-bold animate-pulse">● LIVE SYNC</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{currentCoach.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans font-medium text-left">
                {currentCoach.description}
              </p>
            </div>

            {/* Structured Steps Highlights */}
            <div className="space-y-2.5 pt-4">
              <span className="text-[9.5px] font-mono text-muted-foreground font-bold uppercase tracking-widest block">LAYER PROTOCOLS VALIDATED</span>
              <ul className="space-y-2 text-left">
                {currentCoach.bulletPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs font-sans font-medium text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Persistent Interactive Guided Tour Widgets (Click to open descriptions) */}
          <div className="space-y-3 pt-8 border-t border-border/40 mt-8">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-[9.5px] font-mono font-bold text-muted-foreground uppercase tracking-wider">WORKSPACE TOUR (CLICK FEATURES TO UNDERSTAND)</span>
            </div>
            
            <div className="grid gap-2 text-left">
              {workspaceFeatures.map((feat) => {
                const isSelected = activeTooltip === feat.id;
                return (
                  <div 
                    key={feat.id} 
                    onClick={() => setActiveTooltip(isSelected ? null : feat.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected 
                        ? 'border-primary/50 bg-primary/5 text-foreground' 
                        : 'border-border/40 bg-[#0e0f12]/60 hover:border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-sans flex items-center gap-1.5">
                        <Sparkles className={`w-3 h-3 ${isSelected ? 'text-primary animate-spin-[5s]' : 'text-zinc-500'}`} />
                        {feat.title}
                      </span>
                      <Info className="w-3.5 h-3.5 opacity-55 shrink-0" />
                    </div>
                    {isSelected && (
                      <p className="text-[11px] text-zinc-300 font-sans leading-relaxed mt-2 animate-in fade-in duration-300">
                        {feat.summary}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE INPUT CARD FLOW */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          {/* Main Onboarding Progress line */}
          <div className="flex items-center justify-between mb-6 px-4 select-none relative pb-4">
            {[
              { id: 1, label: 'Identity Setup' },
              { id: 2, label: 'Interest Selectors' },
              { id: 3, label: 'Sync Modules' }
            ].map((stepDef, idx) => (
              <div key={stepDef.id} className="flex flex-col items-center gap-1.5 relative z-10 flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > idx 
                    ? 'bg-primary text-white shadow-[0_0_10px_rgba(var(--primary),0.4)] border border-primary/25' 
                    : 'bg-[#15161c] text-zinc-500 border border-border/40'
                }`}>
                  {step > idx + 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : stepDef.id}
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-wide font-bold ${
                  step === stepDef.id ? 'text-foreground' : 'text-muted-foreground/60'
                }`}>{stepDef.label}</span>
              </div>
            ))}
            
            {/* Horizontal Line connector */}
            <div className="absolute left-[15%] right-[15%] top-4.5 -translate-y-1/2 h-[1px] bg-border/40 -z-0">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${((step - 1) / 2) * 100}%` }} 
              />
            </div>
          </div>

          <Card className="w-full flex-1 border border-border/60 bg-card/65 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col justify-between">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 md:p-10 flex-1 flex flex-col justify-center">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-mono font-bold text-primary uppercase tracking-widest">
                    <Bot className="w-4 h-4 animate-bounce" /> IDENTITY REQUISITION FORM
                  </div>
                  <CardTitle className="text-3xl font-extrabold tracking-tight">Create User Profile</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm font-sans mt-1">
                    Establish your credential identity and profile details safely inside HAVEN workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-5">
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest block">Profile Name Handle</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">@</span>
                      <input 
                        type="text" 
                        placeholder="gamer_dz"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        className="flex h-12 w-full rounded-xl border border-border/60 bg-[#0e0f12] pl-8 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-primary/80 transition-colors" 
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 block leading-tight font-sans">
                      Alphabetic lowercase values, integers, and hyphens permitted only. Space elements truncated.
                    </span>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest block">Short Bio/Purpose Cell</label>
                    <textarea 
                      placeholder="e.g. Algerian developer exploring high-scale edge integrations."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="flex min-h-[100px] w-full rounded-xl border border-border/60 bg-[#0e0f12] px-4 py-3 text-sm font-sans focus:outline-none focus:border-primary/80 transition-colors" 
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>BIOGRAPHY SUMMARY DESCRIPTOR</span>
                      <span>{bio.length}/250 chars</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 md:p-10 flex-1 flex flex-col justify-center">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-mono font-bold text-primary uppercase tracking-widest">
                    <Cpu className="w-4 h-4" /> ATTENTION VECTORS SELECTOR
                  </div>
                  <CardTitle className="text-3xl font-extrabold tracking-tight">Core Competencies & Interests</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm font-sans mt-1">
                    Select the key vectors to inject sandbox plugins, repositories, and communication channels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { name: 'React Development', value: 'React' },
                      { name: 'Go Microservices', value: 'Go' },
                      { name: 'Astro Serverless', value: 'Astro' },
                      { name: 'Startups Scaling', value: 'Startups' },
                      { name: 'UI/UX Craft', value: 'UI/UX' },
                      { name: 'Machine Learning', value: 'Machine Learning' },
                      { name: 'Open Source Repos', value: 'Open Source' },
                      { name: 'System Webhooks', value: 'System Design' },
                      { name: 'Cybersecurity Node', value: 'Cybersecurity' }
                    ].map(interest => {
                      const isSelected = selectedInterests.includes(interest.value);
                      return (
                        <button 
                          key={interest.value} 
                          type="button"
                          onClick={() => toggleInterest(interest.value)}
                          className={`p-3.5 rounded-2xl border text-center font-sans font-bold text-xs transition-all select-none cursor-pointer ${
                            isSelected 
                              ? 'border-primary/60 bg-primary/10 text-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]' 
                              : 'border-border/50 bg-[#0e0f12] text-muted-foreground hover:border-border hover:bg-muted/10'
                          }`}
                        >
                          {interest.name}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 md:p-10 flex-1 flex flex-col justify-center">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-mono font-bold text-primary uppercase tracking-widest">
                    <Compass className="w-4 h-4 animate-spin-[20s]" /> PEER DIRECTORY DISCOVERY
                  </div>
                  <CardTitle className="text-3xl font-extrabold tracking-tight">Join Node Communities</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm font-sans mt-1">
                    Haven operates globally. We offer secure regional hubs configured for high performance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  {[
                    { name: 'Algeria Dev Community Node', members: '18k members', desc: 'Web builders executing Cloudflare Edge & local Chargily codeflows.', icon: Coins, action: 'Connected' },
                    { name: 'Global Founders Workspace Lounge', members: '34k members', desc: 'Global group focused on serverless architectures, scale, and transactional engines.', icon: Compass, action: 'Connected' }
                  ].map(c => (
                     <div key={c.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border/40 rounded-2xl bg-[#0e0f12]/60 gap-4 text-left">
                        <div className="flex items-start gap-3.5">
                           <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0">
                             <c.icon className="w-5 h-5" />
                           </div>
                           <div className="space-y-0.5">
                              <p className="font-extrabold text-sm text-foreground">{c.name}</p>
                              <p className="text-[10px] font-mono text-primary font-bold">{c.members}</p>
                              <p className="text-xs text-zinc-400 font-sans leading-normal">{c.desc}</p>
                           </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-9 font-bold px-4 rounded-xl shrink-0 cursor-default border-primary/20 bg-primary/5 text-primary">
                          {c.action}
                        </Button>
                     </div>
                  ))}
                </CardContent>
              </div>
            )}

            <CardFooter className="flex justify-between border-t border-border/50 p-6 md:p-8 bg-[#090a0d] h-20 items-center">
              <Button 
                variant="ghost" 
                onClick={handlePrev} 
                disabled={step === 1}
                className="h-11 rounded-xl text-xs font-bold border-none transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={step === 1 && !username}
                className="h-11 rounded-xl px-6 font-bold text-xs bg-primary hover:bg-primary/90 text-white min-w-[130px]"
              >
                {step === 3 ? (
                  <span className="flex items-center gap-1.5">Activate Node <Sparkles className="w-4 h-4 animate-pulse" /></span>
                ) : (
                  <span className="flex items-center gap-1.5">Continue <ArrowRight className="w-4 h-4" /></span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
