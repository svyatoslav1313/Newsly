// Типы новостного интерфейса. Когда появится API, их стоит перенести
// в packages/shared, чтобы ими пользовался и бэкенд.

export type CategoryId =
  'technology' | 'science' | 'culture' | 'business' | 'society';

export interface Category {
  id: CategoryId;
  label: string;
}

export type CoverPattern = 'rings' | 'grid' | 'waves' | 'blocks';

/** Обложка-плейсхолдер: рисуется кодом по оттенку и узору, без картинок. */
export interface Cover {
  hue: number;
  pattern: CoverPattern;
}

export interface Author {
  name: string;
  role: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Абзацы разделены пустой строкой; «## » — подзаголовок, «> » — цитата. */
  content: string;
  category: CategoryId;
  cover: Cover;
  author: Author;
  publishedAt: string;
  likes: number;
}

/** Данные формы создания и редактирования новости. */
export interface NewsInput {
  title: string;
  category: CategoryId;
  cover: Cover;
  content: string;
}

export interface Comment {
  id: string;
  newsId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface User {
  name: string;
  email: string;
}
