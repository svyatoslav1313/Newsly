'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';

interface RevealProps {
  children: ReactNode;
  /** Задержка в секундах — для каскадного появления карточек. */
  delay?: number;
  className?: string;
}

/** Плавное появление блока, когда он попадает в область просмотра. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -48px 0px' }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
