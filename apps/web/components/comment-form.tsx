'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useStore } from '@/lib/store';
import { Button } from './ui/button';
import { Field, Textarea } from './ui/input';

const MAX_LENGTH = 1000;

export function CommentForm({ newsId }: { newsId: string }) {
  const { user, addComment } = useStore();
  const [text, setText] = useState('');
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = text.trim();
    if (value.length < 3) {
      setError('Напишите хотя бы несколько слов.');
      return;
    }

    setError(undefined);
    setPending(true);
    await addComment(newsId, value);
    setText('');
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field
        label="Ваш комментарий"
        htmlFor="comment-text"
        error={error}
        hint={`${text.length} из ${MAX_LENGTH} символов`}
      >
        <Textarea
          id="comment-text"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (error) setError(undefined);
          }}
          maxLength={MAX_LENGTH}
          placeholder="Что вы об этом думаете?"
          aria-invalid={Boolean(error)}
          aria-describedby="comment-text-message"
          disabled={pending}
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-subtle">
          {user ? (
            <>
              Вы пишете как{' '}
              <span className="font-medium text-ink">{user.name}</span>
            </>
          ) : (
            <>
              Вы пишете как гость.{' '}
              <Link
                href="/login"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                Войти
              </Link>
            </>
          )}
        </p>
        <Button type="submit" loading={pending}>
          {pending ? 'Отправляем' : 'Отправить'}
        </Button>
      </div>
    </form>
  );
}
