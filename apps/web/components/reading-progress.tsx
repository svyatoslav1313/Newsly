'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/** Тонкая полоса вверху экрана: насколько прокручена страница новости. */
export function ReadingProgress() {
  // Без параметров useScroll следит за прокруткой всей страницы:
  // 0 — самый верх, 1 — самый низ.
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 32 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
