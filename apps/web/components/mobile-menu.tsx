'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { SearchInput } from './search-input';
import { buttonStyles } from './ui/button';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

/** Выезжающая справа панель навигации для узких экранов. */
export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const { user, logout } = useStore();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    // Пока панель открыта, страница под ней не прокручивается.
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            className="absolute inset-y-0 right-0 flex w-[min(20rem,calc(100vw-3rem))] flex-col border-l border-line bg-canvas shadow-lg"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-[72px] items-center justify-between px-4">
              <span className="font-display text-lg font-semibold">Меню</span>
              <button
                type="button"
                onClick={onClose}
                autoFocus
                aria-label="Закрыть меню"
                className={buttonStyles({ variant: 'ghost', size: 'icon' })}
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6">
              <SearchInput id="search-mobile" onSubmitted={onClose} />

              <nav aria-label="Основная навигация" className="flex flex-col">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="flex h-12 items-center rounded-md px-3 text-base font-medium text-ink transition-colors hover:bg-surface-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t border-line pt-6">
                {user ? (
                  <>
                    <p className="px-1 text-sm text-ink-muted">
                      Вы вошли как{' '}
                      <span className="font-medium text-ink">{user.name}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className={buttonStyles({ variant: 'secondary' })}
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={onClose}
                      className={buttonStyles({ variant: 'secondary' })}
                    >
                      Войти
                    </Link>
                    <Link
                      href="/register"
                      onClick={onClose}
                      className={buttonStyles()}
                    >
                      Создать аккаунт
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
