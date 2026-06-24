import React, { useEffect, useState } from 'react';
import { Download, Monitor, Smartphone, CheckCircle2, AlertCircle, Github, ExternalLink, Hash, Package, Clock, RefreshCw } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

interface ReleaseAsset {
  id: number;
  name: string;
  size: number;
  downloadUrl: string;
  contentType: string;
  downloadCount: number;
}

interface Release {
  id: number;
  tag: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  publishedAt: string;
  assets: ReleaseAsset[];
}

interface ReleasesResponse {
  releases: Release[];
  hasReleases: boolean;
  error?: string;
}

type Platform = 'windows' | 'linux' | 'android';

interface PlatformTarget {
  platform: Platform;
  label: string;
  os: string;
  ext: string[];
  icon: React.ReactNode;
  installCommand?: string;
  buildCommand?: string;
  description: string;
}

const platforms: PlatformTarget[] = [
  {
    platform: 'windows',
    label: 'Windows',
    os: 'Windows 10/11 · x64',
    ext: ['.exe', '.msi', '_x64-setup.exe', '_windows'],
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.551H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
      </svg>
    ),
    description: 'Native desktop app built with Tauri v2 for Windows 10 and Windows 11.',
    buildCommand: 'npm run tauri:build',
  },
  {
    platform: 'linux',
    label: 'Linux',
    os: 'Ubuntu 22.04+ · AppImage / deb',
    ext: ['.AppImage', '.deb', '.rpm', '_amd64', '_linux'],
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489.117.744.484 1.427 1.073 1.85.357.255.789.422 1.256.434.527.013.987-.208 1.36-.549 1.026-.954 1.533-2.222 2.085-3.575.55-1.353 1.08-2.738 2.112-3.773.747-.747 1.682-1.2 2.708-1.512-.034.04-.066.082-.1.122-1.02 1.23-1.24 2.936-1.133 4.462.086 1.185.486 2.243 1.225 2.89.578.503 1.327.775 2.2.575.872-.2 1.541-.89 1.9-1.847.273-.718.326-1.558.286-2.362-.034-.694.035-1.363.238-1.943.246-.706.666-1.255 1.108-1.676.148-.138.296-.267.445-.393.01-.011.02-.021.026-.03.03-.028.062-.058.09-.087.047-.047.093-.096.134-.148.105-.135.184-.285.235-.437.053-.155.083-.323.075-.492-.008-.172-.051-.344-.13-.49-.077-.144-.186-.266-.313-.35-.127-.082-.271-.133-.42-.148-.148-.016-.298.01-.436.078-.14.07-.263.177-.36.318l-.043.07c-.075.13-.134.263-.185.394-.048.13-.09.26-.133.39-.046.138-.094.278-.148.416-.055.137-.113.274-.177.407-.064.133-.133.263-.21.386-.078.123-.16.24-.25.35-.088.112-.183.214-.283.308-.101.095-.206.18-.315.257-.108.078-.22.148-.334.208-.112.062-.227.115-.344.16-.116.044-.234.079-.353.104-.119.026-.238.042-.356.05-.118.009-.236.009-.354.002-.117-.007-.233-.021-.347-.043-.114-.022-.225-.053-.333-.09-.108-.038-.213-.083-.313-.136-.1-.052-.195-.111-.286-.177-.09-.065-.176-.135-.256-.213-.08-.076-.154-.159-.22-.248-.067-.089-.126-.183-.178-.283-.053-.099-.1-.204-.139-.312-.04-.108-.072-.22-.097-.334-.025-.113-.041-.23-.05-.347-.009-.117-.01-.234-.002-.35.007-.115.022-.228.044-.339.023-.11.052-.218.088-.321.038-.103.082-.201.133-.293.05-.09.105-.175.168-.254.061-.078.13-.149.204-.212.075-.063.155-.119.24-.167.086-.048.175-.088.27-.12.095-.031.193-.055.293-.07.1-.015.201-.02.302-.015.103.005.204.019.302.044.097.025.192.058.282.1.09.043.177.094.258.152l.008.005c.055.04.11.078.163.116.054.038.107.074.16.11.054.034.106.068.16.099.053.033.106.063.16.09.056.028.11.053.166.076.055.022.11.041.167.057.056.016.113.029.17.038.057.009.114.014.17.015.058.001.115-.002.172-.01.056-.007.112-.018.166-.036.054-.016.107-.038.158-.066.05-.027.098-.06.143-.097.045-.037.088-.079.127-.125.04-.047.075-.097.107-.15.032-.054.06-.11.083-.169.025-.06.044-.122.059-.185.014-.063.023-.127.027-.19.004-.064.003-.128-.003-.19-.006-.062-.017-.123-.033-.181-.016-.059-.037-.116-.063-.17-.026-.055-.056-.107-.092-.155-.034-.048-.074-.092-.116-.132-.044-.04-.09-.075-.14-.107-.049-.031-.1-.059-.153-.081-.054-.022-.109-.04-.164-.054-.056-.013-.112-.021-.168-.025-.056-.003-.112-.002-.167.004-.055.006-.11.016-.163.032-.053.015-.104.035-.152.06-.05.025-.096.055-.139.088-.044.033-.084.07-.12.11-.037.04-.071.083-.1.13-.028.046-.054.095-.075.145-.02.05-.038.102-.051.155-.013.052-.022.105-.026.158l-.006.005c-.023.085-.025.173-.012.256.013.084.038.165.082.24.043.074.097.139.162.19.065.052.14.09.218.115.079.026.16.037.242.035.082-.003.162-.02.236-.05.075-.032.143-.074.201-.128.059-.053.107-.117.143-.187.037-.07.06-.145.075-.22.01-.074.007-.148-.009-.22-.015-.07-.042-.137-.08-.198-.038-.06-.085-.112-.139-.154-.054-.042-.114-.074-.178-.094-.064-.02-.13-.027-.197-.022-.066.005-.13.024-.19.053-.06.029-.113.068-.158.117-.046.048-.082.103-.108.163-.026.06-.042.122-.046.186-.004.065.004.129.023.19.02.061.05.118.087.17.036.051.08.096.129.132.049.038.103.067.159.087l.01.005c.077.03.156.051.237.062.08.012.16.014.24.007.079-.007.157-.023.23-.05.074-.025.144-.062.207-.107.063-.046.12-.1.168-.162.048-.062.087-.131.115-.205.028-.074.044-.152.048-.23.004-.08-.004-.158-.024-.234-.02-.075-.051-.146-.09-.211-.04-.065-.088-.122-.142-.17-.055-.048-.116-.086-.182-.113-.066-.027-.135-.042-.205-.044-.07-.002-.14.009-.207.032-.066.022-.128.056-.182.1-.055.043-.101.095-.138.153-.037.059-.063.122-.079.189-.015.066-.019.134-.011.2.007.066.027.129.056.187.03.058.067.11.11.154.044.044.093.079.147.104.054.026.11.042.168.047.059.004.117-.001.173-.017.056-.014.109-.038.156-.072.048-.033.088-.075.12-.123.031-.047.053-.099.064-.154.011-.054.011-.109-.001-.162-.012-.053-.033-.102-.065-.144-.03-.041-.07-.075-.114-.1-.045-.024-.094-.038-.144-.04-.05-.002-.1.007-.147.028-.046.02-.087.05-.121.088-.034.038-.059.082-.073.13-.014.047-.016.096-.006.144.01.047.03.09.061.128.028.035.064.062.104.082.04.02.084.03.13.031.044.001.088-.007.128-.025.04-.017.075-.043.105-.076.028-.033.05-.071.062-.113.012-.04.014-.084.005-.125-.01-.04-.028-.078-.055-.11-.026-.03-.059-.054-.097-.07-.037-.015-.077-.022-.117-.019-.04.003-.08.013-.116.031-.035.017-.066.042-.092.073-.025.03-.044.065-.055.103-.01.038-.012.078-.004.115.009.038.025.073.049.103.023.029.052.053.084.07.033.017.069.027.105.028.038.001.076-.006.11-.022.033-.015.062-.038.085-.065.023-.026.039-.057.047-.09.008-.033.008-.068 0-.1-.007-.033-.022-.063-.044-.088-.021-.025-.048-.044-.078-.056-.031-.012-.064-.016-.097-.012-.032.004-.063.015-.09.034-.027.019-.05.044-.065.073-.016.028-.023.059-.022.09.001.032.01.063.025.09.015.027.035.05.059.067.024.017.051.028.08.032.029.004.058 0 .084-.011.026-.01.049-.027.066-.049.018-.021.028-.047.03-.074.002-.027-.002-.053-.016-.077-.011-.02-.028-.038-.048-.051-.02-.013-.043-.02-.067-.02-.024-.001-.048.005-.068.018-.02.012-.035.029-.044.05-.009.02-.011.043-.007.065.004.021.015.04.03.055.015.016.033.027.053.033.02.007.041.009.062.005.02-.003.039-.012.054-.024.014-.012.025-.028.03-.046.005-.017.004-.036-.003-.053-.007-.017-.018-.031-.033-.041-.015-.01-.032-.016-.05-.016-.018 0-.035.006-.05.016-.015.01-.025.024-.03.041-.005.017-.004.034.003.05.007.016.018.028.033.036.014.008.031.011.048.009.018-.002.034-.01.046-.023.013-.012.02-.028.022-.046.002-.017-.002-.034-.011-.047-.009-.013-.022-.024-.038-.03-.015-.006-.032-.008-.048-.004-.016.003-.03.011-.041.023-.011.012-.017.027-.018.043-.001.016.005.031.016.042.01.012.024.02.038.024.014.004.029.002.042-.005.012-.007.022-.017.027-.029.006-.011.007-.025.002-.037-.004-.011-.013-.02-.024-.026-.01-.006-.022-.007-.034-.005-.012.002-.022.008-.029.017-.007.009-.01.02-.008.03.002.01.007.018.015.024.007.006.016.01.025.01.009.001.018-.001.025-.006.008-.005.013-.012.016-.021.002-.009.002-.018-.002-.026-.004-.009-.01-.015-.018-.019-.008-.004-.016-.005-.025-.003-.008.002-.016.007-.021.014-.006.007-.009.016-.009.025 0 .009.003.017.009.023.005.007.013.01.021.011.008.001.016-.001.023-.006.006-.005.01-.012.012-.02.001-.008 0-.017-.005-.023-.004-.007-.011-.012-.019-.014-.007-.002-.015-.001-.021.003-.006.003-.011.009-.013.016-.002.007-.001.014.003.02.004.005.01.009.017.011.006.002.013.001.019-.002.006-.003.01-.008.012-.015.002-.006.001-.013-.002-.019-.003-.005-.008-.009-.013-.011-.006-.002-.012-.002-.017.001-.005.003-.008.007-.01.012-.002.005-.001.01.001.015.002.004.006.007.011.009.005.001.01.001.015-.001.004-.002.007-.005.01-.01.002-.004.002-.009 0-.013z"/>
      </svg>
    ),
    description: 'Native desktop app for Ubuntu, Debian, Fedora, and other distributions.',
    buildCommand: 'npm run tauri:build',
  },
  {
    platform: 'android',
    label: 'Android',
    os: 'Android 8.0+ (API 26+) · APK',
    ext: ['.apk'],
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M17.523 15.341c-.59 0-1.068-.478-1.068-1.068s.478-1.068 1.068-1.068 1.068.478 1.068 1.068-.478 1.068-1.068 1.068m-11.046 0c-.59 0-1.068-.478-1.068-1.068s.478-1.068 1.068-1.068 1.068.478 1.068 1.068-.478 1.068-1.068 1.068m11.405-6.411l2.127-3.682a.443.443 0 00-.162-.605.443.443 0 00-.605.162l-2.153 3.728A12.936 12.936 0 0012 8.029a12.936 12.936 0 00-5.089 1.503L4.758 5.805a.443.443 0 00-.605-.162.443.443 0 00-.162.605l2.127 3.682C3.644 11.52 2 14.09 2 17h20c0-2.91-1.644-5.48-4.118-7.07" fill="#3DDC84"/>
      </svg>
    ),
    description: 'Sideloadable APK built with Capacitor v8. No Play Store required.',
    installCommand: 'adb install haven-release.apk',
  },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function matchAssets(assets: ReleaseAsset[], exts: string[]): ReleaseAsset[] {
  return assets.filter(a => exts.some(ext => a.name.toLowerCase().includes(ext.toLowerCase())));
}

