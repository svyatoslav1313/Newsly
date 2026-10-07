import type { Metadata } from 'next';
import { NewsTable } from '@/components/admin/news-table';

export const metadata: Metadata = { title: 'Админка' };

export default function AdminPage() {
  return <NewsTable />;
}
