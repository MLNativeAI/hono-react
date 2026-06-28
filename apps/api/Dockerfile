FROM oven/bun:1.3.14 AS base
WORKDIR /usr/src/app
ENV TURBO_TELEMETRY_DISABLED=1

# Pruner stage - create minimal workspace for API only
FROM base AS pruner
COPY . .
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bunx turbo@2.9.18 prune @repo/api --docker

# Production dependencies for the release image
FROM base AS prod-deps
WORKDIR /usr/src/app

# Copy the pruned package.json files and lockfile
COPY --from=pruner /usr/src/app/out/json/ .
COPY --from=pruner /usr/src/app/out/bun.lock ./bun.lock

# Install only production dependencies (excludes devDependencies)
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --production --frozen-lockfile

# Build dependencies, including devDependencies needed by turbo/build tools
FROM base AS build-deps
WORKDIR /usr/src/app

COPY --from=pruner /usr/src/app/out/json/ .
COPY --from=pruner /usr/src/app/out/bun.lock ./bun.lock

RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --frozen-lockfile

# Builder stage - build API
FROM base AS builder
WORKDIR /usr/src/app

# Copy the pruned source code
COPY --from=pruner /usr/src/app/out/full/ .
COPY --from=build-deps /usr/src/app/ .

# Build the API using turbo
RUN --mount=type=cache,target=/usr/src/app/.turbo \
  bunx turbo build --filter=@repo/api

# Final production image
FROM oven/bun:1.3.14 AS release
WORKDIR /usr/src/app
ARG VERSION=dev
ARG GIT_SHA=unknown

# Copy production dependencies from installer (no devDependencies)
COPY --from=prod-deps --chown=bun:bun /usr/src/app/node_modules ./node_modules

# Copy built API (only what's needed - not full source)
COPY --from=builder --chown=bun:bun /usr/src/app/apps/api/dist/index.js ./apps/api/dist/index.js

# Copy required packages
COPY --from=builder --chown=bun:bun /usr/src/app/packages ./packages

# Copy and make the startup script executable
COPY --chown=bun:bun apps/api/start.sh .
RUN chmod +x start.sh

# Set production environment
ENV NODE_ENV=production \
  VERSION=$VERSION \
  GIT_SHA=$GIT_SHA

# Switch to non-root user
USER bun

# Expose port
EXPOSE 3000/tcp

# Run the app
ENTRYPOINT ["./start.sh"]
