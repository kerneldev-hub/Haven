import React from 'react';
import { Compass, Home, Search } from 'lucide-react';
import { Button } from '../components/ui/components';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 text-center">
      <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mb-8 border border-border/50 text-muted-foreground/50 shadow-sm">
         <Compass className="w-10 h-10" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Page not found</h1>
      <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
        We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Link to="/home" className="w-full sm:w-auto">
          <Button variant="default" className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/explore" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Explore Ecosystem
          </Button>
        </Link>
      </div>
    </div>
  );
}
