import { cn } from '@/lib/format';

/** Серый пульсирующий блок на месте ещё не загруженного контента. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-surface-muted', className)}
    />
  );
}
