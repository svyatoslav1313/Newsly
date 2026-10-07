'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { StoreProvider } from '@/lib/store';

export function Providers({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user": при системной настройке «уменьшить движение»
    // motion отключает сдвиги и масштабирование, оставляя только прозрачность.
    <MotionConfig reducedMotion="user">
      <StoreProvider>{children}</StoreProvider>
    </MotionConfig>
  );
}
