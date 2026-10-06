import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Project',
  description: 'Учебный фулстек-проект на Next.js и NestJS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <header className="border-b border-zinc-200 bg-white">
          <nav className="mx-auto flex max-w-2xl items-center gap-6 px-4 py-4 text-sm">
            <Link href="/" className="font-semibold">
              My Project
            </Link>
            <Link href="/posts" className="text-zinc-600 hover:text-zinc-900">
              Посты
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
