'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, Newspaper, Pencil, Plus, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { useStore } from '@/lib/store';
import type { NewsItem } from '@/lib/types';
import { Cover } from '../cover';
import { EmptyState } from '../empty-state';
import { categoryLabel } from '../news-card';
import { Badge } from '../ui/badge';
import { Button, buttonStyles } from '../ui/button';
import { Container } from '../ui/container';

export function NewsTable() {
  const { news, deleteNews } = useStore();
  // id новости, для которой сейчас запрошено подтверждение удаления.
  const [confirmId, setConfirmId] = useState<string>();

  const sorted = news.toSorted((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  function renderActions(item: NewsItem, size: 'sm' | 'md') {
    if (confirmId === item.id) {
      return (
        <div
          role="group"
          aria-label={`Удалить «${item.title}»?`}
          className="flex items-center justify-end gap-2"
        >
          <span className="mr-1 text-sm text-ink-muted">Удалить?</span>
          <Button
            variant="danger"
            size={size}
            autoFocus
            onClick={() => {
              deleteNews(item.id);
              setConfirmId(undefined);
            }}
          >
            Да
          </Button>
          <Button
            variant="secondary"
            size={size}
            onClick={() => setConfirmId(undefined)}
          >
            Отмена
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-end gap-2">
        <Link
          href={`/admin/${item.id}/edit`}
          className={buttonStyles({ variant: 'secondary', size })}
        >
          <Pencil className="size-4" aria-hidden="true" />
          Изменить
          <span className="sr-only">«{item.title}»</span>
        </Link>
        <Button
          variant="danger"
          size={size}
          onClick={() => setConfirmId(item.id)}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Удалить
          <span className="sr-only">«{item.title}»</span>
        </Button>
      </div>
    );
  }

  return (
    <Container className="pt-8 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Новости
          </h1>
          <p className="mt-2 text-[15px] text-ink-muted">
            Всего опубликовано: {news.length}
          </p>
        </div>
        <Link href="/admin/new" className={buttonStyles()}>
          <Plus className="size-4" aria-hidden="true" />
          Создать новость
        </Link>
      </div>

      <div className="mt-8">
        {sorted.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="Новостей пока нет"
            hint="Создайте первую новость — она сразу появится на главной."
            action={
              <Link href="/admin/new" className={buttonStyles()}>
                <Plus className="size-4" aria-hidden="true" />
                Создать новость
              </Link>
            }
          />
        ) : (
          <>
            {/* Десктоп и планшет: таблица. */}
            <div className="hidden overflow-hidden rounded-xl border border-line bg-surface shadow-sm md:block">
              <table className="w-full text-left text-[15px]">
                <thead className="border-b border-line bg-surface-muted text-sm text-ink-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Заголовок
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Категория
                    </th>
                    <th
                      scope="col"
                      className="hidden px-4 py-3 font-medium lg:table-cell"
                    >
                      Дата
                    </th>
                    <th
                      scope="col"
                      className="hidden px-4 py-3 font-medium lg:table-cell"
                    >
                      Лайки
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-right font-medium"
                    >
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {sorted.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors duration-150 hover:bg-surface-muted/60"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <Cover
                            cover={item.cover}
                            className="hidden h-11 w-16 shrink-0 rounded-sm lg:block"
                          />
                          <Link
                            href={`/news/${item.slug}`}
                            className="line-clamp-2 rounded-sm font-medium text-ink underline-offset-4 hover:underline"
                          >
                            {item.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge>{categoryLabel(item.category)}</Badge>
                      </td>
                      <td className="hidden px-4 py-4 whitespace-nowrap text-ink-muted lg:table-cell">
                        {formatDate(item.publishedAt)}
                      </td>
                      <td className="hidden px-4 py-4 text-ink-muted tabular-nums lg:table-cell">
                        {item.likes}
                      </td>
                      <td className="px-5 py-4">{renderActions(item, 'sm')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Телефон: те же данные списком карточек. */}
            <ul className="space-y-4 md:hidden">
              {sorted.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-line bg-surface p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <Cover
                      cover={item.cover}
                      className="h-14 w-20 shrink-0 rounded-sm"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/news/${item.slug}`}
                        className="line-clamp-2 rounded-sm font-medium text-ink"
                      >
                        {item.title}
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-subtle">
                    <Badge>{categoryLabel(item.category)}</Badge>
                    <time dateTime={item.publishedAt}>
                      {formatDate(item.publishedAt)}
                    </time>
                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                      <Heart className="size-3.5" aria-hidden="true" />
                      {item.likes}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-line pt-4">
                    {renderActions(item, 'md')}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Container>
  );
}
