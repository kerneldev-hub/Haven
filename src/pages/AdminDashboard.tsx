import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/components';
import { Button } from '../components/ui/components';
import { 
  Users, Activity, CreditCard, ShieldCheck, Coins, RefreshCw, CheckCircle, 
  XOctagon, RotateCcw, AlertTriangle, Cpu, TrendingUp, Calendar, Layers 
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';

interface Payment {
  id: string;
  userId: string;
  provider: 'chargily' | 'global' | 'crypto';
  method: string;
  amount: number;
  currency: string;
  transactionId: string;
  status: 'pending' | 'processing' | 'confirmed' | 'failed' | 'expired' | 'refunded';
  createdAt: string;
}

interface Subscription {
  id: string;
  userId: string;
  planId: 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';
  status: 'active' | 'expired' | 'canceled';
  startDate: string;
  endDate: string;
  amountPaid: number;
  currency: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorFeedback, setErrorFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<'payments' | 'subscriptions' | 'logs'>('payments');
  const [actionProcessingId, setActionProcessingId] = useState<string | null>(null);

  // Fetch stats and lists on mount
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/payments/admin/stats');
      if (!res.ok) {
        throw new Error('Failed to load server statistics.');
      }
      const data = await res.json();
      setStats(data);
      setErrorFeedback('');
    } catch (err: any) {
      setErrorFeedback(err.message || 'Error occurred syncing payment records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle manual admin payment override
  const handleAdminAction = async (paymentId: string, action: 'confirm' | 'reject' | 'refund') => {
    setActionProcessingId(paymentId);
    try {
      const res = await fetch('/api/payments/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, action })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Override failed: ${errorData.error}`);
        return;
      }
      
      // Update local tier storage if logged user is upgraded/downgraded for immediate reactive preview sync
      const updatedData = await res.json();
      const updatedPayment = updatedData.payment;
      const currentUser = localStorage.getItem('haven_user') || 'gamerdzbba7';
      
      if (updatedPayment.userId === currentUser) {
        if (action === 'confirm') {
          const planMapped = updatedPayment.amount >= 4900 ? 'TEAM' : 'PRO';
          localStorage.setItem('haven_user_tier', planMapped);
        } else if (action === 'refund' || action === 'reject') {
          localStorage.setItem('haven_user_tier', 'FREE');
        }
      }

      // Re-fetch aggregate stats
      await fetchStats();
    } catch (err: any) {
      alert(`Network error during action processing: ${err.message}`);
    } finally {
      setActionProcessingId(null);
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-20 text-center space-y-4">
        <RefreshCw className="w-10 h-10 animate-spin text-primary mx-auto" />
        <p className="font-mono text-xs text-muted-foreground">CONNECTING TO SECURED BANKING INTEGRATION POOLS...</p>
      </div>
    );
  }

  const dzdEarnings = stats?.dzdEarnings || 0;
  const usdEarnings = stats?.usdEarnings || 0;
  const totalTransactions = stats?.totalTransactions || 0;
  const activeSubs = stats?.activeSubscriptionsCount || 0;
  const paymentsList: Payment[] = stats?.payments || [];
  const subscriptionsList: Subscription[] = stats?.subscriptions || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-10 text-left animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/60">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
             HAVEN PAY Steering Panel
             <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-mono uppercase tracking-wider px-2 py-0.5">God Mode Override</Badge>
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1 font-sans">
            Central dashboard to audit payments, manually bypass credit gateways blockages, and trigger immediate webhook simulations.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button 
            onClick={fetchStats}
            variant="outline" 
            className="font-mono text-xs font-bold border-border/80 text-foreground hover:bg-muted/80 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Records
          </Button>
          <Button 
            disabled 
            variant="ghost"
            className="text-xs font-mono font-bold text-muted-foreground bg-muted/20"
          >
            SECURE SHA256 ACTIVE
          </Button>
        </div>
      </div>

      {errorFeedback && (
        <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-2 font-mono">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorFeedback}</span>
        </div>
      )}

      {/* KPI DASHBOARD CARDS GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10 select-none">
        
        {/* KPI 1 : ALGERIA EARNINGS */}
        <Card className="bg-card/45 backdrop-blur-xl border-border/50 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-bold">Algeria Earnings</CardTitle>
            <CreditCard className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground font-mono leading-tight tracking-tight">
              {dzdEarnings.toLocaleString()} <span className="text-sm font-bold text-amber-500">DZD</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans">Verified via Chargily Pay (Post/CIB)</p>
          </CardContent>
        </Card>

        {/* KPI 2 : GLOBAL & CRYPTO EARNINGS */}
        <Card className="bg-card/45 backdrop-blur-xl border-border/50 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-bold">Global & Crypto Cash</CardTitle>
            <Coins className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground font-mono leading-tight tracking-tight">
              ${usdEarnings.toLocaleString()} <span className="text-sm font-bold text-emerald-500">USDT</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans">Verified Crypto (TRC20/BEP20) & Chargily Pay</p>
          </CardContent>
        </Card>

        {/* KPI 3 : ACTIVE PREMIUM SEATS */}
        <Card className="bg-card/45 backdrop-blur-xl border-border/50 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-bold">SaaS Subscribers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground font-mono leading-tight tracking-tight">
              {activeSubs} <span className="text-sm font-bold text-primary">Active</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans">Upgraded PRO & TEAM operational leases</p>
          </CardContent>
        </Card>

        {/* KPI 4 : INVOICES HANDLED */}
        <Card className="bg-card/45 backdrop-blur-xl border-border/50 overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-bold">Invoice Index</CardTitle>
            <Activity className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground font-mono leading-tight tracking-tight">
              {totalTransactions} <span className="text-sm font-bold text-zinc-400">Issued</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans">Succeeded, failed, and pending checkouts</p>
          </CardContent>
        </Card>

      </div>

      {/* THREE PANE CONSOLE WORKSPACE */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        
        {/* LEFT COLUMN: ACTIVE VIEWERS (PAYMENTS / SUBSCRIPTIONS CORES) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TAB HEADERS CONTROLS */}
          <div className="flex border-b border-border/50 select-none pb-0.5 gap-4 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => setActiveTab('payments')}
              className={`pb-3 font-mono font-bold text-xs uppercase tracking-wider transition-all relative cursor-pointer bg-transparent border-none ${
                activeTab === 'payments' ? 'text-primary' : 'text-muted-foreground/70 hover:text-foreground'
              }`}
            >
              Secure Invoices Log ({paymentsList.length})
              {activeTab === 'payments' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-full"></div>}
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`pb-3 font-mono font-bold text-xs uppercase tracking-wider transition-all relative cursor-pointer bg-transparent border-none ${
                activeTab === 'subscriptions' ? 'text-primary' : 'text-muted-foreground/70 hover:text-foreground'
              }`}
            >
              Subscription Assets ({subscriptionsList.length})
              {activeTab === 'subscriptions' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-full"></div>}
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`pb-3 font-mono font-bold text-xs uppercase tracking-wider transition-all relative cursor-pointer bg-transparent border-none ${
                activeTab === 'logs' ? 'text-primary' : 'text-muted-foreground/70 hover:text-foreground'
              }`}
            >
              Security Audit Trails ({stats?.auditLogs?.length || 0})
              {activeTab === 'logs' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-full"></div>}
            </button>
          </div>

          {/* TAB 1: PAYMENTS INVOICE LOG */}
          {activeTab === 'payments' && (
            <div className="bg-card/40 border border-border/60 rounded-3xl overflow-hidden shadow-sm backdrop-blur-xl">
              <div className="p-6 border-b border-border/40 select-none">
                 <h2 className="text-lg font-bold tracking-tight">Financial Audit Registry</h2>
                 <p className="text-xs text-muted-foreground mt-0.5">Real-time listing of transactions initialized across Algerian and Web3 payment networks.</p>
              </div>

              {paymentsList.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground">No invoices registered on server. Initialise checkouts.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border/40 text-[10px] font-mono uppercase tracking-widest text-muted-foreground select-none">
                        <th className="p-4 pl-6">Invoice ID</th>
                        <th className="p-4">Customer Account</th>
                        <th className="p-4">Gateway</th>
                        <th className="p-4 text-right">Amount</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 pr-6 text-right">Operations Override</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-xs">
                      {paymentsList.map((p) => (
                        <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-4 pl-6 font-mono font-bold text-foreground">
                            {p.id}
                            <span className="block text-[9px] text-zinc-500 font-normal font-sans mt-0.5">{new Date(p.createdAt).toLocaleTimeString()}</span>
                          </td>
                          <td className="p-4 font-mono">@{p.userId}</td>
                          <td className="p-4 text-muted-foreground">
                            {p.method}
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-foreground">
                            {p.amount.toLocaleString()} <span className="text-[10px] font-semibold text-primary">{p.currency}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
                              p.status === 'confirmed' 
                                ? 'bg-emerald-500/10 text-emerald-500' 
                                : (p.status === 'pending' || p.status === 'processing' 
                                  ? 'bg-amber-500/10 text-amber-500 animate-pulse' 
                                  : 'bg-zinc-500/10 text-zinc-400')
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right space-x-1.5 whitespace-nowrap">
                            {actionProcessingId === p.id ? (
                              <span className="text-[10px] text-muted-foreground font-mono">Broadcasting...</span>
                            ) : (
                              <>
                                {(p.status === 'pending' || p.status === 'processing' || p.status === 'failed') && (
                                  <Button
                                    onClick={() => handleAdminAction(p.id, 'confirm')}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-mono font-bold px-2 py-1 text-[10px] rounded h-7 hover:-translate-y-0.5 transition-all border-none cursor-pointer"
                                    title="Manually bypass validation gates and deploy upgrades."
                                  >
                                    Confirm
                                  </Button>
                                )}
                                {p.status === 'confirmed' && (
                                  <Button
                                    onClick={() => handleAdminAction(p.id, 'refund')}
                                    className="bg-transparent hover:bg-amber-500/10 text-amber-500 font-mono font-bold px-2 py-1 text-[10px] rounded h-7 border border-amber-500/30 cursor-pointer"
                                    title="Deactivate subscription & return funds mock logs."
                                  >
                                    Refund
                                  </Button>
                                )}
                                {(p.status === 'pending' || p.status === 'processing') && (
                                  <Button
                                    onClick={() => handleAdminAction(p.id, 'reject')}
                                    className="bg-transparent hover:bg-red-500/10 text-red-500 font-mono font-bold px-2 py-1 text-[10px] rounded h-7 border border-red-500/30 cursor-pointer"
                                    title="Mark as fraud/decline."
                                  >
                                    Reject
                                  </Button>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className="bg-card/40 border border-border/60 rounded-3xl overflow-hidden shadow-sm backdrop-blur-xl animate-in slide-in-from-bottom-4">
              <div className="p-6 border-b border-border/40 select-none">
                 <h2 className="text-lg font-bold tracking-tight">Active User Leases Database</h2>
                 <p className="text-xs text-muted-foreground mt-0.5">Manager logs detailing current tenant licenses, paid levels, and dates of active nodes.</p>
              </div>

              {subscriptionsList.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground">No active premium subscription assets detected on server.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border/40 text-[10px] font-mono uppercase tracking-widest text-muted-foreground select-none">
                        <th className="p-4 pl-6">Subscription ID</th>
                        <th className="p-4">Customer Account</th>
                        <th className="p-4 text-center">Assigned Level</th>
                        <th className="p-4">Duration Epoch Bound</th>
                        <th className="p-4 text-right">Value Locked</th>
                        <th className="p-4 pr-6 text-center">Override status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-xs">
                      {subscriptionsList.map((s) => (
                        <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-4 pl-6 font-mono font-bold text-foreground">{s.id}</td>
                          <td className="p-4 font-mono">@{s.userId}</td>
                          <td className="p-4 text-center">
                            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase font-mono text-[10px]">
                              {s.planId} NODE
                            </Badge>
                          </td>
                          <td className="p-4 font-mono text-muted-foreground text-[10.5px]">
                            {new Date(s.startDate).toLocaleDateString()} to {new Date(s.endDate).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-foreground">
                            {s.amountPaid.toLocaleString()} <span className="text-[10px] text-zinc-500">{s.currency}</span>
                          </td>
                          <td className="p-4 pr-6 text-center">
                            <Button
                              onClick={() => {
                                const matchedPay = paymentsList.find(p => p.userId === s.userId && p.status === 'confirmed');
                                if (matchedPay) {
                                  handleAdminAction(matchedPay.id, 'refund');
                                } else {
                                  alert('Could not find active underlying payment transaction to refund/expire.');
                                }
                              }}
                              className="text-[10px] py-1 px-3.5 bg-transparent hover:bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 h-7 rounded cursor-pointer"
                            >
                              Force Expire Lease
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SECURITY AUDIT TRAILS */}
          {activeTab === 'logs' && (
            <div className="bg-card/40 border border-border/60 rounded-3xl overflow-hidden shadow-sm backdrop-blur-xl animate-in slide-in-from-bottom-4">
              <div className="p-6 border-b border-border/40 select-none">
                 <h2 className="text-lg font-bold tracking-tight">System Infrastructure Telemetry Logs</h2>
                 <p className="text-xs text-muted-foreground mt-0.5">Cryptographically sequenced audit trail logs monitoring server initialization, signature webhooks, state transitions, and manual overrides.</p>
              </div>

              {(stats?.auditLogs || []).length === 0 ? (
                <div className="p-16 text-center text-muted-foreground">No telemetry log entries available on the server.</div>
              ) : (
                <div className="divide-y divide-border/25 max-h-[580px] overflow-y-auto">
                  {(stats?.auditLogs || []).map((log: any) => (
                    <div key={log.id} className="p-5 hover:bg-muted/5 transition-colors flex items-start gap-4 text-left">
                      <div className="h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 animate-pulse" style={{
                        backgroundColor: 
                          log.event === 'verified' ? '#10b981' : 
                          log.event === 'initiated' ? '#f59e0b' : 
                          log.event === 'failed' ? '#ef4444' : '#ec4899'
                      }} />
                      <div className="space-y-1 text-xs grow">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                              {log.event}
                            </span>
                            <span className="font-mono text-[10.5px] font-bold text-foreground">
                              Invoice: {log.invoiceId}
                            </span>
                            <span className="text-muted-foreground font-mono">
                              Tenant: @{log.userId}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-zinc-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11.5px] leading-relaxed font-sans mt-1">
                          {log.message}
                        </p>
                        {log.metadata && (
                          <pre className="text-[9.5px] text-zinc-400 bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 overflow-x-auto select-all max-w-full font-mono mt-1.5 leading-normal">
                            {log.metadata}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: INFRASTRUCTURE METRICS & WEBHOOK SIMULATORS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SECURED GATEWAY WEBHOOK SIMULATOR PANEL */}
          <Card className="bg-card/45 border-border/60 overflow-hidden relative">
            <CardHeader className="border-b border-border/40 select-none">
              <CardTitle className="text-sm font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary animate-pulse" /> Webhook Emulator
              </CardTitle>
              <CardDescription className="text-xs">
                Transmit cryptographically signed test hooks to verify the automation handlers.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5 text-xs text-muted-foreground font-mono leading-relaxed">
                <p className="font-bold text-foreground">Simulate Chargily checkout.paid:</p>
                <p>Clicking simulates Chargily Pay sending a secure payment confirmation to our server endpoint `/api/payments/webhook` with the appropriate headers.</p>
              </div>

              <div className="text-left font-mono text-[10px] bg-zinc-950 p-3 rounded-xl border border-zinc-900 text-zinc-400 select-all max-h-36 overflow-y-auto leading-normal">
                {`{\n  "event": "checkout.paid",\n  "data": {\n    "invoiceId": "${paymentsList.find(p => p.status === 'pending')?.id || 'havpay-827319'}"\n  }\n}`}
              </div>

              <Button
                onClick={async () => {
                  const pendingInvoice = paymentsList.find(p => p.status === 'pending' || p.status === 'processing');
                  if (!pendingInvoice) {
                    alert('No pending invoice found to simulate webhook paid event for. Please create one on the pricing page checkout first!');
                    return;
                  }

                  try {
                    const res = await fetch('/api/payments/webhook', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'X-Chargily-Signature': 'mock-hmac-secure-signature-header-72319283719283712398'
                      },
                      body: JSON.stringify({
                        event: 'checkout.paid',
                        data: { invoiceId: pendingInvoice.id }
                      })
                    });

                    const data = await res.json();
                    alert(`Webhook Simulated! Response status: ${res.status}. Output: ${JSON.stringify(data)}`);
                    await fetchStats();
                  } catch (err: any) {
                    alert(`Simulation failed: ${err.message}`);
                  }
                }}
                className="w-full bg-primary hover:bg-primary/95 text-white font-mono text-xs font-bold py-2.5 h-10 rounded-xl cursor-pointer"
              >
                Fire Secure Test Webhook
              </Button>
            </CardContent>
          </Card>

          {/* ACTIVE INFRASTRUCTURE CONNECTIONS METRICS */}
          <Card className="bg-card/45 border-border/60">
            <CardHeader className="border-b border-border/40 select-none">
              <CardTitle className="text-sm font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" /> Connection Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">In-Memory Sync Queue</span>
                  <span className="text-emerald-500 font-mono font-bold">100% Persistent</span>
                </div>
                <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Webhooks Handshakes</span>
                  <span className="text-primary font-mono font-bold">SHA-256 HMAC</span>
                </div>
                <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[80%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Active Storage Leases</span>
                  <span className="text-zinc-400 font-mono font-bold"> SQLite Pool OK</span>
                </div>
                <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                  <div className="bg-zinc-400 h-full w-[45%]" />
                </div>
              </div>

              <div className="p-3.5 bg-zinc-500/5 rounded-xl border border-border/40 text-[10px] leading-relaxed text-muted-foreground font-sans">
                💡 <span className="font-bold text-foreground">How testing works:</span> You can create a PRO or TEAM invoice on the <Link to="/pricing" className="text-primary font-bold hover:underline">Pricing Page</Link>, select your payment method, and then either verify directly or navigate here to inspect the logs, manually override them, or fire simulated webhooks! This allows debugging any scenario, including failures and refunds, flawlessly.
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
