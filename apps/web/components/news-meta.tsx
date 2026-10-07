import { Clock } from 'lucide-react';
import { cn, formatDate, readingTime } from '@/lib/format';
import type { NewsItem } from '@/lib/types';

/** Строка «дата · время чтения» под заголовком новости. */
export function NewsMeta({
  item,
  className,
}: {
  item: Pick<NewsItem, 'publishedAt' | 'content'>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-subtle',
        className,
      )}
    >
      <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
      <span aria-hidden="true" className="size-1 rounded-full bg-line-strong" />
      <span className="inline-flex items-center gap-1.5">
        <Clock className="size-3.5" aria-hidden="true" />
        {readingTime(item.content)} мин чтения
      </span>
    </div>
  );
}
