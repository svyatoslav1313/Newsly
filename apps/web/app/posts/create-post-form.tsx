'use client';

import { POST_TITLE_MAX_LENGTH } from '@my-project/shared';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';

const inputClass =
  'w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900';

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
      className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4"
    >
      <h2 className="font-medium">Новый пост</h2>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Заголовок"
        maxLength={POST_TITLE_MAX_LENGTH}
        required
        className={inputClass}
      />
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Текст"
        rows={3}
        required
        className={inputClass}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? 'Сохраняем…' : 'Создать'}
      </button>
    </form>
  );
}
