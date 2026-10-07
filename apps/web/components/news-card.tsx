import Link from 'next/link';
import { Heart } from 'lucide-react';
import { categories } from '@/lib/mock-data';
import type { NewsItem } from '@/lib/types';
import { Cover } from './cover';
import { NewsMeta } from './news-meta';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

export function categoryLabel(id: NewsItem['category']) {
  return categories.find((category) => category.id === id)?.label ?? id;
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-line-strong hover:shadow-md has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent">
      <div className="aspect-[16/10] overflow-hidden">
        <Cover
          cover={item.cover}
          className="size-full transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Badge className="self-start">{categoryLabel(item.category)}</Badge>

        <h3 className="mt-3 font-display text-xl leading-snug font-semibold tracking-tight text-ink">
          {/* Ссылка растянута на всю карточку: кликабельна вся площадь. */}
          <Link
            href={`/news/${item.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {item.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink-muted">
          {item.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <NewsMeta item={item} />
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-ink-subtle tabular-nums">
            <Heart className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Лайков:</span>
            {item.likes}
          </span>
        </div>
      </div>
    </article>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-5 h-4 w-40" />
      </div>
    </div>
  );
}
