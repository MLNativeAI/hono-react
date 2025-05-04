# Fullstack Hono + React Template

[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black)](https://react.dev)
[![Hono](https://img.shields.io/badge/Hono-E36002.svg?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

A lightning-fast, self-hostable template for building modern Single Page Applications with Hono and React.

## 🚀 Demo

Check it out for yourself: [hono-react.mlnative.com](https://hono-react.mlnative.com)

## 💡 Why?

This template bridges the gap between using a do-it-all framework and having to configure everything on your own. Despite the SSR/ISR/RSC trends, sometimes what you really need is a simple, efficient way to build SPA + backend applications.

### Key Benefits

- Lightning fast for developing SPAs
- Zero cloud-based vendor dependencies
- Self-hostable with ease
- Highly configurable
- Pre-configured essentials without bloat
- Re-deploys in < 1 minute

## ⚡ Technical Features

- Fullstack type safety with [Hono RPC](https://hono.dev/guides/rpc)
- Unified Docker image build for simple deployments
- Built-in auth handling with [BetterAuth](https://github.com/betterstack-community/better-auth) (fully local)
- Type-safe environment variables (not needed at build time)
- Type-safe client-side navigation

## 📦 Template Features

- Sign up & Sign in (extendible with additional BetterAuth providers)
- Dashboard Layout with [Shadcn UI](https://ui.shadcn.com/)
- File handling (upload, storage & retrieval)

> File handling can be particularly annoying to set up, so we've purposefully included this in the "base" template.

## 🛠 Tech Stack

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

The project structure is straightforward with two Bun projects: `backend` and `frontend`.

- In development mode, run them side by side
- In production, frontend gets bundled and served by the backend

### Runtime Dependencies

1. **[PostgreSQL](https://www.postgresql.org/)** - easily swappable with another DB provider (see [Drizzle docs](https://orm.drizzle.team/docs/installation-and-db-connection))
2. **[MinIO](https://min.io/)** - for file storage (self-hostable on [Coolify](https://coolify.io/) or use any S3 provider like [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/))

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) or similar OCI runtime (e.g., [Orbstack](https://orbstack.dev/))
- [Bun](https://bun.sh)

### Local Development

1. Start the DB and Minio instance:
```bash
docker compose up -d
```

2. Set up the backend:
```bash
cd backend
cp .env.example .env  # No modifications required
bun install
bunx drizzle-kit migrate
bun dev
```

3. Run migrations:
```bash
bunx drizzle-kit migrate
```

4. Set up the frontend (in a new terminal):
```bash
cd frontend
bun install
bun dev
```

Your application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

> In development mode, all API requests are automatically proxied to the backend with CORS configured.

## 🚢 Deployment

The project can be deployed to any platform that supports Docker containers ([Coolify](https://coolify.io/), [DigitalOcean](https://www.digitalocean.com/), [Fly.io](https://fly.io/), etc.).

### Building the Docker Image

```bash
docker build -t hono-spa .
```

The application runs on port 3000 by default. The Docker build contains both frontend and backend, with automatic DB migrations on startup.

## 👏 Acknowledgements

This project was largely inspired by [Bun-Hono-React-Expense-Tracker](https://github.com/meech-ward/Bun-Hono-React-Expense-Tracker)