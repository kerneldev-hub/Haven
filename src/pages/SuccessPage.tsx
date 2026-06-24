import React from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();

  // Handle simulated query params as well as router state
  const planId = state?.planId || searchParams.get('planId');
  const amount = state?.amount || searchParams.get('amount');
  const currency = state?.currency || searchParams.get('currency') || 'DZD';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-8">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-extrabold mb-3">Payment confirmed</h1>
      <p className="text-muted-foreground mb-6">Thank you for supporting Haven OS. Your account has been upgraded.</p>
      {planId && <p className="text-muted-foreground mb-2">Plan: <strong className="text-foreground">{planId}</strong></p>}
      {amount && <p className="text-muted-foreground mb-8">Amount: <strong className="text-foreground">{amount} {currency}</strong></p>}
      <Link to="/workspace" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
        Open Workspace <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
