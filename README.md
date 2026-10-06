# My Project

Учебный фулстек-монорепозиторий: **Next.js** (фронтенд) + **NestJS** (бэкенд) +
**PostgreSQL** через **Prisma**. Всё на TypeScript в strict-режиме.

В проекте уже есть рабочий пример «от базы до экрана»: модель `Post` в базе →
CRUD-модуль `posts` в API → страница `/posts` со списком и формой создания.

## Структура

```
├── apps/
│   ├── web/                  Next.js (App Router, Tailwind CSS, ESLint), порт 3000
│   │   ├── app/              страницы: `/` и `/posts`
│   │   └── lib/api.ts        обёртка над fetch для запросов к API
│   └── api/                  NestJS, порт 3001, префикс /api
│       ├── prisma/           schema.prisma, миграции, seed.ts
│       ├── prisma.config.ts  настройки Prisma CLI (откуда брать DATABASE_URL и т. д.)
│       └── src/
│           ├── main.ts       запуск: префикс, CORS, ValidationPipe
│           ├── app.module.ts корневой модуль
│           ├── prisma/       PrismaService + глобальный PrismaModule
│           ├── health/       GET /api/health
│           ├── posts/        пример модуля: controller, service, DTO
│           └── generated/    Prisma Client (генерируется, в git не попадает)
├── packages/
│   ├── shared/               @my-project/shared — общие типы и константы
│   └── tsconfig/             @my-project/tsconfig — базовые настройки TypeScript
├── pnpm-workspace.yaml       список пакетов монорепозитория
├── turbo.json                задачи Turborepo (build, dev, lint)
└── package.json              корневые скрипты
```

## Запуск с нуля

Нужны: **Node.js 22.12+**, **pnpm 12** и локально установленный **PostgreSQL**
(Docker не используется).

1. Установить зависимости:

   ```bash
   pnpm install
   ```

2. Создать файлы окружения из шаблонов:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   ```

3. В `apps/api/.env` вписать свой пароль в `DATABASE_URL`:

   ```
   DATABASE_URL="postgresql://postgres:ПАРОЛЬ@localhost:5432/my_project"
   ```

   Базу `my_project` создавать вручную не нужно — Prisma создаст её при первой
   миграции. Если в пароле есть спецсимволы (`@`, `#`, `/`, `:` …), их нужно
   закодировать (например, `@` → `%40`).

4. Применить миграции (создаст базу и таблицы):

   ```bash
   pnpm db:migrate
   ```

5. Заполнить базу тестовыми постами:

   ```bash
   pnpm db:seed
   ```

6. Запустить всё в режиме разработки:

   ```bash
   pnpm dev
   ```

   - фронтенд: http://localhost:3000/posts
   - проверка API: http://localhost:3001/api/health

## Скрипты

Все команды запускаются из корня репозитория.

