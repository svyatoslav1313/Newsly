import { NewsCardSkeleton } from '@/components/news-card';
import { Container } from '@/components/ui/container';
import { Skeleton } from '@/components/ui/skeleton';

// Показывается, пока серверный компонент страницы ждёт данные.
// С моками это мгновенно; скелетон понадобится после подключения API.
export default function Loading() {
  return (
    <Container className="pt-8 sm:pt-12">
      <span className="sr-only" role="status">
        Загрузка…
      </span>
      <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
        <Skeleton className="aspect-[16/10] rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {[0, 1, 2].map((index) => (
          <NewsCardSkeleton key={index} />
        ))}
      </div>
    </Container>
  );
}
