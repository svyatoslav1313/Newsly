'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';

export function Logo({ onNavigate }: { onNavigate?: () => void }) {
  const { setQuery } = useStore();

  return (
    <Link
      href="/"
      onClick={() => {
        setQuery('');
        onNavigate?.();
      }}
      className="inline-flex h-11 items-center gap-1 rounded-sm font-display text-2xl font-semibold tracking-tight text-ink"
      aria-label="Newsly — на главную"
    >
      Newsly
      <span
        aria-hidden="true"
        className="mt-2 size-1.5 rounded-full bg-accent"
      />
    </Link>
  );
}
