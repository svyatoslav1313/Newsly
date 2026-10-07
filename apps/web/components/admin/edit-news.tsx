'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { StatusScreen } from '../status-screen';
import { buttonStyles } from '../ui/button';
import { NewsForm } from './news-form';

export function EditNews({ id }: { id: string }) {
  const { news } = useStore();
  const item = news.find((entry) => entry.id === id);

  if (!item) {
    return (
      <StatusScreen
        code="404"
        title="Новость не найдена"
        hint="Возможно, её уже удалили."
      >
        <Link href="/admin" className={buttonStyles()}>
          К списку новостей
        </Link>
      </StatusScreen>
    );
  }

  return <NewsForm item={item} />;
}
