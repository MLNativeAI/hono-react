# Use the official Bun image
FROM oven/bun:1.3.9 AS base
WORKDIR /usr/src/app

# Install turbo globally with cache mount
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install -g turbo@2.8.3

# Pruner stage - create minimal workspace for API only
FROM base AS pruner
COPY . .
RUN turbo prune @repo/api --docker

# Installer stage - install ONLY production dependencies
FROM base AS installer
WORKDIR /usr/src/app

# Copy the pruned package.json files and lockfile
COPY --from=pruner /usr/src/app/out/json/ .
COPY --from=pruner /usr/src/app/out/bun.lock ./bun.lock

# Install only production dependencies (excludes devDependencies)
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --production

# Builder stage - build API
FROM base AS builder
WORKDIR /usr/src/app

# Copy the pruned source code
COPY --from=pruner /usr/src/app/out/full/ .
# Copy installed dependencies from installer stage
COPY --from=installer /usr/src/app/ .

# Build the API using turbo
RUN turbo build --filter=@repo/api

# Final production image
FROM oven/bun:1.3.9 AS release
WORKDIR /usr/src/app

# Install curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy production dependencies from installer (no devDependencies)
COPY --from=installer --chown=bun:bun /usr/src/app/node_modules ./node_modules

# Copy built API (only what's needed - not full source)
COPY --from=builder --chown=bun:bun /usr/src/app/apps/api/dist/index.js ./apps/api/dist/index.js

# Copy required packages
COPY --from=builder --chown=bun:bun /usr/src/app/packages ./packages

# Copy and make the startup script executable
COPY --chown=bun:bun apps/api/start.sh .
RUN chmod +x start.sh

# Set production environment
ENV NODE_ENV=production

# Switch to non-root user
USER bun

# Expose port
EXPOSE 3000/tcp

# Run the app
ENTRYPOINT ["./start.sh"]