export default function DownloadPage() {
  const [data, setData] = useState<ReleasesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchReleases = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/releases/latest');
      const json: ReleasesResponse = await res.json();
      setData(json);
    } catch (err: any) {
      setFetchError('Could not reach the release API. Check your server configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReleases(); }, []);

  const latestRelease = data?.releases?.[0] ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-5xl px-4 md:px-8 py-16 md:py-24">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground mb-8">
            <Package className="w-3.5 h-3.5" />
            Cross-Platform · Open Source · Free
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
            Download Haven
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Available for Windows, Linux, and Android. Built automatically via GitHub Actions
            from the open-source repository.
          </p>
        </div>

        {/* Release Status */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Checking for releases...</span>
          </div>
        )}

        {fetchError && (
          <div className="mb-10 p-5 rounded-2xl border border-destructive/30 bg-destructive/5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive mb-1">Release check failed</p>
              <p className="text-sm text-muted-foreground">{fetchError}</p>
            </div>
          </div>
        )}

        {/* No releases yet — Pipeline in progress state */}
        {!loading && !fetchError && !data?.hasReleases && (
          <div className="mb-12 p-8 rounded-2xl border border-border bg-card/60 backdrop-blur text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Compiled releases are not yet published</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed mb-6">
              The automated GitHub Actions pipeline compiles platform binaries when a versioned tag
              is pushed to the repository. No public tag has been created yet.
              You can build Haven locally or trigger the pipeline yourself.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://github.com/dzlab/haven/actions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-sm font-semibold"
              >
                <Github className="w-4 h-4" />
                View Pipeline Status
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </a>
              <button
                onClick={fetchReleases}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Check again
              </button>
            </div>
          </div>
        )}

        {/* Latest release info */}
        {!loading && latestRelease && (
          <div className="mb-10 p-5 rounded-2xl border border-border bg-card/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{latestRelease.name || latestRelease.tag}</span>
                  {latestRelease.prerelease && (
                    <Badge className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20">Pre-release</Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">Released {formatDate(latestRelease.publishedAt)}</span>
              </div>
            </div>
            <a
              href={`https://github.com/dzlab/haven/releases/tag/${latestRelease.tag}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Github className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          </div>
        )}

        {/* Platform download cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {platforms.map((p) => {
            const assets = latestRelease ? matchAssets(latestRelease.assets, p.ext) : [];
            const hasAssets = assets.length > 0;

            return (
              <div
                key={p.platform}
                className="flex flex-col border border-border bg-card/60 backdrop-blur rounded-2xl p-6 hover:border-border/80 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-foreground">
                    {p.icon}
                  </div>
                  {hasAssets ? (
                    <Badge className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Available</Badge>
                  ) : (
                    <Badge className="text-[10px] bg-muted text-muted-foreground border-transparent">
                      {loading ? 'Checking...' : 'Build Required'}
                    </Badge>
                  )}
                </div>

                <h3 className="font-bold text-base mb-1">{p.label}</h3>
                <p className="text-xs text-muted-foreground mb-1 font-mono">{p.os}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-5 flex-1">{p.description}</p>

                {hasAssets ? (
                  <div className="space-y-2">
                    {assets.map((asset) => (
                      <a
                        key={asset.id}
                        href={asset.downloadUrl}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-bold gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Download className="w-4 h-4 shrink-0" />
                          <span className="truncate">{asset.name}</span>
                        </div>
                        <span className="shrink-0 opacity-70 font-mono">{formatBytes(asset.size)}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-border rounded-xl p-4 text-center">
                    {p.buildCommand && (
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-2">Build locally:</p>
                        <code className="text-xs font-mono bg-muted/50 px-3 py-1.5 rounded-lg text-foreground block">
                          {p.buildCommand}
                        </code>
                      </div>
                    )}
                    {p.installCommand && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">After download:</p>
                        <code className="text-xs font-mono bg-muted/50 px-3 py-1.5 rounded-lg text-foreground block">
                          {p.installCommand}
                        </code>
                      </div>
                    )}
                    <a
                      href={`https://github.com/dzlab/haven/actions`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Check pipeline
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Build from source */}
        <div className="border border-border bg-card/40 rounded-2xl p-8 md:p-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Github className="w-5 h-5" />
            Build from Source
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                Windows / Linux Desktop (Tauri v2)
              </h3>
              <div className="space-y-2 font-mono text-xs">
                {[
                  '# Prerequisites: Node 20+, Rust stable, system deps',
                  '# Linux: sudo apt install libwebkit2gtk-4.1-dev ...',
                  'git clone https://github.com/dzlab/haven',
                  'cd haven && npm install',
                  'npm run tauri:dev   # development',
                  'npm run tauri:build # production binary',
                ].map((cmd, i) => (
                  <div key={i} className={`px-4 py-2 rounded-lg ${cmd.startsWith('#') ? 'text-muted-foreground' : 'bg-muted/40 text-foreground'}`}>
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                Android APK (Capacitor v8)
              </h3>
              <div className="space-y-2 font-mono text-xs">
                {[
                  '# Prerequisites: Node 20+, Android Studio, JDK 17',
                  'git clone https://github.com/dzlab/haven',
                  'cd haven && npm install && npm run build',
                  'npx cap add android',
                  'npx cap sync android',
                  'cd android && ./gradlew assembleDebug',
                  '# APK: android/app/build/outputs/apk/debug/',
                ].map((cmd, i) => (
                  <div key={i} className={`px-4 py-2 rounded-lg ${cmd.startsWith('#') ? 'text-muted-foreground' : 'bg-muted/40 text-foreground'}`}>
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SHA256 checksums */}
          {latestRelease && latestRelease.assets.some(a => a.name === 'SHA256SUMS.txt') && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                Verify Integrity
              </h3>
              <div className="font-mono text-xs bg-muted/30 rounded-xl p-4 space-y-1.5">
                {latestRelease.assets
                  .filter(a => a.name !== 'SHA256SUMS.txt')
                  .map(a => (
                    <div key={a.id} className="flex items-center gap-3 text-muted-foreground">
                      <span className="text-primary font-bold shrink-0">SHA256</span>
                      <span className="truncate">{a.name}</span>
                      <a
                        href={latestRelease.assets.find(x => x.name === 'SHA256SUMS.txt')?.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-xs hover:text-foreground transition-colors"
                      >
                        verify ↗
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
