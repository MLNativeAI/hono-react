import { envVars } from "@repo/shared";
import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { z } from "zod";

const app = new Hono();

const router = app
	.get(
		"/server-info",
		describeRoute({
			description:
				"Get server information including admin account existence and auth mode",
			responses: {
				200: {
					description: "Successful response",
					content: {
						"application/json": {
							schema: resolver(
								z.object({
									authMode: z.string(),
								}),
							),
						},
					},
				},
			},
			hide: true,
		}),
		async (c) => {
			return c.json({
				authMode: envVars.AUTH_MODE,
			});
		},
	)
	.get(
		"/auth-callback",
		describeRoute({
			description: "Handle authentication callback",
			responses: {
				302: {
					description: "Redirect to base URL",
				},
			},
			hide: true,
		}),
		async (c) => {
			const query = c.req.query();
			const queryString = new URLSearchParams(query).toString();
			return c.redirect(
				`${envVars.BASE_URL}${queryString ? `?${queryString}` : ""}`,
			);
		},
	);

export { router as internalRouter };
export type InternalRoutes = typeof router;
