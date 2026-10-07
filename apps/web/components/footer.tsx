import Link from 'next/link';
import { Container } from './ui/container';

const links = [
  { href: '/', label: 'Новости' },
  { href: '/admin', label: 'Админка' },
  { href: '/login', label: 'Вход' },
  { href: '/posts', label: 'Демо API' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Newsly</p>
          <p className="mt-1 text-sm text-ink-subtle">
            Новости без шума. Учебный проект.
          </p>
        </div>
        <nav aria-label="Ссылки в подвале">
          <ul className="-mx-3 flex flex-wrap">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex h-11 items-center rounded-md px-3 text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
