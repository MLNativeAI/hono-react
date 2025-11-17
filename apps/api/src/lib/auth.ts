import { betterAuth, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import { env } from "bun";
import { envVars, logger } from "@repo/shared";
import { admin, apiKey, magicLink, organization } from "better-auth/plugins";
import { matchesPattern } from "../util/pattern";

const publicRoutes = [
  '/api/health',
  '/api/auth/**',
]
export const requireAuth = async (c: any, next: any) => {
  // Skip auth check for public routes
  if (publicRoutes.some(pattern => matchesPattern(c.req.path, pattern))) {
    return next()
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ message: 'Unauthorized' }, 401)
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
};

export const authHandler = async (c: any) => {
  return auth.handler(c.req.raw);
};

export const getUser = async (c: any): Promise<User> => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session.user;
};
