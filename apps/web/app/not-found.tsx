import type { Metadata } from 'next';
import Link from 'next/link';
import { StatusScreen } from '@/components/status-screen';
import { buttonStyles } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Страница не найдена' };

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title="Такой страницы нет"
      hint="Возможно, ссылка устарела или в адресе опечатка."
    >
      <Link href="/" className={buttonStyles()}>
        На главную
      </Link>
    </StatusScreen>
  );
}
