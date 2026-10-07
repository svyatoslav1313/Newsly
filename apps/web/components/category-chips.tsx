'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/format';
import { categories } from '@/lib/mock-data';
import type { CategoryId } from '@/lib/types';

export type CategoryFilter = CategoryId | 'all';

interface CategoryChipsProps {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
}

export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  const options: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'Все' },
    ...categories,
  ];

  return (
    // На узком экране чипы прокручиваются внутри своей строки, а не страницы.
    <div
      role="group"
      aria-label="Фильтр по категориям"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((option) => {
        const active = option.id === value;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              'relative h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-colors duration-200 active:scale-[0.97]',
              active
                ? 'text-canvas'
                : 'border border-line-strong text-ink-muted hover:border-ink-subtle hover:text-ink',
            )}
          >
            {active && (
              <motion.span
                layoutId="category-chip-active"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
