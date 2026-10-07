'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';
import { LogOut, Menu } from 'lucide-react';
import { cn, initials } from '@/lib/format';
import { useStore } from '@/lib/store';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';
import { SearchInput } from './search-input';
import { ThemeToggle } from './theme-toggle';
import { buttonStyles } from './ui/button';
import { Container } from './ui/container';

const links = [
  { href: '/', label: 'Новости' },
  { href: '/admin', label: 'Админка' },
];

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // После небольшой прокрутки шапка сжимается и получает размытый фон.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 16));

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-out',
          scrolled
            ? 'border-line bg-canvas/80 backdrop-blur-lg'
            : 'border-transparent bg-canvas',
        )}
      >
        <Container
          className={cn(
            'flex items-center gap-3 transition-[height] duration-300 ease-out md:gap-6',
            scrolled ? 'h-14' : 'h-[72px]',
          )}
        >
          <Logo />

          <nav aria-label="Основная навигация" className="hidden md:flex">
            {links.map((link) => {
              const active =
                link.href === '/'
                  ? pathname === '/' || pathname.startsWith('/news')
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150',
                    active ? 'text-ink' : 'text-ink-subtle hover:text-ink',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <SearchInput
            id="search-desktop"
            className="ml-auto hidden w-full max-w-xs md:block"
          />

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <ThemeToggle />

            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <>
                  <span
                    title={user.name}
                    className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-sm font-medium text-accent"
                  >
                    <span aria-hidden="true">{initials(user.name)}</span>
                    <span className="sr-only">Вы вошли как {user.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    aria-label="Выйти"
                    className={buttonStyles({ variant: 'ghost', size: 'icon' })}
                  >
                    <LogOut className="size-5" aria-hidden="true" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={buttonStyles({ variant: 'secondary', size: 'sm' })}
                >
                  Войти
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Открыть меню"
              aria-expanded={menuOpen}
              className={buttonStyles({
                variant: 'ghost',
                size: 'icon',
                className: 'md:hidden',
              })}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      {/* Вне <header>: его backdrop-filter иначе ограничил бы панель рамками шапки. */}
      <MobileMenu open={menuOpen} onClose={closeMenu} links={links} />
    </>
  );
}
