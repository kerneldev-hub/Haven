import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BookOpen, Rocket, Settings, Code, Shield, Building2, Scale, 
  Target, Eye, AlignLeft, Layers, CreditCard, PlayCircle, 
  MessageSquare, Terminal, Landmark, Globe, CheckCircle2 
} from 'lucide-react';

export default function DocsPage() {
  const location = useLocation();

  const navGroups = [
    {
      title: 'About HAVEN',
      icon: <Target className="w-4 h-4 mr-2" />,
      items: [
        { title: 'Mission', path: '/docs/mission' },
        { title: 'Vision', path: '/docs/vision' },
        { title: 'Why I Built This', path: '/docs/founder-intent' },
      ]
    },
    {
      title: 'Platform Pillars',
      icon: <Layers className="w-4 h-4 mr-2" />,
      items: [
        { title: 'Core Categories', path: '/docs/categories' },
        { title: 'Future Plans', path: '/docs/future' },
      ]
    },
    {
      title: 'Getting Started',
      icon: <PlayCircle className="w-4 h-4 mr-2" />,
      items: [
        { title: 'Quick Start', path: '/docs/quickstart' },
        { title: 'Platform Access', path: '/docs/cross-platform' },
      ]
    },
    {
      title: 'Operational Pages',
      icon: <BookOpen className="w-4 h-4 mr-2" />,
      items: [
        { title: 'Changelog', path: '/docs/changelog' },
        { title: 'Blog System', path: '/docs/blog' },
        { title: 'Integrations', path: '/docs/integrations' },
        { title: 'Community Moderation', path: '/docs/community/moderation' },
        { title: 'Sub-Havens', path: '/docs/community/subs' },
        { title: 'Workspaces', path: '/docs/workspaces' },
        { title: 'Channels & Issues', path: '/docs/channels' },
      ]
    },
    {
      title: 'Payments & Infrastructure',
      icon: <CreditCard className="w-4 h-4 mr-2" />,
      items: [
        { title: 'Payments Note', path: '/docs/payments' },
      ]
    },
    {
      title: 'Compliance & Legal',
      icon: <Scale className="w-4 h-4 mr-2" />,
      items: [
        { title: 'Privacy Policy', path: '/docs/privacy' },
        { title: 'Terms of Service', path: '/docs/terms' },
      ]
    },
  ];

  const renderContent = () => {
    switch (location.pathname) {
      case '/docs/mission':
      case '/docs':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Philosophy</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Mission & Introduction</h1>
            </div>
            
            <div className="bg-muted/5 border border-border/40 rounded-2xl p-6 mb-8 text-sm font-mono leading-relaxed text-muted-foreground">
              <span className="font-bold text-foreground">HAVEN = Execution Layer for Digital Creation</span>
              <div className="mt-2 text-xs">
                Not just an IDE. Not just a dashboard. Not just a chat system.
                A complete, unified workspace engine.
              </div>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Mission Statement</h2>
              <p className="text-muted-foreground leading-relaxed">
                To build a unified digital execution layer where creators build without friction, developers ship faster, communities collaborate in real-time, and AI acts as a native, secure co-creator.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Find Your People</h2>
              <p className="text-muted-foreground leading-relaxed">
                Haven communities unify real-time messaging, file sharing, collaborative issue-management, and cloud deployments. Join dedicated spaces to chat, share, and connect instantly:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {['Tech & Dev', 'Gaming', 'Anime & Design', 'Comics', 'Education', 'Arts & Culture', 'Global Discussions', 'Startup Builders', 'AI Engineers'].map((c, i) => (
                  <div key={i} className="px-4 py-2 bg-[#0c0c0e] border border-border/30 rounded-xl text-xs font-medium text-foreground">
                    ✦ {c}
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-border/30 pt-6 mt-8">
              <h3 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest mb-1">Core Principle</h3>
              <p className="text-sm italic text-foreground leading-relaxed">
                "HAVEN is constructed as a unified execution environment for the next generation of creators, developers, and communities. It is not just a tool; it is an integrated network where concepts translate directly into production."
              </p>
            </section>
          </div>
        );

      case '/docs/vision':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Roadmap</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Vision</h1>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              We envision a future where digital execution is fluid and unbound by artificial context boundaries.
            </p>

            <section className="space-y-4 bg-[#0a0a0c] border border-border/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold">The future of collaboration:</h3>
              <ul className="space-y-3 font-medium text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-foreground font-extrabold font-mono shrink-0">✦</span>
                  <span>Every concept can become a working product inside one environment without leaving to change tools or remote applications.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground font-extrabold font-mono shrink-0">✦</span>
                  <span>HAVEN becomes the default creator workspace OS.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground font-extrabold font-mono shrink-0">✦</span>
                  <span>A solid foundation for local-first, AI-native development and community-driven secure software creation.</span>
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">Core Philosophy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Modern software creation is deeply fragmented. Creators today are forced to jump constantly between communication lines, repositories, document nodes, code editors, and cloud terminals. HAVEN unites all of this into a single cohesive experience:
              </p>
              <div className="font-mono text-center text-xs py-4 bg-muted/10 border border-border/50 rounded-xl text-foreground font-extrabold">
                Idea → Workspace → Build → Collaborate → Deploy → Scale
              </div>
            </section>
          </div>
        );

      case '/docs/founder-intent':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Background</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Why I Built This</h1>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              HAVEN exists to eliminate three architectural flaws in modern development:
            </p>

            <div className="grid gap-4 mt-4">
              {[
                { title: '1. Fragmentation', desc: 'Communication flows are separated from codebase actions and documentation nodes. Keeping them separate splits attention.' },
                { title: '2. Complexity', desc: 'Modern digital creation demands too many subscriptions, heavy client installations, and complex setup processes.' },
                { title: '3. Isolation', desc: 'Creators, designer, and developer teams lack immediate, shared collaborative execution environments.' }
              ].map((item, idx) => (
                <div key={idx} className="p-5 bg-[#0c0c0e] border border-border/40 rounded-2xl">
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground text-sm mt-4">
              By consolidating workflows into a single tool, HAVEN decreases friction and keeps teams in sync.
            </p>
          </div>
        );

      case '/docs/categories':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Architecture</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Core Categories</h1>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              HAVEN is engineered specifically to unify five primary operations:
            </p>

            <div className="grid gap-6 mt-6">
              {[
                { category: 'AI Workspace', desc: 'Context-sensitive tools, local memory stores, and auto-generated system blueprints.' },
                { category: 'Automation Engine', desc: 'Pre-built Cron flows, reactive action triggers, webhooks, and secure scheduled workers.' },
                { category: 'Development Environment', desc: 'In-app sandboxes, dynamic Monaco-based source editing, and local terminal attachments.' },
                { category: 'Collaboration Layer', desc: 'Low-latency voice panels, real-time message rooms, issue boards, and reputation-tracked contributions.' },
                { category: 'Deployment Pipeline', desc: 'Push-to-edge support, custom server configs, static CDN routing, and remote system health telemetry.' }
              ].map((item, i) => (
                <div key={i} className="border-l-2 border-primary pl-4 py-1">
                  <h3 className="font-bold text-foreground text-lg">{item.category}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <section className="bg-muted/5 border border-border/40 rounded-2xl p-6 mt-8">
              <h3 className="font-bold text-sm mb-3">Supported Community Spaces:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground font-mono">
                <div>✦ Software & AI Engineering</div>
                <div>✦ Indie Game Development</div>
                <div>✦ Graphic Design & Creative Guilds</div>
                <div>✦ Academic & Educational Networks</div>
                <div>✦ Fan Arts & Comic Collectives</div>
                <div>✦ Remote Startup Inception Nodes</div>
              </div>
            </section>
          </div>
        );

      case '/docs/future':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Development Roadmap</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Future Plans</h1>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Our continuous deployment cycle aims to complete the following visual and infrastructure modules:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-[#0a0a0c] border border-border/30 rounded-xl">
                <h4 className="font-bold text-sm text-foreground">Sandbox Plugins Core</h4>
                <p className="text-xs text-muted-foreground mt-1">Further extension of the WASM plugin system to run completely sandboxed processes client-side.</p>
              </div>
              <div className="p-4 bg-[#0a0a0c] border border-border/30 rounded-xl">
                <h4 className="font-bold text-sm text-foreground">Decentralized Storage Hooks</h4>
                <p className="text-xs text-muted-foreground mt-1">Integration of optional decentralized cloud storage endpoints utilizing end-to-end encrypted tunnels.</p>
              </div>
              <div className="p-4 bg-[#0a0a0c] border border-border/30 rounded-xl">
                <h4 className="font-bold text-sm text-foreground">Dynamic Sub-Haven Automation</h4>
                <p className="text-xs text-muted-foreground mt-1">Auto-scaffolding of child sub-havens when community discussion markers cross predefined reputation thresholds.</p>
              </div>
            </div>
          </div>
        );

      case '/docs/quickstart':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Tutorial</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Quick Start Guide</h1>
            </div>

            <div className="space-y-6">
              {[
                { step: 'Step 1: Sign Up / Sign In', desc: 'Securely create your account via our decentralized workspace login or standard credentials.' },
                { step: 'Step 2: Initialize Workspace', desc: 'Determine your category: Developer, Creator, Designer, Team, or Community Builder. The interface auto-configures tailored assets.' },
                { step: 'Step 3: Structure Spaces', desc: 'Enter your custom Dashboard workspace. Join active sub-communities or structure personal projects.' },
                { step: 'Step 4: Launch Execution', desc: 'Build, sync repos, code via the in-app Monaco editor, and review diffs.' },
                { step: 'Step 5: Collaborate & Deploy', desc: 'Publish to public communities, or trigger edge-based hosting deployments immediately.' }
              ].map((item, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-foreground flex items-center justify-center text-[9px] font-bold text-background font-mono">
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-foreground text-sm">{item.step}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case '/docs/cross-platform':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Downloads</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Cross-Platform Access</h1>
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm">
              HAVEN runs seamlessly everywhere, providing uniform latency and full feature compatibility across systems:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Web Space', details: 'Direct edge-optimized workspace context.', link: 'Instant access via browser' },
                { name: 'Windows Client', details: 'Low-latency desktop process. (.EXE executable file)', link: 'Available' },
                { name: 'Linux Client', details: 'Dynamic sandboxed build. (AppImage / .DEB package)', link: 'Available' },
                { name: 'Android Application', details: 'Responsive communication & system tracking. (.APK package)', link: 'Available' }
              ].map((p, idx) => (
                <div key={idx} className="p-4 bg-[#0a0a0c] border border-border/30 rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{p.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-normal">{p.details}</p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground mt-3 font-semibold">Status: {p.link}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-zinc-950/40 border border-border/40 rounded-2xl">
              <p className="text-xs text-zinc-400 leading-normal">
                ⚠️ <strong className="text-foreground">macOS Warning:</strong> macOS and iOS are not supported targets at this time due to restricted native sandboxing restrictions.
              </p>
            </div>
          </div>
        );

      case '/docs/payments':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Infrastructure</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Payments Note</h1>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 leading-relaxed mb-6">
              <h4 className="font-bold text-amber-400 text-sm flex items-center mb-2">
                ⚠️ NON-LEGAL NOTICE
              </h4>
              <p className="text-xs text-amber-200/90 leading-relaxed font-semibold">
                HAVEN is strictly an operational execution environment. We are not a financial institution, backing platform, custodian for cash, or currency issuer. Any billing features are integrated strictly for developer platform usage.
              </p>
            </div>

            <section className="space-y-4">
              <h3 className="font-bold text-lg text-foreground">Crypto-Based Alternative Framework</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To bypass regional payments complexity and restricted banking regions, HAVEN integrates clean, modular cryptocurrency gateways.
              </p>
              
              <div className="grid gap-4 pt-2">
                <div className="p-4 bg-[#0c0c0e] border border-border/40 rounded-xl">
                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wider font-mono mb-1">Principles:</h4>
                  <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 leading-relaxed">
                    <li>Strict adherence to localized legal conditions.</li>
                    <li>Personal responsibility: Each individual user must evaluate local rules regarding digital currency transactions.</li>
                    <li>Zero assistance or promotion of unlawful asset hiding or unregistered financing.</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#0c0c0e] border border-border/40 rounded-xl">
                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wider font-mono mb-1">Supported Infrastructures:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Stablecoins: USDT / USDC transactions.</li>
                    <li>Non-custodial Web3 Connection.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        );

      case '/docs/privacy':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Governance</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm">
              We operate under a strict zero-telemetry blueprint.
            </p>

            <div className="p-6 bg-[#0a0a0c] border border-border/30 rounded-2xl space-y-4">
              <h4 className="font-bold text-sm text-foreground">Our Commitments to Your Privacy:</h4>
              <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed list-disc pl-4">
                <li><strong className="text-foreground">No personal sale:</strong> We never bundle, lease, or distribute usage habits.</li>
                <li><strong className="text-foreground">Private space:</strong> Private repository metadata and transient files are held completely clear of our server caches.</li>
                <li><strong className="text-foreground">E2EE Chat Option:</strong> Real-time messaging uses active session tunnels. We do not inspect private client-to-client queries.</li>
              </ul>
            </div>
          </div>
        );

      case '/docs/terms':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Agreement</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm">
              Operational parameters when running queries on HAVEN:
            </p>

            <div className="p-6 bg-[#0a0a0c] border border-border/30 rounded-2xl space-y-3 font-medium text-xs text-muted-foreground">
              <p>✦ Users hold full copy/intellectual property rights of their written files and code output.</p>
              <p>✦ Automated tasks must not trigger aggressive distributed attacks, rate limits bypassing, or resource scraping.</p>
              <p>✦ HAVEN maintains the absolute right to freeze networks exhibiting resource theft.</p>
              <p>✦ All software logic is delivered strictly <span className="font-mono text-foreground font-bold">AS IS</span>, without implied warranty of continuous uptime.</p>
            </div>
          </div>
        );

      case '/docs/changelog':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Platform Activity</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Changelog</h1>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every platform change is tracked version by version:
            </p>
            <div className="border border-border/30 rounded-2xl p-6 bg-[#0a0a0c] space-y-6">
              <div className="border-b border-border/30 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs bg-white/10 px-2.5 py-1 rounded-lg text-foreground">v2.1.0-beta</span>
                  <span className="text-[10px] font-mono text-muted-foreground">June 2026</span>
                </div>
                <h4 className="font-bold text-sm text-foreground">Introduced Integrations & Marquee UI</h4>
                <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">Installed simpleicons CDN delivery, built tooltip structures, restructured primary landing community flow.</p>
              </div>
            </div>
          </div>
        );

      case '/docs/blog':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Corporate Updates</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Blog System</h1>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Keep updated on roadmap progress, technical discoveries, and builder community highlights:
            </p>
            <div className="grid gap-4">
              <div className="p-5 bg-muted/10 border border-border/40 rounded-2xl hover:border-foreground/30 transition-colors">
                <span className="text-[10px] font-mono text-muted-foreground block mb-2">Platform Update</span>
                <h3 className="font-bold text-base mb-2">Converging IDE Space with Secure Social Communication</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">Why communication and live repository state shouldn't be separated by browser tabs.</p>
              </div>
            </div>
          </div>
        );

      case '/docs/integrations':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Connectivity</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Integrations</h1>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Natively synchronize with external developer tools:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#0c0c0e] border border-border/40 rounded-xl">
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider font-mono mb-2">Development</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">GitHub commits link natively, prompting issues and trigger rules instantly.</p>
              </div>
              <div className="p-4 bg-[#0c0c0e] border border-border/40 rounded-xl">
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider font-mono mb-2">Cloud Edge</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Cloudflare deployment triggers hook dynamically into finished workspace commits.</p>
              </div>
            </div>
          </div>
        );

      case '/docs/community/moderation':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Safety rules</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Community Moderation</h1>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Automated community tools allow administrators to preserve respect across spaces:
            </p>
            <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
              <h4 className="text-red-400 font-bold text-xs font-mono uppercase tracking-wider mb-2">Zero-Tolerance Directives:</h4>
              <ul className="text-xs text-red-200/80 space-y-1.5 list-disc pl-4 leading-normal">
                <li>No aggressive user harassment or targeting of personal affiliations.</li>
                <li>Strict prohibition against hosting and executing malicious payloads.</li>
                <li>Automatic limitation of queries spamming community processing clusters.</li>
              </ul>
            </div>
          </div>
        );

      case '/docs/community/subs':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Community Nest</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Sub-Havens System</h1>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sub-havens operate as micro-communities centered on specialized developer domains:
            </p>
            <div className="space-y-3 font-medium text-xs text-muted-foreground leading-relaxed">
              <div className="p-4 bg-[#0a0a0c] border border-border/30 rounded-xl">
                <strong className="text-foreground">Domain Specialization:</strong>
                <p className="mt-1">Allows deep research networks to self-assemble within master group panels (e.g., Tech → AI Engineering → Prompt Tuning).</p>
              </div>
              <div className="p-4 bg-[#0a0a0c] border border-border/30 rounded-xl">
                <strong className="text-foreground">Local Moderation:</strong>
                <p className="mt-1">Sub-havens support distinct administrator assignment, specific repository sync paths, and specialized file channels.</p>
              </div>
            </div>
          </div>
        );

      case '/docs/workspaces':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Spaces</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Workspaces Architecture</h1>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every user environment provisions local and cloud workspace directory buffers:
            </p>
            <div className="p-5 bg-[#0c0c0e] border border-border/40 rounded-2xl space-y-3 text-xs text-muted-foreground">
              <p>✦ <strong className="text-foreground">Personal Buffers:</strong> Secure storage for local draft source work and individual configuration environments.</p>
              <p>✦ <strong className="text-foreground">Team Nodes:</strong> Dynamic synchronization layers running automatic change tracking metrics.</p>
              <p>✦ <strong className="text-foreground">Integrated Tools:</strong> Direct access to the built-in Monaco file systems, AI debugging, and chat channels on the fly.</p>
            </div>
          </div>
        );

      case '/docs/channels':
        return (
          <div className="space-y-6">
            <div className="border-b border-border/40 pb-4">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-1">Communication Tunnels</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Channels & Issues</h1>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              HAVEN integrates dual communication workflows:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#0a0a0c] border border-border/30 rounded-xl">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5"><MessageSquare className="w-4 h-4"/> Chat Channels</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Real-time collaboration streams contextually attached alongside raw development code windows.</p>
              </div>
              <div className="p-4 bg-[#0a0a0c] border border-border/30 rounded-xl">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5"><Terminal className="w-4 h-4"/> Project Issues</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Linear issue tracking, commit attachments, status assignments, and direct AI diagnostics integrations.</p>
              </div>
            </div>
          </div>
        );

      default:
        // Automatically default gracefully to Mission
        return (
          <div className="text-left py-12">
            <h2 className="text-2xl font-bold mb-2">Section Not Found</h2>
            <p className="text-muted-foreground text-sm">Please select a valid documentation topic from the navigation sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background border-t">
      <div className="container mx-auto px-4 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div className="sticky top-24 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hide pr-2">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                  {group.icon}
                  {group.title}
                </h4>
                <ul className="space-y-1 pl-4 border-l border-border/50">
                  {group.items.map((item, itemIdx) => {
                    const isActive = location.pathname === item.path || (location.pathname === '/docs' && item.path === '/docs/mission');
                    return (
                      <li key={itemIdx}>
                        <NavLink
                          to={item.path}
                          className={`block py-1.5 text-xs transition-colors font-medium ${
                            isActive 
                              ? 'text-primary font-bold border-r-2 border-primary' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {item.title}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 bg-card rounded-[2rem] border border-border/50 p-8 md:p-12 min-h-[500px] shadow-sm">
          <div className="max-w-4xl text-foreground">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
