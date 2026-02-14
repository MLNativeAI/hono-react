import { getOrganizationsByIds } from "@repo/db";
import { logger } from "@repo/shared";
import { envVars } from "@repo/shared/env";
import type { Context } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";
import { auth } from "../index";
import type { UserInvitation } from "../types";

export async function listUserInvitations(c: Context<BlankEnv, "/invitations", BlankInput>) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.redirect("/auth/sign-in");
  }

  const invitations = await auth.api.listUserInvitations({
    query: {
      email: session.user.email,
    },
  });

  const pendingInvitations = invitations.filter((inv) => inv.status === "pending");

  const organizationIds = pendingInvitations.map((invitation) => invitation.organizationId);
  const organizations = await getOrganizationsByIds({
    organizationIds: organizationIds,
  });
  const organizationMap = new Map(organizations.map((org) => [org.id, org]));

  const invitationsWithOrgNames: UserInvitation[] = pendingInvitations.map((invitation) => ({
    ...invitation,
    organizationName: organizationMap.get(invitation.organizationId)?.name || "Unknown",
    expiresAt: invitation.expiresAt.toISOString(),
  }));

  return c.json(invitationsWithOrgNames);
}

export async function handleOrganizationInvite(c: Context<BlankEnv, "/accept-invitation", BlankInput>) {
  logger.debug(`Handling invitation ${c.req.query("invitationId")}`);
  const invitationId = c.req.query("invitationId");

  if (!invitationId) {
    return c.redirect(`${envVars.DASHBOARD_BASE_URL}/auth/sign-in`);
  }

  try {
    const headers = c.req.header();
    const data = await auth.api.acceptInvitation({
      body: {
        invitationId: invitationId,
      },
      headers: headers,
    });
    logger.info(data);
    return c.redirect(`${envVars.DASHBOARD_BASE_URL}/settings/organization`);
  } catch (error) {
    logger.error(error, "Unknown invitation error, redirecting to sign-up");
    return c.redirect(`${envVars.DASHBOARD_BASE_URL}/auth/sign-up`);
  }
}
