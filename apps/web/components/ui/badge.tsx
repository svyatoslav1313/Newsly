import type { ReactNode } from 'react';
import { cn } from '@/lib/format';

interface BadgeProps {
  children: ReactNode;
  variant?: 'neutral' | 'accent';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium tracking-wide',
        variant === 'accent'
          ? 'bg-accent-soft text-accent'
          : 'bg-surface-muted text-ink-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
