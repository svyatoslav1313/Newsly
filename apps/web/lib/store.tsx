'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { excerptFrom, slugify } from './format';
import { adminAuthor, initialComments, initialNews } from './mock-data';
import type { Comment, NewsInput, NewsItem, User } from './types';

// Локальное состояние вместо бэкенда. Компоненты работают только с этим
// интерфейсом, поэтому при подключении API меняется лишь реализация ниже:
// вместо setState — запросы из lib/api.ts.
interface NewsStore {
  news: NewsItem[];
  comments: Comment[];
  likedIds: string[];
  user: User | null;
  query: string;
  setQuery: (query: string) => void;
  toggleLike: (newsId: string) => void;
  addComment: (newsId: string, text: string) => Promise<void>;
  createNews: (input: NewsInput) => Promise<NewsItem>;
  updateNews: (id: string, input: NewsInput) => Promise<void>;
  deleteNews: (id: string) => void;
  login: (user: User) => Promise<void>;
  logout: () => void;
}

const StoreContext = createContext<NewsStore | null>(null);

/** Имитация сетевой задержки, чтобы были видны состояния загрузки. */
const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export function StoreProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState(initialNews);
  const [comments, setComments] = useState(initialComments);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState('');

  const store: NewsStore = {
    news,
    comments,
    likedIds,
    user,
    query,
    setQuery,

    // Оптимистичное обновление: интерфейс меняется сразу, не дожидаясь ответа.
    toggleLike(newsId) {
      const liked = likedIds.includes(newsId);
      setLikedIds(
        liked ? likedIds.filter((id) => id !== newsId) : [...likedIds, newsId],
      );
      setNews((list) =>
        list.map((item) =>
          item.id === newsId
            ? { ...item, likes: item.likes + (liked ? -1 : 1) }
            : item,
        ),
      );
    },

    async addComment(newsId, text) {
      await delay(600);
      const comment: Comment = {
        id: crypto.randomUUID(),
        newsId,
        authorName: user?.name ?? 'Гость',
        text,
        createdAt: new Date().toISOString(),
      };
      setComments((list) => [comment, ...list]);
    },

    async createNews(input) {
      await delay(600);
      const baseSlug = slugify(input.title) || 'novost';
      const taken = news.some((item) => item.slug === baseSlug);
      const item: NewsItem = {
        ...input,
        id: crypto.randomUUID(),
        slug: taken ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug,
        excerpt: excerptFrom(input.content),
        author: adminAuthor,
        publishedAt: new Date().toISOString(),
        likes: 0,
      };
      setNews((list) => [item, ...list]);
      return item;
    },

    async updateNews(id, input) {
      await delay(600);
      setNews((list) =>
        list.map((item) =>
          item.id === id
            ? { ...item, ...input, excerpt: excerptFrom(input.content) }
            : item,
        ),
      );
    },

    deleteNews(id) {
      setNews((list) => list.filter((item) => item.id !== id));
      setComments((list) => list.filter((comment) => comment.newsId !== id));
    },

    async login(nextUser) {
      await delay(700);
      setUser(nextUser);
    },

    logout() {
      setUser(null);
    },
  };

  return <StoreContext value={store}>{children}</StoreContext>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore можно вызывать только внутри StoreProvider');
  }
  return store;
}
