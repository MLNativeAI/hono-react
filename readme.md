# Fullstack Hono + React Template

[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black)](https://react.dev)
[![Hono](https://img.shields.io/badge/Hono-E36002.svg?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444.svg?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/repo)

A lightning-fast, self-hostable template for building modern Single Page Applications with Hono and React, powered by Turborepo for efficient monorepo management.

## 🚀 Demo

Check it out for yourself: [hono-react.mlnative.com](https://hono-react.mlnative.com)

## 💡 Why?
****
This template bridges the gap between using a do-it-all framework and having to configure everything on your own. Despite the SSR/ISR/RSC trends, sometimes what you really need is a simple, efficient way to build SPA + backend applications.

### Key Benefits

- Lightning fast for developing SPAs with Turborepo's caching
- Self-hostable with ease
- Highly configurable monorepo structure

## Technical Features

- Fullstack type safety with [Hono RPC](https://hono.dev/guides/rpc)
- Unified Docker image build for simple deployments
- Built-in auth handling with [BetterAuth](https://github.com/betterstack-community/better-auth) (fully local)
- Type-safe environment variables (not needed at build time)
- Type-safe client-side navigation
- Efficient dependencies management with Turborepo
- [Semantic release](https://github.com/semantic-release/semantic-release) pipeline with pull request support

### Built-in job processor

This template uses [BullMQ](https://docs.bullmq.io/) and [Redis](https://redis.io/) for handling long-running and scheduled operations. You  can use this for any workflows, long running tasks or scheduled tasks (ex. sending delayed emails)

## Other features

- Pre-configured telemetry with Posthog and internal proxy for maximum delivarability
- Linting & Typechecking

### Organization support

The app handles multi-tenancy by default, including:

- Org-level API Keys
- Automatic invite handling
- Invitation emails
- Role support
- Automatic org creation based on domain

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
│   ├── dashboard/  # React Vite application
│   └── api/   # Hono API server
├── packages/
│   └── shared/    # Shared types and utilities
└── package.json   # Root workspace configuration
```

- In development mode, run them concurrently with Turborepo
- In production, frontend gets bundled and served by the backend

### Runtime Dependencies

1. **[PostgreSQL](https://www.postgresql.org/)** - easily swappable with another DB provider (see [Drizzle docs](https://orm.drizzle.team/docs/installation-and-db-connection))
2. **[MinIO](https://min.io/)** - for file storage (self-hostable on [Coolify](https://coolify.io/) or use any S3 provider like [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/))

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) or similar OCI runtime (e.g., [Orbstack](https://orbstack.dev/))
- [Bun](https://bun.sh) (v1.2.0 or later)

### Local Development

1. Start the DB and Minio instance:
```bash
docker compose up -d
```

2. Install dependencies:
```bash
bun install
```

3. Init env vars: 
```bash
bun run init

You'll need to configure either RESEND_API_KEY or GOOGLE_* credentials for either auth method to work


4. Run migrations:
```bash
bun db:migrate
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

TODO needs update after we move to separate docker images

## Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following command:

```bash
bunx turbo link
```

## 👏 Acknowledgements

This project was largely inspired by [Bun-Hono-React-Expense-Tracker](https://github.com/meech-ward/Bun-Hono-React-Expense-Tracker)
