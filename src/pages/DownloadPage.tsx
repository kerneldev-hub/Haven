import React, { useEffect, useState, useRef } from 'react';
import { 
  Download, Monitor, TerminalSquare, Smartphone, 
  ShieldCheck, Github, ChevronRight, Globe, Check, Copy, ExternalLink, 
  AlertTriangle, UploadCloud, Search, RefreshCw, Loader 
} from 'lucide-react';
import { calculateSHA256 } from '../lib/checksum';

interface PlatformBuild {
  id: string;
  name: string;
  osKey: 'windows' | 'linux' | 'android' | 'web';
  icon: React.ReactNode;
  fileName: string;
  fileSize: string;
  checksum: string;
  downloadUrl: string;
  subLabel?: string;
  isInstaller?: boolean;
}

interface ReleaseLatestPayload {
  repoPath: string;
  repoUrl: string;
  tagName: string | null;
  htmlUrl: string;
  assets: any[];
  error?: boolean;
  message?: string;
}

function detectOS() {
  const ua = navigator.userAgent;

  if (ua.includes("Windows")) return "windows";
  if (ua.includes("Linux")) return "linux";
  if (/Android/i.test(ua)) return "android";

  return "web";
}

function mapAssetToBuild(asset: any): PlatformBuild {
  const nameLower = asset.name.toLowerCase();
  let osKey: 'windows' | 'linux' | 'android' | 'web' = 'web';
  let displayName = asset.name;
  let subLabel = "Production distribution package";
  let isInstaller = false;
  let icon = <Monitor className="w-6 h-6 text-sky-400" />;

  if (nameLower.endsWith('.msi')) {
    osKey = 'windows';
    displayName = 'Windows MSI Installer';
    subLabel = 'Recommended for corporate installations';
    isInstaller = true;
    icon = <Monitor className="w-6 h-6 text-sky-400" />;
  } else if (nameLower.endsWith('.exe')) {
    osKey = 'windows';
    displayName = 'Windows Direct Setup';
    subLabel = 'Standard standalone setup executable';
    isInstaller = true;
    icon = <Monitor className="w-6 h-6 text-sky-400" />;
  } else if (nameLower.endsWith('.appimage')) {
    osKey = 'linux';
    displayName = 'Linux Portable AppImage';
    subLabel = 'Distro-agnostic self-contained app image';
    isInstaller = true;
    icon = <TerminalSquare className="w-6 h-6 text-emerald-400" />;
  } else if (nameLower.endsWith('.deb')) {
    osKey = 'linux';
    displayName = 'Ubuntu / Debian Native';
    subLabel = 'Native package built for APT managers';
    isInstaller = false;
    icon = <TerminalSquare className="w-6 h-6 text-emerald-400" />;
  } else if (nameLower.endsWith('.apk')) {
    osKey = 'android';
    displayName = 'Android App Core';
    subLabel = 'Direct sideloading build with fully integrated features';
    isInstaller = true;
    icon = <Smartphone className="w-6 h-6 text-amber-400" />;
  }

  return {
    id: asset.name,
    name: displayName,
    osKey,
    icon,
    fileName: asset.name,
    fileSize: asset.fileSize,
    checksum: asset.checksum,
    downloadUrl: asset.downloadUrl,
    subLabel,
    isInstaller
  };
}

