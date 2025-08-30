# Admin Panel (Backend)

## What is this project?

This repository contains the backend for an Admin Panel built with TypeScript, Express and Prisma. It provides REST APIs for authentication, user management, companies, jobs, messages, workers, wallets, analytics and more. Prisma is used as the ORM with a PostgreSQL-compatible database (the provided .env uses a Neon Postgres connection string).

## Tech stack

- Node.js + TypeScript
- Express 5
- Prisma ORM
- PostgreSQL (Neon recommended based on .env)
- JWT authentication
- Swagger for API docs

## Quick contract (inputs / outputs / success)

- Inputs: HTTP requests (JSON) to REST endpoints.
- Outputs: JSON responses with standardized envelopes (see `src/utils/response.ts`).
- Success: 2xx responses; errors are handled by `src/middlewares/errorHandler.ts` and return non-2xx JSON.

## Prerequisites

- Node.js >= 18 (or LTS) and npm
- A PostgreSQL-compatible database (Neon, Postgres, etc.)
- Git

## Clone repository

Use a bash shell (Windows WSL or Git Bash):

```bash
git clone <REPO_URL> "Admin Panel"
cd "Admin Panel"
```

Replace `<REPO_URL>` with your repo URL.

## Install dependencies

```bash
npm install
```

Note: `postinstall` runs `prisma generate` automatically (see `package.json`).

## Environment

Create a `.env` in the project root with at least the following keys (an example `.env` is included in the repository):

```
DATABASE_URL="postgresql://USER:PASS@HOST:PORT/DBNAME?sslmode=require"
JWT_SECRET=your_secret
```

Adjust `DATABASE_URL` to point to your Postgres database.

## Database setup (Prisma)

If you're developing locally and want an interactive flow:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

For deploying to a remote environment where migrations are already generated, use the provided script:

```bash
npm run migrate
```

To open Prisma Studio (browser UI for your database):

```bash
npm run studio
```

## Seed data

The repository includes a seeder at `src/utils/seed.ts`. Run:

```bash
npm run seed
```

## Run the app

Development (auto-reload):

```bash
npm run dev
```

Build and run production bundle:

```bash
npm run build
npm start
```

Important scripts from `package.json`:

- `dev` – runs `ts-node-dev` for fast TypeScript development
- `build` – runs `tsc` to emit `dist/`
- `start` – runs compiled `dist/server.js`
- `postinstall` – `prisma generate`
- `migrate` – `prisma migrate deploy`
- `seed` – runs the seed script

## API documentation

Swagger is configured (see `src/config/swagger.ts`). When the server is running, check the Swagger UI path (commonly `/docs` or `/api-docs`) depending on how the server mounts it. If you don't see it, open `src/server.ts` or `src/app.ts` to confirm the mount path.

## Folder layout (high level)

- `src/` – TypeScript source
  - `config/` – config and Prisma client wrapper
  - `middlewares/` – auth, validation and error handling
  - `modules/` – grouped feature modules (auth, user, company, job, worker, wallet, etc.)
  - `utils/` – helpers like logger, response, and seed
  - `generated/prisma/` – generated Prisma client

## Environment-specific notes

- JWT: The app uses `JWT_SECRET` from env for signing tokens. Keep it private.
- Prisma client binaries for Windows are included under `src/generated/prisma`; if you switch platforms, regenerate with `prisma generate`.

## Troubleshooting

- Prisma connection errors: verify `DATABASE_URL`, network, and SSL settings. Neon often requires `?sslmode=require`.
- Port already in use: the server port is typically configured in `src/config/env.ts`. Change or free the port.
- TypeScript build issues: run `npm run build` and inspect compiler errors.

## Quality gates / recommended checks

- Build: `npm run build` (PASS/FAIL)
- Typecheck (via `tsc`) is part of build
- Seed: `npm run seed` to ensure DB and models are healthy

## Next steps and suggestions

- Add unit/integration tests (Jest or Vitest).
- Add CI workflow to run `npm run build` + `npm run test` + `prisma migrate deploy` on release.
- Add a `.env.example` for safer onboarding.

---

Requirements coverage:

- Generate README describing the project: Done
- How to clone & run: Done (commands provided)
- How to setup DB & seed: Done
- Additional notes (structure, scripts, troubleshooting): Done

If you want, I can also:

- add a `.env.example` file,
- create a small README badge table, or
- open the Swagger path in `src/server.ts` to confirm the exact docs URL — tell me which next.
