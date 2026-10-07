# Newsly

A full-stack news site built as a learning project: a **Next.js** frontend, a
**NestJS** REST API and **PostgreSQL** through **Prisma**, all in one
TypeScript monorepo.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

> **Status:** work in progress. The news interface currently runs on mock data,
> and the API has no authentication yet. See [Roadmap](#roadmap).

## Features

**Frontend**

- News feed with categories and search, article pages with likes and comments
- Sign-in and registration forms, admin panel for creating and editing news
- Light and dark themes, applied before first paint
- Responsive layout from 360 px up, with animations that respect
  `prefers-reduced-motion`
- A `/posts` page wired to the real API, as an end-to-end example

**Backend**

- REST API with request validation and consistent HTTP errors
- Users: registration with bcrypt password hashing, profile update, password
  change with current-password check
- Posts linked to their author; deleting a user keeps their posts
- Versioned database schema with Prisma migrations and a seed script

## Tech stack

| Layer    | Technology                                                        |
| -------- | ----------------------------------------------------------------- |
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4, Motion         |
| Backend  | NestJS 12 (ESM), class-validator, bcrypt                          |
| Database | PostgreSQL, Prisma 7 with the `pg` driver adapter                 |
| Tooling  | pnpm workspaces, Turborepo, TypeScript 6 (strict), ESLint, oxlint |

## Project structure

```
├── apps/
│   ├── web/                  Next.js app, port 3000
│   │   ├── app/              routes: /, /news/[slug], /login, /register,
│   │   │                     /admin, /posts
│   │   ├── components/       UI components (ui/ holds the base primitives)
│   │   └── lib/              API client, mock data, client-side store, types
│   └── api/                  NestJS app, port 3001, global prefix /api
│       ├── prisma/           schema.prisma, migrations, seed.ts
│       ├── prisma.config.ts  Prisma CLI configuration
│       └── src/
│           ├── prisma/       PrismaService and the global PrismaModule
│           ├── health/       health check
│           ├── posts/        posts module (controller, service, DTO)
│           └── users/        users module (controller, service, DTOs)
├── packages/
│   ├── shared/               @my-project/shared: types and constants
│   └── tsconfig/             @my-project/tsconfig: base TypeScript configs
├── pnpm-workspace.yaml
└── turbo.json
```

## Getting started

**Prerequisites:** Node.js 22.12 or newer, pnpm 12 and a local PostgreSQL
server. Docker is not used.

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create the environment files from the templates:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   ```

3. Put your PostgreSQL password into `DATABASE_URL` in `apps/api/.env`:

   ```
   DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/my_project"
   ```

   The database itself is created by the first migration. Special characters
   in the password must be URL-encoded (for example `@` becomes `%40`).

4. Apply the migrations and seed the database:

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

   The seed creates one admin user and three posts. It does nothing if posts
   already exist.

5. Start everything in development mode:

   ```bash
   pnpm dev
   ```

   - Frontend: http://localhost:3000
   - API health check: http://localhost:3001/api/health

## Scripts

Run all commands from the repository root.

| Command             | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `pnpm dev`          | Start web, api and the shared package in watch mode   |
| `pnpm build`        | Build every package in dependency order               |
| `pnpm lint`         | Lint the code (ESLint in web, oxlint in api)          |
| `pnpm format`       | Format the repository with Prettier                   |
| `pnpm format:check` | Check formatting without writing changes              |
| `pnpm db:migrate`   | Create and apply a migration after editing the schema |
| `pnpm db:generate`  | Regenerate the Prisma Client                          |
| `pnpm db:seed`      | Fill the database with sample data                    |
| `pnpm db:studio`    | Open Prisma Studio to browse the data                 |

To run a script in a single app, use `pnpm --filter web <script>` or
`pnpm --filter api <script>`.

## Environment variables

| File                  | Variable              | Default                     | Purpose                        |
| --------------------- | --------------------- | --------------------------- | ------------------------------ |
| `apps/api/.env`       | `DATABASE_URL`        | none (required)             | PostgreSQL connection string   |
| `apps/api/.env`       | `PORT`                | `3001`                      | Port the API listens on        |
| `apps/api/.env`       | `CORS_ORIGIN`         | `http://localhost:3000`     | Origin allowed to call the API |
| `apps/web/.env.local` | `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | Base URL of the API            |

## API reference

All routes are served under the `/api` prefix. Errors are returned as
`{ "message", "error", "statusCode" }`.

### Health

| Method | Path      | Description                               |
| ------ | --------- | ----------------------------------------- |
| `GET`  | `/health` | Application and database connection state |

### Posts

| Method   | Path         | Description                         |
| -------- | ------------ | ----------------------------------- |
| `GET`    | `/posts`     | List posts, newest first            |
| `GET`    | `/posts/:id` | Get one post                        |
| `POST`   | `/posts`     | Create a post: `{ title, content }` |
| `DELETE` | `/posts/:id` | Delete a post, responds with `204`  |

### Users

| Method   | Path                  | Description                                                      |
| -------- | --------------------- | ---------------------------------------------------------------- |
| `GET`    | `/users`              | List users, newest first                                         |
| `GET`    | `/users/count`        | Number of registered users                                       |
| `GET`    | `/users/:id`          | Get one user                                                     |
| `POST`   | `/users`              | Register: `{ email, name, password }`, password of 8+ characters |
| `PATCH`  | `/users/:id`          | Update `name` and/or `email`                                     |
| `PATCH`  | `/users/:id/password` | Change password: `{ currentPassword, newPassword }`, `204`       |
| `DELETE` | `/users/:id`          | Delete a user; their posts stay with an empty author             |

Password hashes are never included in responses.

## Database

The schema lives in `apps/api/prisma/schema.prisma`.

| Model  | Fields                                                              |
| ------ | ------------------------------------------------------------------- |
| `User` | `id`, `email` (unique), `name`, `passwordHash`, `role`, `createdAt` |
| `Post` | `id`, `title`, `content`, `createdAt`, `authorId` (optional)        |

`role` is an enum of `USER` and `ADMIN`. A user has many posts; when a user is
deleted, `authorId` of their posts is set to `NULL`.

## Architecture notes

- **Compiled shared package.** `packages/shared` is built with `tsc` into
  `dist/`, and both apps import the compiled JavaScript with its types.
  Turborepo builds it before anything that depends on it.
- **ESM on the backend.** The API and the shared package use `nodenext`
  module resolution, so relative imports end in `.js`.
- **Prisma 7.** The client is generated into `apps/api/src/generated/prisma`
  and is not committed. The connection goes through the `@prisma/adapter-pg`
  driver adapter, and the CLI reads `DATABASE_URL` from `prisma.config.ts`.
- **Design tokens.** Colours, radii and shadows are CSS variables in
  `apps/web/app/globals.css`, mapped to Tailwind classes with `@theme`. The
  dark theme overrides the same variables through `data-theme` on `<html>`.
- **Mock store as a seam.** The news interface reads from a client-side store
  in `apps/web/lib/store.tsx`. Replacing its function bodies with API calls is
  the planned path to a real backend.

## Roadmap

- [ ] Authentication and role-based access to the admin panel
- [ ] News, categories and comments in the database and the API
- [ ] Connect the news interface to the API instead of mock data
- [ ] Show the post author on the frontend
