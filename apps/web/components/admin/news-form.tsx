'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn, excerptFrom } from '@/lib/format';
import { categories, coverHues, coverPatterns } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import type { CategoryId, Cover as CoverData, NewsItem } from '@/lib/types';
import { ArticleContent } from '../article-content';
import { Cover } from '../cover';
import { categoryLabel } from '../news-card';
import { Badge } from '../ui/badge';
import { Button, buttonStyles } from '../ui/button';
import { Container } from '../ui/container';
import { Field, Input, Select, Textarea } from '../ui/input';

type Errors = Partial<Record<'title' | 'content', string>>;

/** Форма создания новости; с пропом `item` — редактирования. */
export function NewsForm({ item }: { item?: NewsItem }) {
  const router = useRouter();

  const { createNews, updateNews } = useStore();

  const [title, setTitle] = useState(item?.title ?? '');
  const [category, setCategory] = useState<CategoryId>(
    item?.category ?? 'technology',
  );
  const [cover, setCover] = useState<CoverData>(
    item?.cover ?? { hue: coverHues[0], pattern: 'rings' },
  );
  const [content, setContent] = useState(item?.content ?? '');
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  // Ошибка поля снимается, как только пользователь начинает его исправлять.
  function clearError(field: keyof Errors) {
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Errors = {};

    if (title.trim().length < 5) {
      nextErrors.title = 'Заголовок должен быть не короче 5 символов.';
    }

    if (content.trim().length < 50) {
      nextErrors.content =
        'Текст слишком короткий — нужно хотя бы 50 символов.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setPending(true);

    const input = {
      title: title.trim(),
      category,
      cover,
      content: content.trim(),
    };

    if (item) {
      await updateNews(item.id, input);
    } else {
      await createNews(input);
    }

    router.push('/admin');
  }

  return (
    <Container className="pt-6 sm:pt-10">
      <Link
        href="/admin"
        className="-ml-3 inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />К списку новостей
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {item ? 'Редактирование новости' : 'Новая новость'}
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <Field label="Заголовок" htmlFor="news-title" error={errors.title}>
            <Input
              id="news-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                clearError('title');
              }}
              placeholder="О чём эта новость"
              maxLength={140}
              aria-invalid={Boolean(errors.title)}
              aria-describedby="news-title-message"
              disabled={pending}
            />
          </Field>

          <Field label="Категория" htmlFor="news-category">
            <Select
              id="news-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as CategoryId)
              }
              disabled={pending}
            >
              {categories.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>

          <fieldset className="space-y-3" disabled={pending}>
            <legend className="text-sm font-medium text-ink">Обложка</legend>
            <div
              role="radiogroup"
              aria-label="Цвет обложки"
              className="flex flex-wrap gap-2"
            >
              {coverHues.map((hue) => (
                <button
                  key={hue}
                  type="button"
                  role="radio"
                  aria-checked={cover.hue === hue}
                  aria-label={`Оттенок ${hue}`}
                  onClick={() => setCover({ ...cover, hue })}
                  className={cn(
                    'size-11 rounded-full border-2 p-1 transition-[border-color,transform] duration-150 active:scale-95',
                    cover.hue === hue
                      ? 'border-accent'
                      : 'border-transparent hover:border-line-strong',
                  )}
                >
                  <span
                    className="block size-full rounded-full"
                    style={{ background: `oklch(0.82 0.08 ${hue})` }}
                  />
                </button>
              ))}
            </div>
            <div
              role="radiogroup"
              aria-label="Узор обложки"
              className="flex flex-wrap gap-2"
            >
              {coverPatterns.map((pattern) => {
                const active = cover.pattern === pattern.id;

                return (
                  <button
                    key={pattern.id}
                    type="button"
                    role="radio"
                    aria-checked={cover.pattern === pattern.id}
                    onClick={() => setCover({ ...cover, pattern: pattern.id })}
                    className={cn(
                      'relative h-11 rounded-full border px-4 text-sm font-medium transition-colors duration-150 active:scale-[0.97]',
                      active
                        ? 'text-canvas'
                        : 'border-line-strong text-ink-muted hover:border-ink-subtle hover:text-ink',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="pattern-chip-active"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    )}
                    <span className="relative">{pattern.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Field
            label="Текст"
            htmlFor="news-content"
            error={errors.content}
            hint="Абзацы разделяйте пустой строкой. «## » в начале — подзаголовок, «> » — цитата."
          >
            <Textarea
              id="news-content"
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                clearError('content');
              }}
              rows={12}
              placeholder="Текст новости"
              aria-invalid={Boolean(errors.content)}
              aria-describedby="news-content-message"
              disabled={pending}
            />
          </Field>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" loading={pending}>
              {pending ? 'Сохраняем' : item ? 'Сохранить' : 'Опубликовать'}
            </Button>
            <Link
              href="/admin"
              className={buttonStyles({ variant: 'secondary' })}
            >
              Отмена
            </Link>
          </div>
        </form>

        <section
          aria-labelledby="preview-title"
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <h2
            id="preview-title"
            className="text-sm font-medium tracking-wide text-ink-subtle uppercase"
          >
            Предпросмотр
          </h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
            <Cover cover={cover} className="aspect-[16/9]" />
            <div className="p-5 sm:p-6">
              <Badge>{categoryLabel(category)}</Badge>
              <p className="mt-3 font-display text-2xl leading-snug font-semibold tracking-tight break-words text-ink">
                {title.trim() || 'Заголовок новости'}
              </p>
              {content.trim() ? (
                <>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                    {excerptFrom(content)}
                  </p>
                  <ArticleContent
                    content={content}
                    className="mt-6 border-t border-line pt-6 !text-base break-words"
                  />
                </>
              ) : (
                <p className="mt-2 text-[15px] leading-relaxed text-ink-subtle">
                  Начните вводить текст — он появится здесь так, как его увидят
                  читатели.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}
