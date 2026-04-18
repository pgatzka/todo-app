# Todo App

Personal self-hosted todo app. React + Vite + Tailwind frontend, Node.js + Fastify (TypeScript) backend, Postgres storage.

## Prerequisites

- Node.js 20+
- npm 10+
- A Postgres instance reachable on your network

## Setup

```bash
cp .env.example .env
# edit .env with your Postgres connection details
npm install
```

## Development

```bash
npm run dev
```

Starts the API (default `http://localhost:3001`) and the web app (default `http://localhost:5173`) concurrently. The Vite dev server proxies `/api/*` to the API.

Open `http://localhost:5173` — the landing view calls `GET /api/health` and shows the result, which reports whether the Postgres connection is healthy.

## Checks

```bash
npm run typecheck   # tsc --noEmit across both workspaces
npm run lint        # eslint across the monorepo
```

## Structure

- `apps/api` — Fastify HTTP API, talks to Postgres via `pg`.
- `apps/web` — Vite + React SPA, styled with Tailwind.
- `tsconfig.base.json` — shared TS compiler options extended by each workspace.
- `eslint.config.js` — flat ESLint config applied to the whole monorepo.

## Environment variables

See `.env.example`. Both apps read from the same `.env` at the repo root:

| Var          | Purpose                                |
|--------------|----------------------------------------|
| `PGHOST`     | Postgres host                          |
| `PGPORT`     | Postgres port                          |
| `PGUSER`     | Postgres user                          |
| `PGPASSWORD` | Postgres password                      |
| `PGDATABASE` | Postgres database name                 |
| `API_PORT`   | API server port (default 3001)         |
| `WEB_PORT`   | Vite dev server port (default 5173)    |
