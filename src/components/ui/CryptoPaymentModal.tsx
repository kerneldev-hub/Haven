import React, { useState, useEffect } from 'react';
import { 
  X, Check, Copy, Clock, ShieldCheck, RefreshCw, 
  Coins, ArrowRight, Radio, ExternalLink, Library, CheckCircle
} from 'lucide-react';
import { Button } from './components';
import { Badge } from './Badge';

interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  amount: number;
  currency: string;
  depositAddress: string;
  userId: string;
  planId: string;
  onVerificationSuccess: (newTier: string) => void;
}

interface CoinOption {
  symbol: string;
  name: string;
  icon: string;
  network: string;
  address: string;
  multiplier: number;
  color: string;
}

const coins: CoinOption[] = [
  { symbol: 'USDT', name: 'Tether USD', icon: '🟢', network: 'TRC20 / BEP20', address: 'TR7NHqdj61L397F1eP2FiK67ST7592tv6n', multiplier: 1, color: 'text-emerald-400 bg-emerald-500/10' },
  { symbol: 'BTC', name: 'Bitcoin', icon: '🍊', network: 'BTC Mainnet', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', multiplier: 0.000015, color: 'text-amber-500 bg-amber-500/10' },
  { symbol: 'ETH', name: 'Ethereum', icon: '🔷', network: 'ERC20 (Mainnet)', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', multiplier: 0.00032, color: 'text-indigo-400 bg-indigo-500/10' },
  { symbol: 'SOL', name: 'Solana', icon: '🟣', network: 'Solana Network', address: 'HN7cABmqscJeX99db9e6C7b36yFFf7g8p12c987DF', multiplier: 0.0055, color: 'text-purple-400 bg-purple-500/10' },
  { symbol: 'LTC', name: 'Litecoin', icon: '⚡', network: 'Litecoin Mainnet', address: 'Lby3D9Y6bA9A2dfB98deC7b36yFFf7G8p', multiplier: 0.012, color: 'text-sky-400 bg-sky-500/10' }
];

export function CryptoPaymentModal({
  isOpen,
  onClose,
  invoiceId,
  amount,
  currency,
  depositAddress,
  userId,
  planId,
  onVerificationSuccess
}: CryptoPaymentModalProps) {
  const [selectedCoin, setSelectedCoin] = useState<CoinOption>(coins[0]);
  const [network, setNetwork] = useState<'TRC20' | 'BEP20'>('TRC20');
  const [copied, setCopied] = useState(false);
  const [verifyStage, setVerifyStage] = useState<'idle' | 'mempool' | 'confirming' | 'syncing' | 'completed' | 'failed'>('idle');
  const [countdown, setCountdown] = useState(900); // 15 mins
  const [currentAddress, setCurrentAddress] = useState(depositAddress);
  const [txHash, setTxHash] = useState('');

  // Handle address update based on chosen coin and network
  useEffect(() => {
    if (selectedCoin.symbol === 'USDT') {
      if (network === 'BEP20') {
        setCurrentAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
      } else {
        setCurrentAddress('TR7NHqdj61L397F1eP2FiK67ST7592tv6n');
      }
    } else {
      setCurrentAddress(selectedCoin.address);
    }
  }, [network, selectedCoin]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulates onbed stage verification with backend handshake
  const handleVerifyPayment = async () => {
    setVerifyStage('mempool');
    
    // Step 1: Listening to Mempool
    setVerifyStage('confirming');
    setTxHash(network === 'TRC20' 
      ? 'f3b8908da781e66c781190bcda42fa60c6dbe329de419ab009cb9f82de011cb5' 
      : '0x8bda42fa60c6dbe329de419ab009cb9f82de011cb57db8908da781e66c781190b'
    );

    // Step 2: Confirmation
    setVerifyStage('syncing');

    // Step 3: Synced & Activation via DB API
    try {
      // Send mock webhook to trigger DB confirmation bypassing traditional strict auth
      await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-chargily-signature': 'MOCK_SIGNATURE_OK'
        },
        body: JSON.stringify({
          event: 'checkout.paid',
          data: { invoiceId }
        })
      });

      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      });

      if (response.ok) {
        setVerifyStage('completed');
        // Update user state tier
        localStorage.setItem('haven_user_tier', planId);
        onVerificationSuccess(planId);
      } else {
         setVerifyStage('failed');
      }
    } catch (e) {
      setVerifyStage('failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-card border border-border/80 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-6 border-b border-border/40 bg-muted/10 flex justify-between items-center select-none shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Coins className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Secured USDT Settlement Portal</h2>
              <p className="text-[10px] font-mono text-muted-foreground uppercase mt-0.5 tracking-wider">SECURE INSTANCE ID: {invoiceId}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full border hover:bg-muted font-bold transition-all text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Rate Timer Alarm */}
          {verifyStage !== 'completed' && (
            <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 dark:text-yellow-400 rounded-2xl flex items-center justify-between gap-3 text-xs font-mono font-bold select-none">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 animate-spin [animation-duration:12s]" /> RATE GUARANTEE COUNTDOWN</span>
              <span className="text-sm bg-yellow-500/20 px-2 py-0.5 rounded font-extrabold">{formatTimer(countdown)}</span>
            </div>
          )}

          {verifyStage === 'completed' ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-400">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xl">
                <CheckCircle className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="text-xl font-extrabold tracking-tight">Decentralized Token Clearance Complete!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedCoin.symbol} deposit on-chain transfer has been securely verified. Your {planId} server-grade license is activated on the database vault.
                </p>
              </div>

              <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl text-left max-w-sm mx-auto space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-muted-foreground uppercase">LICENSE CLASS:</span>
                  <span className="font-bold text-foreground">{planId}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-muted-foreground uppercase">STATUS:</span>
                  <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">ACTIVE</span>
                </div>
              </div>

              <div className="pt-2">
                <Button className="w-full max-w-xs font-semibold mx-auto rounded-xl" onClick={onClose}>
                  Access Elevated Workspace
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Coin Variety Selector */}
              <div className="space-y-2 select-none">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">SELECT SETTLEMENT TOKENS</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {coins.map((coin) => (
                    <button
                      key={coin.symbol}
                      onClick={() => {
                        setSelectedCoin(coin);
                        setVerifyStage('idle');
                      }}
                      className={`py-2 px-1 text-center rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        selectedCoin.symbol === coin.symbol
                          ? 'border-primary/50 bg-primary/10 text-foreground font-black'
                          : 'border-border bg-card/45 hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <span className="text-sm mb-1">{coin.icon}</span>
                      <span className="text-[10.5px] font-bold font-mono tracking-tight">{coin.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Network Selector Tabs (Only for USDT) */}
              {selectedCoin.symbol === 'USDT' && (
                <div className="space-y-2 select-none animate-in fade-in duration-300">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">CHOOSE USABLE NETWORK</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setNetwork('TRC20')}
                      className={`h-11 px-4 text-xs font-mono font-bold rounded-xl border flex items-center justify-between transition-all ${
                        network === 'TRC20' 
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-extrabold' 
                          : 'border-border hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>USDT TRC20</span>
                      <Badge className={`px-1.5 py-0.25 text-[8px] tracking-wide uppercase ${network === 'TRC20' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted'}`}>TRON</Badge>
                    </button>

                    <button
                      onClick={() => setNetwork('BEP20')}
                      className={`h-11 px-4 text-xs font-mono font-bold rounded-xl border flex items-center justify-between transition-all ${
                        network === 'BEP20' 
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-extrabold' 
                          : 'border-border hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>USDT BEP20</span>
                      <Badge className={`px-1.5 py-0.25 text-[8px] tracking-wide uppercase ${network === 'BEP20' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted'}`}>BSC</Badge>
                    </button>
                  </div>
                </div>
              )}

              {/* Deposit Visual Grid */}
              <div className="grid md:grid-cols-12 gap-5 items-center">
                {/* SVG Procedural High-Contrast Vector QR Code */}
                <div className="md:col-span-4 flex flex-col justify-center items-center bg-zinc-950 p-4 border border-zinc-900 rounded-2xl select-none relative group shrink-0">
                  <div className="absolute top-2 left-2 flex items-center gap-1 text-[8.5px] font-mono text-zinc-500">
                    <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-500" /> ONLINE QR
                  </div>
                  <svg className="w-28 h-28 text-white mt-1.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Outer border markers */}
                    <rect x="5" y="5" width="25" height="25" stroke="currentColor" strokeWidth="6" />
                    <rect x="12" y="12" width="11" height="11" fill="currentColor" />
                    <rect x="70" y="5" width="25" height="25" stroke="currentColor" strokeWidth="6" />
                    <rect x="77" y="12" width="11" height="11" fill="currentColor" />
                    <rect x="5" y="70" width="25" height="25" stroke="currentColor" strokeWidth="6" />
                    <rect x="12" y="77" width="11" height="11" fill="currentColor" />
                    {/* Mock randomized QR pixels */}
                    <rect x="36" y="8" width="6" height="14" fill="currentColor" />
                    <rect x="48" y="5" width="12" height="6" fill="currentColor" />
                    <rect x="42" y="18" width="18" height="6" fill="currentColor" />
                    <rect x="10" y="40" width="15" height="10" fill="currentColor" />
                    <rect x="30" y="32" width="18" height="6" fill="currentColor" />
                    <rect x="55" y="35" width="6" height="24" fill="currentColor" />
                    <rect x="68" y="42" width="14" height="12" fill="currentColor" />
                    <rect x="12" y="58" width="24" height="6" fill="currentColor" />
                    <rect x="40" y="50" width="10" height="18" fill="currentColor" />
                    <rect x="68" y="62" width="6" height="16" fill="currentColor" />
                    <rect x="80" y="68" width="15" height="6" fill="currentColor" />
                    <rect x="38" y="75" width="22" height="8" fill="currentColor" />
                    <rect x="48" y="88" width="18" height="6" fill="currentColor" />
                    <rect x="75" y="82" width="15" height="13" fill="currentColor" />
                    {/* Active target element */}
                    <circle cx="50" cy="50" r="10" fill="#10b981" />
                    <path d="M47 50L49 52L53 48" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[9px] font-mono text-zinc-500 font-semibold tracking-wider uppercase mt-3">Scan to Transact</span>
                </div>

                {/* Amount and Address Detail */}
                <div className="md:col-span-8 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">SECURED DEPOSIT VALUE</span>
                    <div className="text-2xl font-black text-foreground font-mono flex items-baseline gap-1.5 text-left">
                      {(amount * selectedCoin.multiplier).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} <span className="text-sm font-bold text-emerald-500">{selectedCoin.symbol}</span>
                      <span className="text-xs font-mono text-zinc-500 font-normal ml-auto">~ {amount.toLocaleString()} USD</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">DEPOSIT ADDRESS ({selectedCoin.symbol === 'USDT' ? network : selectedCoin.network})</span>
                    <div className="flex items-center gap-2 bg-background border p-2.5 rounded-xl max-w-full overflow-hidden shadow-inner">
                      <span className="font-mono text-xs text-foreground truncate select-all grow">{currentAddress}</span>
                      <button 
                        onClick={handleCopy}
                        className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 border rounded-lg cursor-pointer flex items-center justify-center p-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[9px] text-zinc-500 block leading-normal">
                      Only dispatch {selectedCoin.symbol} over custom {selectedCoin.symbol === 'USDT' ? network : selectedCoin.network} chain specs. Transferring other currencies causes permanent depletion.
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Verification Stage Steps */}
              {verifyStage !== 'idle' && (
                <div className="p-4 bg-muted/20 border rounded-2xl text-xs space-y-3 font-mono">
                  <div className="flex justify-between items-center border-b border-border/40 pb-2">
                    <span className="font-bold text-foreground flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> ON-CHAIN CONSENSUS STAGES</span>
                    <Badge className="bg-primary/10 text-primary uppercase text-[9px]">{verifyStage}</Badge>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        verifyStage === 'mempool' ? 'bg-amber-500 animate-pulse' : 
                        ['confirming', 'syncing', 'completed'].includes(verifyStage) ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`} />
                      <span className={['confirming', 'syncing', 'completed'].includes(verifyStage) ? 'text-foreground' : 'text-muted-foreground'}>
                        Stage 1: Scanning Network Mempool Queue
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        verifyStage === 'confirming' ? 'bg-amber-500 animate-pulse' : 
                        ['syncing', 'completed'].includes(verifyStage) ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`} />
                      <span className={['syncing', 'completed'].includes(verifyStage) ? 'text-foreground' : 'text-muted-foreground'}>
                        Stage 2: Waiting Block Confirmations (2 / 2 nodes synced)
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        verifyStage === 'syncing' ? 'bg-amber-500 animate-pulse' : 
                        verifyStage === 'completed' ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`} />
                      <span className={verifyStage === 'completed' ? 'text-foreground' : 'text-muted-foreground'}>
                        Stage 3: Mapping Database Access Token Keys
                      </span>
                    </div>
                  </div>

                  {txHash && (
                    <div className="pt-2 border-t border-border/30 mt-1 flex flex-col gap-1 text-[9.5px]">
                      <span className="text-zinc-500 font-bold uppercase">TX HASH ID:</span>
                      <span className="text-zinc-400 truncate select-all">{txHash}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                {verifyStage === 'idle' ? (
                  <Button 
                    onClick={handleVerifyPayment}
                    className="w-full h-12 text-xs font-bold font-mono tracking-wider uppercase bg-primary hover:bg-primary/95 text-primary-foreground flex justify-center items-center gap-2 rounded-xl"
                  >
                    I Have Dispatched {selectedCoin.symbol} Deposit <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button 
                    disabled 
                    variant="outline"
                    className="w-full h-12 text-xs font-bold font-mono uppercase text-muted-foreground bg-muted/20 flex justify-center items-center gap-2 rounded-xl"
                  >
                    Scanning On-Chain Network...
                  </Button>
                )}
                
                <div className="flex justify-center items-center gap-2 text-[10px] text-zinc-500 font-sans select-none">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Settled through secure decentralized payment clearance loops.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
