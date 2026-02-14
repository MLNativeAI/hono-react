import { handleOrganizationInvite, listUserInvitations } from "@repo/auth/invitations";
import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { z } from "zod";

const app = new Hono();

const router = app
  .get(
    "/accept-invitation",
    describeRoute({
      description: "Accept organization invitation",
      responses: {
        200: {
          description: "Invitation accepted",
        },
        302: {
          description: "Redirect after acceptance",
        },
      },
      hide: true,
    }),
    async (c) => {
      return handleOrganizationInvite(c);
    },
  )
  .get(
    "/invitations",
    describeRoute({
      description: "List user invitations",
      responses: {
        200: {
          description: "List of invitations",
          content: {
            "application/json": {
              schema: resolver(
                z.array(
                  z.object({
                    id: z.string(),
                    email: z.string(),
                    role: z.string().optional(),
                    status: z.string(),
                    expiresAt: z.string(),
                    inviterId: z.string(),
                  }),
                ),
              ),
            },
          },
        },
      },
      hide: true,
    }),
    async (c) => {
      return listUserInvitations(c);
    },
  );

export { router as internalRouter };
export type InternalRoutes = typeof router;
