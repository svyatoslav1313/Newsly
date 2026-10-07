import type { Post } from '@my-project/shared';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { api } from '@/lib/api';
import { CreatePostForm } from './create-post-form';

export const metadata: Metadata = { title: 'Демо API' };

// Страница рендерится на каждый запрос, а не один раз при сборке:
// список постов меняется, и API во время `next build` может быть не запущен.
export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    posts = await api.getPosts();
  } catch {
    error = 'Не удалось загрузить посты. Проверьте, что API запущен.';
  }

  return (
    <Container className="max-w-2xl space-y-8 pt-8 sm:pt-12">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Посты
        </h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Пример работы с настоящим API: данные приходят из NestJS и PostgreSQL.
        </p>
      </div>

      <CreatePostForm />

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-ink-subtle">Постов пока нет.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded-xl border border-line bg-surface p-5 shadow-sm"
            >
              <h2 className="font-medium text-ink">{post.title}</h2>
              <p className="mt-1 text-[15px] leading-relaxed whitespace-pre-line text-ink-muted">
                {post.content}
              </p>
              <time
                dateTime={post.createdAt}
                className="mt-3 block text-sm text-ink-subtle"
              >
                {new Date(post.createdAt).toLocaleString('ru-RU')}
              </time>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