| Команда             | Что делает                                                                  |
| ------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`          | Запускает web, api и пересборку shared одновременно, с авто-перезагрузкой   |
| `pnpm build`        | Собирает все пакеты в правильном порядке (shared → api, web)                |
| `pnpm lint`         | Проверяет код: ESLint в web, oxlint в api                                   |
| `pnpm format`       | Форматирует весь репозиторий через Prettier                                 |
| `pnpm format:check` | Проверяет форматирование, ничего не меняя                                   |
| `pnpm db:migrate`   | `prisma migrate dev` — создаёт и применяет миграцию после правки схемы      |
| `pnpm db:generate`  | `prisma generate` — пересоздаёт Prisma Client по схеме                      |
| `pnpm db:studio`    | Открывает Prisma Studio — веб-интерфейс для просмотра данных                |
| `pnpm db:seed`      | Запускает `apps/api/prisma/seed.ts` (ничего не делает, если посты уже есть) |

Запустить команду только в одном приложении: `pnpm --filter api <скрипт>` или
`pnpm --filter web <скрипт>`. Так же ставятся зависимости:
`pnpm --filter web add <пакет>`.

## API

| Метод и путь            | Описание                                             |
| ----------------------- | ---------------------------------------------------- |
| `GET /api/health`       | Статус приложения и подключения к базе               |
| `GET /api/posts`        | Список постов (новые сверху)                         |
| `GET /api/posts/:id`    | Один пост, `404`, если не найден                     |
| `POST /api/posts`       | Создать пост: `{ "title": "...", "content": "..." }` |
| `DELETE /api/posts/:id` | Удалить пост, ответ `204`                            |

## Как добавить новый модуль в NestJS

Смотрите на `apps/api/src/posts` как на образец. Пример — модуль `comments`:

1. Если нужна новая таблица — опишите модель в `apps/api/prisma/schema.prisma`
   и выполните `pnpm db:migrate` (спросит имя миграции, заодно обновит Prisma
   Client).
2. Сгенерируйте заготовки (из папки `apps/api`):

   ```bash
   pnpm nest g module comments
   pnpm nest g controller comments --no-spec
   pnpm nest g service comments --no-spec
   ```

   CLI сам добавит `CommentsModule` в `imports` в `app.module.ts`.

3. Создайте DTO в `comments/dto/` — класс с декораторами `class-validator`.
   Глобальный `ValidationPipe` проверит по нему тело запроса.
4. В сервисе получите `PrismaService` через конструктор. Импортировать
   `PrismaModule` не нужно — он глобальный.

**Важно:** API — это ESM-проект, поэтому относительные импорты пишутся с
расширением `.js`, даже если файл называется `.ts`:

```ts
import { CommentsService } from './comments.service.js';
```

## Как добавить новую страницу в Next.js

В App Router путь страницы определяется папкой. Страница `/about` — это файл
`apps/web/app/about/page.tsx`:

```tsx
export default function AboutPage() {
  return <h1 className="text-2xl font-semibold">О проекте</h1>;
}
```

- По умолчанию компонент **серверный**: в нём можно делать `await api.getPosts()`
  прямо в теле функции (см. `app/posts/page.tsx`).
- Если нужны `useState`, обработчики событий и т. п. — вынесите эту часть в
  отдельный файл с `'use client'` в первой строке (см.
  `app/posts/create-post-form.tsx`).
- Новые запросы к API добавляйте в `apps/web/lib/api.ts`.
- Ссылку в шапку — в `app/layout.tsx`.

## Как добавить общий тип в packages/shared

1. Создайте или дополните файл в `packages/shared/src`, например `comment.ts`:

   ```ts
   export interface Comment {
     id: number;
     text: string;
   }
   ```

2. Экспортируйте его из `packages/shared/src/index.ts` (тоже с `.js`):

   ```ts
   export * from './comment.js';
   ```

3. Импортируйте в любом приложении:

   ```ts
   import type { Comment } from '@my-project/shared';
   ```

При запущенном `pnpm dev` пакет пересобирается сам. Чтобы подключить
`@my-project/shared` к новому приложению, добавьте в его `package.json`
`"@my-project/shared": "workspace:*"` и выполните `pnpm install`.

## Ключевые решения

- **pnpm workspaces + Turborepo.** pnpm связывает пакеты между собой
  (`workspace:*`), а Turborepo запускает задачи в нужном порядке и кэширует
  результат: `build` приложения всегда ждёт сборки `shared`.
- **`shared` — компилируемый пакет.** Он собирается через `tsc` в `dist/`, и
  приложения импортируют готовый JavaScript + типы. Причина: NestJS запускается
  обычным Node.js, который не умеет импортировать `.ts` из другого пакета. В
  dev-режиме `tsc --watch` пересобирает пакет на лету, а перед `dev`/`build`
  Turborepo собирает его заранее.
- **Тип `Post` в `shared` описывает JSON, а не строку таблицы.** Поэтому
  `createdAt` там `string`: дата по сети передаётся строкой. Внутри API для
  работы с базой используются типы, сгенерированные Prisma.
- **API — ESM-проект** (`"type": "module"`). Так его создаёт актуальный
  `nest new` (NestJS 12), и так проще с Prisma 7, которая генерирует ESM-код.
  Отсюда `.js` в импортах.
- **Prisma 7.** Клиент генерируется в `apps/api/src/generated/prisma` (не в
  `node_modules`) и в git не хранится — его создаёт `prisma generate`, который
  Turborepo запускает перед `dev`, `build` и `lint`. Подключение к базе идёт
  через драйвер-адаптер `@prisma/adapter-pg`, а `DATABASE_URL` для CLI читается
  в `prisma.config.ts`.
- **Два линтера.** В web — ESLint с конфигом Next.js, в api — oxlint. Оба
  варианта взяты из официальных шаблонов (`create-next-app` и `nest new`).
- **TypeScript 6.0**, а не 7.0: на момент создания проекта инструменты ESLint
  для TypeScript и Nest CLI ещё не поддерживают 7-ю версию.
- **Страница `/posts` — `force-dynamic`.** Она рендерится на каждый запрос, так
  что список всегда свежий и `pnpm build` не требует запущенного API.
- **Форма отправляет запрос из браузера напрямую в API** — поэтому в NestJS
  включён CORS для `http://localhost:3000` (меняется через `CORS_ORIGIN`).
