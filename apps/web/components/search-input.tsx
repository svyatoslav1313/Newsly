'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/format';
import { useStore } from '@/lib/store';

interface SearchInputProps {
  id: string;
  className?: string;
  /** Вызывается после отправки — например, чтобы закрыть мобильное меню. */
  onSubmitted?: () => void;
}

export function SearchInput({ id, className, onSubmitted }: SearchInputProps) {
  const { query, setQuery } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Результаты показывает главная: с других страниц переходим на неё.
    if (pathname !== '/') router.push('/');
    onSubmitted?.();
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn('relative', className)}
    >
      <label htmlFor={id} className="sr-only">
        Поиск по новостям
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle"
        aria-hidden="true"
      />
      <input
        id={id}
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Поиск по новостям"
        className="h-11 w-full rounded-full border border-line bg-surface-muted pr-11 pl-10 text-[15px] text-ink transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-ink-subtle hover:border-line-strong focus:border-accent focus:bg-surface focus:ring-3 focus:ring-accent/15 focus:outline-none"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label="Очистить поиск"
          className="absolute top-0 right-0 flex size-11 items-center justify-center rounded-full text-ink-subtle transition-colors hover:text-ink"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </form>
  );
}
