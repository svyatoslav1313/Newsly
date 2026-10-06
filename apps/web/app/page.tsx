import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Project</h1>
      <p className="text-zinc-600">
        Учебный монорепозиторий: Next.js на фронтенде, NestJS и PostgreSQL на
        бэкенде.
      </p>
      <Link
        href="/posts"
        className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Перейти к постам
      </Link>
    </div>
  );
}
