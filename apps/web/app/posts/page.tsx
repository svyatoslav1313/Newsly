import type { Post } from '@my-project/shared';
import { api } from '@/lib/api';
import { CreatePostForm } from './create-post-form';

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
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Посты</h1>

      <CreatePostForm />

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-zinc-500">Постов пока нет.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded-lg border border-zinc-200 bg-white p-4"
            >
              <h2 className="font-medium">{post.title}</h2>
              <p className="mt-1 text-sm whitespace-pre-line text-zinc-600">
                {post.content}
              </p>
              <time
                dateTime={post.createdAt}
                className="mt-2 block text-xs text-zinc-400"
              >
                {new Date(post.createdAt).toLocaleString('ru-RU')}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
