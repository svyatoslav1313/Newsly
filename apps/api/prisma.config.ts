import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Конфигурация Prisma CLI (migrate, generate, studio, seed).
// Начиная с Prisma 7 строка подключения задаётся здесь, а не в schema.prisma.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // process.env вместо строгого env() из prisma/config: `prisma generate`
    // база не нужна, и он не должен падать, пока .env ещё не создан.
    url: process.env.DATABASE_URL,
  },
});
