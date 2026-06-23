import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/components';
import { Button } from '../components/ui/components';
import { CheckCircle2, ArrowRight, ShieldCheck, HelpCircle, Terminal, Sparkles, Receipt } from 'lucide-react';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state params safely
  const { planId = 'PRO', invoiceId = 'havpay-821948', amount = 29.45, currency = 'USD' } = (location.state as any) || {};

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden text-foreground selection:bg-primary/20">
      {/* Background Ambience Glares */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="container mx-auto max-w-3xl px-4 py-24 flex-1 flex flex-col justify-center relative z-10">
        
        {/* Verification Success Stage Card */}
        <div className="p-1 md:p-2 bg-gradient-to-br from-emerald-500/30 via-border/10 to-primary/30 rounded-[2.5rem] shadow-2xl relative select-none animate-in scale-in duration-500">
          <div className="bg-card/95 backdrop-blur-2xl rounded-[2.2rem] p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3.5 mb-10">
              <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-block">
                SECURE CHECKOUT MATCHED
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">System Node Upgraded!</h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                Automated payments validation completed. Your Haven OS enterprise workspace nodes are active, verified, and secured.
              </p>
            </div>

            {/* Receipt details bento element */}
            <div className="bg-muted/30 border border-border/80 rounded-2xl p-6 text-left font-mono text-xs space-y-4 max-w-md mx-auto">
              <div className="flex justify-between items-center text-muted-foreground border-b border-border/50 pb-3">
                <span className="flex items-center gap-1.5 font-bold text-foreground">
                  <Receipt className="w-4 h-4 text-primary" /> SYSTEM RECEIPT
                </span>
                <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> SECURE MATCH
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>INVOICE IDENTIFIER</span>
                  <span className="text-foreground font-bold tracking-wider">{invoiceId}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>PROVISIONED PLAN</span>
                  <span className="text-primary font-bold uppercase">{planId} MEMBER NODE</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>BILLING CYCLE</span>
                  <span className="text-foreground">30 DAYS (AUTOMATIC RESET)</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>CLEARANCE RATE</span>
                  <span className="text-foreground font-bold">{amount.toLocaleString()} {currency}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-border/50 flex justify-between items-center text-foreground font-bold">
                <span>GATEWAY PROTOCOL</span>
                <span className="text-emerald-600 dark:text-emerald-400">CERTIFIED TRUSTED</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Button
                onClick={() => navigate('/workspace')}
                className="flex-1 font-bold tracking-tight py-4 h-12 bg-primary text-white flex items-center justify-center gap-2 rounded-xl hover:-translate-y-0.5 transition-all text-sm cursor-pointer shadow-lg shadow-primary/20"
              >
                Launch Workspace <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate('/pricing')}
                variant="outline"
                className="flex-1 font-bold border-border text-muted-foreground hover:bg-muted/20 hover:text-foreground h-12 text-sm cursor-pointer"
              >
                Back to Billing Hub
              </Button>
            </div>

            {/* Verification badge footer */}
            <div className="pt-8 text-center text-muted-foreground flex items-center justify-center gap-2 select-none text-[10px] font-mono uppercase">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>CORE WORKSPACE NODE ONLINE: HAVEN NETWORK COMPLIANT</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
