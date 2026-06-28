/**
 * Preload: satisfies @repo/env's eager validation and points every package at
 * the throwaway integration-test database BEFORE any @repo/* module is imported.
 *
 * Run with: bun test --preload ./test-setup.ts
 * The db-test compose service must be up (docker compose up -d postgres-test).
 */
import { resolve } from "node:path";

process.env.API_BASE_URL = "http://localhost:3000";
process.env.DASHBOARD_BASE_URL = "http://localhost:5173";
// Dedicated test database (docker-compose `postgres-test` service).
process.env.DATABASE_URL =
  process.env.INTEGRATION_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5433/app_test";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.S3_ENDPOINT = "http://localhost:9000";
process.env.S3_ACCESS_KEY = "test-access-key";
process.env.S3_SECRET_KEY = "test-secret-key";
process.env.S3_BUCKET = "test-bucket";
// 32+ chars, satisfies BETTER_AUTH_SECRET validation.
process.env.BETTER_AUTH_SECRET = "test-secret-that-is-at-least-32-chars-long";
// Empty key => @repo/email makes `resend` null and no-ops all sends.
process.env.RESEND_API_KEY = "";
process.env.FROM_EMAIL = "test@example.com";
process.env.ENVIRONMENT = "dev";
process.env.LOG_LEVEL = "warn";
// Enables better-auth's testUtils plugin (createUser/login/getAuthHeaders).
process.env.ENABLE_TEST_UTILS = "1";

// Expose the migrations folder absolutely so the drizzle migrator can find it.
process.env.MIGRATIONS_FOLDER = resolve(import.meta.dir, "../../packages/db/migrations");
