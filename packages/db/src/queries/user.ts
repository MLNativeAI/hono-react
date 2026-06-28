import { eq } from "drizzle-orm";
import { db } from "../db";
import { invitation, user } from "../schema";

export async function getUserById({ userId }: { userId: string }) {
  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });
  return userData;
}

export async function getUserByEmail({ email }: { email: string }) {
  const userData = await db.query.user.findFirst({
    where: eq(user.email, email),
  });
  return userData;
}

export async function getUserInvitations({ invitationId }: { invitationId: string }) {
  const invitationResponse = await db.query.invitation.findFirst({
    where: eq(invitation.id, invitationId),
  });
  return invitationResponse;
}

/**
 * Returns the user's remembered last-active organization id (a per-user
 * preference, independent of any single session). Used to restore the active
 * org on new sessions.
 */
export async function getUserLastActiveOrg({ userId }: { userId: string }) {
  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: { lastActiveOrganizationId: true },
  });
  return userData?.lastActiveOrganizationId ?? null;
}

/**
 * Persist the user's active-org choice so it can be restored on future sessions.
 */
export async function setUserLastActiveOrg({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string | null;
}) {
  await db.update(user).set({ lastActiveOrganizationId: organizationId }).where(eq(user.id, userId));
}
