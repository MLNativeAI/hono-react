# Fullstack Hono + React Template

[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black)](https://react.dev)
[![Hono](https://img.shields.io/badge/Hono-E36002.svg?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444.svg?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/repo)

A lightning-fast, self-hostable template for building modern Single Page Applications with Hono and React, powered by Turborepo for efficient monorepo management.

## Demo

Check it out for yourself: [hono-react.mlnative.com](https://hono-react.mlnative.com)

## Why?

We run plenty of applications. Some are cloud-only, some are on-premise only. We needed a setup that would work for us and allow us to not worry about infra or compatibility. 

## Technical Features

- Fullstack type safety with [Hono RPC](https://hono.dev/guides/rpc)
- Separate production Docker images for the API and dashboard
- Built-in auth handling with [BetterAuth](https://github.com/betterstack-community/better-auth) (fully local)
- Type-safe environment variables (not needed at build time)
- Type-safe client-side navigation
- Efficient dependencies management with Turborepo
- [Semantic release](https://github.com/semantic-release/semantic-release) pipeline with pull request support

## Tech Stack

### Monorepo

- [Turborepo](https://turbo.build/repo) - High-performance monorepo build system
- [Bun](https://bun.sh) - Fast JavaScript runtime with built-in package manager

### Backend

- [Bun](https://bun.sh) - JavaScript runtime & toolkit
- [Hono](https://hono.dev) - Lightweight web framework
- [DrizzleORM](https://orm.drizzle.team) - TypeScript ORM
- [BetterAuth](https://github.com/betterstack-community/better-auth) - Authentication library
- [Zod](https://zod.dev) - TypeScript-first schema validation

### Frontend

- [React 19](https://react.dev) - UI library
- [Vite](https://vitejs.dev) - Build tool
- [TailwindCSS](https://tailwindcss.com) - CSS framework
- [Shadcn UI](https://ui.shadcn.com) - UI component library
- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [TanStack Query](https://tanstack.com/query) - Data synchronization

## 🏗 Project Structure

The project is organized as a Turborepo monorepo with the following structure:

```
├── apps/
│   ├── api/        # Hono API server
│   └── dashboard/  # React Vite application served by Caddy in production
├── packages/
│   ├── auth/       # BetterAuth setup, handlers, and RBAC helpers
│   ├── db/         # Drizzle schema, migrations, and database client
│   ├── email/      # Email rendering and delivery service
│   ├── engine/     # Background workflow engine
│   ├── env/        # Type-safe environment validation
│   ├── queue/      # BullMQ workers and Redis integration
│   ├── shared/     # Shared logger, IDs, errors, and constants
│   ├── tsconfig/   # Shared TypeScript configs
│   └── ui/         # Shared React UI components
├── tests/
│   ├── e2e/
│   └── integration/
└── package.json   # Root workspace configuration
```

- In development mode, run them concurrently with Turborepo
- In production, the API runs on Bun and the dashboard is served as static assets by Caddy

### Runtime Dependencies

1. **[PostgreSQL](https://www.postgresql.org/)** - primary relational database
2. **[Redis](https://redis.io/)** - queue backend for BullMQ workers
3. **S3-compatible storage** - local development uses SeaweedFS; production can use any S3 provider like Cloudflare R2, MinIO, or AWS S3

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) or similar OCI runtime (e.g., [Orbstack](https://orbstack.dev/))
- [Bun](https://bun.sh) 1.3.14

### Local Development

1. Start the local runtime services:
```bash
docker compose up -d
```

This starts PostgreSQL, a separate integration-test PostgreSQL database, Redis, and SeaweedFS for S3-compatible storage.

2. Install dependencies:
```bash
bun install
```

3. Init env vars:
```bash
bun run init
```

You'll need to configure either RESEND_API_KEY or GOOGLE_* credentials for either auth method to work

4. Run migrations:
```bash
bun run db:migrate
```

5. Start the development environment:
```bash
# From project root
bun dev
```

Your application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

> In development mode, all API requests are automatically proxied to the backend with CORS configured.

## 🚢 Deployment

Production is designed around two Dokploy applications/images:

- API: `apps/api/Dockerfile`
- Dashboard: `apps/dashboard/Dockerfile`

There is no production Docker Compose file in this repo. Dokploy owns production service wiring, domains, environment variables, healthchecks, and rolling deployment behavior.

You can verify both Docker images locally with:

```bash
bun run docker
```

This builds:

- `hono-react-api`
- `hono-react-dashboard`

To deploy the current branch to staging, run:

```bash
bun run deploy:staging
```

This uses the GitHub CLI to trigger `.github/workflows/deploy-staging.yml` on the current branch. The workflow builds both Docker images with a `staging-<sha>` tag, deploys them through Dokploy, and verifies the API deployment against `/api/info`.

### Dokploy API Deployment

The API container entrypoint is `apps/api/start.sh`. It runs database migrations first, then starts the compiled API bundle:

```sh
bun run db:migrate
exec bun dist/index.js
```

Use Dokploy's rolling deployment strategy for the API. The intended flow is:

1. The old API container keeps serving traffic.
2. Dokploy starts the new API container.
3. The new container runs migrations before starting the app.
4. The new container should not receive traffic until its healthcheck passes.
5. After migrations complete and the app starts, `/api/health` returns success.
6. Dokploy routes traffic to the new container and stops the old one.

The API also exposes deployment metadata at `/api/info`:

```json
{
  "version": "staging-<sha>",
  "gitSha": "<sha>",
  "environment": "staging"
}
```

Configure the API healthcheck in Dokploy rather than in the Dockerfile. This keeps migration timing environment-specific and avoids rebuilding the image just to tune healthcheck behavior.

Suggested Dokploy healthcheck:

```json
{
  "Test": [
    "CMD",
    "bun",
    "-e",
    "fetch('http://localhost:3000/api/health').then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"
  ],
  "Interval": 30000000000,
  "Timeout": 10000000000,
  "StartPeriod": 60000000000,
  "Retries": 3
}
```

Increase `StartPeriod` if migrations can take longer than 60 seconds.

### Migration Safety

Rolling deployments do not make backward-incompatible migrations safe by themselves. During deployment, the old container may still serve traffic after the new container has migrated the database.

Production migrations should be backward-compatible across at least one rolling deploy:

- Add columns as nullable or with safe defaults before making code depend on them.
- Deploy code that can read/write both old and new shapes when needed.
- Backfill data separately when needed.
- Drop old columns or add strict constraints in a later deployment.

### Required API Environment Variables

Set these in Dokploy for the API app:

```txt
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
S3_ENDPOINT=https://...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=...
API_BASE_URL=https://api.example.com
DASHBOARD_BASE_URL=https://app.example.com
BETTER_AUTH_SECRET=at-least-32-characters
RESEND_API_KEY=
FROM_EMAIL=noreply@example.com
ENVIRONMENT=prod
LOG_LEVEL=info
```

Optional auth provider variables:

```txt
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
```

### Required Dashboard Environment Variables

Set this in Dokploy for the dashboard app:

```txt
VITE_PUBLIC_API_URL=https://api.example.com
```

The dashboard image uses `apps/dashboard/docker-entrypoint.sh` to replace the build-time placeholder with `VITE_PUBLIC_API_URL` at container startup.

## Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following command:

```bash
bunx turbo link
```

## 👏 Acknowledgements

This project was largely inspired by [Bun-Hono-React-Expense-Tracker](https://github.com/meech-ward/Bun-Hono-React-Expense-Tracker)
