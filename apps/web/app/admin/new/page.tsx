import type { Metadata } from 'next';
import { NewsForm } from '@/components/admin/news-form';

export const metadata: Metadata = { title: 'Новая новость' };

export default function NewNewsPage() {
  return <NewsForm />;
}
