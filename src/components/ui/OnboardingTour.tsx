import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Button } from './components';

export function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Only show once per session for demo purposes
    const hasSeenTour = sessionStorage.getItem('haven_tour_seen');
    if (!hasSeenTour) {
      // Delay showing the tour slightly
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const steps = [
    {
      title: 'Welcome to Haven',
      description: 'Your new home for community, collaboration, and building together. Let\'s take a quick look around.',
      position: 'fixed bottom-8 right-8',
    },
    {
      title: 'Community Hub',
      description: 'Discover trending topics, join discussions, and complete daily quests to earn reputation points.',
      position: 'fixed top-24 left-1/2 -translate-x-1/2',
    },
    {
      title: 'Haven Rooms',
      description: 'Drop into voice channels or text chat in real-time with other members from the left sidebar.',
      position: 'fixed top-1/2 left-72 -translate-y-1/2',
    },
    {
      title: 'Your Profile',
      description: 'Show off your badges, projects, and stats. Customize your identity here.',
      position: 'fixed top-24 right-8',
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      closeTour();
    }
  };

  const closeTour = () => {
    setIsVisible(false);
    sessionStorage.setItem('haven_tour_seen', 'true');
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <>
      <div className="fixed inset-0 bg-background/50 backdrop-blur-[2px] z-[100]" aria-hidden="true" />
      <div className={`z-[101] bg-card border border-border shadow-2xl p-6 rounded-2xl w-80 animate-in fade-in zoom-in-95 duration-300 ${step.position}`}>
        <button 
          onClick={closeTour}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="text-xs font-bold text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <h3 className="text-lg font-bold tracking-tight mb-2">{step.title}</h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {step.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'}`}
              />
            ))}
          </div>
          <Button onClick={handleNext} size="sm" className="gap-1.5">
            {currentStep === steps.length - 1 ? (
              <>Finish <CheckCircle2 className="w-3.5 h-3.5" /></>
            ) : (
              <>Next <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
