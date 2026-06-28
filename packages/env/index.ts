import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    API_BASE_URL: z.string(),
    DASHBOARD_BASE_URL: z.string(),
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
    S3_ENDPOINT: z.url(),
    S3_ACCESS_KEY: z.string().min(1),
    S3_SECRET_KEY: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    PORT: z.coerce.number().int().positive().default(3000),
    ENVIRONMENT: z.enum(["dev", "staging", "prod"]).default("dev"),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    MICROSOFT_CLIENT_ID: z.string().optional(),
    MICROSOFT_CLIENT_SECRET: z.string().optional(),
    BETTER_AUTH_SECRET: z.string().min(32),
    RESEND_API_KEY: z.string(),
    FROM_EMAIL: z.email().default("noreply@getrepo.com"),
    AXIOM_TOKEN: z.string().optional(),
    AXIOM_DATASET: z.string().optional(),
    LOG_LEVEL: z.string().default("debug"),
    VERSION: z.string().default("dev"),
    GIT_SHA: z.string().default("unknown"),
  },
  runtimeEnv: process.env,
});
