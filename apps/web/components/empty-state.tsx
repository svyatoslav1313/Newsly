import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  hint: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  hint,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-surface-muted text-ink-subtle">
        <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold text-ink">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink-muted">
        {hint}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
