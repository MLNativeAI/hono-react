import { envVars } from "@repo/shared/env";
import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";

const isAllowedOrigin = (origin: string): boolean => {
  if (!origin) return false;

  const allowedOrigins = [envVars.DASHBOARD_BASE_URL];

  // Check exact matches
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  return false;
};

// Cors middleware
export const corsMiddleware: MiddlewareHandler = (c, next) => {
  const origin = c.req.header("Origin");

  if (origin && isAllowedOrigin(origin)) {
    return cors({
      origin: origin,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
      exposeHeaders: ["Content-Length", "Content-Disposition"],
      maxAge: 600,
      credentials: true,
    })(c, next);
  }

  return next();
};
