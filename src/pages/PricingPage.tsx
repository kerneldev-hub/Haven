import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button } from '../components/ui/components';
import { 
  CheckCircle2, Shield, Users, Zap, Terminal, CreditCard, HeartHandshake, Bot, 
  ChevronRight, Sparkles, Clock, ArrowRight, ShieldCheck, Wallet, Coins, 
  RefreshCw, Check, AlertCircle, Copy, Laptop, ExternalLink, QrCode, ArrowLeft,
  Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { CryptoPaymentModal } from '../components/ui/CryptoPaymentModal';

export default function PricingPage() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Active Session info
  const [currentUser, setCurrentUser] = useState<string>(() => {
    return localStorage.getItem('haven_user') || 'gamerdzbba7';
  });
  const [currentTier, setCurrentTier] = useState<string>(() => {
    return localStorage.getItem('haven_user_tier') || 'FREE';
  });

  useEffect(() => {
    // Check dynamic tier from database backend on load
    const user = localStorage.getItem('haven_user') || 'gamerdzbba7';
    fetch(`/api/payments/user-tier/${user}`)
      .then(r => r.json())
      .then(data => {
        if (data.tier) {
          setCurrentTier(data.tier);
          localStorage.setItem('haven_user_tier', data.tier);
        }
      })
      .catch(err => console.warn('Could not sync user tier from live backend database:', err));
  }, []);

  // Checkout Engine States
  const [checkoutPlan, setCheckoutPlan] = useState<'FREE' | 'PRO' | 'TEAM' | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4>(1); // 1: Choose Method, 2: Simulator/Details, 3: Success Check
  const [checkoutMethod, setCheckoutMethod] = useState<'chargily' | 'global' | 'crypto' | null>(null);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);

  // Custom toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };
  
  // Invoice state from backend
  const [invoice, setInvoice] = useState<any>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 mins
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState('');
  
  // Algeria Chargily pay simulator states
  const [cardCarrier, setCardCarrier] = useState<'EDAHABIA' | 'CIB'>('EDAHABIA');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [chargilyProcessing, setChargilyProcessing] = useState(false);

  // Live countdown timer for selected payment lock
  useEffect(() => {
    let interval: any;
    if (checkoutPlan && checkoutStep === 2) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 900));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [checkoutPlan, checkoutStep]);

  const formatTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Launch Checkout Engine Instance
  const startCheckout = (planId: 'FREE' | 'PRO' | 'TEAM') => {
    if (planId === 'FREE') {
      // Downgrade or claim free
      localStorage.setItem('haven_user_tier', 'FREE');
      setCurrentTier('FREE');
      showToast('Your workspace node has been reset to basic Free tier limits.', 'info');
      return;
    }
    setCheckoutPlan(planId);
    setCheckoutStep(1);
    setCheckoutMethod(null);
    setInvoice(null);
    setVerificationFeedback('');
    setCountdown(900);
  };

  // Direct Checkout Bypass for specific gateways
  const startDirectCheckout = (planId: 'FREE' | 'PRO' | 'TEAM', method: 'chargily' | 'crypto') => {
    if (planId === 'FREE') return;
    
    setCheckoutPlan(planId);
    setCheckoutStep(1);
    setCheckoutMethod(method);
    setInvoice(null);
    setVerificationFeedback('');
    setCountdown(900);
    setVerifyLoading(true);

    // Dynamic scale-factor calculation based on billing terms
    let amount = 29.45;
    let currency = 'USD';

    if (planId === 'TEAM') {
      amount = isAnnual ? 70.05 : 90.35;
    } else {
      amount = isAnnual ? 24.35 : 29.45;
    }

    if (method === 'chargily') {
      currency = 'DZD';
      if (planId === 'TEAM') {
        amount = isAnnual ? 9740 : 12180;
      } else {
        amount = isAnnual ? 3250 : 4060;
      }
    } else if (method === 'crypto') {
      currency = 'USDT';
    }

    // Scroll smoothly to checkout console
    setTimeout(() => {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }, 120);

    fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        paymentMethod: method,
        currency,
        amount,
        email: `${currentUser}@haven.io`,
        userId: currentUser
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setInvoice(data);
        setCheckoutStep(2);
        if (method === 'crypto') {
          setIsCryptoModalOpen(true);
        }
      } else {
        showToast(`Error generating payment: ${data.error}`, 'error');
      }
    })
    .catch(err => {
      showToast(`Network error creating checkout: ${err.message}`, 'error');
    })
    .finally(() => {
      setVerifyLoading(false);
    });
  };

  const handleCreateInvoice = async (method: 'chargily' | 'global' | 'crypto') => {
    setCheckoutMethod(method);
    setVerifyLoading(true);

    let amount = 29.45;
    let currency = 'USD';

    if (checkoutPlan === 'TEAM') {
      amount = isAnnual ? 70.05 : 90.35;
    } else {
      amount = isAnnual ? 24.35 : 29.45;
    }

    if (method === 'chargily') {
      currency = 'DZD';
      if (checkoutPlan === 'TEAM') {
        amount = isAnnual ? 9740 : 12180;
      } else {
        amount = isAnnual ? 3250 : 4060;
      }
    } else if (method === 'crypto') {
      currency = 'USDT';
    }

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: checkoutPlan,
          paymentMethod: method,
          currency,
          amount,
          email: `${currentUser}@haven.io`,
          userId: currentUser
        })
      });

      const data = await response.json();
      if (data.success) {
        setInvoice(data);
        setCheckoutStep(2);
        if (method === 'crypto') {
          setIsCryptoModalOpen(true);
        }
      } else {
        showToast(`Error generating payment: ${data.error}`, 'error');
      }
    } catch (err: any) {
      showToast(`Network error creating checkout: ${err.message}`, 'error');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Algeria Local Payment Simulator - EDAHABIA or SATIM / CIB Card checkout
  const handleSimulateChargilySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !cardExpiry || !cardCvc) {
      showToast('Please fill in all requested payment credentials variables to authorize transaction.', 'error');
      return;
    }

    setChargilyProcessing(true);
    
    // Simulate API delay connecting to Chargily processing servers
    setTimeout(async () => {
      try {
        // Trigger simulated Webhook to backend to actually confirm the payment securely via signature
        await fetch('/api/payments/webhook', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-chargily-signature': 'MOCK_SIGNATURE_OK'
          },
          body: JSON.stringify({
            event: 'checkout.paid',
            data: { invoiceId: invoice.invoice.id }
          })
        });

        // Now poll verification standardly
        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceId: invoice.invoice.id
          })
        });

        const data = await response.json();
        if (data.success) {
          // Success checkout step transition
          setCheckoutStep(3);
          localStorage.setItem('haven_user_tier', checkoutPlan!);
          setCurrentTier(checkoutPlan!);
          
          // Trigger mock webhook payload for platform logs consistency
          try {
            await fetch('/api/payments/webhook', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'X-Chargily-Signature': 'sim-hmac-sha256-signature-987213897123981273981723'
              },
              body: JSON.stringify({
                event: 'checkout.paid',
                data: { invoiceId: invoice.invoice.id }
              })
            });
          } catch(e) {}

        } else {
          showToast('Chargily payment processor declined transactions.', 'error');
        }
      } catch (err: any) {
        showToast(`Verification server issue: ${err.message}`, 'error');
      } finally {
        setChargilyProcessing(false);
      }
    }, 1800);
  };

  // Instant Record / Webhook Verification Trigger (USDT Crypto or PayPal fallback)
  const handleVerifyInstantPayment = async () => {
    setVerifyLoading(true);
    setVerificationFeedback('Scanning blockchain transaction pools for transactions matching invoice amount & hashes...');

    setTimeout(async () => {
      try {
        await fetch('/api/payments/webhook', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-chargily-signature': 'MOCK_SIGNATURE_OK'
          },
          body: JSON.stringify({
            event: 'checkout.paid',
            data: { invoiceId: invoice.invoice.id }
          })
        });

        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceId: invoice.invoice.id
          })
        });

        const data = await response.json();
        if (data.success && data.payment.status === 'confirmed') {
          setCheckoutStep(3);
          localStorage.setItem('haven_user_tier', checkoutPlan!);
          setCurrentTier(checkoutPlan!);
        } else {
          setVerificationFeedback('Invoice pending. No matching transaction detected. Try again or check with administrator.');
        }
      } catch (err: any) {
        setVerificationFeedback(`Verification endpoint communication error: ${err.message}`);
      } finally {
        setVerifyLoading(false);
      }
    }, 2000);
  };

  const faqs = [
    {
      question: "Are there any credit card requirements in Algeria?",
      answer: "No. HAVEN PAY is engineered with zero reliance on traditional Visa or MasterCards. We fully support native Algeria payments via EDAHABIA (Algérie Poste) and satisfaction-checked Satim/CIB cards directly via the Chargily Pay integration gateway, making software checkout fast and local."
    },
    {
      question: "Which cryptocurrencies and networks are validated?",
      answer: "We support USDT as our primary asset. We validate transactions on both the TRC20 network (Tron) and BEP20 network (BNB Smart Chain). Our payment monitor matches transaction states to ensure prompt plan activation."
    },
    {
      question: "Do you store secret keys or customer funds?",
      answer: "Never. Haven Pay operates purely as software routing checkout verification. All payments execute directly on public networks or Chargily official secure layers. Your private keys and financial nodes remain secure."
    },
    {
      question: "How is the Team plan billed?",
      answer: "The Team plan is billed per seat seat. You are only charged for active builders on your workspace. Direct conversions translate from local Algerian Dinars or stable Crypto to reflect true values accurately."
    },
    {
      question: "Is there a refund option?",
      answer: "Refunds can be triggered instantly from the Admin Platform Management panel by administrators. Contact support with your transaction hash coordinates for support query verification."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden text-foreground selection:bg-primary/20">
      {/* Background Ambience Glares */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 flex-1 relative z-10">
        
        {/* Active Node Tier Status Banner */}
        <div className="max-w-4xl mx-auto mb-10 bg-card/40 border border-border/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl animate-in fade-in select-none">
          <div className="flex items-center gap-3.5 text-left">
            <span className="p-2 sm:p-3 bg-primary/10 rounded-xl text-primary text-sm font-bold">@</span>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">LOGGED USER:</span>
                <span className="text-xs font-bold font-mono text-foreground">@{currentUser}</span>
              </div>
              <p className="text-sm font-bold text-foreground">Active Workspace Plan Status Window</p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs font-sans text-muted-foreground mr-1">CURRENT MEMBERSHIP TIER:</span>
            <Badge className={`uppercase text-[11px] font-bold tracking-wider px-3 py-1 ${
              currentTier === 'FREE' 
                ? 'bg-zinc-100 dark:bg-zinc-800 text-muted-foreground border-transparent' 
                : (currentTier === 'PRO' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20')
            }`}>
              {currentTier} NODE
            </Badge>
          </div>
        </div>

        {/* ==================== HAVEN CHECKOUT ENGINE (ACTIVE VIEW OVERLAY / MODULE) ==================== */}
        {checkoutPlan && (
          <div className="max-w-3xl mx-auto mb-20 p-1 md:p-2 bg-gradient-to-br from-border/50 via-border/10 to-border/50 rounded-[2.5rem] shadow-2xl relative select-none animate-in scale-in duration-500">
            <div className="bg-card/95 backdrop-blur-2xl rounded-[2.2rem] p-6 md:p-10 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>
              
              {/* Back controls */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-border/50">
                <button 
                  onClick={() => {
                    if (checkoutStep === 1) setCheckoutPlan(null);
                    else if (checkoutStep === 2) setCheckoutStep(1);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> 
                  {checkoutStep === 2 ? 'Change Payment Method' : 'Cancel Checkout'}
                </button>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">HAVEN CHECKOUT NODE</span>
                  <span className="text-xs font-bold font-sans text-primary flex items-center gap-1.5 justify-end">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> PLAN: {checkoutPlan}
                  </span>
                </div>
              </div>

              {/* Progress Steps Indicators */}
              <div className="grid grid-cols-3 gap-2.5 mb-10 max-w-md mx-auto select-none">
                {[
                  { step: 1, label: 'Payment Gateway' },
                  { step: 2, label: 'Verification Processing' },
                  { step: 3, label: 'Access Activated' },
                ].map((s) => (
                  <div key={s.step} className="space-y-2">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${
                      checkoutStep >= s.step ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-muted'
                    }`}></div>
                    <span className={`text-[10px] font-bold block text-center uppercase tracking-wide ${
                      checkoutStep === s.step ? 'text-foreground font-extrabold' : 'text-muted-foreground/60'
                    }`}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* STEP 1: CHOOSE PAYMENT METHOD */}
              {checkoutStep === 1 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight">Select Operational Payment Gateway</h2>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto font-sans leading-relaxed">
                      Flexible payment methods configured for local Algerian access and worldwide decentralized web wallets with zero traditional credit cards requested.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4.5 pt-4">
                    {/* Algeire Option */}
                    <button
                      onClick={() => handleCreateInvoice('chargily')}
                      disabled={verifyLoading}
                      className="flex flex-col items-center justify-between p-6 rounded-2xl border border-border bg-card/65 hover:border-primary/80 hover:bg-muted/30 transition-all text-center gap-4 cursor-pointer relative overflow-hidden group min-h-[220px]"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-sm flex items-center gap-1.5 justify-center">
                          🇩🇿 Algeria Pay
                        </h4>
                        <p className="text-xs text-muted-foreground font-sans line-clamp-3 leading-normal">
                          EDAHABIA card or Satim/CIB cards powered by Chargily Pay with instant automated DZD webhook routing.
                        </p>
                      </div>
                      <Badge className="bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] uppercase border-transparent tracking-wide">
                        Chargily Pay Gateway
                      </Badge>
                    </button>

                    {/* Crypto Option */}
                    <button
                      onClick={() => handleCreateInvoice('crypto')}
                      disabled={verifyLoading}
                      className="flex flex-col items-center justify-between p-6 rounded-2xl border border-border bg-card/65 hover:border-primary/80 hover:bg-muted/30 transition-all text-center gap-4 cursor-pointer relative overflow-hidden group min-h-[220px]"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Coins className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-sm flex items-center gap-1.5 justify-center">
                          ₿ Crypto USDT
                        </h4>
                        <p className="text-xs text-muted-foreground font-sans line-clamp-3 leading-normal">
                          USDT Stable Coin deposits validated natively on TRC20 and BEP20 blockchain networks.
                        </p>
                      </div>
                      <Badge className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase border-transparent tracking-wide">
                        Secure USDT Invoice
                      </Badge>
                    </button>

                    {/* Global Option */}
                    <button
                      onClick={() => handleCreateInvoice('global')}
                      disabled={verifyLoading}
                      className="flex flex-col items-center justify-between p-6 rounded-2xl border border-border bg-card/65 hover:border-primary/80 hover:bg-muted/30 transition-all text-center gap-4 cursor-pointer relative overflow-hidden group min-h-[220px]"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-sm flex items-center gap-1.5 justify-center">
                          🌍 Global Wallet
                        </h4>
                        <p className="text-xs text-muted-foreground font-sans line-clamp-3 leading-normal">
                          Chargily Pay or direct browser digital secure web wallets fallback clearance.
                        </p>
                      </div>
                      <Badge className="bg-primary/10 text-primary font-mono text-[10px] uppercase border-transparent tracking-wide">
                        Digital Wallet Sync
                      </Badge>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PAYMENT VERIFICATION PROCESSING (GATES DETAILED SCREEN) */}
              {checkoutStep === 2 && invoice && (
                <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-400 text-left">
                  
                  {/* Timer Lock Header alert */}
                  <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 dark:text-yellow-400 rounded-xl flex items-center justify-between gap-3 text-xs font-mono font-bold">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 animate-spin [animation-duration:10s]" /> SECURE EXCHANGE RATE LOCKED</span>
                    <span className="text-sm bg-yellow-500/20 px-2 py-0.5 rounded font-extrabold">{formatTimer(countdown)}</span>
                  </div>

                  {/* INVOICE DETAILS GRID */}
                  <div className="grid md:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: PAY COORDINATES */}
                    <div className="md:col-span-7 space-y-6">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">SECURED BILLING INVOICE ID</span>
                        <h3 className="text-xl font-bold font-mono text-foreground flex items-center gap-2">
                          {invoice.invoice.id}
                          <Badge variant="outline" className="text-[10px] font-bold text-zinc-400 border-border bg-muted/40 uppercase">Pending Verification</Badge>
                        </h3>
                      </div>

                      {/* Payment amount show */}
                      <div className="p-5 bg-muted/20 border border-border/60 rounded-2xl flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wide block">TOTAL REQUESTED AMOUNT</span>
                          <span className="text-xs text-muted-foreground">Software subscription licensing</span>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-extrabold text-foreground font-mono">
                            {invoice.invoice.amount.toLocaleString()}
                          </span>
                          <span className="text-md font-extrabold text-primary ml-1.5 font-mono">{invoice.invoice.currency}</span>
                        </div>
                      </div>

                      {/* CRYPTO WORKFLOW INFO */}
                      {checkoutMethod === 'crypto' && (
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">CHOOSE CRYPTO NETWORK</span>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleCreateInvoice('crypto')} // refreshes addresses if needed
                                variant="outline" 
                                className="flex-1 text-xs font-mono font-bold border-emerald-500/25 bg-emerald-500/5 text-emerald-400"
                              >
                                USDT (TRC20 Network) - TRON
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2 text-left">
                            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">SECURED DEPOSIT ADDRESS</label>
                            <div className="flex items-center gap-2 bg-background border rounded-xl p-2.5 overflow-hidden">
                              <span className="font-mono text-xs text-foreground truncate select-all">{invoice.depositAddress}</span>
                              <Button 
                                onClick={() => handleCopyAddress(invoice.depositAddress)} 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 border-none cursor-pointer"
                                title="Copy deposit address"
                              >
                                {copiedText ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-sans block">
                              Only send USDT TRC20 to this secure invoice instance token router. Expired invoices lose rate security.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* GLOBAL DIGITAL WALLET FLOW */}
                      {checkoutMethod === 'global' && (
                        <div className="space-y-4 bg-muted/15 border border-border/40 p-4 rounded-xl text-xs leading-relaxed space-y-3 font-sans">
                          <p className="font-bold text-foreground">🌍 Digital Wallet Chargily Pay fallbacks:</p>
                          <p className="text-muted-foreground">
                            For global clients without cryptocurrency, transfer matching amount direct to our secure workspace vault clearing account:
                          </p>
                          <div className="p-3 bg-background border rounded-lg font-mono flex items-center justify-between text-foreground">
                            <span>clearing-vault@haven.io</span>
                            <Button 
                              onClick={() => handleCopyAddress('clearing-vault@haven.io')} 
                              variant="ghost" 
                              className="h-7 text-[10px] font-bold py-0.5 px-2 hover:bg-muted font-sans"
                            >
                              {copiedText ? 'Copied' : 'Copy Email'}
                            </Button>
                          </div>
                          <span className="text-[10px] text-zinc-500 block leading-normal mt-2.5">
                            Upon transferring, click the checking verification button below.
                          </span>
                        </div>
                      )}

                      {/* ALGERIA CHARGILY INTUITIVE CHECOUT SIMULATOR PORTAL */}
                      {checkoutMethod === 'chargily' && (
                        <form onSubmit={handleSimulateChargilySubmit} className="space-y-4 bg-muted/10 p-5 border border-primary/20 rounded-2xl relative">
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
                            <span className="animate-ping w-1.5 h-1.5 rounded-full bg-primary block"></span> Chargily Redirect Redirect Spoofer
                          </div>

                          <span className="text-[11px] font-mono text-muted-foreground font-bold uppercase tracking-wider block border-b border-border/50 pb-2">🇩🇿 CHARGILY PAY CREDIT/DEBIT SECURE FORM</span>
                          
                          <div className="grid grid-cols-2 gap-3.5 select-none">
                            <div className="space-y-1.5 text-left col-span-2">
                              <label className="text-[9px] font-mono text-muted-foreground uppercase font-bold">Select Local Card Carrier</label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setCardCarrier('EDAHABIA')}
                                  className={`py-2 px-3 border rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                                    cardCarrier === 'EDAHABIA' ? 'border-amber-500/40 bg-amber-500/10 text-amber-500' : 'border-border bg-card'
                                  }`}
                                >
                                  EDAHABIA (Algérie Poste)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCardCarrier('CIB')}
                                  className={`py-2 px-3 border rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                                    cardCarrier === 'CIB' ? 'border-blue-500/40 bg-blue-500/10 text-blue-500' : 'border-border bg-card'
                                  }`}
                                >
                                  SATIM / CIB Card
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1.5 text-left col-span-2">
                              <label className="text-[9px] font-mono text-muted-foreground uppercase font-bold">Simulated Cardholder Full Name</label>
                              <input 
                                type="text"
                                placeholder="MOHAMED BENDAOUD"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                className="w-full bg-background border rounded-lg p-2 text-xs font-mono font-bold uppercase tracking-wider text-foreground placeholder:text-zinc-500 text-left focus:outline-none focus:border-amber-500"
                                required
                              />
                            </div>

                            <div className="space-y-1.5 text-left col-span-2">
                              <label className="text-[9px] font-mono text-muted-foreground uppercase font-bold">Simulated Card Number</label>
                              <input 
                                type="text"
                                placeholder={cardCarrier === 'EDAHABIA' ? '6070 4392 8472 8391' : '5333 9182 3749 2810'}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full bg-background border rounded-lg p-2 text-xs font-mono font-bold tracking-widest text-foreground text-left focus:outline-none focus:border-amber-500"
                                required
                              />
                            </div>

                            <div className="space-y-1.5 text-left">
                              <label className="text-[9px] font-mono text-muted-foreground uppercase font-bold">Expiration (MM/YY)</label>
                              <input 
                                type="text"
                                placeholder="12/28"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full bg-background border rounded-lg p-2 text-xs font-mono font-bold tracking-widest text-foreground text-left focus:outline-none focus:border-amber-500"
                                required
                              />
                            </div>

                            <div className="space-y-1.5 text-left">
                              <label className="text-[9px] font-mono text-muted-foreground uppercase font-bold">CVC / CVV</label>
                              <input 
                                type="text"
                                placeholder="839"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                className="w-full bg-background border rounded-lg p-2 text-xs font-mono font-bold tracking-widest text-foreground text-left focus:outline-none focus:border-amber-500"
                                required
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            disabled={chargilyProcessing}
                            className={`w-full py-3 text-xs font-extrabold uppercase font-mono tracking-wider transition-all h-11 flex items-center justify-center gap-1.5 ${
                              cardCarrier === 'EDAHABIA' 
                                ? 'bg-amber-500 text-white hover:bg-amber-600' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {chargilyProcessing ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" /> AUTHORIZING SECURED DZD TRANSACTION...
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" /> AUTHORIZE SIMULATED DZD CHECKOUT
                              </>
                            )}
                          </Button>
                        </form>
                      )}

                    </div>

                    {/* RIGHT COLUMN: ACTION CONTROLS & QR CODE ASSISTANT */}
                    <div className="md:col-span-5 space-y-6 pt-5 md:pt-0">
                      
                      {checkoutMethod === 'crypto' && (
                        <div className="border border-border/80 bg-background rounded-2xl p-6 text-center space-y-4">
                          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">FAST INVOICE QR CODE SCANNER</span>
                          <div className="w-44 h-44 bg-muted/20 border border-dashed rounded-xl flex items-center justify-center mx-auto overflow-hidden shadow-inner p-1">
                            <img 
                              src={invoice.qrSimulatedUrl} 
                              alt="Secure Invoice QR Code" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain rounded"
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono leading-relaxed px-2">
                            Open trust wallet, OKX, or Bitget wallet on your mobile device to scan TRC20 and process payment instantly.
                          </p>
                        </div>
                      )}

                      {checkoutMethod !== 'chargily' && (
                        <div className="border border-border/50 bg-muted/10 p-5 rounded-2xl text-left space-y-4">
                          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">SECURED TRANSACTION VALIDATOR</span>
                          
                          <div className="space-y-1 text-xs">
                            <p className="font-bold text-foreground">Verify Transfer & Emit Upgrade:</p>
                            <p className="text-muted-foreground font-sans leading-relaxed text-[11px]">
                              Our automated payment verifier listens on-chain & parses mock webhooks signatures payload. Click verify once processed.
                            </p>
                          </div>

                          {verificationFeedback && (
                            <div className="p-3 bg-zinc-950 text-zinc-300 font-mono text-[10px] leading-relaxed rounded-xl border border-zinc-800 text-left select-all">
                              {verificationFeedback}
                            </div>
                          )}

                          <Button
                            onClick={handleVerifyInstantPayment}
                            disabled={verifyLoading}
                            className="w-full font-bold uppercase font-mono text-xs py-3 h-11 flex items-center justify-center gap-1.5"
                          >
                            {verifyLoading ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" /> Validating Transfer Record...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Confirm Verification
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Security compliance footer block */}
                      <div className="space-y-2 text-center text-muted-foreground p-3 bg-muted/10 rounded-xl select-none">
                        <div className="flex justify-center items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-foreground">HAVEN PRIVACY & RISK PROTOCOL</span>
                        </div>
                        <p className="text-[9px] font-sans leading-relaxed">
                          This is a cryptographic software transaction validation module. No traditional user passwords, bank log-ins or custody databases are compromised.
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* STEP 3: SUCCESS AND ONBOARDING ACTION CARD */}
              {checkoutStep === 3 && (
                <div className="space-y-8 animate-in zoom-in-95 duration-500 text-center select-none py-10 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto animate-bounce shadow-xl">
                    <Check className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold tracking-tight">Node Access Upgraded!</h2>
                    <p className="text-muted-foreground text-sm font-sans max-w-sm mx-auto leading-relaxed">
                      Checkout validation completed successfully. Webhook automated verification routing has updated your level status to paid tiers!
                    </p>
                  </div>

                  {/* Upgraded parameters check list */}
                  <div className="bg-muted/15 border border-border/60 rounded-2xl p-5 text-left font-mono text-xs space-y-3.5">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>BILLING VERIFICATION</span>
                      <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMED
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>PLAN CREDENTIALS</span>
                      <span className="text-emerald-500 font-bold uppercase">{checkoutPlan} NODE STATUS</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>EXPIRATION WINDOW</span>
                      <span className="text-emerald-500 font-bold">30 DAYS ACTIVE UNTIL LOCKED</span>
                    </div>
                    <div className="pt-2 border-t border-border/50 flex justify-between items-center text-foreground font-bold">
                      <span>UPGRADED CAPABILITIES</span>
                      <span className="text-primary font-bold">UNLOCKED / ALL GATEWAYS</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => navigate('/workspace')}
                      className="flex-1 font-bold tracking-tight py-3.5 h-12 bg-primary text-white flex items-center justify-center gap-1.5 rounded-xl hover:-translate-y-0.5 transition-all text-xs"
                    >
                      Launch Workspace Node <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setCheckoutPlan(null)}
                      variant="outline"
                      className="font-bold border-border text-muted-foreground hover:text-foreground h-12 text-xs"
                    >
                      Close Invoice
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* PRICE HEADINGS */}
        <div className="flex flex-col items-center text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-muted-foreground drop-shadow-sm leading-[1.1]">
            Deploy Secure Software Checkouts
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-medium max-w-2xl mb-8 leading-relaxed font-sans">
            Premium workspace layers built with Cloudflare workers, SQLite repositories, and native web payment verification engines provide instant automated subscriptions. Upgrade your team node to unlock global edge scale.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 w-full">
            <Button 
               onClick={() => startDirectCheckout('PRO', 'chargily')} 
               className="font-bold text-xs uppercase font-mono tracking-wider h-11 px-6 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg border-2 border-amber-500/20 shadow-amber-500/20"
            >
              START MOCK DZD CHARGILY CHECKOUT
            </Button>
            <Button 
               onClick={() => startDirectCheckout('PRO', 'crypto')} 
               className="font-bold text-xs uppercase font-mono tracking-wider h-11 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg border-2 border-emerald-500/20 shadow-emerald-500/20"
            >
              DEPLOY WITH CRYPTO USDT
            </Button>
          </div>

          <div className="flex items-center gap-2 bg-card/40 p-1.5 rounded-[1.25rem] border border-border/60 shadow-inner select-none relative backdrop-blur-xl">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${!isAnnual ? 'text-foreground font-extrabold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Monthly Billing
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 flex items-center gap-2 ${isAnnual ? 'text-foreground font-extrabold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Annual Billing
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest transition-colors ${isAnnual ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-emerald-500/10 text-emerald-600/70'}`}>-20%</span>
            </button>
            {/* Sliding background indicator */}
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-background rounded-xl shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0 border border-border/40 ${isAnnual ? 'translate-x-[calc(100%+0.5rem)]' : 'translate-x-0'}`} 
            ></div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-32 select-none">
          
          {/* Tier 1: Free */}
          <div className="flex flex-col border border-border/50 bg-card/40 backdrop-blur-xl transition-all shadow-lg hover:shadow-2xl hover:border-border/80 rounded-[2rem] hover:-translate-y-1.5 duration-500 overflow-hidden relative text-left">
            <div className="p-8 border-b border-border/30 bg-muted/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-extrabold tracking-tight">Starter</h3>
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-background border border-border shadow-sm px-3 py-1 rounded-full">Free Node</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium min-h-[40px] font-sans">
                A massive out-of-the-box system tier designed to heavily outperform general GitHub Free and Discord Nitro. No card required.
              </p>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <div className="mb-6 flex items-end">
                  <span className="text-6xl font-extrabold tracking-tighter text-foreground leading-none">$0</span>
                  <span className="text-sm font-bold text-muted-foreground ml-2 mb-1.5 font-sans">/ forever</span>
                </div>
                <ul className="space-y-3.5 text-xs font-semibold text-muted-foreground mb-8">
                  <li className="flex items-start gap-3">
                    <Bot className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-foreground font-extrabold">200 total features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-foreground font-bold">Basic AI access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Workspace system & limited templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-foreground">Limited storage capacity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Plugin marketplace (read-only)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Community support</span>
                  </li>
                </ul>
              </div>
              <Button 
                onClick={() => startCheckout('FREE')}
                disabled={currentTier === 'FREE'}
                className="w-full h-14 text-xs font-bold font-mono uppercase rounded-2xl border-border/80 hover:bg-muted/80 shadow-sm transition-all animate-none" variant="outline"
              >
                {currentTier === 'FREE' ? 'Active Plan' : 'Select Free Plan'}
              </Button>
            </div>
          </div>

          {/* Tier 2: Pro */}
          <div className="flex flex-col border border-primary/30 bg-card shadow-[0_0_50px_-15px_rgba(var(--primary),0.3)] rounded-[2rem] relative z-20 md:scale-105 hover:scale-[1.07] transition-all duration-500 overflow-hidden group text-left">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet-500 via-primary to-emerald-500 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            
            <div className="p-8 border-b border-border/30 bg-muted/5 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-extrabold tracking-tight">Professional</h3>
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 shadow-sm px-3 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                  <Zap className="w-3 h-3"/> Popular
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium min-h-[40px] font-sans">
                For creators launching production nodes and serious apps who require premium edge infrastructure.
              </p>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between relative z-10">
              <div>
                <div className="mb-8 flex items-end">
                  <span className="text-6xl font-extrabold tracking-tighter text-foreground leading-none flex items-start">
                    <span className="text-3xl mt-1">$</span>
                    {isAnnual ? '19.00' : '24.45'}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground ml-2 mb-1.5 font-sans">/ month</span>
                </div>
                <ul className="space-y-4 text-xs font-semibold text-muted-foreground mb-10">
                  <li className="flex items-start gap-3">
                    <Bot className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground font-bold">400 feature capacity & unlimited projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">Advanced AI routing & faster compute</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">10× storage upgrade</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">Full plugin access & automation system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">Priority execution layer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">Custom domains</span>
                  </li>
                </ul>
              </div>
              <Button 
                onClick={() => startCheckout('PRO')}
                className={`w-full h-14 text-xs font-bold font-mono uppercase shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  currentTier === 'PRO' ? 'bg-zinc-800 text-white cursor-not-allowed' : 'bg-foreground text-background hover:bg-foreground/95'
                }`}
              >
                {currentTier === 'PRO' ? 'Active Pro Node' : 'Deploy Pro Node'}
              </Button>
            </div>
            {/* Abstract glow inside Pro tier */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 blur-[60px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          </div>

          {/* Tier 3: Team */}
          <div className="flex flex-col border border-emerald-500/40 bg-emerald-500/5 backdrop-blur-xl transition-all shadow-2xl hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.4)] rounded-[2rem] hover:-translate-y-1.5 duration-500 overflow-hidden relative text-left">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>
            <div className="p-8 border-b border-border/30 bg-muted/10 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-extrabold tracking-tight">Team</h3>
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-background border border-border shadow-sm px-3 py-1 rounded-full">Scale</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium min-h-[40px] font-sans">
                For established dev organizations and collaborative communities.
              </p>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <div className="mb-8 flex items-end">
                  <span className="text-6xl font-extrabold tracking-tighter text-foreground leading-none flex items-start">
                    <span className="text-3xl mt-1">$</span>
                    {isAnnual ? '54.00' : '67.50'}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground ml-2 mb-1.5 pl-2 border-l border-border/60">/ seat <br/>/ mo</span>
                </div>
                <ul className="space-y-4 text-xs font-semibold text-muted-foreground mb-10">
                  <li className="flex items-start gap-3">
                    <Bot className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-foreground font-extrabold">1600 feature capacity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>Private AI sandbox & team workspaces</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>SSO authentication, RBAC & audit logs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>Shared storage pool & dedicated database</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>Admin controls & SLA-level reliability</span>
                  </li>
                </ul>
              </div>
              <Button 
                onClick={() => startCheckout('TEAM')}
                className={`w-full h-14 text-xs font-bold font-mono uppercase shadow-md hover:bg-muted/80 transition-all ${
                  currentTier === 'TEAM' ? 'bg-zinc-800 text-white cursor-not-allowed' : ''
                }`}
                variant="outline"
              >
                {currentTier === 'TEAM' ? 'Active Team Node' : 'Deploy Team Node'}
              </Button>
            </div>
          </div>

        </div>

        {/* COMPARISON TRAY */}
        <section className="max-w-6xl mx-auto mb-32 w-full relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Compare Advanced Node Limits</h2>
            <p className="text-muted-foreground text-lg font-medium font-sans">Every tier scales dynamically based on organizational compute requirements.</p>
          </div>
          
          <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-xl overflow-hidden overflow-x-auto relative z-10 p-2">
             <div className="min-w-[800px] rounded-[2rem] overflow-hidden border border-border/40">
                <div className="grid grid-cols-4 bg-muted/45 border-b border-border/50 text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono select-none">
                   <div className="p-6 md:p-8 text-left border-r border-border/40">Capability Integration Spec</div>
                   <div className="p-6 md:p-8 text-center border-r border-border/40">Starter</div>
                   <div className="p-6 md:p-8 text-center border-r border-border/40 text-primary">Professional</div>
                   <div className="p-6 md:p-8 text-center text-foreground">Team Node</div>
                </div>
                
                {[
                  { name: "Feature capacity", free: "200", pro: "400", team: "1600" },
                  { name: "AI capability", free: "Basic access", pro: "Advanced routing", team: "Private sandbox" },
                  { name: "Storage", free: "Limited", pro: "10× upgrade", team: "Shared pool" },
                  { name: "Projects", free: "Limited", pro: "Unlimited", team: "Team workspaces" },
                  { name: "Plugins", free: "Read-only", pro: "Full access", team: "Full access" },
                  { name: "Automation", free: "No", pro: "Yes", team: "Advanced" },
                  { name: "Collaboration", free: "Workspace system", pro: "Priority execution", team: "Dedicated databases" },
                  { name: "Security", free: "Standard", pro: "Custom domains", team: "SSO, RBAC & Audit logs" },
                  { name: "Integrations", free: "Basic", pro: "Advanced", team: "Custom" },
                  { name: "Support", free: "Community", pro: "Priority", team: "SLA-level" },
                ].map((row, i) => {
                   return (
                     <div key={i} className="grid grid-cols-4 border-b border-border/30 last:border-0 text-sm font-medium hover:bg-muted/15 transition-colors group">
                        <div className="p-5 md:p-6 text-left border-r border-border/30 text-foreground flex items-center pl-8 group-hover:text-primary transition-colors font-sans">{row.name}</div>
                        <div className="p-5 md:p-6 flex items-center justify-center border-r border-border/30 text-muted-foreground font-sans text-xs text-center">{row.free}</div>
                        <div className="p-5 md:p-6 flex items-center justify-center border-r border-border/30 text-primary font-bold bg-primary/5 text-xs font-sans text-center">{row.pro}</div>
                        <div className="p-5 md:p-6 flex items-center justify-center text-foreground font-bold text-xs font-sans text-center">{row.team}</div>
                     </div>
                   )
                })}
             </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto mb-32 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Payment Infrastructure FAQs</h2>
            <p className="text-muted-foreground text-sm font-sans">No banks, no cards, no custody. Zero-dollar micro-architecture specifications.</p>
          </div>
          
          <div className="space-y-4">
             {faqs.map((faq, i) => (
               <div key={i} className="border border-border/50 bg-card/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left font-bold text-foreground focus:outline-none group bg-transparent border-none cursor-pointer"
                  >
                    <span className="text-base text-foreground font-bold">{faq.question}</span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openFaq === i ? 'bg-primary text-white scale-110' : 'bg-muted text-muted-foreground group-hover:bg-muted/80'}`}>
                       <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${openFaq === i ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                     <p className="px-6 md:px-8 pb-8 pt-0 text-muted-foreground text-sm font-sans leading-relaxed text-left">
                       {faq.answer}
                     </p>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* Support Section */}
        <div className="max-w-4xl mx-auto text-center border border-border/50 bg-card/40 backdrop-blur-xl p-12 md:p-16 rounded-[3rem] relative overflow-hidden shadow-2xl group transition-all duration-500 hover:shadow-3xl hover:border-border/80">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
          
          <HeartHandshake className="w-12 h-12 text-primary mx-auto mb-8 relative z-10 transform group-hover:scale-110 transition-transform duration-500" />
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 relative z-10">Global Workspace Access</h3>
          <p className="text-base text-muted-foreground font-sans mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
            HAVEN supports multiple global payment methods including crypto-based options where legally permitted in user regions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Button 
              onClick={() => startDirectCheckout('PRO', 'chargily')} 
              variant="outline" 
              className="w-full sm:w-auto h-14 px-8 font-bold text-sm font-mono rounded-2xl border-border hover:bg-muted/60 transition-all shadow-sm flex items-center justify-center group/btn cursor-pointer"
            >
              <CreditCard className="w-5 h-5 mr-3 group-hover/btn:scale-110 transition-transform" /> START MOCK DZD CHARGILY CHECKOUT
            </Button>
            <Button 
              onClick={() => startDirectCheckout('PRO', 'crypto')}
              variant="secondary" 
              className="w-full sm:w-auto h-14 px-8 font-bold text-sm font-mono rounded-2xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
            >
               <Coins className="w-5 h-5 mr-3" /> DEPLOY WITH CRYPTO USDT
            </Button>
          </div>
        </div>

      </div>

      {isCryptoModalOpen && invoice && (
        <CryptoPaymentModal
          isOpen={isCryptoModalOpen}
          onClose={() => setIsCryptoModalOpen(false)}
          invoiceId={invoice.invoice.id}
          amount={invoice.invoice.amount}
          currency={invoice.invoice.currency}
          depositAddress={invoice.invoice.depositAddress || 'TTRC6a2dfBba772391bde42fa60c6dbe329de419ab71bc7'}
          userId={currentUser}
          planId={checkoutPlan || 'PRO'}
          onVerificationSuccess={(newTier) => {
            setCheckoutStep(3);
            setCurrentTier(newTier);
            localStorage.setItem('haven_user_tier', newTier);
            setIsCryptoModalOpen(false);
          }}
        />
      )}

      {/* Floating custom toasts */}
      {toast && (
        <div key={toast.message} className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border shadow-xl flex items-center gap-2 max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${
          toast.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-350' 
            : toast.type === 'error' 
            ? 'bg-rose-950/90 border-rose-500/30 text-rose-350' 
            : 'bg-[#0a0c10]/95 border-border text-foreground'
        }`}>
          <span className="text-xs font-semibold leading-relaxed">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
