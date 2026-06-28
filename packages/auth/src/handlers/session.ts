import { getUserById, getUserLastActiveOrg, getUserOrganizations, setUserLastActiveOrg } from "@repo/db";
import { logger } from "@repo/shared";
import { slugify } from "@repo/shared/id";
import type { AuthContext } from "@repo/shared/types";
import type { Context } from "hono";
import { auth } from "../index";
import { detectOrgNameFromEmail } from "../util/email";

const ROLE_PRIORITY: Record<string, number> = { owner: 0, admin: 1, member: 2 };

/**
 * Returns the organization id that should be active for a user's new session.
 *
 * Preference order:
 *   1. The user's remembered `lastActiveOrganizationId` (if they're still a member).
 *   2. A deterministic default (an org they own, else most recent).
 *   3. A freshly-created personal org derived from their email domain.
 *
 * The chosen id is persisted back to the user record so subsequent sessions
 * restore the same org, and so manual switches (mirrored via the
 * `session.update` hook) aren't reset on every login.
 */
export const getDefaultOrgOrCreate = async (userId: string): Promise<string | null> => {
  try {
    // 1. Restore the remembered preference if the user is still a member.
    const rememberedOrgId = await getUserLastActiveOrg({ userId });
    if (rememberedOrgId) {
      const userOrgs = await getUserOrganizations({ userId });
      const isStillMember = userOrgs.some((o) => o.organizationId === rememberedOrgId);
      if (isStillMember) {
        return rememberedOrgId;
      }
      // Stale preference (user left/was removed) — clear it and fall through.
      logger.debug({ userId, rememberedOrgId }, "Stale lastActiveOrganizationId, recomputing default");
    }

    // 2. Deterministic default: prefer an org the user owns, then most recent.
    const userOrgs = await getUserOrganizations({ userId });
    if (userOrgs.length > 0) {
      const sorted = [...userOrgs].sort((a, b) => {
        const roleDiff = (ROLE_PRIORITY[a.role] ?? 3) - (ROLE_PRIORITY[b.role] ?? 3);
        if (roleDiff !== 0) return roleDiff;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
      const defaultOrgId = sorted[0]?.organizationId;
      if (defaultOrgId) {
        await setUserLastActiveOrg({ userId, organizationId: defaultOrgId });
        return defaultOrgId;
      }
    }

    // 3. No orgs at all — create a personal one.
    const userData = await getUserById({ userId });
    const orgName = userData?.email ? await detectOrgNameFromEmail(userData.email) : "Default";
    const { id: organizationId } = await auth.api.createOrganization({
      body: {
        name: orgName,
        slug: slugify(orgName),
        userId,
      },
    });
    await setUserLastActiveOrg({ userId, organizationId });
    logger.info({ organizationId, userId, orgName }, "Created default organization");
    return organizationId;
  } catch (error) {
    logger.error(error, "Create org failed:");
    return null;
  }
};

export const getUserIfLoggedIn = async (c: Context): Promise<string | undefined> => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return undefined;
  }
  return session.user.id;
};

export const getAuthContext = async (c: Context): Promise<AuthContext> => {
  const authContext: AuthContext = c.get("context");
  if (!authContext) {
    throw new Error("AuthContext not found");
  }
  return authContext;
};
