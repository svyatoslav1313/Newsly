import { Container } from '@/components/ui/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Container className="pt-10">
      <span className="sr-only" role="status">
        Загрузка…
      </span>
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-full" />
      </div>
      <Skeleton className="mx-auto mt-10 aspect-[16/10] max-w-5xl rounded-xl sm:aspect-[21/9]" />
      <div className="mx-auto mt-12 max-w-[40rem] space-y-4">
        {[0, 1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
        <Skeleton className="h-5 w-2/3" />
      </div>
    </Container>
  );
}
