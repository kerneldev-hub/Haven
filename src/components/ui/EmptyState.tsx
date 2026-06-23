import React from 'react';
import { cn } from '../../lib/utils';
import { Search, Inbox } from 'lucide-react';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-[400px] border rounded-xl bg-card border-dashed", className)} {...props}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/50 text-muted-foreground mb-4">
        {icon || <Inbox className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
