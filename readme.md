# Fullstack Hono + React Template

[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black)](https://react.dev)
[![Hono](https://img.shields.io/badge/Hono-E36002.svg?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

A lightning-fast, self-hostable template for building modern Single Page Applications with Hono and React.

## 🚀 Demo

Check it out for yourself: [hono-fullstack-template.mlnative.com](https://hono-fullstack-template.mlnative.com)

## 💡 Why?

This template bridges the gap between using a do-it-all framework and having to configure everything on your own. Despite the SSR/ISR/RSC trends, sometimes what you really need is a simple, efficient way to build SPA + backend applications.

### Key Benefits

- ⚡ Lightning fast for developing SPAs
- 🏠 Zero cloud-based vendor dependencies
- 🛠 Self-hostable with ease
- ⚙️ Highly configurable
- 🎯 Pre-configured essentials without bloat
- 🚄 Re-deploys in < 1 minute

## 🔥 Technical Features

- 📘 Fullstack type safety with Hono RPC
- 🐳 Unified Docker image build for simple deployments
- 🔒 Built-in auth handling with BetterAuth (fully local)
- 🔐 Type-safe environment variables (not needed at build time)
- 🧭 Type-safe client-side navigation

## 📦 Template Features

- 🔑 Sign up & Sign in (extendible with additional BetterAuth providers)
- 📊 Dashboard Layout
- 📁 File handling (upload, storage & retrieval)

> File handling can be particularly annoying to set up, so we've purposefully included this in the "base" template.

## 🛠 Tech Stack

### Backend

- 🏃 Bun
- 🚀 Hono
- 🗃️ DrizzleORM
- 🔐 BetterAuth
- ✅ Zod

### Frontend

- ⚛️ React 19
- ⚡ Vite
- 🎨 TailwindCSS 4
- 🎯 Shadcn UI
- 🔄 Tanstack Router
- 📊 Tanstack Query

## 🏗 Project Structure

The project structure is straightforward with two Bun projects: `backend` and `frontend`.

- In development mode, run them side by side
- In production, frontend gets bundled and served by the backend

### Runtime Dependencies

1. **Postgres** - easily swappable with another DB provider (see Drizzle docs)
2. **Minio** - for file storage (self-hostable on Coolify or use any S3 provider like Cloudflare R2)

## 🚀 Getting Started

### Prerequisites

- Docker or similar OCI runtime (e.g., [Orbstack](https://orbstack.dev/))
- Bun

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

3. Set up the frontend (in a new terminal):
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

The project can be deployed to any platform that supports Docker containers (Coolify, DigitalOcean, Fly.io, etc.).

### Building the Docker Image

```bash
docker build -t hono-spa .
```

The application runs on port 3000 by default. The Docker build contains both frontend and backend, with automatic DB migrations on startup.

## 👏 Acknowledgements

This project was largely inspired by [Bun-Hono-React-Expense-Tracker](https://github.com/meech-ward/Bun-Hono-React-Expense-Tracker)