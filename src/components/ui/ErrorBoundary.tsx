import React, { ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "./components";
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full bg-card border shadow-sm rounded-xl p-8 flex flex-col items-center text-center">
         <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-6 h-6" />
         </div>
         <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
         <p className="text-muted-foreground text-sm mb-6">
           An unexpected error occurred. Our engineering team has been notified.
         </p>
         <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
               variant="default" 
               className="w-full"
               onClick={resetErrorBoundary}
            >
               <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </Button>
            <Button 
               variant="outline" 
               className="w-full"
               onClick={() => window.location.href = '/'}
            >
               <Home className="w-4 h-4 mr-2" /> Return Home
            </Button>
         </div>
         {process.env.NODE_ENV === "development" && (
            <div className="mt-8 p-4 bg-muted rounded-md w-full text-left overflow-auto border border-border/50 max-h-48 text-xs font-mono text-muted-foreground">
               {error.toString()}
            </div>
         )}
      </div>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
