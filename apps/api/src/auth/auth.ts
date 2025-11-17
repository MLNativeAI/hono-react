
import { betterAuth, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import { env } from "bun";
import { envVars, logger } from "@repo/shared";
import { admin, apiKey, magicLink, organization } from "better-auth/plugins";
import { matchesPattern } from "../util/pattern";

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: sendPasswordResetEmail,
    onPasswordReset: async ({ user }, _) => {
      logger.info(`Password for user ${user.email} has been reset.`);
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      enabled: envVars.GOOGLE_CLIENT_ID !== undefined && envVars.GOOGLE_CLIENT_SECRET !== undefined,
      clientId: envVars.GOOGLE_CLIENT_ID || "",
      clientSecret: envVars.GOOGLE_CLIENT_SECRET || "",
    },
    microsoft: {
      enabled: envVars.MICROSOFT_CLIENT_ID !== undefined && envVars.MICROSOFT_CLIENT_SECRET !== undefined,
      clientSecret: envVars.MICROSOFT_CLIENT_SECRET || "",
      clientId: envVars.MICROSOFT_CLIENT_ID || "",
    },
  },
  trustedOrigins: [envVars.BASE_URL],
  plugins: [
    apiKey({
      rateLimit: {
        enabled: true,
        timeWindow: 60000,
        maxRequests: 100,
      },
    }),
    magicLink({
      sendMagicLink: sendMagicLink,
    }),
  ],
});

