import type { Metadata } from 'next';
import { EditNews } from '@/components/admin/edit-news';

export const metadata: Metadata = { title: 'Редактирование новости' };

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditNews id={id} />;
}
