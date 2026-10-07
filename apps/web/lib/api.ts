import type { CreatePostInput, Post } from '@my-project/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    // Данные всегда свежие: Next.js не кэширует ответы API.
    cache: 'no-store',
  });

  if (!response.ok) {
    // NestJS возвращает ошибки в виде { message: string | string[] }.
    const body = await response.json().catch(() => null);

    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : (body?.message ?? response.statusText);

    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  getPosts: () => request<Post[]>('/posts'),
  getPost: (id: number) => request<Post>(`/posts/${id}`),
  createPost: (input: CreatePostInput) =>
    request<Post>('/posts', { method: 'POST', body: JSON.stringify(input) }),
  deletePost: (id: number) =>
    request<void>(`/posts/${id}`, { method: 'DELETE' }),
};
