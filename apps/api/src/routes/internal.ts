import { handleOrganizationInvite, listUserInvitations } from "@repo/auth/invitations";
import { Hono } from "hono";

const app = new Hono();

const router = app
  .get("/accept-invitation", async (c) => {
    return handleOrganizationInvite(c);
  })
  .get("/invitations", async (c) => {
    return listUserInvitations(c);
  });

export { router as internalRouter };
export type InternalRoutes = typeof router;