export default function DownloadPage() {
  const [detectedOS, setDetectedOS] = useState<'windows' | 'linux' | 'android' | 'web'>('web');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Dynamic API state
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [releasePayload, setReleasePayload] = useState<ReleaseLatestPayload | null>(null);
  const [builds, setBuilds] = useState<PlatformBuild[]>([]);

  // Verification Utility State
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [verifyingFile, setVerifyingFile] = useState<File | null>(null);
  const [computedHash, setComputedHash] = useState<string>('');
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [selectedExpectedHash, setSelectedExpectedHash] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const os = detectOS();
    setDetectedOS(os);

    // Fetch dynamic releases from our newly added Express route
    async function fetchReleases() {
      try {
        setLoading(true);
        const res = await fetch('/api/releases/latest');
        if (!res.ok) {
          throw new Error(`HTTP Error: Status ${res.status}`);
        }
        const data: ReleaseLatestPayload = await res.json();
        
        if (data.error) {
          setApiError(data.message || 'GitHub API connection error');
        }
        
        setReleasePayload(data);
        if (data.assets && data.assets.length > 0) {
          const mapped = data.assets.map(mapAssetToBuild);
          setBuilds(mapped);
        } else {
          setBuilds([]);
        }
      } catch (err: any) {
        console.error("Failed to load release assets dynamically:", err);
        setApiError(err.message || 'Connection offline');
      } finally {
        setLoading(false);
      }
    }

    fetchReleases();
  }, []);

  const triggerCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRecommendedBuild = (): PlatformBuild | null => {
    if (detectedOS === 'web' || builds.length === 0) return null;
    return builds.find(b => b.osKey === detectedOS && b.isInstaller) || builds.find(b => b.osKey === detectedOS) || null;
  };

  const recommendedBuild = getRecommendedBuild();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (file: File) => {
    setVerifyingFile(file);
    setIsComputing(true);
    setComputedHash('');
    
    if (builds.length > 0) {
      const matchingBuild = builds.find(b => file.name.toLowerCase().includes(b.fileName.toLowerCase()) || b.fileName.toLowerCase().includes(file.name.toLowerCase()));
      if (matchingBuild) {
        setSelectedExpectedHash(matchingBuild.checksum);
      } else {
        setSelectedExpectedHash(builds[0].checksum);
      }
    } else {
      setSelectedExpectedHash('');
    }

    try {
      const hash = await calculateSHA256(file);
      setComputedHash(hash);
    } catch (err) {
      console.error("Cryptographic hash logic failure:", err);
    } finally {
      setIsComputing(false);
    }
  };

  const clearVerifier = () => {
    setVerifyingFile(null);
    setComputedHash('');
    setSelectedExpectedHash('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden text-left">
      
      {/* Background visual graphics */}
      <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-24 relative z-10 text-left">
        
        {/* Header section */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/5 border border-border/40 text-[11px] font-mono rounded-full text-muted-foreground mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Release Tag: </span>
            <span className="font-extrabold text-white">
              {loading ? (
                <span className="opacity-50 font-sans text-[10px]">Loading...</span>
              ) : releasePayload?.tagName || 'Awaiting Initial deployment'}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-100 to-neutral-400">
            Download HAVEN
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-2xl mx-auto leading-relaxed font-normal">
            Gain complete access with hardware acceleration, direct file structures integration, automated synchronization parameters, and crystal clear room chats.
          </p>

          {/* Supported platform scope announcement */}
          <div className="p-4 bg-zinc-950/40 border border-border/40 rounded-2xl mb-8 max-w-xl mx-auto">
            <p className="text-xs text-zinc-400 leading-normal font-sans">
              ⚠️ <strong className="text-foreground">Platform Support:</strong> At this time, HAVEN is packaged only for Windows, Linux, and Android. macOS and iOS are explicitly NOT supported.
            </p>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-border/60 px-4 py-2 rounded-full font-mono text-xs text-muted-foreground">
              <span>Detected Device:</span>
              <span className="font-extrabold text-foreground uppercase">{detectedOS === 'web' ? 'Web Client' : `${detectedOS} system`}</span>
            </div>
            
            <a 
              href="/workspace"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-border/40 text-xs rounded-full font-mono font-bold transition-all text-foreground flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Launch Web Sandbox Fallback</span>
            </a>
          </div>
        </div>

        {/* Dynamic State handling: Loading Skeleton */}
        {loading && (
          <div className="max-w-4xl mx-auto mb-16 space-y-8">
            <div className="h-44 bg-card/40 border border-border/40 animate-pulse rounded-3xl p-8 flex justify-between items-center">
              <div className="space-y-3">
                <div className="h-3 w-28 bg-white/10 rounded"></div>
                <div className="h-6 w-60 bg-white/15 rounded"></div>
                <div className="h-3.5 w-80 bg-white/10 rounded"></div>
              </div>
              <div className="h-10 w-44 bg-white/10 rounded-xl"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-6 bg-card/25 border border-border/40 animate-pulse rounded-2xl space-y-4">
                  <div className="h-8 w-8 bg-white/10 rounded-lg"></div>
                  <div className="h-5 w-40 bg-white/15 rounded"></div>
                  <div className="h-3 w-52 bg-white/10 rounded"></div>
                  <div className="h-8 w-full bg-white/10 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic state handling: Offline / No builds built yet */}
        {!loading && builds.length === 0 && (
          <div className="max-w-xl mx-auto mb-16 p-8 bg-zinc-950/60 border border-white/5 rounded-3xl text-center backdrop-blur-md">
            <AlertTriangle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No compiled binaries available</h3>
            <p className="text-xs text-muted-foreground leading-normal mb-6">
              {apiError ? `Reason: ${apiError}.` : "We haven't compiled the final release artifacts for this version tag yet. You can find active tags, branches, and release logs on the official GitHub interface."}
            </p>
            <a 
              href={releasePayload?.htmlUrl || "https://github.com/dzlab/haven/releases"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-border/40 text-xs text-white rounded-xl font-mono font-bold transition-all"
            >
              <Github className="w-4 h-4" />
              <span>View Releases on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>
          </div>
        )}

        {/* Recommended Installer Panel */}
        {!loading && recommendedBuild && (
          <div className="mb-16 max-w-4xl mx-auto bg-gradient-to-b from-card/90 to-card/40 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md text-left">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sky-500/5 rounded-full filter blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10 text-left">
              <div className="space-y-3.5 flex-1 select-none text-left">
                <span className="text-[10px] font-mono tracking-widest font-extrabold text-sky-400 uppercase">Detection Matches Hardware</span>
                <h3 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5 text-foreground leading-none text-left">
                  {recommendedBuild.icon}
                  HAVEN for {recommendedBuild.osKey === 'windows' ? 'Windows' : recommendedBuild.osKey === 'linux' ? 'Linux' : 'Android'}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xl text-left">
                  {recommendedBuild.subLabel}. Features high-performance architecture, optimized client loading parameters, and low local footprint.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground pt-1 select-none text-left">
                  <span className="font-extrabold text-foreground/80">SHA-256 Checksum:</span>
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-background/60 border border-border/50 rounded-xl max-w-[280px] sm:max-w-md overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="font-mono text-[10px] text-muted-foreground truncate">{recommendedBuild.checksum}</span>
                    <button 
                      onClick={() => triggerCopy(recommendedBuild.id, recommendedBuild.checksum)}
                      className="text-muted-foreground hover:text-foreground shrink-0 ml-1.5 cursor-pointer animate-none bg-transparent border-none p-0"
                      title="Copy Expected Signatures"
                    >
                      {copiedId === recommendedBuild.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0 self-center">
                <a 
                  href={recommendedBuild.downloadUrl}
                  className="w-full md:w-auto group flex items-center justify-center gap-2.5 px-8 py-4 bg-foreground hover:bg-neutral-200 text-background rounded-2xl transition-all font-extrabold text-sm shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Recommended ({recommendedBuild.fileSize})</span>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Manual Fallback Registry Grid */}
        {!loading && builds.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-border/40">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">Manual Binary Manifest</h2>
              <span className="text-[11px] font-mono font-bold text-muted-foreground/60 select-none">SHA-256 Hashed Artifacts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {builds.map((b) => {
                const isRecommended = recommendedBuild?.id === b.id;
                return (
                  <div 
                    key={b.id} 
                    className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between bg-card/40 backdrop-blur-sm ${
                      isRecommended 
                        ? 'border-sky-500/30 bg-card/60 ring-1 ring-sky-500/10' 
                        : 'border-border/50 hover:border-border/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4 select-none">
                        <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl">
                          {b.icon}
                        </div>
                        <div className="flex gap-2">
                          {isRecommended && (
                            <span className="text-[9px] uppercase font-mono font-extrabold tracking-wider px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                              Suggested
                            </span>
                          )}
                          <span className="text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 bg-white/5 text-muted-foreground border border-border/50 rounded-full">
                            {b.fileSize}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold tracking-tight mb-1 text-foreground">{b.name}</h3>
                      <p className="text-xs text-muted-foreground mb-4 leading-normal h-8">{b.subLabel}</p>

                      <div className="mb-5 bg-background/50 border border-border/30 rounded-lg p-2.5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-muted-foreground truncate mr-2 select-all">SHA256: {b.checksum}</span>
                        <button 
                          onClick={() => triggerCopy(b.id, b.checksum)}
                          className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer bg-transparent border-none p-0"
                          title="Copy cryptographic signature"
                        >
                          {copiedId === b.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <a 
                      href={b.downloadUrl}
                      className="w-full group flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-border/40 text-foreground rounded-xl transition-all font-bold text-xs cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Download {b.fileName}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Drag-And-Drop Cryptographic Integrity Hash Verifier */}
        <section className="mb-20 max-w-4xl mx-auto" id="verifier">
          <div className="mb-6 text-left">
            <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2 justify-start">
              <ShieldCheck className="w-5.5 h-5.5 text-emerald-400" />
              Integrity Checksum Verifier
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-sans">
              Verify local binary integrity instantly. Drag-and-drop your downloaded package to compute its SHA-256 signature locally running in your client browser sandbox.
            </p>
          </div>

          <div 
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 relative ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-border/100 bg-card/25'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={onFileInputChange}
              className="hidden"
            />

            {!verifyingFile ? (
              <div className="py-6 flex flex-col items-center justify-center">
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl mb-4 text-muted-foreground">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-sm font-extrabold mb-1">Drag file here to verify checksum</h4>
                <p className="text-xs text-muted-foreground/60 mb-5 max-w-md">Runs entirely locally on your processor via WebCrypto. Your files are never uploaded.</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-border/40 rounded-xl text-xs font-mono font-bold transition-all text-white cursor-pointer"
                >
                  Browse Files Manually
                </button>
              </div>
            ) : (
              <div className="space-y-6 text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/30 pb-4">
                  <div>
                    <h4 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 bg-white/5 rounded-md border text-muted-foreground text-left">Local file</span>
                      {verifyingFile.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground/60 font-mono mt-0.5">Size: {(verifyingFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button 
                    onClick={clearVerifier}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-mono text-[10px] font-bold rounded-lg transition-all cursor-pointer bg-transparent"
                  >
                    Reset Verifier
                  </button>
                </div>

                <div className="grid gap-4 text-left">
                  {/* Expected Selector */}
                  <div className="space-y-1.5 text-left animate-in duration-150">
                    <label className="text-[10px] font-mono uppercase font-extrabold text-muted-foreground">EXPECTED SIGNATURE REFERENCE</label>
                    <select 
                      value={selectedExpectedHash}
                      onChange={(e) => setSelectedExpectedHash(e.target.value)}
                      className="w-full bg-background border border-border/60 rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                    >
                      {builds.map(b => (
                        <option key={b.id} value={b.checksum}>{b.name} ({b.fileName})</option>
                      ))}
                      <option value="">Custom Manual Hash</option>
                    </select>
                  </div>

                  {/* Computed */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-extrabold text-muted-foreground">DYNAMICALLY COMPUTED HASH</span>
                      {isComputing && <span className="text-[10px] font-mono text-sky-400 font-bold flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin"/> Computing SHA-256...</span>}
                    </div>

                    <div className="p-3 bg-zinc-950/80 border border-border/30 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground break-all select-all">
                        {computedHash || (isComputing ? "Computing digests..." : "Ready to verify.")}
                      </span>
                      {computedHash && (
                        <button 
                          onClick={() => triggerCopy('verifier-computed', computedHash)}
                          className="text-muted-foreground hover:text-white ml-2 cursor-pointer bg-transparent border-none p-0"
                        >
                          {copiedId === 'verifier-computed' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Match Evaluation */}
                  {computedHash && (
                    <div className={`p-4 rounded-xl border transition-all ${
                      computedHash.toLowerCase().trim() === selectedExpectedHash.toLowerCase().trim()
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                        : 'bg-destructive/10 border-destructive/20 text-red-300'
                    }`}>
                      <div className="flex items-start gap-2.5 text-left">
                        <div className="mt-0.5">
                          {computedHash.toLowerCase().trim() === selectedExpectedHash.toLowerCase().trim() ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-left">
                            {computedHash.toLowerCase().trim() === selectedExpectedHash.toLowerCase().trim() 
                              ? "Verification Succeeded!" 
                              : "Warning: Checksum Mismatch."}
                          </h4>
                          <p className="text-[11px] opacity-80 mt-1 leading-normal text-left">
                            {computedHash.toLowerCase().trim() === selectedExpectedHash.toLowerCase().trim() 
                              ? "The dynamically computed SHA-256 signature perfectly matches our manifest releases. This file is authentic."
                              : "The computed hash does not correspond with our official manifest expectations. Verify your download file source."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </section>

        {/* CI/CD Transparency info block */}
        <div className="max-w-4xl mx-auto bg-card border border-border/50 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-md shadow-sm text-left">
          <div className="grid md:grid-cols-2 gap-12 items-center text-left">
            
            <div className="space-y-4 text-left">
              <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground justify-start text-left">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                Transparent Release Pipeline
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium text-left">
                Every release package on HAVEN is built automatically using isolated virtual machines configured directly inside our GitHub repository actions pipeline. No manually compiled binaries enter distribution. 
              </p>
              <div className="space-y-3 font-mono text-xs pt-1 select-none text-left">
                <div className="flex items-center justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">Release Signatures</span>
                  <span className="font-bold text-foreground">Verified SHA256</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">Compilation Pipeline</span>
                  <span className="text-emerald-400 font-bold">100% Automated (GitHub Actions)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-left">
              <a 
                href={releasePayload?.repoUrl || "https://github.com/dzlab/haven"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-border/30 hover:bg-white/10 hover:border-border/60 transition-all text-left"
              >
                <div className="p-3 bg-zinc-950 rounded-xl shrink-0">
                  <Github className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-semibold text-xs text-foreground flex items-center gap-1 justify-start">
                    Audit Pipeline Source <ExternalLink className="w-3" />
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium leading-normal text-left">Review the build workflow code and download releases directly on GitHub.</p>
                </div>
              </a>
              
              <div className="p-4 rounded-2xl bg-zinc-950/20 border border-border/20 text-left text-xs text-zinc-500 font-normal">
                At this time, macOS and iOS systems are not supported due to restricted native code sandboxing guidelines. For desktop users click above to launch the web client portal.
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
