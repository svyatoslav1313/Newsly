'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { cn, pluralize } from '@/lib/format';
import { useStore } from '@/lib/store';

export function LikeButton({ newsId }: { newsId: string }) {
  const { news, likedIds, toggleLike } = useStore();
  const liked = likedIds.includes(newsId);
  const count = news.find((item) => item.id === newsId)?.likes ?? 0;
  // Новая цифра приезжает снизу при лайке и сверху при его снятии.
  const direction = liked ? 1 : -1;

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? 'Убрать лайк' : 'Поставить лайк'}
      onClick={() => toggleLike(newsId)}
      className={cn(
        'inline-flex h-11 items-center gap-2.5 rounded-full border px-4 text-sm font-medium transition-colors duration-200',
        liked
          ? 'border-accent/30 bg-accent-soft text-accent'
          : 'border-line-strong bg-surface text-ink-muted hover:border-ink-subtle hover:text-ink',
      )}
    >
      <motion.span
        key={liked ? 'liked' : 'idle'}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 520, damping: 14 }}
        className="flex"
      >
        <Heart
          className="size-[18px]"
          fill={liked ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
      </motion.span>

      <span className="relative flex h-5 items-center overflow-hidden tabular-nums">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.span
            key={count}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ y: dir * 16, opacity: 0 }),
              center: { y: 0, opacity: 1 },
              exit: (dir: number) => ({ y: dir * -16, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">
        {pluralize(count, ['лайк', 'лайка', 'лайков'])}
      </span>
    </button>
  );
}
