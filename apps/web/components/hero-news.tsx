import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/lib/types';
import { Cover } from './cover';
import { categoryLabel } from './news-card';
import { NewsMeta } from './news-meta';
import { Badge } from './ui/badge';

/** Крупная «главная новость» в начале ленты. */
export function HeroNews({ item }: { item: NewsItem }) {
  return (
    <article className="group relative grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
      <div className="aspect-[16/10] overflow-hidden rounded-xl border border-line shadow-sm transition-shadow duration-300 ease-out group-hover:shadow-md">
        <Cover
          cover={item.cover}
          className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div>
        <div className="flex items-center gap-3">
          <Badge variant="accent">Главное</Badge>
          <span className="text-sm text-ink-subtle">
            {categoryLabel(item.category)}
          </span>
        </div>

        <h2 className="mt-4 font-display text-3xl leading-[1.15] font-semibold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem]">
          <Link
            href={`/news/${item.slug}`}
            className="rounded-sm after:absolute after:inset-0"
          >
            {item.title}
          </Link>
        </h2>

        <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
          {item.excerpt}
        </p>

        <NewsMeta item={item} className="mt-5" />

        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
          Читать
          <ArrowRight
            className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  );
}
