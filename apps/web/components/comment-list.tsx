'use client';

import { AnimatePresence, motion } from 'motion/react';
import { MessagesSquare } from 'lucide-react';
import { formatDate, initials } from '@/lib/format';
import type { Comment } from '@/lib/types';
import { EmptyState } from './empty-state';

export function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <>
      {comments.length === 0 && (
        <EmptyState
          icon={MessagesSquare}
          title="Комментариев пока нет"
          hint="Станьте первым, кто поделится мнением об этой новости."
        />
      )}
      {/* Список отрисован всегда, чтобы и самый первый комментарий выехал плавно. */}
      <CommentItems comments={comments} />
    </>
  );
}

function CommentItems({ comments }: { comments: Comment[] }) {
  return (
    <ul className="divide-y divide-line">
      {/* initial={false}: уже существующие комментарии не анимируются при открытии. */}
      <AnimatePresence initial={false}>
        {comments.map((comment) => (
          <motion.li
            key={comment.id}
            initial={{ opacity: 0, height: 0, y: -12 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <article className="flex gap-4 py-5">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-medium text-ink-muted"
              >
                {initials(comment.authorName)}
              </span>
              <div className="min-w-0 flex-1">
                <header className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-medium text-ink">
                    {comment.authorName}
                  </span>
                  <time
                    dateTime={comment.createdAt}
                    className="text-sm text-ink-subtle"
                  >
                    {formatDate(comment.createdAt)}
                  </time>
                </header>
                <p className="mt-1.5 text-[15px] leading-relaxed break-words whitespace-pre-line text-ink-muted">
                  {comment.text}
                </p>
              </div>
            </article>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
