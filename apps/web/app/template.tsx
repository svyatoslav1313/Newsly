'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';

// template.tsx, в отличие от layout.tsx, создаётся заново при каждом переходе —
// поэтому анимация появления проигрывается на каждой странице.
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
