import type { Metadata, Viewport } from 'next';
import { Golos_Text, Source_Serif_4 } from 'next/font/google';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Providers } from '@/components/providers';
import { themeInitScript } from '@/components/theme-toggle';
import './globals.css';

// Заголовочный шрифт — антиква с редакционным характером.
const headingFont = Source_Serif_4({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-heading',
  display: 'swap',
});

// Текстовый шрифт — спроектирован в первую очередь под кириллицу.
const textFont = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-text',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Newsly — новости без шума',
    template: '%s — Newsly',
  },
  description: 'Новостное приложение: читайте, ставьте лайки и обсуждайте.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#111110' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: data-theme выставляет скрипт до гидрации.
    <html
      lang="ru"
      className={`${headingFont.variable} ${textFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:shadow-md"
          >
            Перейти к содержимому
          </a>
          <Header />
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
