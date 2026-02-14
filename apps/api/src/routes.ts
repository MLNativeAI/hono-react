import { otel } from "@hono/otel";
import { adminAuthMiddleware, type auth, authHandler, userAuthMiddleware } from "@repo/auth";
import { logger } from "@repo/shared";
import { Hono } from "hono";
import { logger as honoLogger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { openAPIRouteHandler } from "hono-openapi";
import { corsMiddleware } from "./lib/cors";
import { posthogProxy } from "./lib/posthog-proxy";
import { type InternalRoutes, internalRouter } from "./routes/internal";
import { type ApiKeysRoutes, v1ApiKeyRouter } from "./routes/v1/api-keys";

export const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use("*", otel());
app.use(poweredBy({ serverName: "mlnative.com" }));
app.use(
  honoLogger((message) => {
    logger.trace(message);
  }),
);
app.use("/api/*", corsMiddleware);
app.use("/api/v1/*", userAuthMiddleware);
app.use("/api/v1/admin/*", adminAuthMiddleware);
app.on(["POST", "GET"], "/api/auth/*", authHandler);

app.route("/ph", posthogProxy);

app.get("/api/health", async (c) => {
  return c.json({
    status: "ok",
  });
});

app.basePath("/api").route("/internal", internalRouter).route("/v1/api-keys", v1ApiKeyRouter);

app.get(
  "/openapi",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: "Hono React API",
        version: "1.0.0",
        description: "",
      },
      components: {
        securitySchemes: {
          apiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "x-api-key",
          },
        },
      },
      security: [
        {
          apiKeyAuth: [],
        },
      ],
      servers: [
        {
          url: "https://hono-react.mlnative.com",
          description: "Production Server",
        },
      ],
    },
  }),
);

export type { InternalRoutes };
export type { ApiKeysRoutes };
