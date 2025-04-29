
# Fullstack Hono + React Template

This is an opinionated template for people who are looking for a Next.js alternative, that:

- is lightning fast for developing SPA's
- has ZERO cloud-based vendor dependencies
- is self-hostable with ease
- is as configurable as possible
- has all the annoying problems already sorted out, while not being bloated with *every-dependency-under-the-sun*
- re-deploys in < 1 minute

## Demo

Check it out for yourself:

hono-fullstack-template.mlnative.com

## Why?

This is a template I've built primarly for my own use. What I've found is that despite all the SSR/ISR/RSC craze, what I really need is a way to build simple SPA + backend applications. This template was created to bridge the gap between using a do-it-all framework and having to configure everything on your own. 

## Technical Features

- Fullstack type safety with Hono RPC
- Unified Docker image build for simple deployments
- Built-in auth handling with BetterAuth (fully local)
- Type-safe environment variables (not needed at build time...)
- Type-safe client-side navigation

## Template features

- Sign up & Sign in (extendible with additional BetterAuth providers)
- Dashboard Layout
- File handling (upload, storage & retrieval)

File handling can be particularly annoying to set up, so I've purposefully decided to implement this in a "base" template.

## Tech Stack

### Backend:

- Bun
- Hono
- DrizzleORM
- BetterAuth
- Zod

### Frontend:

- React 19
- Vite
- TailwindCSS 4
- Shadcn UI
- Tanstack Router
- Tanstack Query

# Project structure and architecture

It's pretty simple - we have two bun projects, `backend` and `frontend`. 

In development mode, you run them side by side. In production, frontend gets bundled and served by the backend. Everything is preconfigured to work out of the box. 

We have two runtime depencies:

- Postgres - you can easily swap this out for another DB provider, see Drizzle docs for details
- Minio - for handling file storage - you can either self-host this on Coolify or use any other s3 provider (Cloudflare R2 etc.)

## Local setup & dev workflow

Requirements:

- Docker or similar OCI runtime (ex. [Orbstack](https://orbstack.dev/))
- Bun

1. Start the DB and Minio instance

`docker compose up -d`

### Start the backend

```sh
cd backend
cp .env.example .env # populate the env vars. No modifications are required
bun install
bunx drizzle-kit migrate # run the DB migrations
bun dev
```

Open up a second terminal

### Start the frontend

```sh
cd frontend
bun install
bun dev
```

The frontend runs on localhost:5173
The backend runs on localhost:3000. 

In development mode, we automatically proxy all API requests to the backend. CORS is already configured. 

## Deployment

I personally deploy this to Coolify, however since this builds into a single docker image you can probably one-click deploy this to any provider (DigitalOcean, Fly.io etc)

### Docker image

The docker build contains both the frontend and the backend. Once the image is built, we automatically run the DB migrations on startup. 

Building the image:

```
docker build -t hono-spa .
```

The application runs on port 3000 by default.

## Acknoledgements

This project was largely inspired by https://github.com/meech-ward/Bun-Hono-React-Expense-Tracker