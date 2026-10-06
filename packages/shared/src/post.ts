/** Максимальная длина заголовка поста — проверяется и в API, и в форме. */
export const POST_TITLE_MAX_LENGTH = 120;

/**
 * Пост в том виде, в каком он приходит по HTTP.
 * `createdAt` — строка, потому что JSON не умеет передавать Date.
 */
export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

/** Тело запроса POST /api/posts. */
export interface CreatePostInput {
  title: string;
  content: string;
}
