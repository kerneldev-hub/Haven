import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Github, MessageSquare, Shield, Zap, Blocks, Bot, CheckCircle2, ChevronRight, X, Sparkles, Code2, Cpu, Globe, Lock as Locks, Search, Layout, Monitor, Apple, TerminalSquare, Smartphone } from 'lucide-react';
import { Button } from '../components/ui/components';
import IntegratesWithEcosystem from '../components/IntegratesWithEcosystem';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "How does Haven differ from fragmented communication tools?",
      answer: "Haven converges chat, project management, and repository syncing into a single interface. You never have to switch applications to link a commit to a message or an issue."
    },
    {
      question: "Is my code secure with the AI Assistant?",
      answer: "Yes. Our AI operates on a strictly zero-telemetry architecture. Your codebase is only analyzed locally within your session and is never used to train external models."
    },
    {
      question: "Do you support on-premise deployment?",
      answer: "Yes, Haven Workspace Engine v2.0 includes standalone Docker containers for enterprise clients that require completely isolated networking."
    },
    {
      question: "Can I integrate my existing remote repositories?",
      answer: "Absolutely. Haven natively syncs with major remote Git services to pull branches, commits, and file trees in real-time."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[150px]"></div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-16">
        
        {/* HERO SECTION */}
        <section className="text-center px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center relative z-10 animate-fade-in text-balance">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-muted-foreground drop-shadow-sm">
            Find Your People
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground/90 max-w-3xl mb-12 leading-relaxed font-semibold">
            Join Haven communities to chat, share, & connect in real-time. Whether it's Tech, Gaming, Anime, Comics, Education, Arts or Global discussions.
            <span className="opacity-80 mt-4 block text-base font-normal text-muted-foreground/70 border-t border-white/5 pt-4">
              Not just an IDE. Not just a dashboard. A complete execution system for creators, developers, and teams.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-lg">
            <Button asChild size="lg" className="w-full sm:w-auto font-bold h-14 px-8 text-base bg-foreground text-background hover:bg-foreground/90 rounded-2xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:-translate-y-1">
              <Link to="/login?mode=signup">
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto font-bold h-14 px-8 text-base bg-background/50 backdrop-blur-sm border-border/60 hover:bg-muted text-foreground rounded-2xl transition-all duration-300 transform hover:-translate-y-1">
              <Link to="#features">
                Explore Platform
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto font-bold h-14 px-6 text-base hover:bg-muted text-foreground rounded-2xl transition-all duration-300">
              <Link to="/download" target="_blank">
                Download App
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-muted-foreground font-mono text-xs font-semibold opacity-70">
            <span className="flex items-center gap-1.5"><Monitor className="w-4 h-4"/> Windows</span>
            <span className="flex items-center gap-1.5"><TerminalSquare className="w-4 h-4"/> Linux</span>
            <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4"/> Android</span>
          </div>
        </section>

        {/* 3D DEVICE MOCKUP SECTION */}
        <section className="w-full max-w-6xl mx-auto px-4 mt-24 relative perspective-[2500px]">
           {/* Abstract 3D Shadow/Glow */}
           <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-violet-500/10 to-transparent blur-3xl -z-10 rounded-full opacity-50"></div>
           
           <div className="rounded-[2.5rem] p-1.5 md:p-3 bg-gradient-to-b from-white/10 to-transparent shadow-2xl overflow-hidden ring-1 ring-white/10 transform rotate-x-6 hover:rotate-x-0 transition-transform duration-1000 ease-out group relative">
              <div className="absolute inset-0 bg-background/50 rounded-[2rem] blur-xl -z-10"></div>
              
              <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/80 relative">
                {/* Window Controls */}
                <div className="bg-background/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-border hover:bg-rose-500 transition-colors shadow-inner"></div>
                    <div className="w-3 h-3 rounded-full bg-border hover:bg-amber-500 transition-colors shadow-inner"></div>
                    <div className="w-3 h-3 rounded-full bg-border hover:bg-emerald-500 transition-colors shadow-inner"></div>
                  </div>
                  <div className="flex items-center justify-center bg-black/40 rounded-full px-5 py-1.5 shadow-inner border border-white/5 text-[11px] font-mono font-medium text-muted-foreground w-80 backdrop-blur-md gap-3">
                     <Shield className="w-3 h-3 opacity-50"/> 
                     <span>haven.local/workspace/engine</span>
                     <div className="w-4 h-4 ml-auto bg-white/10 rounded-full flex items-center justify-center"><Locks className="w-2 h-2"/></div>
                  </div>
                  <div className="w-16 flex justify-end">
                    <div className="w-6 h-1.5 rounded-full bg-white/10"></div>
                  </div>
                </div>
                
                {/* Mockup Interface */}
                <div className="aspect-[16/10] md:aspect-[16/9] w-full bg-gradient-to-br from-[#0c0c0e] via-[#101015] to-[#151520] flex relative overflow-hidden">
                  {/* Glowing blobs inside mockup */}
                  <div className="absolute top-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
                  <div className="absolute bottom-10 right-10 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none opacity-50"></div>
                  
                  {/* 3D Grid background inside mockup */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_60%,transparent_100%)]"></div>
                  
                  {/* Mockup Sidebar */}
                  <div className="w-64 border-r border-white/5 bg-[#0a0a0c]/80 backdrop-blur-2xl p-5 hidden md:flex flex-col gap-6 relative z-10">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 flex items-center justify-center shadow-lg">
                        <Blocks className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="h-3 w-20 bg-white/80 rounded mb-1.5"></div>
                        <div className="h-2 w-12 bg-white/30 rounded"></div>
                      </div>
                    </div>

                    <div className="space-y-4 mt-2">
                       <div className="text-[10px] font-bold text-white/30 px-2 uppercase tracking-widest">Active Projects</div>
                       <div className="h-9 w-full bg-white/10 rounded-xl border border-white/10 flex items-center px-3 gap-3 shadow-inner">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                         <div className="h-2 w-16 bg-white/70 rounded-full"></div>
                       </div>
                       <div className="h-9 w-5/6 bg-white/5 hover:bg-white/10 transition-colors rounded-xl flex items-center px-3 gap-3">
                         <div className="w-2 h-2 rounded-full bg-white/20"></div>
                         <div className="h-2 w-20 bg-white/40 rounded-full"></div>
                       </div>
                       <div className="h-9 w-4/6 bg-white/5 hover:bg-white/10 transition-colors rounded-xl flex items-center px-3 gap-3">
                         <div className="w-2 h-2 rounded-full bg-white/20"></div>
                         <div className="h-2 w-14 bg-white/40 rounded-full"></div>
                       </div>
                    </div>
                  </div>
                  
                  {/* Mockup Content area */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col gap-6 relative z-10">
                     {/* Top bar inside mockup */}
                     <div className="flex justify-between items-center bg-white/5 p-3 px-4 rounded-[1.5rem] border border-white/10 backdrop-blur-md shadow-sm">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                           <Search className="w-3.5 h-3.5 text-white/50" />
                         </div>
                         <div className="h-4 w-32 bg-white/20 rounded-md"></div>
                       </div>
                       <div className="flex gap-3">
                         <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-[2px]">
                           <div className="w-full h-full bg-black rounded-full border border-black overflow-hidden flex items-center justify-center">
                              <span className="text-[10px] font-bold text-white">JD</span>
                           </div>
                         </div>
                         <div className="h-8 w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                           Deploy
                         </div>
                       </div>
                     </div>
                     
                     {/* Main code/chat area */}
                     <div className="flex-1 rounded-[1.5rem] border border-white/5 bg-[#050505]/60 flex flex-col justify-end p-6 gap-5 relative overflow-hidden shadow-inner backdrop-blur-sm">
                        {/* Fake Code Editor Block */}
                        <div className="absolute top-6 left-6 right-8 p-5 rounded-2xl bg-[#0a0a0c] border border-white/5 shadow-2xl transition-transform duration-700">
                          <div className="flex items-center justify-between gap-2 mb-4 border-b border-white/5 pb-3">
                             <div className="flex gap-2 text-[10px] font-mono text-white/40">
                               <span className="text-white/80">server.ts</span>
                               <span>—</span>
                               <span>src/api</span>
                             </div>
                             <div className="flex gap-1.5">
                               <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                               <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                               <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                             </div>
                          </div>
                          <div className="space-y-2.5 font-mono text-xs">
                            <div className="flex"><span className="text-pink-400">import</span>&nbsp;<span className="text-blue-300">express</span>&nbsp;<span className="text-pink-400">from</span>&nbsp;<span className="text-emerald-300">'express'</span><span className="text-white/50">;</span></div>
                            <div className="flex"><span className="text-pink-400">import</span>&nbsp;<span className="text-blue-300">{`{ initDB }`}</span>&nbsp;<span className="text-pink-400">from</span>&nbsp;<span className="text-emerald-300">'@haven/db'</span><span className="text-white/50">;</span></div>
                            <div className="h-2"></div>
                            <div className="flex"><span className="text-blue-400">const</span>&nbsp;<span className="text-white">app</span>&nbsp;<span className="text-white/50">=</span>&nbsp;<span className="text-amber-200">express</span><span className="text-white/50">();</span></div>
                            <div className="flex"><span className="text-white">app</span><span className="text-white/50">.</span><span className="text-amber-200">use</span><span className="text-white/50">(</span><span className="text-blue-300">express</span><span className="text-white/50">.</span><span className="text-amber-200">json</span><span className="text-white/50">());</span></div>
                          </div>
                        </div>

                        {/* Floating Agent Card */}
                        <div className="absolute top-36 right-6 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl w-64 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100 flex items-start gap-4">
                           <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                             <Sparkles className="w-4 h-4" />
                           </div>
                           <div className="space-y-2">
                             <div className="text-xs font-bold text-white">Agent Insight</div>
                             <div className="text-[10px] text-white/60 leading-relaxed">Consider implementing a rate limiter on this endpoint to prevent abuse.</div>
                             <div className="h-6 w-16 bg-white/10 rounded-full mt-2! flex items-center justify-center text-[9px] font-bold">Apply</div>
                           </div>
                        </div>

                        {/* Chat bubbles */}
                        <div className="self-start relative bg-white/10 border border-white/5 px-5 py-3 rounded-[1.25rem] rounded-bl-sm max-w-[70%] backdrop-blur-md shadow-sm group-hover:-translate-y-1 transition-transform duration-500 delay-100 mt-20">
                           <div className="text-xs font-medium text-white/80">Check the latest commit, DB looks ready.</div>
                        </div>
                        <div className="self-end relative bg-foreground border border-white/10 px-5 py-3 rounded-[1.25rem] rounded-br-sm max-w-[70%] shadow-[0_5px_20px_rgba(255,255,255,0.15)] group-hover:-translate-y-1 transition-transform duration-500 delay-200">
                           <div className="text-xs font-bold text-background mb-1">LGTM. Shipping to production. 🚀</div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
           </div>
        </section>

        {/* INTEGRATIONS LOGOS */}
        <section className="w-full mt-32 animate-fade-in">
          <IntegratesWithEcosystem />
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="px-4 md:px-8 max-w-6xl mx-auto mt-32 w-full relative">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">How Haven Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
               A structured progression from intent to execution. No context switching.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
             {/* Connecting Line */}
             <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent -z-10"></div>
             
             {[
               { icon: MessageSquare, num: '1', title: 'Communicate', desc: 'Discuss architecture in high-speed, structured channels directly beside your codebase.', color: 'text-primary', badge: 'bg-primary/10 border-primary/20' },
               { icon: Bot, num: '2', title: 'Analyze', desc: 'Haven AI watches your channels, automatically drafting issues and suggesting code fixes contextually.', color: 'text-violet-500', badge: 'bg-violet-500/10 border-violet-500/20' },
               { icon: Terminal, num: '3', title: 'Ship', desc: 'Commit directly to your active branches. Validate performance without leaving the window.', color: 'text-emerald-500', badge: 'bg-emerald-500/10 border-emerald-500/20' },
             ].map((step, idx) => (
               <div key={idx} className="relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-3xl p-8 text-center hover:-translate-y-2 transition-all duration-300 group shadow-lg hover:shadow-xl hover:border-border">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
                  <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-xl mb-8 shadow-inner border ${step.badge}`}>
                    <span className={step.color}>{step.num}</span>
                  </div>
                  <step.icon className={`w-8 h-8 mx-auto mb-5 ${step.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`} />
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{step.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* REFINED BEFORE & AFTER SECTION */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto mt-40 w-full relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
          
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">A paradigm shift</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-medium">
               Escape the chaos of fractured tabs and missing context. See the architectural difference of a unified engine.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-stretch lg:px-4">
            {/* Before */}
            <div className="relative rounded-[2.5rem] border border-red-500/10 bg-gradient-to-b from-red-500/5 to-transparent p-10 lg:p-12 shadow-sm overflow-hidden group flex flex-col justify-between">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
              <div className="absolute top-6 right-8 py-1.5 px-4 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-500/20">The Old Way</div>
              
              <div className="mb-12 mt-6">
                <h3 className="text-2xl font-extrabold tracking-tight mb-3 text-red-500/90">Fragmented & Sloppy</h3>
                <p className="text-muted-foreground font-medium">Context lost across multiple tabs, applications, and terminal windows. High cognitive load.</p>
              </div>

              <div className="h-[280px] flex flex-col justify-center gap-6 relative z-10 w-full max-w-sm mx-auto">
                 <div className="flex gap-5 items-center bg-background/50 p-4 rounded-2xl border border-white/5 shadow-sm transform -translate-x-4 mix-blend-luminosity opacity-70 group-hover:opacity-100 transition-opacity">
                   <div className="w-12 h-12 rounded-xl bg-card border border-white/10 flex items-center justify-center text-xl shrink-0 shadow-sm"><span className="opacity-50 text-white">#</span></div>
                   <div className="flex-1 space-y-2.5">
                     <div className="h-2 w-full bg-white/20 rounded-full"></div>
                     <div className="h-2 w-2/3 bg-white/10 rounded-full"></div>
                   </div>
                 </div>
                 <div className="flex gap-5 items-center bg-background/50 p-4 rounded-2xl border border-white/5 shadow-sm translate-x-4 mix-blend-luminosity opacity-70 group-hover:opacity-100 transition-opacity">
                   <div className="w-12 h-12 rounded-xl bg-card border border-white/10 flex items-center justify-center text-xl shrink-0 shadow-sm"><CheckCircle2 className="w-5 h-5 text-white/50"/></div>
                   <div className="flex-1 space-y-2.5">
                     <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                     <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                   </div>
                 </div>
                 <div className="flex gap-5 items-center bg-background/50 p-4 rounded-2xl border border-white/5 shadow-sm -translate-x-2 mix-blend-luminosity opacity-70 group-hover:opacity-100 transition-opacity">
                   <div className="w-12 h-12 rounded-xl bg-card border border-white/10 flex items-center justify-center text-[10px] font-mono shrink-0 shadow-sm text-white/50">&gt;_</div>
                   <div className="flex-1 space-y-2.5">
                     <div className="h-2 w-full bg-white/20 rounded-full"></div>
                     <div className="h-2 w-4/5 bg-white/10 rounded-full"></div>
                   </div>
                 </div>
              </div>
            </div>

            {/* After */}
            <div className="relative rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent p-10 lg:p-12 shadow-[0_0_50px_-15px_rgba(16,185,129,0.15)] overflow-hidden group flex flex-col justify-between">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
              <div className="absolute top-6 right-8 py-1.5 px-4 bg-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/30">With Haven</div>
              
              <div className="mb-12 mt-6">
                <h3 className="text-2xl font-extrabold tracking-tight mb-3 text-emerald-500">Unified & Immediate</h3>
                <p className="text-foreground font-medium">All systems synchronized in a single secure window. Instant execution. Zero context switching.</p>
              </div>
              
              <div className="h-[280px] flex flex-col justify-center relative z-10 items-center">
                 <div className="bg-background/90 backdrop-blur-xl w-full max-w-[400px] h-[240px] rounded-[1.5rem] border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col group-hover:scale-105 transition-transform duration-700 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)]">
                   <div className="h-5 w-full bg-white/5 border-b border-white/5 px-4 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-white/20"></div>
                     <div className="w-2 h-2 rounded-full bg-white/20"></div>
                     <div className="w-2 h-2 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                   </div>
                   <div className="flex flex-1 p-3 gap-3">
                      {/* Unified sidebar */}
                      <div className="w-1/3 flex flex-col gap-2">
                         <div className="h-6 w-full bg-white/5 rounded-lg border border-white/5 flex items-center px-2.5 gap-2"><div className="w-2 h-2 rounded-sm bg-emerald-500/50"></div><div className="h-1 w-8 bg-white/20 rounded"></div></div>
                         <div className="h-6 w-full bg-white/5 rounded-lg border border-white/5 flex items-center px-2.5 gap-2"><div className="w-2 h-2 rounded-sm bg-blue-500/50"></div><div className="h-1 w-10 bg-white/20 rounded"></div></div>
                         <div className="h-6 w-full bg-white/5 rounded-lg border border-white/5 flex items-center px-2.5 gap-2"><div className="w-2 h-2 rounded-sm bg-amber-500/50"></div><div className="h-1 w-6 bg-white/20 rounded"></div></div>
                      </div>
                      {/* Unified Content */}
                      <div className="w-2/3 flex flex-col gap-3">
                         <div className="flex-1 w-full bg-[#050505] rounded-xl border border-white/10 p-4 shadow-inner relative overflow-hidden flex flex-col gap-3">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl"></div>
                            
                            <div className="bg-white/5 border border-white/5 rounded-lg p-2.5 mt-auto">
                              <div className="h-1.5 w-full bg-emerald-500/40 rounded-full mb-2"></div>
                              <div className="h-1.5 w-3/4 bg-emerald-500/40 rounded-full mb-2"></div>
                            </div>
                            <div className="bg-primary/20 border border-primary/30 rounded-lg p-2">
                               <div className="h-1.5 w-1/2 bg-foreground rounded-full"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE CAROUSEL & BENTO GRID SECTION */}
        <section id="features" className="px-4 md:px-8 max-w-7xl mx-auto mt-40 w-full mb-20 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Total Operational Superiority</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-medium">
               We re-engineered the standard collaboration paradigm to include total extensibility, artificial intelligence, and unmatched privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[280px] lg:auto-rows-[340px] text-left">
            
            {/* Feature Carousel (Interactive/Animated span) */}
            <div className="md:col-span-2 lg:col-span-2 flex flex-col p-8 md:p-10 rounded-[2.5rem] bg-card border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 opacity-50 z-0"></div>
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full -mr-20 -mt-40 transition-all duration-1000 group-hover:scale-125 z-0"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/30 mb-6 backdrop-blur-md shadow-lg">
                    <Blocks className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-extrabold tracking-tighter mb-4 text-foreground leading-tight">Interactive Feature Carousel</h3>
                  <p className="text-muted-foreground text-base md:text-lg font-medium leading-relaxed max-w-sm">
                    Connect workflows with over 200 integrated plugins. Swipe through dynamic capabilities.
                  </p>
                </div>
                
                {/* Horizontal Scrolling Mock Content */}
                <div className="flex gap-4 overflow-x-auto pb-4 pt-4 scrollbar-hide snap-x">
                   <div className="min-w-[200px] h-32 rounded-2xl bg-background/50 border border-white/5 shadow-inner p-4 backdrop-blur-xl snap-center flex flex-col justify-between shrink-0 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm"><Github className="w-4 h-4"/> Git Sync</div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="w-[80%] h-full bg-indigo-500 rounded-full"></div></div>
                   </div>
                   <div className="min-w-[200px] h-32 rounded-2xl bg-background/50 border border-white/5 shadow-inner p-4 backdrop-blur-xl snap-center flex flex-col justify-between shrink-0 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm"><MessageSquare className="w-4 h-4"/> Live Chat</div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="w-full h-full bg-emerald-500 rounded-full"></div></div>
                   </div>
                   <div className="min-w-[200px] h-32 rounded-2xl bg-background/50 border border-white/5 shadow-inner p-4 backdrop-blur-xl snap-center flex flex-col justify-between shrink-0 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm"><Layout className="w-4 h-4"/> Boards</div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className="w-[60%] h-full bg-amber-500 rounded-full"></div></div>
                   </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Small */}
            <div className="md:col-span-1 lg:col-span-1 flex flex-col justify-between p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-2 shadow-sm relative z-10 ring-1 ring-emerald-500/20">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
               <div className="relative z-10 mt-auto">
                 <h3 className="text-xl font-extrabold tracking-tight mb-2">Absolute Security</h3>
                 <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                   Zero telemetry on your code. Cloud or on-prem. E2E compliance.
                 </p>
               </div>
            </div>

            {/* Feature 3 - Small */}
            <div className="md:col-span-1 lg:col-span-1 flex flex-col justify-between p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-2 shadow-sm relative z-10 ring-1 ring-blue-500/20">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
               <div className="relative z-10 mt-auto">
                 <h3 className="text-xl font-extrabold tracking-tight mb-2">Global Edge</h3>
                 <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                   Sub-50ms latency worldwide via our distributed edge network.
                 </p>
               </div>
            </div>

            {/* Feature 4 - Large Span Dark */}
            <div className="md:col-span-2 lg:col-span-2 flex flex-col p-8 md:p-10 rounded-[2.5rem] bg-foreground text-background border border-black/5 relative overflow-hidden group shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-transparent.png')] opacity-[0.1] pointer-events-none"></div>
              
              {/* Dynamic decorative elements */}
              <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-[500px] h-[500px] border-[50px] border-background/5 rounded-full pointer-events-none group-hover:scale-110 transition-all duration-1000 ease-out"></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                   <div className="w-14 h-14 rounded-2xl bg-background/10 flex items-center justify-center mb-6 backdrop-blur-md shadow-lg ring-1 ring-white/10">
                     <Terminal className="w-7 h-7 text-background" />
                   </div>
                   <h3 className="text-2xl md:text-4xl font-extrabold tracking-tighter mb-4 leading-tight">Live Repository Sync</h3>
                   <p className="text-background/80 text-base md:text-lg font-medium leading-relaxed max-w-md">
                     Bring branch management directly into issue tracking. Visualize diffs, trace commits, and execute shell commands natively.
                   </p>
                </div>
                <Button asChild size="lg" variant="secondary" className="w-fit hover:scale-105 transition-transform bg-background text-foreground hover:bg-background/90 font-bold rounded-2xl shadow-xl mt-6 px-8 h-14 text-sm">
                  <Link to="/workspace">Explore Workspace <ArrowRight className="w-4 h-4 ml-2"/></Link>
                </Button>
              </div>
            </div>

            {/* Feature 5 - Medium */}
            <div className="md:col-span-1 lg:col-span-2 flex flex-col justify-between p-8 md:p-10 rounded-[2rem] bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/5 blur-[80px] rounded-full -mr-20 -mb-20 transition-all duration-700 group-hover:bg-violet-500/10 group-hover:scale-110 pointer-events-none"></div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center ring-1 ring-violet-500/20 relative z-10 shadow-lg backdrop-blur-sm">
                <Bot className="w-7 h-7 text-violet-500" />
              </div>
              <div className="mt-auto relative z-10">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">AI Agent Core</h3>
                <p className="text-muted-foreground text-base font-medium leading-relaxed max-w-sm">
                  A hyper-intelligent AI directly embedded via API. Debug, lint, and auto-triage instantly.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="px-4 md:px-8 max-w-5xl mx-auto mt-32 w-full">
           <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">The New Standard</h2>
            <p className="text-muted-foreground text-lg font-medium">Compare Haven against standard fragmented architectures.</p>
          </div>
          
          <div className="bg-card border border-border/60 rounded-[2rem] overflow-hidden shadow-sm shadow-black/5">
             <div className="grid grid-cols-3 bg-muted/30 border-b border-border/60 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <div className="p-5 md:p-6 text-left border-r border-border/40">Feature Capability</div>
                <div className="p-5 md:p-6 text-center border-r border-border/40 text-rose-500/80">Fragmented Tools</div>
                <div className="p-5 md:p-6 text-center text-foreground font-extrabold tracking-tight flex items-center justify-center gap-2">
                   <HavenLogoIcon />
                   Haven Engine
                </div>
             </div>
             
             {[
               { name: "Context Switching", old: "High", new: "Zero" },
               { name: "Integrated AI", old: "Paid Add-on", new: "Native Core" },
               { name: "Code Context", old: "None / Linking required", new: "Real-time Repo Sync" },
               { name: "Plugin Ecosystem", old: "Siloed", new: "200+ Open Extensions" },
               { name: "Deployment", old: "Cloud Only", new: "Enterprise Sandboxing" }
             ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 border-b border-border/40 last:border-0 text-sm font-medium hover:bg-muted/10 transition-colors">
                   <div className="p-5 md:p-6 text-left border-r border-border/40 text-foreground">{row.name}</div>
                   <div className="p-5 md:p-6 flex items-center justify-center border-r border-border/40 text-muted-foreground">
                      {row.old === "High" ? <X className="w-4 h-4 text-rose-500 mr-2"/> : null}
                      {row.old}
                   </div>
                   <div className="p-5 md:p-6 flex items-center justify-center text-foreground font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2"/>
                      {row.new}
                   </div>
                </div>
             ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="px-4 md:px-8 max-w-3xl mx-auto mt-40 w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Questions?</h2>
            <p className="text-muted-foreground text-lg font-medium">Everything you need to know about the product and billing.</p>
          </div>
          
          <div className="space-y-3">
             {faqs.map((faq, i) => (
               <div key={i} className="border border-border/50 bg-card/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:border-border transition-colors">
                 <button 
                   onClick={() => setOpenFaq(openFaq === i ? null : i)}
                   className="w-full flex items-center justify-between p-5 md:p-6 text-left font-bold text-foreground focus:outline-none"
                 >
                   <span className="text-base font-semibold">{faq.question}</span>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground transition-transform duration-300 ${openFaq === i ? 'rotate-180 bg-foreground text-background' : ''}`}>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${openFaq === i ? 'rotate-90' : ''}`} />
                   </div>
                 </button>
                 <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="p-5 md:p-6 pt-0 text-muted-foreground text-sm font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                 </div>
               </div>
             ))}
          </div>
        </section>

        {/* REFINED FOOTER CTA WITH BENTO GRID PORTFOLIO */}
        <section className="w-full max-w-7xl mx-auto mt-40 mb-10 px-4 md:px-8 relative">
           <div className="bg-card border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
             <div className="absolute inset-0 bg-gradient-to-br from-foreground to-background opacity-20 mix-blend-overlay pointer-events-none"></div>
             {/* 3D glow effect behind */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
             
             <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
               <div className="flex flex-col items-start text-left">
                 <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6 leading-tight">Ready to unite <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">your team?</span></h2>
                 <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl mb-10 leading-relaxed">
                   Deploy Haven Workspace today and experience zero context-switching, lightning-fast communications, and intelligent repository tracking natively.
                 </p>
                 <Button asChild size="lg" className="h-14 px-10 text-base font-extrabold rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] ring-1 ring-white/10 transition-all duration-300 bg-foreground text-background hover:bg-foreground">
                   <Link to="/login?mode=signup">Get Started for Free <ArrowRight className="w-5 h-5 ml-2"/></Link>
                 </Button>
                 <p className="text-xs font-mono font-medium text-muted-foreground mt-6 uppercase tracking-widest flex items-center gap-2">
                   <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No Credit Card Required.
                 </p>
               </div>

               {/* Right Side Bento Grid Portfolio */}
               <div className="grid grid-cols-2 gap-4 auto-rows-[160px]">
                  <div className="col-span-2 row-span-1 rounded-[2rem] bg-background/50 border border-white/5 p-6 relative overflow-hidden group shadow-inner backdrop-blur-xl flex flex-col justify-end">
                     <div className="absolute top-0 right-0 p-6 opacity-40 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-110"><Blocks className="w-12 h-12 text-primary" /></div>
                     <h4 className="text-lg font-extrabold z-10 text-foreground">Intelligent Routing</h4>
                     <p className="text-sm text-muted-foreground font-medium z-10">Direct paths connect your tasks instantly.</p>
                     <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="col-span-1 row-span-1 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 p-6 relative overflow-hidden group shadow-inner backdrop-blur-xl flex flex-col justify-end">
                     <h4 className="text-lg font-extrabold z-10 text-emerald-100">Zero Latency</h4>
                     <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/20 blur-xl rounded-full group-hover:scale-150 transition-transform"></div>
                  </div>
                  <div className="col-span-1 row-span-1 rounded-[2rem] bg-background/50 border border-white/5 p-6 relative overflow-hidden group shadow-inner backdrop-blur-xl flex flex-col justify-end items-center text-center">
                     <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 mb-3 animate-[spin_10s_linear_infinite] flex items-center justify-center">
                       <Shield className="w-5 h-5 text-muted-foreground" />
                     </div>
                     <h4 className="text-sm font-extrabold z-10 text-muted-foreground uppercase tracking-widest">E2E Secure</h4>
                  </div>
               </div>
             </div>
           </div>
        </section>

      </main>
    </div>
  );
}

function HavenLogoIcon() {
  return (
    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-foreground text-background">
      <Blocks className="w-3 h-3" />
    </div>
  )
}
