#!/bin/sh
# Run database migrations
bunx drizzle-kit migrate

# Start the application
exec bun index.ts 