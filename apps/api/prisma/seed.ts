import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // Не трогаем базу, если в ней уже есть посты — seed можно запускать повторно.
  const existing = await prisma.post.count();
  if (existing > 0) {
    console.log(`Seed пропущен: в базе уже есть посты (${existing}).`);
    return;
  }

  // У каждого поста обязан быть автор, поэтому сначала создаём пользователя.
  // upsert — чтобы повторный запуск не падал на уникальном email.
  const author = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Администратор',
      // Заглушка, а не настоящий хеш: войти под этим пользователем нельзя,
      // пока не появится авторизация с хешированием паролей.
      passwordHash: 'not-a-real-hash',
      role: 'ADMIN',
    },
  });

  const { count } = await prisma.post.createMany({
    data: [
      {
        title: 'Привет, монорепозиторий!',
        content: 'Этот пост создан seed-скриптом и хранится в PostgreSQL.',
        authorId: author.id,
      },
      {
        title: 'NestJS + Prisma',
        content: 'API отдаёт посты через PostsService, который ходит в базу.',
        authorId: author.id,
      },
      {
        title: 'Next.js App Router',
        content:
          'Страница /posts — серверный компонент, получающий этот список.',
        authorId: author.id,
      },
    ],
  });
  console.log(`Seed выполнен: создано постов — ${count}.`);
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
