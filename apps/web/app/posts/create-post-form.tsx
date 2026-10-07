'use client';

import { POST_TITLE_MAX_LENGTH } from '@my-project/shared';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/input';
import { api } from '@/lib/api';

export function CreatePostForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      await api.createPost({ title, content });
      setTitle('');
      setContent('');
      // Просим Next.js заново выполнить серверный компонент со списком.
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-line bg-surface p-5 shadow-sm"
    >
      <h2 className="font-display text-xl font-semibold text-ink">
        Новый пост
      </h2>
      <Field label="Заголовок" htmlFor="post-title">
        <Input
          id="post-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={POST_TITLE_MAX_LENGTH}
          required
        />
      </Field>
      <Field label="Текст" htmlFor="post-content">
        <Textarea
          id="post-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={3}
          required
        />
      </Field>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <Button type="submit" loading={pending}>
        {pending ? 'Сохраняем' : 'Создать'}
      </Button>
    </form>
  );
}
