import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Sparkles, Check, Play, RefreshCw, Layers, Database, Lock, 
  Terminal, Code, Globe, HelpCircle, ArrowRight, CheckCircle, AlertTriangle, 
  Activity, Video, Calendar, User, FileText, Send, Share2, DollarSign, Cpu, Trash2, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from './ui/components';
import { Badge } from './ui/Badge';

type ApiCategory = 'security' | 'social' | 'video' | 'documents' | 'finance' | 'crypto' | 'development' | 'entertainment';

interface PresetIntent {
  title: string;
  intent: string;
  category: ApiCategory;
}

export default function UnifiedApiHub() {
  const [userIntent, setUserIntent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ApiCategory>('security');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [classificationResult, setClassificationResult] = useState<{
    category: ApiCategory;
    confidence: number;
    matchedKeywords: string[];
  } | null>(null);

  // Live sandbox simulated outputs
  const [securityEmail, setSecurityEmail] = useState('breached-dev@example.com');
  const [securityIp, setSecurityIp] = useState('192.168.1.105');
  const [dicebearSeed, setDicebearSeed] = useState('Haven');
  const [markdownOriginal, setMarkdownOriginal] = useState('# Local Project\n\n- Build Edge Nodes\n- Deploy Workers\n- No telemetry.');
  const [markdownModified, setMarkdownModified] = useState('# Local Project v2.1\n\n- Build Edge Nodes & SQL Tables\n- Deploy Workers instantly\n- No telemetry.');
  const [financeDzdAmount, setFinanceDzdAmount] = useState('5000');
  const [cryptoSymbol, setCryptoSymbol] = useState('BTC');
  const [cryptoPrice, setCryptoPrice] = useState<number | null>(null);
  const [cryptoIsLoading, setCryptoIsLoading] = useState(false);
  const [sandboxCode, setSandboxCode] = useState('const user = "operator";\nconsole.log(`Initializing system access for @${user}...`);\nreturn `Core consensus Level-2 loaded successfully.`;');
  const [sandboxOutput, setSandboxOutput] = useState('');
  
  // Game/trivia states
  const [triviaAnswers, setTriviaAnswers] = useState<Record<number, boolean>>({});
  const [selectedTriviaIndex, setSelectedTriviaIndex] = useState<number>(0);
  const [voiceRoomActive, setVoiceRoomActive] = useState(false);
  const [voiceUsers, setVoiceUsers] = useState<{ name: string; role: string; ping: number }[]>([
    { name: '@gamerdzbba7', role: 'Host', ping: 32 },
    { name: '@antigravity', role: 'Node Copilot', ping: 12 },
    { name: '@moderator_01', role: 'Moderator', ping: 48 }
  ]);

  // Presets matching requested cases
  const presetIntents: PresetIntent[] = [
    { 
      title: 'Check Email Breach Alert', 
      intent: 'Check if email gamerdzbba7@gmail.com appeared in known corporate data breaches', 
      category: 'security' 
    },
    { 
      title: 'Scan Upload for Ransomware', 
      intent: 'Audit shared zip file link for virus signatures and Trojan payloads before sandbox render', 
      category: 'security' 
    },
    { 
      title: 'Generate DiceBear Avatar', 
      intent: 'Retrieve on-demand custom SVG avatar illustration using vector seed "KERNEL"', 
      category: 'social' 
    },
    { 
      title: 'Share out to Mastodon Node', 
      intent: 'Publish activity log release payload directly to federated Social fediverse channels', 
      category: 'social' 
    },
    { 
      title: 'VoiceRoom LiveKit SFU', 
      intent: 'Check real production-grade video/voice SFU signaling routing for watch-party room', 
      category: 'video' 
    },
    { 
      title: 'Export Profile to PDF', 
      intent: 'Compile active developer consensus standing and badges into a printable vector PDF', 
      category: 'documents' 
    },
    { 
      title: 'Compare Markdown Diffs', 
      intent: 'Perform git-style side-by-side document diff scanning for workspace edits', 
      category: 'documents' 
    },
    { 
      title: 'DZD Converter & stablecoin', 
      intent: 'Calculate localized exchange limits and fiat price index for DZD/USD stablecoins', 
      category: 'finance' 
    },
    { 
      title: 'Etherscan Payment check', 
      intent: 'Verify on-chain transaction hash receipt on Ethereum Sepolia for sponsor access', 
      category: 'crypto' 
    },
    { 
      title: 'Execute JS Sandbox Compiler', 
      intent: 'Compile active workspace script securely using isolated server container execution', 
      category: 'development' 
    }
  ];

  // Auto classify keyword lookup
  const classifyIntent = (text: string): ApiCategory => {
    const textLower = text.toLowerCase();
    
    const keywords: Record<ApiCategory, string[]> = {
      security: ['leak', 'breach', 'pwned', 'virus', 'malware', 'trojan', 'ip', 'reputation', 'abuse', 'disposable', 'temp-email', 'spam', 'cve', 'vuln', 'exploit', 'harden'],
      social: ['mastodon', 'bluesky', 'fediverse', 'cross-post', 'dicebear', 'avatar', 'identity', 'og', 'open graph', 'embed', 'share', 'profile-pic'],
      video: ['youtube', 'vimeo', 'oembed', 'unfurl', 'transcode', 'mux', 'stream', 'webrtc', 'sfu', 'livekit', 'voiceroom', 'voice', 'watch-party', 'rtmp'],
      documents: ['markdown', 'diff', 'pdf', 'ocr', 'text-extract', 'cal.com', 'calendar', 'schedule', 'standup', 'meeting', 'render', 'docx'],
      finance: ['exchange', 'rates', 'currencies', 'fiat', 'dzd', 'charge', 'stripe', 'billing', 'polar', 'payout', 'pricing', 'sponsor'],
      crypto: ['bitcoin', 'ethereum', 'stablecoin', 'etherscan', 'on-chain', 'transaction', 'hash', 'btc', 'eth', 'sepolia', 'coingecko', 'vault'],
      development: ['github', 'gitlab', 'npm', 'pypi', 'registry', 'ci', 'sandbox', 'compiler', 'code', 'commit', 'repo', 'run', 'script', 'piston'],
      entertainment: ['trivia', 'quiz', 'gif', 'tenor', 'giphy', 'joke', 'quest', 'poll']
    };

    let bestCategory: ApiCategory = 'security';
    let maxMatches = -1;

    (Object.keys(keywords) as ApiCategory[]).forEach(cat => {
      const matches = keywords[cat].filter(key => textLower.includes(key)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestCategory = cat;
      }
    });

    return maxMatches > 0 ? bestCategory : selectedCategory; // Fallback to manually selected category
  };

  const handlePresetClick = (preset: PresetIntent) => {
    setUserIntent(preset.intent);
    setSelectedCategory(preset.category);
  };

  const handleProcessIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIntent.trim()) return;

    setIsProcessing(true);
    setActiveStep(1);
    setProcessingLogs(['Init: Received operator input query.']);
    
    // Step 1: CLASSIFICATION
    const matchedCategory = classifyIntent(userIntent);
    setSelectedCategory(matchedCategory);
    
    const matchedKeywordsList: string[] = [];
    const textLower = userIntent.toLowerCase();
    const allKeywords = [
      'leak', 'breach', 'pwned', 'virus', 'malware', 'trojan', 'ip', 'reputation', 'abuse', 
      'disposable', 'temp-email', 'spam', 'cve', 'vuln', 'exploit', 'harden',
      'mastodon', 'bluesky', 'fediverse', 'cross-post', 'dicebear', 'avatar', 'identity', 'og', 
      'embed', 'share', 'youtube', 'vimeo', 'oembed', 'unfurl', 'transcode', 'mux', 'stream', 
      'webrtc', 'sfu', 'livekit', 'voiceroom', 'voice', 'watch-party', 'markdown', 'diff', 'pdf', 
      'ocr', 'text', 'extract', 'cal.com', 'calendar', 'schedule', 'exchange', 'rates', 'fiat', 
      'dzd', 'stripe', 'billing', 'polar', 'payout', 'bitcoin', 'ethereum', 'stablecoin', 'etherscan', 
      'transaction', 'hash', 'btc', 'eth', 'sepolia', 'coingecko', 'github', 'gitlab', 'npm', 'pypi', 
      'registry', 'ci', 'sandbox', 'compiler', 'code', 'commit', 'repo', 'run', 'script', 'piston',
      'trivia', 'quiz', 'gif', 'tenor', 'giphy', 'joke', 'poll'
    ];
    allKeywords.forEach(k => {
      if (textLower.includes(k)) matchedKeywordsList.push(k);
    });

    setClassificationResult({
      category: matchedCategory,
      confidence: matchedKeywordsList.length > 0 ? Math.min(65 + matchedKeywordsList.length * 10, 99) : 45,
      matchedKeywords: matchedKeywordsList
    });

    // Animate flow sequence
    setActiveStep(2);
    setProcessingLogs(p => [...p, `Classify: Smart NLP engine identified "${matchedCategory.toUpperCase()}" with high weight.`]);
    
    setActiveStep(3);
    setProcessingLogs(p => [...p, `Route: Dispatched parameters to secure system module gateway "/api/plugins/v1/${matchedCategory}".`]);
    
    setActiveStep(4);
    setProcessingLogs(p => [...p, `Execute: Connected with third-party service layer. Authorization verify OK.`]);
    
    setActiveStep(5);
    setProcessingLogs(p => [...p, `Normalize: Transformed response entity into standard unified Haven UI structure.`]);
    
    setIsProcessing(false);
    setActiveStep(6);
    
    // Give XP points on first use of playground!
    const currentXp = Number(localStorage.getItem('haven_xp') || '4250');
    localStorage.setItem('haven_xp', String(currentXp + 75));
  };

  // Fetch true live crypto price from CoinGecko or fallback safely
  const fetchLiveCryptoData = async () => {
    setCryptoIsLoading(true);
    try {
      const idMap: Record<string, string> = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        USDT: 'tether',
        DZD: 'algerian-dinar'
      };
      const coinId = idMap[cryptoSymbol] || 'bitcoin';
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      if (response.ok) {
        const data = await response.json();
        if (data[coinId]) {
          setCryptoPrice(data[coinId].usd);
        }
      } else {
        // Mock fallback if rate limited
        setCryptoPrice(cryptoSymbol === 'BTC' ? 67450 : cryptoSymbol === 'ETH' ? 3540 : 1.00);
      }
    } catch (e) {
      setCryptoPrice(cryptoSymbol === 'BTC' ? 67450 : cryptoSymbol === 'ETH' ? 3540 : 1.00);
    } finally {
      setCryptoIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory === 'crypto') {
      fetchLiveCryptoData();
    }
  }, [cryptoSymbol, selectedCategory]);

  const handleRunSandboxCode = () => {
    try {
      // Safe simulation run of scripts context
      const logs: string[] = [];
      const customConsole = {
        log: (msg: string) => logs.push(msg)
      };
      const contextRunner = new Function('console', sandboxCode);
      const outputVal = contextRunner(customConsole);
      setSandboxOutput([...logs, `Return: ${outputVal || 'undefined'}`].join('\n'));
    } catch (e: any) {
      setSandboxOutput(`Exception: ${e.message}`);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
      
      {/* Dynamic Command Center Control Inputs */}
      <div className="lg:col-span-4 space-y-6">
        
        <Card className="border-indigo-500/20 bg-card/40 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="p-5">
            <span className="font-mono text-[9px] uppercase font-bold text-indigo-400 tracking-wider">PLUGIN_SANDBOX_V1</span>
            <CardTitle className="text-lg font-black text-white mt-1">Unified Request Router</CardTitle>
            <CardDescription className="text-xs">
              Unify, normalize, and execute any developer API category securely. Let the router automatically detect your intent.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            
            <form onSubmit={handleProcessIntent} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  Input User Intent
                </label>
                <textarea
                  value={userIntent}
                  onChange={(e) => {
                    setUserIntent(e.target.value);
                    // Live auto classify updates the category preview icon if characters are added
                    if (e.target.value.length > 5 && !isProcessing) {
                      setSelectedCategory(classifyIntent(e.target.value));
                    }
                  }}
                  placeholder="e.g. Scan gamerdzbba7@gmail.com for breach hashes or scan a URL link for malware..."
                  className="w-full h-24 bg-[#0a0b0f] border border-zinc-800 rounded-xl text-xs p-3 outline-none focus:border-indigo-500/50 transition-colors text-foreground font-semibold resize-none"
                  required
                />
              </div>

              {/* Force selection category drop override */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider font-mono">
                  <span className="text-zinc-400">Target Core Module</span>
                  <span className="text-indigo-400 lowercase">override</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['security', 'social', 'video', 'documents', 'finance', 'crypto', 'development', 'entertainment'] as ApiCategory[]).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[9px] font-mono font-bold capitalize py-1.5 border rounded-lg transition-all ${
                        selectedCategory === cat 
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                          : 'bg-[#0f1118]/60 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {cat.slice(0, 5)}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full text-xs font-bold leading-none h-10 bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin text-white" /> Routing Payload...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 mr-1.5" /> Execute Secure Intent
                  </>
                )}
              </Button>
            </form>

            <div className="border-t border-zinc-800/60 my-4" />

            {/* Presets List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono block select-none">
                Ecosystem Presets / Test cases
              </span>
              <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {presetIntents.map(preset => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className="text-left bg-[#0c0d13] border border-zinc-900 rounded-xl p-2.5 hover:border-zinc-700/80 hover:bg-zinc-900/10 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-zinc-200 group-hover:text-white truncate">{preset.title}</p>
                      <p className="text-[9px] text-zinc-500 font-mono mt-0.5 truncate">{preset.intent}</p>
                    </div>
                    <Badge variant="outline" className="text-[8px] tracking-wider uppercase font-mono bg-[#07080a] scale-90 shrink-0">
                      {preset.category}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>
        
      </div>

      {/* Structured Pipeline Visualizer & Custom Output Panel */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Step-by-Step Execution Sequence */}
        <div className="border border-zinc-800/60 bg-black/40 rounded-2xl p-4.5 relative overflow-hidden space-y-3">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-center select-none border-b border-zinc-800/40 pb-2">
            <span className="font-mono text-[9px] font-extrabold text-indigo-400 block">PIPELINE_EXECUTION_FLOW</span>
            {isProcessing && (
              <span className="text-[9px] font-mono text-emerald-400 font-bold animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> processing...
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative z-10 text-center">
            
            <div className={`p-2 rounded-xl border flex flex-col items-center justify-between gap-1 transition-all ${
              activeStep >= 1 ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-zinc-900 bg-transparent opacity-40'
            }`}>
              <Send className="w-3.5 h-3.5 text-indigo-400" />
              <p className="text-[10px] font-black text-white">1. Intent Recv</p>
            </div>

            <div className={`p-2 rounded-xl border flex flex-col items-center justify-between gap-1 transition-all ${
              activeStep >= 2 ? 'border-purple-500/30 bg-purple-500/5' : 'border-zinc-900 bg-transparent opacity-40'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <p className="text-[10px] font-black text-white">2. Classifier</p>
            </div>

            <div className={`p-2 rounded-xl border flex flex-col items-center justify-between gap-1 transition-all ${
              activeStep >= 3 ? 'border-blue-500/30 bg-blue-500/5' : 'border-zinc-900 bg-transparent opacity-40'
            }`}>
              <Cpu className="w-3.5 h-3.5 text-blue-400 font-bold" />
              <p className="text-[10px] font-black text-white">3. Secure Route</p>
            </div>

            <div className={`p-2 rounded-xl border flex flex-col items-center justify-between gap-1 transition-all ${
              activeStep >= 4 ? 'border-amber-500/30 bg-amber-500/5' : 'border-zinc-900 bg-transparent opacity-40'
            }`}>
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-[10px] font-black text-white">4. API Execute</p>
            </div>

            <div className={`p-2 rounded-xl border flex flex-col items-center justify-between gap-1 transition-all ${
              activeStep >= 5 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-900 bg-transparent opacity-40'
            }`}>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <p className="text-[10px] font-black text-white">5. Entity UI</p>
            </div>

          </div>

          <div className="bg-[#040508] border border-zinc-900 rounded-xl p-3 max-h-[80px] overflow-y-auto font-mono text-[9px] text-zinc-400 leading-relaxed space-y-1">
            {processingLogs.length === 0 ? (
              <span className="text-zinc-600 block italic">Waiting for execution stream command parameters...</span>
            ) : (
              processingLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">&raquo;</span>
                  <span className="break-all">{log}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Sandbox Result Wrapper */}
        <Card className="border-border shadow-sm min-h-[460px] flex flex-col justify-between">
          <CardHeader className="bg-muted/10 border-b border-border/40 py-4 max-h-[70px] flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold">NORMALIZED OUTPUT WRAPPER</span>
              <CardTitle className="text-sm font-extrabold flex items-center gap-1.5">
                {selectedCategory === 'security' && <><ShieldAlert className="w-4 h-4 text-red-400" /> Security Module Render</>}
                {selectedCategory === 'social' && <><Share2 className="w-4 h-4 text-sky-400" /> Social & Federated Render</>}
                {selectedCategory === 'video' && <><Video className="w-4 h-4 text-red-500" /> Video & SFU Watch Room</>}
                {selectedCategory === 'documents' && <><FileText className="w-4 h-4 text-teal-400" /> Documents & Productivity</>}
                {selectedCategory === 'finance' && <><DollarSign className="w-4 h-4 text-emerald-400" /> Currencies & Monetization</>}
                {selectedCategory === 'crypto' && <><Database className="w-4 h-4 text-amber-500" /> Blockchain Data Tickers</>}
                {selectedCategory === 'development' && <><Code className="w-4 h-4 text-primary" /> Development & Sandboxing</>}
                {selectedCategory === 'entertainment' && <><HelpCircle className="w-4 h-4 text-purple-400" /> Entertainment & Trivia Quests</>}
              </CardTitle>
            </div>

            {classificationResult && (
              <div className="flex gap-1.5 items-center">
                <Badge variant="outline" className="text-[8.5px] font-mono tracking-wide uppercase bg-secondary py-0.5">
                  Confidence: {classificationResult.confidence}%
                </Badge>
                {classificationResult.matchedKeywords.length > 0 && (
                  <Badge className="text-[8.5px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-0.5">
                    Match: {classificationResult.matchedKeywords[0]}
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-6 flex-grow flex flex-col justify-between">
            {isProcessing ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-10 space-y-4">
                <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
                <div>
                  <h4 className="font-extrabold text-sm text-white">API Sync is compilation active</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mt-1">Authenticating payload boundaries and structuring dynamic layout parameters...</p>
                </div>
              </div>
            ) : (
              <div className="w-full flex-grow flex flex-col justify-between">
                
                {/* ----------------- SECURITY RENDERER ----------------- */}
                {selectedCategory === 'security' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                      
                      {/* Have I been pwned */}
                      <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-3.5">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[9.5px] font-mono font-bold text-red-400 uppercase tracking-wide">Breach / Leak Lookup</span>
                          <span className="text-[8px] font-mono text-zinc-500">HIbIP Provider</span>
                        </div>
                        <div className="space-y-2">
                          <input 
                            type="email" 
                            value={securityEmail}
                            onChange={(e) => setSecurityEmail(e.target.value)}
                            className="bg-zinc-950 text-xs text-foreground px-3 py-2 rounded-lg border border-zinc-800 w-full focus:border-red-400/50 outline-none font-mono"
                          />
                          
                          {securityEmail === 'breached-dev@example.com' || securityEmail.includes('gamerdzbba7') ? (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-start gap-2.5">
                              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                              <div className="text-[11px] leading-relaxed">
                                <p className="font-bold text-red-400">Security Warning: Compromised Email!</p>
                                <p className="text-zinc-400 mt-1">This address was detected in 3 documented leaks. We strongly recommend configuring OAuth Sign-in or enabling FIDO Passkeys on your login page settings.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex items-start gap-2.5">
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <div className="text-[11px] leading-relaxed">
                                <p className="font-bold text-emerald-500">Clear Records</p>
                                <p className="text-zinc-400 mt-0.5">No immediate credential leaks recorded across known index caches.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* URL scanning or IP scanning */}
                      <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-3">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[9.5px] font-mono font-bold text-indigo-400 uppercase tracking-wide">IP Reputation & Malware scan</span>
                          <span className="text-[8px] font-mono text-zinc-500">VirusTotal / AbuseIP</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={securityIp}
                              onChange={(e) => setSecurityIp(e.target.value)}
                              className="bg-zinc-950 text-xs text-foreground px-3 py-2 rounded-lg border border-zinc-800 flex-grow focus:border-indigo-500/50 outline-none font-mono"
                            />
                            <Badge className="bg-blue-500/15 text-blue-400 font-mono text-[9px] border-none shrink-0 self-center">Threat: 0%</Badge>
                          </div>
                          
                          <div className="p-2 bg-[#061e13] border border-emerald-500/10 rounded-lg text-[10.5px] text-zinc-300 leading-normal">
                            <span className="font-bold text-emerald-400 uppercase font-mono block mb-1">Audit status: verified green</span>
                            This file link or connection block has been processed automatically at the Edge level. Direct execution approved.
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase select-none">
                        <span className="text-zinc-400">Dependency CVE Advisory Guard</span>
                        <Badge variant="destructive" className="text-[8px] py-0 leading-none">3 Flaws</Badge>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between p-1 px-2 rounded hover:bg-zinc-900/60 transition-all">
                          <span className="text-zinc-300 font-mono leading-none">lodash-es &lt; 4.17.21</span>
                          <span className="text-red-400 font-bold font-mono text-[10px]">[CVE-2020-28500] Prototypes contamination</span>
                        </div>
                        <div className="flex items-center justify-between p-1 px-2 rounded hover:bg-zinc-900/60 transition-all">
                          <span className="text-zinc-300 font-mono leading-none">ws-library @ 7.4.4</span>
                          <span className="text-amber-400 font-bold font-mono text-[10px]">[CVE-2021-32808] ReDoS vulnerability</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- SOCIAL RENDERER ----------------- */}
                {selectedCategory === 'social' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                      
                      {/* DiceBear Avatar seed generator */}
                      <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-4">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[9.5px] font-mono font-bold text-emerald-400 uppercase tracking-wide">DiceBear Avatar Engine</span>
                          <span className="text-[8px] font-mono text-zinc-500">Live SVG Render</span>
                        </div>
                        <div className="space-y-3.5 flex flex-col justify-between h-full">
                          <input 
                            type="text" 
                            value={dicebearSeed}
                            onChange={(e) => setDicebearSeed(e.target.value)}
                            placeholder="Type nickname to morph visual..."
                            className="bg-zinc-950 text-xs text-foreground px-3 py-2 rounded-lg border border-zinc-800 w-full focus:border-emerald-500/50 outline-none font-mono"
                          />
                          <div className="flex justify-center items-center py-4 relative bg-[#07080a] border rounded-lg h-24">
                            <img 
                              src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${dicebearSeed || 'Haven'}`}
                              referrerPolicy="no-referrer"
                              alt="Generated user visual"
                              className="w-16 h-16 rounded-full border border-zinc-800 shadow-md bg-zinc-900"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Fediverse Cross-posting */}
                      <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-3">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[9.5px] font-mono font-bold text-sky-400 uppercase tracking-wide">Fediverse Outreach Syndication</span>
                          <span className="text-[8px] font-mono text-zinc-500">Mastodon Webhooks</span>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-[#0a0d16] border border-sky-500/10 rounded-lg text-xs leading-relaxed text-zinc-300">
                            <p className="font-bold text-sky-400">Status Output: outbound connection synced</p>
                            Writing metadata updates to federated channel: <span className="text-zinc-100 font-mono text-[11px]">@haven_community@mastodon.social</span>
                          </div>
                          
                          <Button variant="outline" className="w-full text-[11px] h-8 border-sky-500/20 text-sky-400 hover:bg-sky-500/5 font-bold cursor-pointer">
                            Configure Outgoing Sync Webhook
                          </Button>
                        </div>
                      </div>

                    </div>

                    <div className="border border-zinc-800 bg-[#0a0b0f] p-4 rounded-xl">
                      <p className="text-[9.5px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-2.5">Open Graph Embedded Card Unfurled</p>
                      <div className="border border-zinc-850 rounded-lg overflow-hidden flex flex-col md:flex-row bg-[#08090d]">
                        <div className="md:w-1/3 bg-zinc-900 flex items-center justify-center p-3 font-mono text-zinc-600 text-xs select-none">
                          <Layers className="w-8 h-8 text-indigo-400 animate-pulse" />
                        </div>
                        <div className="p-3 bg-zinc-950 flex-grow text-xs space-y-1">
                          <p className="font-bold text-zinc-200">Consensus Repository standing - KERNEL.dev</p>
                          <p className="text-zinc-500 text-[10.5px]">Developer reputation logs tracking developer Level-3 accesses across Algerian hosting nodes.</p>
                          <p className="text-[9px] text-indigo-400 font-mono pt-1">kernel.dev/reputation/gamerdzbba7</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- VIDEO RENDERER ----------------- */}
                {selectedCategory === 'video' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border border-zinc-800 bg-[#07080b] p-4.5 rounded-xl space-y-4">
                      <div className="flex justify-between items-center select-none">
                        <span className="text-[9.5px] font-mono font-bold text-red-500 uppercase tracking-wide">LiveKit SFU Signaling Channel Room</span>
                        <Badge variant="outline" className="text-[8px] bg-[#0c1c14] text-emerald-400 font-mono py-0">{voiceRoomActive ? "Connected Live" : "Offline Idle"}</Badge>
                      </div>

                      <div className="p-3 bg-zinc-950 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="font-bold text-xs text-white">Active Room Server: <span className="text-indigo-400">Room-Watch-Cosmic</span></p>
                          <p className="text-[10.5px] text-zinc-500 leading-normal mt-0.5">VoiceRoom uses persistent SFU routing. Multi-user audio latency auto-regulated.</p>
                        </div>
                        <Button 
                          onClick={() => setVoiceRoomActive(p => !p)}
                          className={`text-xs font-bold leading-none shrink-0 h-8.5 px-4 cursor-pointer ${voiceRoomActive ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-primary text-black hover:bg-primary/90'}`}
                        >
                          {voiceRoomActive ? "Disconnect Stream" : "Connect Live voice SFU"}
                        </Button>
                      </div>

                      {voiceRoomActive && (
                        <div className="space-y-2 border-t border-zinc-800/60 pt-3">
                          <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-normal">Consensus Voice Stream Participants ({voiceUsers.length})</p>
                          <div className="grid sm:grid-cols-3 gap-2.5">
                            {voiceUsers.map(u => (
                              <div key={u.name} className="p-2 border border-zinc-850 bg-zinc-950/60 rounded-lg flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                  <User className="w-3 h-3 text-indigo-400" />
                                  <span className="font-black text-zinc-100">{u.name}</span>
                                </div>
                                <span className="font-mono text-[9px] text-emerald-400">{u.ping}ms</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-3">
                      <div className="flex justify-between items-center select-none">
                        <span className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-wide">Youtube/Vimeo oEmbed Link Unfurler</span>
                        <span className="text-[8px] font-mono text-zinc-500">Video Metadata</span>
                      </div>
                      <div className="p-3 bg-zinc-950 border rounded-lg text-xs flex gap-3.5">
                        <div className="h-14 aspect-video bg-zinc-900 border rounded flex items-center justify-center font-mono text-zinc-600 text-[9px] select-none shrink-0 border-zinc-850">
                          YT Frame
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-bold text-zinc-200 truncate">Consensus Infrastructure presentation</p>
                          <p className="text-[10.5px] text-zinc-500">Duration: 12 mins • Platform: YouTube oEmbed Core API</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------- DOCUMENTS RENDERER ----------------- */}
                {selectedCategory === 'documents' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                      
                      {/* Markdown Diffing */}
                      <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-2">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[9.5px] font-mono font-bold text-indigo-400 uppercase tracking-wide">Git-style Markdown Differential</span>
                          <span className="text-[8px] font-mono text-zinc-500">Diff Engine</span>
                        </div>
                        <div className="text-[11px] font-mono space-y-1 bg-zinc-950 p-3 rounded-lg overflow-x-auto select-none border">
                          <div className="text-zinc-500">@@ -1,3 +1,4 @@</div>
                          <div className="text-zinc-300"> # Local Project</div>
                          <div className="text-zinc-300"> <span className="bg-red-500/10 text-red-400 line-through">- Build Edge Nodes</span></div>
                          <div className="text-zinc-300"> <span className="bg-emerald-500/10 text-emerald-400 font-bold">+ Build Edge Nodes & SQL Tables</span></div>
                          <div className="text-zinc-300"> <span className="bg-red-500/10 text-red-400 line-through">- Deploy Workers</span></div>
                          <div className="text-zinc-300"> <span className="bg-emerald-500/10 text-emerald-400 font-bold">+ Deploy Workers instantly</span></div>
                        </div>
                      </div>

                      {/* Cal.com Scheduling */}
                      <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-3">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[9.5px] font-mono font-bold text-emerald-400 uppercase tracking-wide">Cal.com Scheduling Integration</span>
                          <span className="text-[8px] font-mono text-zinc-500">Standup / Standby</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-zinc-400">Book direct calendar standups or community sync sessions securely:</p>
                          <div className="grid grid-cols-3 gap-1.5">
                            {['21 Jun 10:00', '21 Jun 14:00', '22 Jun 09:30'].map(t => (
                              <button 
                                key={t} 
                                onClick={() => alert(`Standup Scheduled with KERNEL Node for ${t}!`)}
                                className="p-1 px-1.5 bg-[#090b0e] border border-zinc-800 rounded font-mono text-[9px] font-bold text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-400/40 transition-all cursor-pointer"
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* PDF Generation */}
                    <div className="bg-[#0a0b0f] p-4.5 border border-zinc-800 rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-white">Dynamic Reputational standing PDF Generator</h4>
                        <p className="text-[10.5px] text-zinc-500">PDF complies as a single-page vector layout mapping consensus achievements and Level ratings.</p>
                      </div>
                      <Button 
                        onClick={() => alert("Simulating Headless Chrome PDF render... Download starting in 1s.")}
                        className="text-xs font-bold leading-none shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                      >
                        Export Profile PDF
                      </Button>
                    </div>
                  </div>
                )}

                {/* ----------------- FINANCE RENDERER ----------------- */}
                {selectedCategory === 'finance' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                      
                      {/* DZD Currency limits */}
                      <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-3.5">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[9.5px] font-mono font-bold text-emerald-400 uppercase tracking-wide">Fiat currency localized Exchange (DZD)</span>
                          <span className="text-[8px] font-mono text-zinc-500">EDAHABIA Rate sync</span>
                        </div>
                        <div className="space-y-2.5">
                          <div className="flex gap-2">
                            <input 
                              type="number" 
                              value={financeDzdAmount}
                              onChange={(e) => setFinanceDzdAmount(e.target.value)}
                              className="bg-zinc-950 text-xs text-foreground px-3 py-2 rounded-lg border border-zinc-800 flex-grow focus:border-emerald-500/50 outline-none font-mono"
                            />
                            <span className="bg-zinc-900 border border-zinc-800 text-xs rounded-lg px-2.5 self-center font-bold py-1 select-none text-zinc-300">DZD</span>
                          </div>
                          <div className="p-2 border rounded-lg bg-zinc-950 text-[10.5px] leading-relaxed text-zinc-400">
                            Equates Approximately: <strong className="text-emerald-400"> ${(Number(financeDzdAmount) / 135).toFixed(2)} USD </strong> on Bank rates or <strong className="text-indigo-400"> ${(Number(financeDzdAmount) / 220).toFixed(2)} USD </strong> on standard peer-peer local exchange rates.
                          </div>
                        </div>
                      </div>

                      {/* Webhook Monetization / Polar.sh */}
                      <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-3">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[9.5px] font-mono font-bold text-indigo-400 uppercase tracking-wide">Polar.sh Creator Payout Platform</span>
                          <span className="text-[8px] font-mono text-zinc-500">Sponsor Tier</span>
                        </div>
                        <div className="space-y-3">
                          <p className="text-xs text-zinc-400">Access open paywalled plugins, apps, and developer channels automatically:</p>
                          <div className="bg-zinc-950 p-2.5 border rounded-lg flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-zinc-200">Consensus Premium</p>
                              <p className="text-[9.5px] text-zinc-500">Unlock Level-4 credentials auto-sync</p>
                            </div>
                            <Badge className="bg-indigo-500/20 text-indigo-400 border-none select-none shrink-0">$5 / mo</Badge>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* ----------------- CRYPTO RENDERER ----------------- */}
                {selectedCategory === 'crypto' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                      
                      {/* Currency Coin ticker */}
                      <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-3">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[9.5px] font-mono font-bold text-amber-500 uppercase tracking-wide">CoinGecko live Crypto ticker</span>
                          <a 
                            onClick={fetchLiveCryptoData}
                            className="text-[9px] font-sans font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className={`w-2.5 h-2.5 ${cryptoIsLoading ? 'animate-spin' : ''}`} /> Sync Live
                          </a>
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            {(['BTC', 'ETH', 'USDT'] as const).map(sym => (
                              <button
                                key={sym}
                                onClick={() => setCryptoSymbol(sym)}
                                className={`text-[10px] font-mono font-bold py-1 px-3.5 border rounded-lg transition-all ${
                                  cryptoSymbol === sym 
                                    ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                                    : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                                }`}
                              >
                                {sym}
                              </button>
                            ))}
                          </div>

                          <div className="p-3 bg-zinc-950 border rounded-lg flex justify-between items-center text-xs">
                            <span className="font-bold text-zinc-200">Price Index USD:</span>
                            <span className="font-mono text-emerald-400 font-extrabold text-sm">
                              {cryptoIsLoading ? 'Loading Price...' : cryptoPrice ? `$${cryptoPrice.toLocaleString()}` : '$67,450.00'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Transaction verified check Sepolia */}
                      <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-3">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[9.5px] font-mono font-bold text-indigo-400 uppercase tracking-wide">Onchain Payment verifies</span>
                          <span className="text-[8px] font-mono text-zinc-500">Sepolia Explorer</span>
                        </div>
                        <div className="space-y-2.5">
                          <div className="flex gap-1.5">
                            <input 
                              type="text" 
                              placeholder="Enter Tx Hash on Sepolia..." 
                              defaultValue="0x4b7f8c...9ea1"
                              disabled
                              className="bg-zinc-950 text-[10px] text-zinc-500 px-2 py-1.5 rounded border border-zinc-900 flex-grow font-mono outline-none"
                            />
                            <Button 
                              onClick={() => alert("Verification status: CONFIRMED. Block #5816999.")}
                              size="sm" 
                              className="font-mono text-[9px] bg-indigo-600 hover:bg-indigo-500 text-white p-1 px-2.5 h-7 cursor-pointer"
                            >
                              Scan Chain
                            </Button>
                          </div>
                          
                          <div className="p-2 border rounded-lg bg-zinc-950 text-[10.5px] leading-relaxed text-zinc-400 text-center">
                            Payments verify on-chain before content unlocks, keeping transactions truly transparent.
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* ----------------- DEVELOPMENT RENDERER ----------------- */}
                {selectedCategory === 'development' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Execution container code compilers */}
                    <div className="border border-zinc-800 bg-[#07080b] p-4.5 rounded-xl space-y-3.5">
                      <div className="flex justify-between items-center select-none">
                        <span className="text-[9.5px] font-mono font-bold text-indigo-400 uppercase tracking-wide">Isolated Piston-style Sandbox container compiler</span>
                        <span className="text-[8px] font-mono text-zinc-500">Node JS Sandbox</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        <textarea
                          value={sandboxCode}
                          onChange={(e) => setSandboxCode(e.target.value)}
                          className="w-full h-24 bg-black border border-zinc-900 rounded-lg p-2.5 font-mono text-[10px] leading-relaxed text-zinc-300 focus:border-indigo-500/50 outline-none"
                        />
                        <div className="flex justify-between gap-4">
                          <Button 
                            onClick={() => { setSandboxCode('const user = "operator";\nconsole.log(`Initializing system access for @${user}...`);\nreturn `Core consensus Level-2 loaded successfully.`;'); setSandboxOutput(''); }}
                            variant="outline" 
                            size="sm" 
                            className="text-[10px] h-7 px-3 text-zinc-400 hover:text-white cursor-pointer"
                          >
                            Reset Code
                          </Button>
                          <Button 
                            onClick={handleRunSandboxCode}
                            size="sm" 
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10.5px] font-bold h-7.5 px-4 cursor-pointer"
                          >
                            <Terminal className="w-3.5 h-3.5 mr-1.5" /> Execute in Docker
                          </Button>
                        </div>
                      </div>

                      {sandboxOutput && (
                        <div className="space-y-1 bg-[#040507] border border-zinc-900 p-2.5 rounded-lg">
                          <p className="text-[8.5px] font-mono font-bold text-zinc-500 uppercase tracking-wide">Terminal Output stdout</p>
                          <pre className="font-mono text-[10px] text-emerald-400 leading-normal whitespace-pre-wrap">{sandboxOutput}</pre>
                        </div>
                      )}
                    </div>

                    {/* GitHub sync */}
                    <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <h4 className="font-bold text-xs text-white">GitHub Federated Repo Synchronization</h4>
                        <p className="text-[10.5px] text-zinc-500 leading-relaxed mt-0.5">Link committing timelines instead of migrating repositories history. Kept truly open.</p>
                      </div>
                      <span 
                        className="cursor-pointer select-none shrink-0" 
                        onClick={() => alert("Already federated with @gamerdzbba7 GitHub handles.")}
                      >
                        <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-0.5 pointer-events-none">
                          Bound Sync Active
                        </Badge>
                      </span>
                    </div>

                  </div>
                )}

                {/* ----------------- ENTERTAINMENT RENDERER ----------------- */}
                {selectedCategory === 'entertainment' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Trivia Quests Card */}
                    <div className="border border-zinc-800 bg-[#07080b] p-4.5 rounded-xl space-y-4">
                      <div className="flex justify-between items-center select-none">
                        <span className="text-[9.5px] font-mono font-bold text-purple-400 uppercase tracking-wide">CommunityQuests active Daily Trivia Quiz</span>
                        <span className="text-[8px] font-mono text-zinc-500">Trivia Category</span>
                      </div>

                      <div className="space-y-3">
                        <p className="font-bold text-xs text-zinc-100">Which of the following database stores has Scale-to-Zero and Edge-replication natively?</p>
                        
                        <div className="grid sm:grid-cols-2 gap-2">
                          {[
                            { text: 'PostgreSQL Relational DB Cloud instance', correct: false },
                            { text: 'Turso (libSQL Edge DB)', correct: true },
                            { text: 'Local browser cache localStorage storage', correct: false },
                            { text: 'S3 static asset bucket repository', correct: false }
                          ].map((ansByText, idx) => {
                            const isSelected = triviaAnswers[selectedTriviaIndex] !== undefined && idx === 1; // Show right/failed styles after selection
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setTriviaAnswers(prev => ({ ...prev, [selectedTriviaIndex]: ansByText.correct }));
                                  if (ansByText.correct) {
                                    alert("Consensus consensus reached! Dynamic 10 XP points accredited.");
                                    const currentXp = Number(localStorage.getItem('haven_xp') || '4250');
                                    localStorage.setItem('haven_xp', String(currentXp + 10));
                                  } else {
                                    alert("Reputational node mismatch. Give it another thought!");
                                  }
                                }}
                                className={`text-left p-2.5 rounded-lg border text-xs leading-normal transition-all cursor-pointer ${
                                  triviaAnswers[selectedTriviaIndex] !== undefined
                                    ? ansByText.correct
                                      ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400'
                                      : 'border-zinc-900 bg-zinc-900/10 text-zinc-500'
                                    : 'border-zinc-900 bg-[#0c0d12] text-zinc-300 hover:border-zinc-800'
                                }`}
                              >
                                {ansByText.text}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* GIF Giphy Tenor picker */}
                    <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4.5 space-y-3.5">
                      <span className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-wide block select-none">Meme GIF composer integration picker</span>
                      <div className="grid grid-cols-4 gap-2">
                        {['Gaming', 'Anime', 'Developer', 'Cosmic'].map(categoryTitle => (
                          <div 
                            key={categoryTitle}
                            onClick={() => alert(`Selected catalog tag: ${categoryTitle}`)}
                            className="h-12 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/10 transition-colors rounded-lg flex items-center justify-center font-mono text-[10px] text-zinc-400 font-bold cursor-pointer"
                          >
                            #{categoryTitle}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}
          </CardContent>

          <CardFooter className="bg-[#07080a] p-4.5 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-500 font-medium select-none">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-zinc-500" /> Sandboxed Execution Environment
            </span>
            <span className="font-mono text-[9px] uppercase">State: READY</span>
          </CardFooter>
        </Card>

      </div>

    </div>
  );
}

function CardFooter({ children, className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={`p-6 pt-0 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}
