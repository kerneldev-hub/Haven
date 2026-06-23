import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { OnboardingTour } from '../ui/OnboardingTour';
import MobileNav from './MobileNav';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Navbar />
      <OnboardingTour />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      
      <Footer />

      {/* Persistent Bottom Mobile Navigation Tab Bar (PWA Experience) */}
      <MobileNav />
    </div>
  );
}

