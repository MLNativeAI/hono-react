import { otel } from "@hono/otel";
import {
	adminAuthMiddleware,
	type auth,
	authHandler,
	userAuthMiddleware,
} from "@repo/auth";
import { envVars, logger } from "@repo/shared";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger as honoLogger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { openAPIRouteHandler } from "hono-openapi";
import { corsMiddleware } from "./lib/cors";
import { posthogProxy } from "./lib/posthog-proxy";
import { type InternalRoutes, internalRouter } from "./routes/internal";

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

app.basePath("/api").route("/internal", internalRouter);

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

if (process.env.NODE_ENV === "production") {
	// Serve all static files from the dist directory
	app.use("*", serveStatic({ root: "./dist" }));

	// Serve index.html for all other routes (SPA fallback)
	app.get("*", serveStatic({ path: "./dist/index.html" }));
} else {
	app.get("*", (c) => {
		return c.redirect(envVars.BASE_URL);
	});
}

export type { InternalRoutes };
