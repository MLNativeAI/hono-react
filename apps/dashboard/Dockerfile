# Use the official Bun image
FROM oven/bun:1.3.4 AS base
WORKDIR /usr/src/app

# Install turbo globally with cache mount
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install -g turbo@2.8.3

# Pruner stage - create minimal workspace for dashboard only
FROM base AS pruner
COPY . .
RUN turbo prune @repo/dashboard --docker

# Installer stage - install ONLY production dependencies
FROM base AS installer
WORKDIR /usr/src/app

# Copy the pruned package.json files and lockfile
COPY --from=pruner /usr/src/app/out/json/ .
COPY --from=pruner /usr/src/app/out/bun.lock ./bun.lock

# Install all dependencies (including devDependencies for build)
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install 

# Builder stage - build dashboard
FROM base AS builder
WORKDIR /usr/src/app

# Copy the pruned source code
COPY --from=pruner /usr/src/app/out/full/ .
# Copy installed dependencies from installer stage
COPY --from=installer /usr/src/app/ .

# Build the dashboard using turbo
RUN turbo build --filter=@repo/dashboard

# Final production image - use Caddy to serve static files
FROM caddy:alpine AS release

# Install curl
RUN apk add --no-cache curl

# Copy Caddyfile
COPY apps/dashboard/Caddyfile /etc/caddy/Caddyfile

# Copy built dashboard assets to Caddy html directory
COPY --from=builder /usr/src/app/apps/dashboard/dist /usr/share/caddy/html

# Expose HTTP port
EXPOSE 80

# Run Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
