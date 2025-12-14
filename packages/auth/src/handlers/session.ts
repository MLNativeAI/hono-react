import { createOrganization, createOrganizationMember, getUserById, getUserOrganizations } from "@repo/db";
import { logger } from "@repo/shared";
import type { AuthContext } from "@repo/shared/types";
import type { Context } from "hono";
import { auth } from "../auth";
import { detectOrgNameFromEmail } from "../util/email";

export const getDefaultOrgOrCreate = async (userId: string) => {
  try {
    const userOrgs = await getUserOrganizations({ userId: userId });
    if (userOrgs.length > 0) {
      return userOrgs[0]?.organizationId;
    } else {
      const userData = await getUserById({ userId: userId });
      const orgName = userData?.email ? await detectOrgNameFromEmail(userData?.email) : "Default";
      const { id: organizationId } = await createOrganization({
        name: orgName,
      });
      await createOrganizationMember({
        organizationId: organizationId,
        userId: userId,
        role: "owner",
      });
      logger.info({ organizationId, userId, orgName }, "Create new organization");
      return organizationId;
    }
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
