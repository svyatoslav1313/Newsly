'use client'; // Граница ошибок обязана быть клиентским компонентом

import Link from 'next/link';
import { useEffect } from 'react';
import { StatusScreen } from '@/components/status-screen';
import { Button, buttonStyles } from '@/components/ui/button';

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      code="500"
      title="Что-то пошло не так"
      hint="Мы уже знаем о проблеме. Попробуйте обновить страницу чуть позже."
    >
      <Button onClick={() => retry()}>Попробовать снова</Button>
      <Link href="/" className={buttonStyles({ variant: 'secondary' })}>
        На главную
      </Link>
    </StatusScreen>
  );
}
