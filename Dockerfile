# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install backend dependencies
FROM base AS backend-deps
RUN mkdir -p /temp/dev
COPY backend/package.json backend/bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY backend/package.json backend/bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Install frontend dependencies and build
FROM base AS frontend-build
WORKDIR /usr/src/app
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile
COPY frontend/ .
RUN bun run build

# Setup backend with dev dependencies for building
FROM base AS backend-build
WORKDIR /usr/src/app
COPY --from=backend-deps /temp/dev/node_modules node_modules
COPY backend/ .

# Final production image
FROM base AS release
WORKDIR /usr/src/app/backend

# Copy backend production dependencies and source
COPY --from=backend-deps /temp/prod/node_modules node_modules
COPY --from=backend-build /usr/src/app/ .

# Copy frontend build output into backend/public
COPY --from=frontend-build /usr/src/app/dist ./public

# Make the startup script executable
COPY start.sh .
RUN chmod +x start.sh

# Run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "./start.sh" ]