import type { ReactNode } from 'react';
import { Container } from './ui/container';

interface StatusScreenProps {
  code: string;
  title: string;
  hint: string;
  children: ReactNode;
}

/** Общий вид страниц 404 и ошибки. */
export function StatusScreen({
  code,
  title,
  hint,
  children,
}: StatusScreenProps) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p
        aria-hidden="true"
        className="font-display text-[7rem] leading-none font-semibold tracking-tighter text-line-strong sm:text-[10rem]"
      >
        {code}
      </p>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted">
        {hint}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
    </Container>
  );
}
