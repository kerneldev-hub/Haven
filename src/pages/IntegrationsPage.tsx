import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '../components/ui/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { 
  Code, Webhook, Box, Lock, Database, Gamepad2, Settings, Puzzle, CheckCircle2,
  Search, ExternalLink, Layers, Globe, Shield, Sparkles, Check, Trash2, 
  Lightbulb, Copy, PlusCircle, Link2, ArrowRight, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import UnifiedApiHub from '../components/UnifiedApiHub';

// Structure of curating directories from user-provided links
interface ResourceItem {
  name: string;
  desc: string;
  category: string; 
  alternativeTo?: string; // What it replaces (from opensourcealternatives.to)
  url: string; // Direct link
  catalogSource: string; // Which catalog lists it
  catalogUrl: string; // The specific list reference
  freeTierLimit: string;
  snippet: string; // Quick start code or config block
  layer: 'Security & DNS' | 'Hosting & Delivery' | 'API, AI & Logic' | 'Database & Storage';
  badge?: string;
}

export default function IntegrationsPage() {
  // Existing system integrations (workspace settings)
  const [integrations, setIntegrations] = useState([
    { name: 'GitHub', desc: 'Sync repositories, issues, and pull requests.', icon: Code, category: 'Dev Tools', connected: true },
    { name: 'Sentry / GlitchTip', desc: 'Real-time application monitoring and zero-cost error tracking.', icon: Webhook, category: 'Dev Tools', connected: true },
    { name: 'Turso (libSQL)', desc: 'Unified Edge database and backend state manager, optimized for 1,000+ concurrent active connections.', icon: Database, category: 'Database', connected: true, badge: 'Unified Stack' },
    { name: 'Ably Realtime', desc: 'Unified high-concurrency WebSocket messaging & peer room signaling engine.', icon: Webhook, category: 'Database', connected: true, badge: 'Unified Stack' },
    { name: 'Logto Identity', desc: 'Unified modern open-source identity, OAuth, and SSO security layer.', icon: Lock, category: 'Auth & Security', connected: true, badge: 'Unified Stack' },
    { name: 'Umami', desc: 'Lightweight, privacy-focused open source web analytics.', icon: Settings, category: 'Analytics', connected: true },
    { name: 'Stripe', desc: 'Secure multi-gateway payment architecture for subscriptions and credit bundles.', icon: Lock, category: 'Finance', connected: true }
  ]);

  // Comprehensive resource directory parsed directly from the user's links cataloging
  const publicResources: ResourceItem[] = [
    // Open-Source Alternatives & Dev Resources
    {
      name: 'Supabase',
      desc: 'Open source Firebase alternative. Build production-grade backends with a Postgres database, Authentication, Instant APIs, Realtime subscriptions, and Storage.',
      category: 'FOSS Alternatives',
      alternativeTo: 'Firebase',
      url: 'https://supabase.com/',
      catalogSource: 'opensourcealternatives.to',
      catalogUrl: 'https://www.opensourcealternatives.to/',
      freeTierLimit: '2 free projects, 500MB DB storage, 50k monthly active users, 1GB file storage.',
      layer: 'Database & Storage',
      badge: 'Highly Popular',
      snippet: `import { createClient } from '@supabase/supabase-js'\nconst supabase = createClient(\n  'https://your-project.supabase.co',\n  'your-anon-key'\n)`
    },
    {
      name: 'Umami Analytics',
      desc: 'Sleek, lightweight, cookie-free, privacy-focused open source alternative to Google Analytics. Fits beautifully on serverless infrastructures.',
      category: 'FOSS Alternatives',
      alternativeTo: 'Google Analytics',
      url: 'https://umami.is/',
      catalogSource: 'devresourc.es',
      catalogUrl: 'https://devresourc.es/category/open-source',
      freeTierLimit: '10,000 monthly events on free cloud tier, 100% unlimited if self-hosted.',
      layer: 'API, AI & Logic',
      snippet: `<script \n  async \n  src="https://cloud.umami.is/script.js" \n  data-website-id="your-website-id"\n></script>`
    },
    {
      name: 'Penpot',
      desc: 'The first open-source, collaborative design and prototyping tool for teams, built on web standards (SVG natively) to bridge developers and designers.',
      category: 'FOSS Alternatives',
      alternativeTo: 'Figma',
      url: 'https://penpot.app/',
      catalogSource: 'opensourcealternatives.to',
      catalogUrl: 'https://www.opensourcealternatives.to/',
      freeTierLimit: '100% Free on Penpot Cloud, fully unlimited self-hosting for enterprise rails.',
      layer: 'Hosting & Delivery',
      snippet: `docker run --name penpot -d -p 9001:9001 penpotdb/backend:latest`
    },
    {
      name: 'Activepieces',
      desc: 'Open source node-based marketing and tooling workflow automation companion. Run AI prompts, sync directories, and connect 100+ services easily.',
      category: 'FOSS Alternatives',
      alternativeTo: 'Zapier & Make',
      url: 'https://www.activepieces.com/',
      catalogSource: 'opensourcealternatives.to',
      catalogUrl: 'https://www.opensourcealternatives.to/',
      freeTierLimit: '1,000 tasks/mo on cloud. Self-hosted engine is 100% free with unlimited local execution.',
      layer: 'API, AI & Logic',
      snippet: `// Self-host via Docker command\ngit clone https://github.com/activepieces/activepieces.git\ncd activepieces && docker-compose up`
    },
    {
      name: 'PostHog Suite',
      desc: 'FOSS product orchestration suite providing feature flags, intensive session recordings, A/B testing, and user analytics databases in one container.',
      category: 'FOSS Alternatives',
      alternativeTo: 'Mixpanel / Amplitude',
      url: 'https://posthog.com/',
      catalogSource: 'devresourc.es',
      catalogUrl: 'https://devresourc.es/category/open-source',
      freeTierLimit: '1,000,000 events/mo free, 15,000 session replays/mo free forever.',
      layer: 'Database & Storage',
      badge: 'Best Value',
      snippet: `import posthog from 'posthog-js'\nposthog.init('<ph_project_api_key>', {\n  api_host: 'https://us.i.posthog.com'\n})`
    },
    {
      name: 'Polar.sh',
      desc: 'Open-source payment, SaaS subscriptions, and digital products engine for developers. Built on open infrastructure, tailored specifically for GitHub active creators.',
      category: 'FOSS Alternatives',
      alternativeTo: 'Stripe Billing & Patreon',
      url: 'https://polar.sh/',
      catalogSource: 'opensourcealternatives.to',
      catalogUrl: 'https://www.opensourcealternatives.to/',
      freeTierLimit: 'Free account. Only pay-on-payout processing fees (no baseline overhead).',
      layer: 'API, AI & Logic',
      snippet: `import { Polar } from '@polar-sh/sdk';\nconst polar = new Polar({ accessToken: process.env.POLAR_ACCESS_TOKEN });`
    },

    // Public APIs (publicapis.dev)
    {
      name: 'JSONPlaceholder Sandbox',
      desc: 'High-performance public testing REST API and sandbox data stream for modern frontend prototyping. Instantly retrieves records, logs, and nested documents with zero auth overhead.',
      category: 'Public APIs',
      url: 'https://jsonplaceholder.typicode.com/',
      catalogSource: 'publicapis.dev',
      catalogUrl: 'https://publicapis.dev/',
      freeTierLimit: '100% Free, zero rate limits. Perfect for local sandboxed staging cycles.',
      layer: 'API, AI & Logic',
      snippet: `fetch('https://jsonplaceholder.typicode.com/posts/1')\n  .then(res => res.json())\n  .then(console.log)`
    },
    {
      name: 'CoinGecko API',
      desc: 'Comprehensive cryptocurrency market data tracking digital coins, volumes, exchange grids, historic performance, and contract listings details.',
      category: 'Public APIs',
      url: 'https://www.coingecko.com/en/api',
      catalogSource: 'publicapis.dev',
      catalogUrl: 'https://publicapis.dev/',
      freeTierLimit: '30 requests per minute limit, up to 10,000 database metrics free.',
      layer: 'API, AI & Logic',
      snippet: `fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')\n  .then(res => res.json())`
    },
    {
      name: 'PokeAPI',
      desc: 'All the Pokémon data you will ever need in one cleanly formatted RESTful database, covering moves, abilities, species, types, and high-res sprites.',
      category: 'Public APIs',
      url: 'https://pokeapi.co/',
      catalogSource: 'publicapis.dev',
      catalogUrl: 'https://publicapis.dev/',
      freeTierLimit: '100% Free and open, unlimited queries cached global CDN caching paths.',
      layer: 'API, AI & Logic',
      snippet: `fetch('https://pokeapi.co/api/v2/pokemon/ditto')\n  .then(res => res.json())`
    },
    {
      name: 'DiceBear Avatars',
      desc: 'Creative avatar design library with high-quality styled vector SVGs on-demand. Great for seeding users list or rendering random profile pictures.',
      category: 'Public APIs',
      url: 'https://www.dicebear.com/',
      catalogSource: 'publicapis.dev',
      catalogUrl: 'https://publicapis.dev/',
      freeTierLimit: 'Fully free open-source vector graphics endpoint. Unlimited runs.',
      layer: 'Hosting & Delivery',
      snippet: `// Image URL to load in standard tags\nconst avatarUrl = "https://api.dicebear.com/9.x/adventurer/svg?seed=Haven";`
    },

    // APIs, Data & ML (free-for.dev)
    {
      name: 'Gemini Developer API',
      desc: 'Google native Generative AI platform. Integrate top-tier text generation, multimodal processing, function execution, and embeddings directly inside the server layers.',
      category: 'AI & Data',
      url: 'https://ai.google.dev/',
      catalogSource: 'free-for.dev (apis-data-and-ml)',
      catalogUrl: 'https://free-for.dev/#/?id=apis-data-and-ml',
      freeTierLimit: 'Flash Models: 15 Requests/minute, 1,000,000 free tokens per minute, 1,500 total requests/day.',
      layer: 'API, AI & Logic',
      badge: 'Powerhouse AI',
      snippet: `import { GoogleGenAI } from '@google/genai';\nconst ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });`
    },
    {
      name: 'Hugging Face Spaces',
      desc: 'Open-access hub hosting thousands of open-weight ML models (LLMs, vision, diffusion). Deploy applications and expose API models instantly in the cloud.',
      category: 'AI & Data',
      url: 'https://huggingface.co/',
      catalogSource: 'free-for.dev (apis-data-and-ml)',
      catalogUrl: 'https://free-for.dev/#/?id=apis-data-and-ml',
      freeTierLimit: 'Deploy unlimited FOSS Spaces. Generous free default CPU container execution.',
      layer: 'Hosting & Delivery',
      snippet: `// Query inference endpoint directly\nfetch("https://api-inference.huggingface.co/models/bert-base-uncased", {\n  headers: { Authorization: "Bearer " + HF_TOKEN }\n})`
    },
    {
      name: 'Mapbox Navigation',
      desc: 'High-performance interactive vector mapping, routing matrix, address search lookup geocodes, and customized geographical vectors.',
      category: 'AI & Data',
      url: 'https://www.mapbox.com/',
      catalogSource: 'free-for.dev (apis-data-and-ml)',
      catalogUrl: 'https://free-for.dev/#/?id=apis-data-and-ml',
      freeTierLimit: '50,000 monthly map loads free. 100,000 search queries free per month.',
      layer: 'Hosting & Delivery',
      snippet: `mapboxgl.accessToken = 'YOUR_MAPBOX_KEY';\nconst map = new mapboxgl.Map({\n  container: 'map',\n  style: 'mapbox://styles/mapbox/streets-v11'\n});`
    },

    // Security & PKI (free-for.dev)
    {
      name: 'Let\'s Encrypt',
      desc: 'A free, automated, and open certificate authority brought to you by the non-profit Internet Security Research Group (ISRG). Solves TLS/SSL setups.',
      category: 'Security & DNS',
      url: 'https://letsencrypt.org/',
      catalogSource: 'free-for.dev (security-and-pki)',
      catalogUrl: 'https://free-for.dev/#/?id=security-and-pki',
      freeTierLimit: '100% Free SSL certificates, automated renewals built in to web server software.',
      layer: 'Security & DNS',
      snippet: `sudo certbot --nginx -d address.yourdomain.com`
    },
    {
      name: 'Clerk Identity',
      desc: 'Elegant, secure, drop-in user identity interface widgets providing auth, MFA security, session sync, and pre-built profile editors.',
      category: 'Security & DNS',
      url: 'https://clerk.com/',
      catalogSource: 'free-for.dev (security-and-pki)',
      catalogUrl: 'https://free-for.dev/#/?id=security-and-pki',
      freeTierLimit: 'Up to 10,000 monthly active users (MAU) completely free on non-production rails.',
      layer: 'Security & DNS',
      snippet: `import { ClerkProvider } from '@clerk/clerk-react';\n<ClerkProvider publishableKey={PUBLISHER_KEY}>`
    },

    // CDN, Web Hosting & Domain Channels
    {
      name: 'Cloudflare Proxy Grid',
      desc: 'Global speed optimization cache, free enterprise-grade DDoS shields, SSL certificates, dynamic DNS controls, page rules, and high performance WAF routing.',
      category: 'Web Hosting & CDN',
      url: 'https://www.cloudflare.com/',
      catalogSource: 'free-for.dev (cdn-and-protection)',
      catalogUrl: 'https://free-for.dev/#/?id=cdn-and-protection',
      freeTierLimit: 'Unlimited static queries, free WAF, quick subdomains, and 3 custom page paths routing.',
      layer: 'Security & DNS',
      badge: 'Infrastructure Core',
      snippet: `// Point your domain Nameservers to Cloudflare:\n// ns1.cloudflare.com\n// ns2.cloudflare.com`
    },
    {
      name: 'jsDelivr CDN',
      desc: 'A super-fast, free, multi-CDN infrastructure for open-source files. Allows instant edge-fetch mapping of npm packages, GitHub files, and WordPress plugins.',
      category: 'Web Hosting & CDN',
      url: 'https://www.jsdelivr.com/',
      catalogSource: 'free-for.dev (cdn-and-protection)',
      catalogUrl: 'https://free-for.dev/#/?id=cdn-and-protection',
      freeTierLimit: '100% Free globally, unlimited data volumes and request pipelines.',
      layer: 'Hosting & Delivery',
      snippet: `<!-- Load any file from NPM instantly -->\n<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>`
    },
    {
      name: 'Vercel Edge Cloud',
      desc: 'Developer-optimized serverless static and serverless function host. Perfect for React, Next.js, and Solid frameworks with Git-automated deployments.',
      category: 'Web Hosting & CDN',
      url: 'https://vercel.com/',
      catalogSource: 'free-for.dev (web-hosting)',
      catalogUrl: 'https://free-for.dev/#/?id=web-hosting',
      freeTierLimit: 'Unlimited non-commercial deployments, free serverless edge functions, 100GB/mo bandwidth.',
      layer: 'Hosting & Delivery',
      snippet: `npm install -g vercel\nnpx vercel deploy`
    },
    {
      name: 'Fly.io Micro VM',
      desc: 'Run arbitrary Docker containers physically close to your users. Installs actual server processes and database nodes on an edge microVM fabric.',
      category: 'Web Hosting & CDN',
      url: 'https://fly.io/',
      catalogSource: 'free-for.dev (web-hosting)',
      catalogUrl: 'https://free-for.dev/#/?id=web-hosting',
      freeTierLimit: 'Up to 3 micro-VMs (256MB RAM), 3GB persistent disk volumes, 160GB outbound bandwidth/mo.',
      layer: 'Database & Storage',
      snippet: `flyctl launch --image node:18-alpine`
    },
    {
      name: 'DuckDNS',
      desc: 'Free dynamic DNS record mapper. Binds arbitrary public IPs with persistent duckdns.org subdomains using lightweight background updater scripts.',
      category: 'Web Hosting & CDN',
      url: 'https://www.duckdns.org/',
      catalogSource: 'free-for.dev (domain)',
      catalogUrl: 'https://free-for.dev/#/?id=domain',
      freeTierLimit: 'Up to 5 custom registered domains (duckdns.org suffixes) 100% free.',
      layer: 'Security & DNS',
      snippet: `curl "https://www.duckdns.org/update?domains=MYDOMAIN&token=MYTOKEN&ip=MYIP"`
    }
  ];

  // Search & Filter States
  const [activeMainTab, setActiveMainTab] = useState<'directory' | 'resources' | 'stack' | 'webhooks' | 'ai-search' | 'api-playground'>('resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalog, setSelectedCatalog] = useState<'All' | 'opensourcealternatives.to' | 'publicapis.dev' | 'free-for.dev'>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'FOSS Alternatives' | 'Public APIs' | 'AI & Data' | 'Security & DNS' | 'Web Hosting & CDN'>('All');

  // AI Tech Stack Search States
  const [userTechStack, setUserTechStack] = useState('');
  const [aiIsSearching, setAiIsSearching] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [matchedResourceCards, setMatchedResourceCards] = useState<ResourceItem[]>([]);

  const handleSuggestAPIs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTechStack.trim()) return;
    setAiIsSearching(true);
    setAiSuggestions('');
    setMatchedResourceCards([]);

    // Get catalog API outlines
    const apiOutlines = publicResources.map(res => ({
      name: res.name,
      desc: res.desc,
      category: res.category,
      freeTierLimit: res.freeTierLimit
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'user', 
              content: `Hello! Suggest the most relevant public APIs and FOSS tools from our catalog for my current project tech stack: "${userTechStack}". Explain how each suggested tool complements my workspace setup, and output a short copy-pasteable configuration snippet.` 
            }
          ],
          systemInstruction: `You are the Expert Stack Recommendation Agent. You MUST strictly look at this array of available catalog APIs: ${JSON.stringify(apiOutlines)}. Based on the user's input tech stack, select 2 to 3 of the MOST highly complementary tools from this catalog. Explain precisely why they are suitable. You must output your recommendation in clean markdown with structured headings (e.g. '## Strategic Fit', '## Implementation Instructions'). Mention the exact names of the tools as they are written in the catalog.`
        })
      });

      if (!response.ok) {
        throw new Error('Chat API returned an error');
      }

      const data = await response.json();
      const content = data.content || '';
      setAiSuggestions(content);

      // Perform a smart sub-string inspection to find matching catalog resources which they can instantly bookmark
      const matches: ResourceItem[] = [];
      publicResources.forEach(res => {
        // Lowercase exact name matching
        if (content.toLowerCase().includes(res.name.toLowerCase())) {
          matches.push(res);
        }
      });
      setMatchedResourceCards(matches);

      // Give XP points for completing quest/AI session
      const currentXp = Number(localStorage.getItem('haven_xp') || '4250');
      localStorage.setItem('haven_xp', String(currentXp + 50));
      
      // Save AI Chat action to Copilot history so "AI Architect" is unlocked
      localStorage.setItem('haven_copilot_history', JSON.stringify([{ time: new Date().toISOString() }]));
    } catch (e: any) {
      console.error(e);
      setAiSuggestions(`### Integration Consult Timeout\nFailed to map stack variables at this time: ${e.message || 'Server did not respond'}`);
    } finally {
      setAiIsSearching(false);
    }
  };
  
  // Workspace Stack State (Favorites / Composed Architecture)
  const [workspaceStack, setWorkspaceStack] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('haven_active_stack');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    // Pre-populate with a neat starter stack
    return [
      publicResources[0], // Supabase
      publicResources[10], // Gemini API
      publicResources[13], // Cloudflare
      publicResources[15]  // Vercel
    ];
  });

  useEffect(() => {
    localStorage.setItem('haven_active_stack', JSON.stringify(workspaceStack));
  }, [workspaceStack]);

  const isLoggedIn = localStorage.getItem('haven_session') === 'active';

  // Load and save resource bookmarks
  const [bookmarks, setBookmarks] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('haven_bookmarks_resources');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const toggleBookmark = (res: ResourceItem) => {
    const isBookmarked = bookmarks.some(item => item.name === res.name);
    let newBookmarks = [];
    if (isBookmarked) {
      newBookmarks = bookmarks.filter(item => item.name !== res.name);
    } else {
      newBookmarks = [...bookmarks, res];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('haven_bookmarks_resources', JSON.stringify(newBookmarks));
  };

  // Code inspection helper
  const [inspectingResource, setInspectingResource] = useState<ResourceItem | null>(publicResources[10] /* Default to Gemini */);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // App directory categories lookup
  const categories = ['All', 'Dev Tools', 'Database', 'Auth & Security', 'App Hosting', 'Analytics', 'Comms', 'Finance'];
  const [activeAppCategory, setActiveAppCategory] = useState('All');

  // Filter existing integrations
  const filteredIntegrations = integrations.filter(
    (app) => activeAppCategory === 'All' || app.category === activeAppCategory
  );

  // Filter public directory items
  const filteredResources = publicResources.filter((res) => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (res.alternativeTo && res.alternativeTo.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCatalog = selectedCatalog === 'All' || res.catalogSource.includes(selectedCatalog);
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    return matchesSearch && matchesCatalog && matchesCategory;
  });

  const toggleStackItem = (res: ResourceItem) => {
    const exists = workspaceStack.some(item => item.name === res.name);
    if (exists) {
      setWorkspaceStack(prev => prev.filter(item => item.name !== res.name));
    } else {
      setWorkspaceStack(prev => [...prev, res]);
    }
  };

  const clearStack = () => {
    setWorkspaceStack([]);
  };

  const copyCodeSnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-14 fade-in min-h-screen">
      
      {/* Visual Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b pb-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <Badge variant="secondary" className="w-fit mb-2 flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono tracking-wide text-[10px]">
             <Sparkles className="w-3 h-3 text-emerald-400" /> Platform Ecosystem
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Integrations & Resources</h1>
          <p className="text-muted-foreground text-md md:text-lg mt-2 font-normal">
            Automate workspace webhooks, connect SaaS modules, or explore hundreds of zero-dollar developer resources, open-source alternatives, and public APIs parsed in real-time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Button variant="outline" asChild className="text-xs h-9">
            <Link to="/settings"><Settings className="w-3.5 h-3.5 mr-1.5" /> API Keys & Setup</Link>
          </Button>
          <Button className="text-xs h-9" onClick={() => setActiveMainTab('stack')}>
            <Layers className="w-3.5 h-3.5 mr-1.5" /> View Active Stack ({workspaceStack.length})
          </Button>
        </div>
      </div>

      {/* Main Tab Bar Switching */}
      <div className="flex flex-col space-y-6">
        <div className="border-b border-border/60 pb-1.5 flex overflow-x-auto scrollbar-hide shrink-0 gap-8">
          <button 
            onClick={() => setActiveMainTab('resources')}
            className={`pb-3 text-sm font-bold tracking-tight border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === 'resources' 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Globe className="w-4 h-4" /> 
            FOSS & API Directory
            <span className="bg-primary/10 text-foreground text-[10px] font-mono px-1.5 py-0.5 rounded-full">{publicResources.length}</span>
          </button>

          <button 
            onClick={() => setActiveMainTab('stack')}
            className={`pb-3 text-sm font-bold tracking-tight border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === 'stack' 
                ? 'border-emerald-500 text-emerald-400' 
                : 'border-transparent text-muted-foreground hover:text-emerald-400/85'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-500" /> 
            Active Stack Builder
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded-full">{workspaceStack.length}</span>
          </button>
          
          <button 
            onClick={() => setActiveMainTab('directory')}
            className={`pb-3 text-sm font-bold tracking-tight border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === 'directory' 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Puzzle className="w-4 h-4" /> Workspace Connections
          </button>

          <button 
            onClick={() => setActiveMainTab('webhooks')}
            className={`pb-3 text-sm font-bold tracking-tight border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === 'webhooks' 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Webhook className="w-4 h-4" /> Webhooks & Events
          </button>

          <button 
            onClick={() => setActiveMainTab('ai-search')}
            className={`pb-3 text-sm font-bold tracking-tight border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === 'ai-search' 
                ? 'border-purple-500 text-purple-400 font-extrabold' 
                : 'border-transparent text-muted-foreground hover:text-purple-400/85'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> 
            AI Stack Copilot 🤖
            <span className="bg-purple-500/10 text-purple-400 text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold">SMART</span>
          </button>

          <button 
            onClick={() => setActiveMainTab('api-playground')}
            className={`pb-3 text-sm font-bold tracking-tight border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeMainTab === 'api-playground' 
                ? 'border-indigo-500 text-indigo-400 font-extrabold' 
                : 'border-transparent text-muted-foreground hover:text-indigo-400/85'
            }`}
          >
            <Code className="w-4 h-4 text-indigo-400" /> 
            API Sandbox Playground ⚡
            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-mono px-1.5 py-0.5 rounded-full font-black">ACTIVE</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: RESOURCE DIRECTORY & OPEN-SOURCE EXPLORER
            ======================================================== */}
        {activeMainTab === 'resources' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
            
            {/* Sidebar Filters */}
            <aside className="lg:col-span-3 space-y-6">
              
              {/* Category selector */}
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1 select-none">
                  FOSS Catalogs
                </h3>
                <div className="flex flex-col space-y-1">
                  {(['All', 'opensourcealternatives.to', 'publicapis.dev', 'free-for.dev'] as const).map((source) => (
                    <button
                      key={source}
                      onClick={() => setSelectedCatalog(source)}
                      className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                        selectedCatalog === source
                          ? 'bg-secondary text-secondary-foreground font-bold'
                          : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                      }`}
                    >
                      <span className="truncate">{source === 'All' ? 'All Original Catalogs' : source}</span>
                      {selectedCatalog === source && <Check className="w-3.5 h-3.5 text-primary ml-1 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border/40" />

              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1 select-none">
                  Directories
                </h3>
                <div className="flex flex-col space-y-1">
                  {(['All', 'FOSS Alternatives', 'Public APIs', 'AI & Data', 'Security & DNS', 'Web Hosting & CDN'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-secondary text-secondary-foreground font-bold'
                          : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                      }`}
                    >
                      <span>{cat === 'All' ? 'All Channels' : cat}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-primary ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Informative helper box */}
              <div className="bg-muted/20 border rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs">Origin References</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  These verified entries are compiled directly from curated free software directories. Use <strong>opensourcealternatives.to</strong> to replace subscriptions, and <strong>free-for.dev</strong> to host your edge infrastructure for $0.
                </p>
                <div className="pt-1 flex flex-col space-y-1 text-[10px] font-semibold text-primary/80 font-mono">
                  <a href="https://www.opensourcealternatives.to/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                    <Link2 className="w-3 h-3" /> FOSS Alternatives <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://publicapis.dev/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                    <Link2 className="w-3 h-3" /> PublicAPIs.dev <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://free-for.dev/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                    <Link2 className="w-3 h-3" /> Free-For-Developers <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Area: Resources List + Interactive Inspector */}
            <main className="lg:col-span-9 space-y-6">
              
              {/* Top Search Utilities */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" />
                <input
                  type="text"
                  placeholder="Search resources, technology names, or 'Figma alternative'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card border border-border text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-all"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                
                {/* Scrollable list mapping */}
                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredResources.length === 0 ? (
                    <div className="border border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                      <HelpCircle className="w-8 h-8 text-muted-foreground mb-2" />
                      <h4 className="font-bold text-sm text-foreground">No matches found</h4>
                      <p className="text-xs text-muted-foreground max-w-xs mt-1">Try refining search parameters or reset resource channels filters.</p>
                      <Button size="sm" variant="outline" className="mt-3 text-xs" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedCatalog('All'); }}>Reset Filter</Button>
                    </div>
                  ) : (
                    filteredResources.map((res) => {
                      const isAdded = workspaceStack.some(item => item.name === res.name);
                      const isInspecting = inspectingResource?.name === res.name;
                      return (
                        <div 
                          key={res.name}
                          onClick={() => setInspectingResource(res)}
                          className={`group border rounded-xl p-4.5 bg-background hover:bg-card/30 transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                            isInspecting ? 'border-primary ring-1 ring-primary bg-card/10 shadow-md' : 'border-border/60 hover:border-border'
                          }`}
                        >
                          {/* Card Content Row */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-start gap-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <h4 className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors">{res.name}</h4>
                                {res.badge && <Badge className="text-[8px] bg-primary/10 text-foreground border-transparent px-1.5 py-0">{res.badge}</Badge>}
                              </div>
                              <span className="text-[10px] font-mono font-bold text-muted-foreground/80 lowercase bg-secondary px-1.5 py-0.5 rounded">
                                {res.category}
                              </span>
                            </div>

                            {/* Alternative mapping line (FOSS Alternatives) */}
                            {res.alternativeTo && (
                              <div className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 shrink-0" /> Alternative to: <span className="underline">{res.alternativeTo}</span>
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-3">
                              {res.desc}
                            </p>
                          </div>

                          {/* Detail & Action row */}
                          <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground text-[10px] font-mono leading-none truncate max-w-[150px]">
                              Catalog: {res.catalogSource}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStackItem(res);
                                }}
                                className={`flex items-center gap-1 px-2.2 h-7 rounded font-bold transition-all text-[10px] ${
                                  isAdded 
                                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' 
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" /> Loaded
                                  </>
                                ) : (
                                  <>
                                    <PlusCircle className="w-3 h-3" /> Stack
                                  </>
                                )}
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isLoggedIn) {
                                    alert('Please Sign In or Join Haven to save resources to your profile!');
                                    return;
                                  }
                                  toggleBookmark(res);
                                }}
                                className={`flex items-center justify-center w-7 h-7 rounded border transition-all ${
                                  bookmarks.some(item => item.name === res.name)
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                                    : 'bg-transparent border-border/80 text-muted-foreground hover:text-foreground hover:border-border'
                                }`}
                                title={bookmarks.some(item => item.name === res.name) ? "Remove Bookmarked resource" : "Bookmark resource to profile"}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={bookmarks.some(item => item.name === res.name) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Interactive live blueprint code inspector pane */}
                <div className="border border-border/80 bg-card rounded-2xl p-5 sticky top-6 self-start flex flex-col gap-4 shadow-sm min-h-[500px]">
                  {inspectingResource ? (
                    <div className="space-y-4 flex flex-col h-full animate-in fade-in duration-300">
                      
                      {/* Name Plate */}
                      <div className="border-b pb-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-semibold tracking-wider text-muted-foreground uppercase">
                            RESOURCE_INSPECTOR_V1
                          </span>
                          <a 
                            href={inspectingResource.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                          >
                            Explore Site <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <h2 className="text-xl font-black text-foreground tracking-tight">{inspectingResource.name}</h2>
                        
                        {inspectingResource.alternativeTo && (
                          <div className="inline-flex items-center gap-1.5 bg-emerald-500/5 text-emerald-400 border border-emerald-500/15 rounded-md px-2.5 py-1 text-xs font-mono font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Replaces: {inspectingResource.alternativeTo}
                          </div>
                        )}
                      </div>

                      {/* Info lines */}
                      <div className="space-y-3.5 text-xs">
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Description:</span>
                          <p className="text-muted-foreground leading-relaxed font-normal">{inspectingResource.desc}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3.5 bg-muted/20 p-3.5 rounded-xl border">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[9px] uppercase font-bold text-muted-foreground block">Network Layer:</span>
                            <span className="font-semibold text-foreground text-[11px] flex items-center gap-1">
                              <Layers className="w-3 h-3 shrink-0 text-primary" /> {inspectingResource.layer}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-mono text-[9px] uppercase font-bold text-muted-foreground block">Monthly Cost:</span>
                            <span className="font-extrabold text-emerald-400 text-[11px]">$0.00 / mo</span>
                          </div>
                        </div>

                        <div className="space-y-1 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                          <span className="font-mono text-[9px] uppercase font-bold text-emerald-400/80 tracking-wider block">Free Tier Inclusions / Scope:</span>
                          <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">{inspectingResource.freeTierLimit}</p>
                        </div>
                      </div>

                      {/* Code snapshot block */}
                      <div className="space-y-2 flex-grow">
                        <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground">
                          <span className="font-bold uppercase">INTEGRATION_BOILERPLATE</span>
                          <button 
                            onClick={() => copyCodeSnippet(inspectingResource.snippet)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-white hover:text-white/80 active:scale-95 transition-all bg-secondary/80 px-2 py-0.5 rounded border border-input"
                          >
                            {copiedSnippet ? <><Check className="w-2.5 h-2.5 text-emerald-400" /> Copied</> : <><Copy className="w-2.5 h-2.5" /> Copy Code</>}
                          </button>
                        </div>
                        <pre className="p-3.5 bg-black rounded-lg text-zinc-300 font-mono text-[10px] leading-relaxed overflow-x-auto border">
                          <code>{inspectingResource.snippet}</code>
                        </pre>
                      </div>

                      {/* Stack manipulation action bottom */}
                      <div className="flex gap-2 w-full mt-auto">
                        <Button 
                          onClick={() => toggleStackItem(inspectingResource)}
                          variant={workspaceStack.some(item => item.name === inspectingResource.name) ? 'outline' : 'default'}
                          className="flex-grow text-xs font-bold"
                        >
                          {workspaceStack.some(item => item.name === inspectingResource.name) ? (
                            <>Remove from Project Stack</>
                          ) : (
                            <>Add to Active Stack ($0/mo)</>
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            if (!isLoggedIn) {
                              alert('Please Sign In or Join Haven to save resources to your profile!');
                              return;
                            }
                            toggleBookmark(inspectingResource);
                          }}
                          variant="outline"
                          className={`px-3 ${
                            bookmarks.some(item => item.name === inspectingResource.name)
                              ? 'border-amber-500/30 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                          title={bookmarks.some(item => item.name === inspectingResource.name) ? "Remove Bookmark" : "Save Bookmark to Profile"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={bookmarks.some(item => item.name === inspectingResource.name) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                        </Button>
                      </div>

                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 select-none">
                      <Layers className="w-10 h-10 text-muted-foreground mb-3 animate-pulse" />
                      <h4 className="font-bold text-sm text-foreground">Select a Developer Resource</h4>
                      <p className="text-xs text-muted-foreground max-w-sm mt-1">
                        Click on any public API, open-source repository, or hosting platform listing to read documentation snippets, scopes, and boilerplate imports.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </main>
          </div>
        )}

        {/* ========================================================
            TAB 2: ACTIVE STACK BUILDER & SANDBOX
            ======================================================== */}
        {activeMainTab === 'stack' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/25 border p-5 rounded-2xl">
              <div className="space-y-1.5 max-w-2xl">
                <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" /> Visual Stack Blueprint Composer
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-normal">
                  Toggle open-source resources or public APIs to draft a completely serverless, enterprise-grade architecture. All featured services inside HAVEN have free developer limits, meaning your composed infrastructure maintains a net operating expenditure of exactly <strong>$0.00 / month</strong>.
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto self-end md:self-center shrink-0">
                <Button size="sm" variant="outline" onClick={clearStack} disabled={workspaceStack.length === 0} className="text-xs h-9 text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear Stack
                </Button>
                <Button size="sm" onClick={() => copyCodeSnippet(JSON.stringify(workspaceStack, null, 2))} disabled={workspaceStack.length === 0} className="text-xs h-9 bg-emerald-600 hover:bg-emerald-500">
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> Export Stack JSON
                </Button>
              </div>
            </div>

            {workspaceStack.length === 0 ? (
              <div className="border border-dashed border-border/80 rounded-2xl p-16 text-center max-w-3xl mx-auto space-y-4">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-lg">Your Workspace Stack is currently empty</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Browse the curated FOSS & Public API directory and click <strong>Add to Stack</strong> on databases, hosting services, security blocks, or ML keys to map out your infrastructure blueprint.
                </p>
                <Button size="sm" onClick={() => setActiveMainTab('resources')} className="text-xs bg-primary">
                  Browse Directory Hub
                </Button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Flow and Diagram Blueprint Mapping Column (lg:col-span-8) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Visual flowchart container */}
                  <div className="border rounded-2xl bg-black/40 p-6 shadow-md relative overflow-hidden space-y-6 min-h-[400px] flex flex-col justify-between">
                    
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />

                    {/* Metadata Header line */}
                    <div className="flex items-center justify-between border-b pb-4 select-none">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span className="font-mono text-[10px] uppercase font-extrabold text-emerald-400">BLUEPRINT_SCHEMATIC_ACTIVE</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-muted-foreground">TOTAL EST. COMPUTE COST: $0.00 / mo</span>
                    </div>

                    {/* Infrastructure Layers Map */}
                    <div className="grid sm:grid-cols-4 gap-4 relative z-10 py-6 items-start">
                      
                      {/* Layer A: Security & DNS */}
                      <div className="space-y-3">
                        <div className="border border-border bg-card/60 rounded-lg p-2 flex items-center gap-1.5 justify-center select-none">
                          <Lock className="w-3.5 h-3.5 text-primary" />
                          <span className="font-mono text-[9px] font-bold tracking-wider text-muted-foreground uppercase">1. Security/DNS</span>
                        </div>
                        <div className="space-y-2">
                          {workspaceStack.filter(item => item.layer === 'Security & DNS').length === 0 ? (
                            <div className="border border-dashed border-border/60 rounded-xl p-3 text-center text-muted-foreground text-[10px] font-mono select-none">
                              No DNS layer
                            </div>
                          ) : (
                            workspaceStack.filter(item => item.layer === 'Security & DNS').map(item => (
                              <div key={item.name} className="bg-muted/15 border border-primary/10 rounded-xl p-3 text-center shadow-sm relative group">
                                <h5 className="font-bold text-[12px] text-foreground">{item.name}</h5>
                                <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">DDoS / Auth Protection</p>
                                <button onClick={() => toggleStackItem(item)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-rose-400 hover:bg-rose-500/10 rounded">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Layer B: Static & CDN */}
                      <div className="space-y-3 relative">
                        {/* Connecting Line Vector (Arrow) */}
                        <div className="hidden sm:block absolute top-[15px] -left-3 h-0.5 w-6 bg-border" />
                        
                        <div className="border border-border bg-card/60 rounded-lg p-2 flex items-center gap-1.5 justify-center select-none">
                          <Globe className="w-3.5 h-3.5 text-primary" />
                          <span className="font-mono text-[9px] font-bold tracking-wider text-muted-foreground uppercase">2. CDN/Static</span>
                        </div>
                        <div className="space-y-2">
                          {workspaceStack.filter(item => item.layer === 'Hosting & Delivery').length === 0 ? (
                            <div className="border border-dashed border-border/60 rounded-xl p-3 text-center text-muted-foreground text-[10px] font-mono select-none">
                              No Delivery layer
                            </div>
                          ) : (
                            workspaceStack.filter(item => item.layer === 'Hosting & Delivery').map(item => (
                              <div key={item.name} className="bg-muted/15 border border-primary/10 rounded-xl p-3 text-center shadow-sm relative group">
                                <h5 className="font-bold text-[12px] text-foreground">{item.name}</h5>
                                <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">Frontend / static files</p>
                                <button onClick={() => toggleStackItem(item)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-rose-400 hover:bg-rose-500/10 rounded">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Layer C: Logic & APIs */}
                      <div className="space-y-3 relative">
                        {/* Connecting Line Vector (Arrow) */}
                        <div className="hidden sm:block absolute top-[15px] -left-3 h-0.5 w-6 bg-border" />

                        <div className="border border-border bg-card/60 rounded-lg p-2 flex items-center gap-1.5 justify-center select-none">
                          <Code className="w-3.5 h-3.5 text-primary" />
                          <span className="font-mono text-[9px] font-bold tracking-wider text-muted-foreground uppercase">3. Logic/APIs</span>
                        </div>
                        <div className="space-y-2">
                          {workspaceStack.filter(item => item.layer === 'API, AI & Logic').length === 0 ? (
                            <div className="border border-dashed border-border/60 rounded-xl p-3 text-center text-muted-foreground text-[10px] font-mono select-none">
                              No API layer
                            </div>
                          ) : (
                            workspaceStack.filter(item => item.layer === 'API, AI & Logic').map(item => (
                              <div key={item.name} className="bg-muted/15 border border-primary/10 rounded-xl p-3 text-center shadow-sm relative group">
                                <h5 className="font-bold text-[12px] text-foreground">{item.name}</h5>
                                <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">Severless API route</p>
                                <button onClick={() => toggleStackItem(item)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-rose-400 hover:bg-rose-500/10 rounded">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Layer D: Data Store */}
                      <div className="space-y-3 relative">
                        {/* Connecting Line Vector (Arrow) */}
                        <div className="hidden sm:block absolute top-[15px] -left-3 h-0.5 w-6 bg-border" />

                        <div className="border border-border bg-card/60 rounded-lg p-2 flex items-center gap-1.5 justify-center select-none">
                          <Database className="w-3.5 h-3.5 text-primary" />
                          <span className="font-mono text-[9px] font-bold tracking-wider text-muted-foreground uppercase">4. Data Store</span>
                        </div>
                        <div className="space-y-2">
                          {workspaceStack.filter(item => item.layer === 'Database & Storage').length === 0 ? (
                            <div className="border border-dashed border-border/60 rounded-xl p-3 text-center text-muted-foreground text-[10px] font-mono select-none">
                              No Storage layer
                            </div>
                          ) : (
                            workspaceStack.filter(item => item.layer === 'Database & Storage').map(item => (
                              <div key={item.name} className="bg-muted/15 border border-primary/10 rounded-xl p-3 text-center shadow-sm relative group">
                                <h5 className="font-bold text-[12px] text-foreground">{item.name}</h5>
                                <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">Postgres / edge database</p>
                                <button onClick={() => toggleStackItem(item)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-rose-400 hover:bg-rose-500/10 rounded">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Graphic system indicators summary info */}
                    <div className="pt-4 border-t border-border/30 text-xs text-muted-foreground flex flex-col md:flex-row md:items-center justify-between gap-3 font-normal select-none">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Layer dependencies resolved successfully.
                      </span>
                      <span className="text-[10px] font-mono text-primary/80 uppercase">All connections route securely on HAVEN backbones</span>
                    </div>

                  </div>

                  {/* Complete Stack setup instructions list */}
                  <div className="space-y-4">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
                      Composed Architecture Stack Manifest
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {workspaceStack.map((item, idx) => (
                        <Card key={item.name} className="border border-border/60 bg-card hover:bg-card/70 transition-all flex flex-col justify-between">
                          <CardHeader className="p-4 flex flex-row items-start justify-between">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">NODE A{idx+1}</span>
                              <CardTitle className="text-sm font-extrabold">{item.name}</CardTitle>
                            </div>
                            <Badge variant="outline" className="text-[8px] tracking-wider uppercase font-mono px-1.5 py-0 bg-muted">{item.layer}</Badge>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-3 font-normal">
                              {item.desc}
                            </p>
                            <div className="p-2 py-1.5 bg-muted/30 border rounded-lg text-[10px] font-mono flex items-center justify-between">
                              <span className="text-muted-foreground">Free Tier Limit:</span>
                              <span className="text-[9px] truncate max-w-[150px] font-semibold text-primary/90">{item.freeTierLimit}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right hand setup configuration companion side panel (lg:col-span-4) */}
                <div className="lg:col-span-4 space-y-6">
                   <div className="border border-border/80 bg-card rounded-2xl p-5 shadow-sm space-y-4 flex flex-col min-h-[450px]">
                      <div className="border-b pb-4 space-y-2 select-none">
                        <span className="font-mono text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">ENVIRONMENT_GENERATOR_V1</span>
                        <h3 className="text-md font-extrabold tracking-tight">Active Stack YAML Blueprint</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Your active serverless design mapped into an optimized edge worker deploy configuration structure.
                        </p>
                      </div>

                      {/* Compiled template output block */}
                      <div className="space-y-2 flex-grow flex flex-col justify-between">
                         <div className="space-y-2">
                           <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground select-none">
                             <span className="font-bold uppercase">compiled_infrastructure.yaml</span>
                             <button
                               onClick={() => {
                                 const stackYaml = `haven_blueprint:\n  version: "2026-v1"\n  workspace: "haven_community"\n  total_compute_cost: "$0.00/mo"\n  nodes:\n` + workspaceStack.map((item, idx) => `    - name: "${item.name}"\n      layer: "${item.layer}"\n      free_tier_scope: "${item.freeTierLimit}"\n      doc_source: "${item.url}"\n`).join('');
                                 copyCodeSnippet(stackYaml);
                               }}
                               className="inline-flex items-center gap-1 text-[10px] font-bold text-white hover:text-white/80 active:scale-95 transition-all bg-secondary/80 px-2 py-0.5 rounded border border-input"
                             >
                               {copiedSnippet ? <><Check className="w-2.5 h-2.5 text-emerald-400" /> Copied</> : <><Copy className="w-2.5 h-2.5" /> Copy YAML</>}
                             </button>
                           </div>
                           <pre className="p-3.5 bg-black rounded-lg text-emerald-400 font-mono text-[9px] leading-relaxed overflow-x-auto shadow-inner border max-h-[250px]">
<code>{`# Auto-generated by HAVEN Workspace
haven_blueprint:
  version: "2026-v1"
  workspace: "haven_community"
  total_compute_cost: "$0.00/mo"
  nodes:${workspaceStack.map((item) => `
    - name: "${item.name}"
      layer: "${item.layer}"
      free_tier_scope: "${item.freeTierLimit}"
      doc_source: "${item.url}"`).join('')}
`}</code>
                           </pre>
                         </div>

                         <div className="bg-muted/15 border p-3 rounded-xl mt-4 space-y-1.5 font-normal text-xs text-muted-foreground">
                            <span className="font-mono text-[9px] uppercase font-bold text-primary block flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5 text-yellow-400" /> Prototyping Quick Tip</span>
                            <p className="leading-relaxed text-[11px]">
                              Ready to build real software? Connect these entities by grabbing credentials from the developers panels. All database tables can be structured securely via our Turso SQL console or Firestore.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: APP INTEGRATIONS AND PLUGINS (Existing)
            ======================================================== */}
        {activeMainTab === 'directory' && (
          <div className="grid lg:grid-cols-4 gap-8 animate-in fade-in duration-300">
             <aside className="lg:col-span-1">
                <nav className="flex flex-col space-y-1 sticky top-6">
                   <h3 className="font-bold text-xs mb-3 px-3 uppercase tracking-wider text-muted-foreground font-mono">Workspace Directory</h3>
                   
                   {categories.map((cat) => (
                     <button
                       key={cat}
                       onClick={() => setActiveAppCategory(cat)}
                       className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                         activeAppCategory === cat 
                           ? 'bg-secondary text-secondary-foreground font-bold' 
                           : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                       }`}
                     >
                       <span>{cat === 'All' ? 'All Connections' : cat}</span>
                       {cat === 'All' && <span className="bg-background text-foreground text-xs rounded-full px-2 py-0.5 border font-mono">{integrations.length}</span>}
                     </button>
                   ))}
                </nav>
             </aside>

             <main className="lg:col-span-3">
                <div className="grid sm:grid-cols-2 gap-4">
                   {filteredIntegrations.map((app) => (
                      <Card key={app.name} className="hover:border-primary/50 transition-colors bg-background flex flex-col justify-between">
                         <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                               <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${app.connected ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                  <app.icon className="w-6 h-6" />
                               </div>
                               {app.connected ? (
                                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-none flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Bound</Badge>
                               ) : (
                                  <Badge variant="outline" className="text-muted-foreground">{app.category}</Badge>
                               )}
                            </div>
                            <h3 className="text-lg font-bold mb-1">{app.name}</h3>
                            <p className="text-xs text-muted-foreground mb-6 leading-relaxed line-clamp-2">{app.desc}</p>
                            
                            <Button variant={app.connected ? "outline" : "secondary"} className="w-full text-xs font-semibold">
                               {app.connected ? 'Configure Integration' : 'Activate Credentials'}
                            </Button>
                         </CardContent>
                      </Card>
                   ))}
                </div>
             </main>
          </div>
        )}

        {/* ========================================================
            TAB 4: ACTIVE WEBHOOKS & ENDPOINTS (Existing)
            ======================================================== */}
        {activeMainTab === 'webhooks' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
             <Card className="bg-background">
                <CardHeader>
                   <CardTitle>Active Webhook Subscription Endpoints</CardTitle>
                   <CardDescription>Configure HAVEN to automatically trigger webhooks and POST event updates directly to external URLs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-xl bg-muted/10">
                      <div className="flex items-start gap-4 mb-4 sm:mb-0">
                         <div className="text-primary mt-1 p-2 bg-muted rounded-lg"><Webhook className="w-5 h-5" /></div>
                         <div>
                            <p className="font-extrabold text-sm">Production Alerts Sync</p>
                            <p className="text-[11px] font-mono text-muted-foreground mt-1">https://api.myapp.com/haven/webhook</p>
                            <div className="flex gap-2 mt-2">
                               <Badge variant="outline" className="text-[9px] font-mono bg-background">post.created</Badge>
                               <Badge variant="outline" className="text-[9px] font-mono bg-background">member.joined</Badge>
                            </div>
                         </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                         <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs font-bold leading-none h-8">Edit</Button>
                         <Button variant="outline" size="sm" className="text-rose-400 hover:bg-rose-500/10 border-rose-500/10 flex-1 sm:flex-none text-xs font-bold leading-none h-8">Revoke</Button>
                      </div>
                   </div>

                   <div className="border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center bg-card/40">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-3">
                         <Webhook className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-sm mb-1">Create Webhook Router</h4>
                      <p className="text-xs text-muted-foreground max-w-sm mb-4">Listen to architectural events across your workspaces (like community posts, commits, or issue alerts) to feed Slack, Discord, or custom servers.</p>
                      <Button size="sm" className="text-xs font-bold h-8"><PlusCircle className="w-4 h-4 mr-2" /> Add Endpoint</Button>
                   </div>
                </CardContent>
             </Card>
          </div>
        )}

        {/* ========================================================
            TAB 5: AI STACK COPILOT SEARCH & RECOMMEND (Smart AI Search)
            ======================================================== */}
        {activeMainTab === 'ai-search' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            <Card className="border border-purple-500/20 bg-card/60 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-xl font-extrabold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  AI Stack Integrations Copilot
                </CardTitle>
                <CardDescription className="text-xs">
                  Provide your project's technology stack (e.g. frontend, backend database, hosting). Haven's AI instantly scans our FOSS catalog to recommend complementary tools, integrations, and ready-to-use boilerplate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSuggestAPIs} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                      Enter Tech Stack (Comma Separated)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={userTechStack}
                        onChange={(e) => setUserTechStack(e.target.value)}
                        placeholder="e.g. Next.js, Express, Redis, Tailwind CSS"
                        className="flex-grow bg-muted/60 border border-border rounded-xl text-xs px-4 py-3 outline-none focus:border-purple-500/55 transition-colors text-foreground font-semibold"
                        required
                      />
                      <Button 
                        type="submit" 
                        disabled={aiIsSearching}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 h-11 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        {aiIsSearching ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Consulting Gemini...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Suggest Integrations
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap pt-1.5">
                    <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase shrink-0">Try Presets:</span>
                    {["React + Workers", "Next.js + PostgreSQL", "Go + Vue + Redis"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setUserTechStack(preset)}
                        className="text-[10px] px-2 py-0.5 rounded bg-muted/80 border border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground font-mono transition-all"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* AI Results Block */}
            {(aiSuggestions || aiIsSearching) && (
              <div className="space-y-6">
                <Card className="border border-border shadow-sm">
                  <CardHeader className="bg-muted/10 border-b border-border/40 py-4 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 px-1.5 bg-purple-500/10 text-purple-400 rounded-md font-mono text-[10px] font-bold">ANALYSIS STATUS</div>
                      <span className="text-xs font-semibold text-muted-foreground">Generated via Gemini Generative-AI</span>
                    </div>
                    {aiIsSearching && <span className="text-[10px] text-purple-400 font-bold font-mono uppercase animate-pulse">Running Deep Mapping...</span>}
                  </CardHeader>
                  <CardContent className="p-6">
                    {aiIsSearching ? (
                      <div className="space-y-4 py-6">
                        <div className="h-4 bg-muted rounded-full w-3/4 animate-pulse" />
                        <div className="h-4 bg-muted rounded-full w-5/6 animate-pulse" />
                        <div className="h-4 bg-muted rounded-full w-2/3 animate-pulse" />
                        <div className="h-4 bg-muted rounded-full w-1/2 animate-pulse" />
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none text-xs text-foreground/95 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                        {aiSuggestions}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Interactive Recommended Catalog Item Match Cards */}
                {matchedResourceCards.length > 0 && !aiIsSearching && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-500 animate-ping shrink-0" />
                      <h3 className="font-bold text-sm tracking-tight text-foreground">Actionable Matches Found in Catalog ({matchedResourceCards.length})</h3>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {matchedResourceCards.map((res) => {
                        const isBookmarked = bookmarks.some(b => b.name === res.name);
                        return (
                          <Card key={res.name} className="hover:border-purple-500/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between hover:shadow-md bg-card">
                            <CardHeader className="p-5 pb-3">
                              <div className="flex justify-between items-start gap-4">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-extrabold text-sm text-foreground truncate">{res.name}</span>
                                    {res.badge && <Badge className="text-[8px] bg-primary/10 text-foreground px-1.5 py-0 leading-none">{res.badge}</Badge>}
                                  </div>
                                  <CardDescription className="text-xs mt-1.5 leading-relaxed line-clamp-2">{res.desc}</CardDescription>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleBookmark(res)}
                                  className={`h-8 w-8 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                                    isBookmarked 
                                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 font-extrabold' 
                                      : 'bg-muted border-border text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                  }`}
                                  title={isBookmarked ? "Delete saved resource" : "Save resource directly"}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                                </button>
                              </div>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 space-y-3 mt-auto">
                              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider font-mono bg-purple-500/5 p-1 px-2 rounded-md w-fit">
                                Fits: {res.layer}
                              </p>
                              <div className="bg-muted/20 border p-2 rounded-lg text-[10px] font-mono flex items-center justify-between gap-2 overflow-hidden">
                                <span className="text-zinc-400 truncate">{res.freeTierLimit}</span>
                                <a href={res.url} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline shrink-0 text-[10px] whitespace-nowrap">Explore &rarr;</a>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeMainTab === 'api-playground' && (
          <div className="animate-in fade-in duration-300">
            <UnifiedApiHub />
          </div>
        )}

      </div>

    </div>
  );
}
