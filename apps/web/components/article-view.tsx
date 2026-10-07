'use client';

import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { initials, pluralize } from '@/lib/format';
import { useStore } from '@/lib/store';
import { ArticleContent } from './article-content';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';
import { Cover } from './cover';
import { LikeButton } from './like-button';
import { NewsCard, categoryLabel } from './news-card';
import { NewsMeta } from './news-meta';
import { ReadingProgress } from './reading-progress';
import { Reveal } from './reveal';
import { StatusScreen } from './status-screen';
import { Badge } from './ui/badge';
import { buttonStyles } from './ui/button';
import { Container } from './ui/container';

export function ArticleView({ slug }: { slug: string }) {
  const { news, comments } = useStore();
  const item = news.find((entry) => entry.slug === slug);

  if (!item) {
    return (
      <StatusScreen
        code="404"
        title="Новость не найдена"
        hint="Возможно, её удалили или ссылка устарела."
      >
        <Link href="/" className={buttonStyles()}>
          На главную
        </Link>
      </StatusScreen>
    );
  }

  const itemComments = comments.filter((comment) => comment.newsId === item.id);
  // Сначала новости той же категории, затем остальные.
  const related = news
    .filter((entry) => entry.id !== item.id)
    .toSorted(
      (a, b) =>
        Number(b.category === item.category) -
        Number(a.category === item.category),
    )
    .slice(0, 3);

  return (
    <>
      <ReadingProgress />

      <Container className="pt-6 sm:pt-10">
        <Link
          href="/"
          className="-ml-3 inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Все новости
        </Link>

        <article className="mt-4">
          <header className="mx-auto max-w-3xl">
            <Badge>{categoryLabel(item.category)}</Badge>
            <h1 className="mt-4 font-display text-[2rem] leading-[1.15] font-semibold tracking-tight text-balance text-ink sm:text-5xl sm:leading-[1.1]">
              {item.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted sm:text-xl">
              {item.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-sm font-medium text-ink-muted"
                >
                  {initials(item.author.name)}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">
                    {item.author.name}
                  </p>
                  <p className="text-sm text-ink-subtle">{item.author.role}</p>
                </div>
              </div>
              <NewsMeta item={item} />
            </div>
          </header>

          <div className="mx-auto mt-8 aspect-[16/10] max-w-5xl overflow-hidden rounded-xl border border-line sm:mt-10 sm:aspect-[21/9]">
            <Cover cover={item.cover} className="size-full" />
          </div>

          <ArticleContent
            content={item.content}
            className="mx-auto mt-10 sm:mt-12"
          />

          <footer className="mx-auto mt-12 flex max-w-[40rem] flex-wrap items-center justify-between gap-4 border-y border-line py-5">
            <p className="text-[15px] text-ink-muted">Понравилась новость?</p>
            <div className="flex items-center gap-2">
              <LikeButton newsId={item.id} />
              <a
                href="#comments"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-sm font-medium text-ink-muted transition-colors duration-200 hover:border-ink-subtle hover:text-ink"
              >
                <MessageCircle className="size-[18px]" aria-hidden="true" />
                <span className="tabular-nums">{itemComments.length}</span>
                <span className="sr-only">
                  {pluralize(itemComments.length, [
                    'комментарий',
                    'комментария',
                    'комментариев',
                  ])}
                </span>
              </a>
            </div>
          </footer>
        </article>

        <section
          id="comments"
          aria-labelledby="comments-title"
          className="mx-auto mt-14 max-w-[40rem] scroll-mt-24"
        >
          <h2
            id="comments-title"
            className="font-display text-2xl font-semibold tracking-tight text-ink"
          >
            Комментарии
            <span className="ml-2 text-ink-subtle tabular-nums">
              {itemComments.length}
            </span>
          </h2>
          <div className="mt-6">
            <CommentForm newsId={item.id} />
          </div>
          <div className="mt-8">
            <CommentList comments={itemComments} />
          </div>
        </section>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-20">
            <h2
              id="related-title"
              className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              Читайте также
            </h2>
            <ul className="mt-6 grid gap-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {related.map((entry, index) => (
                <li key={entry.id}>
                  <Reveal delay={index * 0.06} className="h-full">
                    <NewsCard item={entry} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </>
  );
}
