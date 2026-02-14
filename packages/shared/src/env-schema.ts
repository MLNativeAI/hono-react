import { z } from "zod";

export const envSchema = z.object({
  API_BASE_URL: z.string(),
  DASHBOARD_BASE_URL: z.string(),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),

  S3_ENDPOINT: z.url("S3_ENDPOINT must be a valid URL"),
  S3_ACCESS_KEY: z.string().min(1, "S3_ACCESS_KEY is required"),
  S3_SECRET_KEY: z.string().min(1, "S3_SECRET_KEY is required"),
  S3_BUCKET: z.string().min(1, "S3_BUCKET is required"),

  PORT: z.string().regex(/^\d+$/, "Port must be a numeric string").default("3000").transform(Number),
  ENVIRONMENT: z.enum(["dev", "staging", "prod"]).default("dev"),

  // auth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET is required"),

  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.email("FROM_EMAIL must be a valid email address").default("noreply@getrepo.com"),

  AXIOM_TOKEN: z.string().optional(),
  AXIOM_DATASET: z.string().optional(),

  // posthog
  POSTHOG_API_KEY: z.string().optional(),
});

// Export the inferred type for use across packages
export type EnvVars = z.infer<typeof envSchema>;

// Type augmentation for Bun - can be imported by API package
export interface BunEnvModule {
  Env: EnvVars;
}
