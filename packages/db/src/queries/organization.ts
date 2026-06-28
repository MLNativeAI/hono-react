import { eq } from "drizzle-orm";
import { db } from "../db";
import { member, organization } from "../schema";

export async function getUserOrganizations({ userId }: { userId: string }) {
  const userOrgs = await db.query.member.findMany({
    where: eq(member.userId, userId),
  });
  return userOrgs;
}

export async function getOrganizationsByIds({ organizationIds }: { organizationIds: string[] }) {
  const organizations = await db.query.organization.findMany({
    where: (organization, { inArray }) => inArray(organization.id, organizationIds),
  });
  return organizations;
}

export async function getOrganization({ organizationId }: { organizationId: string }) {
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, organizationId),
  });
  return org;
}
