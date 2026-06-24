import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-8">
      <p className="text-8xl font-black text-foreground/10 mb-4 select-none">404</p>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-muted-foreground text-sm mb-8">This page doesn't exist or has been moved.</p>
      <Link to="/" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
