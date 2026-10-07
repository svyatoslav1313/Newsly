import type { Metadata } from 'next';
import { ArticleView } from '@/components/article-view';
import { initialNews } from '@/lib/mock-data';

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;

  const item = initialNews.find((entry) => entry.slug === slug);

  return item
    ? { title: item.title, description: item.excerpt }
    : { title: 'Новость' };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { slug } = await params;
  // Саму новость ищет клиентский компонент: пока нет API, данные (включая
  // новости, созданные в админке) живут в локальном хранилище браузера.
  return <ArticleView slug={slug} />;
}
