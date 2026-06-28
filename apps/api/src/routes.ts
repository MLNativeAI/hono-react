import { type auth, authHandler, userAuthMiddleware } from "@repo/auth";
import { env } from "@repo/env";
import { ApiError, ApiErrorCode, logger } from "@repo/shared";
import { Hono } from "hono";
import { logger as honoLogger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { corsMiddleware } from "./lib/cors";
import { type InternalRoutes, internalRouter } from "./routes/internal";
import { type ApiKeysRoutes, v1ApiKeyRouter } from "./routes/v1/api-keys";
import { type ProjectsRoutes, v1ProjectsRouter } from "./routes/v1/projects";

export const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.onError((error, c) => {
  if (error instanceof ApiError) {
    if (error.statusCode >= 500) {
      logger.error(error, "API error");
    }
    error.path ??= c.req.path;
    return c.json(error.toJSON(), error.statusCode);
  }

  logger.error(error, "Unhandled API error");
  return c.json(new ApiError("Internal server error", 500, ApiErrorCode.INTERNAL_ERROR, c.req.path).toJSON(), 500);
});

app.use(secureHeaders());
app.use(
  honoLogger((message) => {
    logger.trace(message);
  }),
);
app.use("/api/*", corsMiddleware);
app.use("/api/v1/*", userAuthMiddleware);
app.on(["POST", "GET"], "/api/auth/*", authHandler);

app.get("/api/health", async (c) => {
  return c.json({
    status: "ok",
  });
});

app.get("/api/info", async (c) => {
  return c.json({
    version: env.VERSION,
    gitSha: env.GIT_SHA,
    environment: env.ENVIRONMENT,
  });
});

app
  .basePath("/api")
  .route("/internal", internalRouter)
  .route("/v1/api-keys", v1ApiKeyRouter)
  .route("/v1/projects", v1ProjectsRouter);

export type { ApiKeysRoutes, InternalRoutes, ProjectsRoutes };
