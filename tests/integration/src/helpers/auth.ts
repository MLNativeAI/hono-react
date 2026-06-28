import { auth } from "@repo/auth";
import { slugify } from "@repo/shared/id";
import type { TestHelpers } from "better-auth/plugins";

/**
 * The `testUtils` plugin is conditionally spread into `plugins`, so TS can't
 * narrow `ctx.test`. It exists at runtime when ENABLE_TEST_UTILS=1 (set by the
 * test preload). We assert the helper type in this one place.
 */
async function testHelpers(): Promise<TestHelpers> {
  const ctx = await auth.$context;
  return (ctx as unknown as { test: TestHelpers }).test;
}

export type Role = "owner" | "admin" | "member";

export interface TestUser {
  id: string;
  email: string;
}

export interface SeededOrg {
  organizationId: string;
  users: Record<Role, TestUser>;
}

/**
 * Creates an organization with an owner, an admin, and a plain member.
 * Returns the ids so tests can drive the API as each role.
 */
export async function seedOrgWithMembers(slug: string): Promise<SeededOrg> {
  const test = await testHelpers();

  const makeUser = async (email: string): Promise<TestUser> => {
    const user = test.createUser({ email, emailVerified: true });
    const saved = await test.saveUser(user);
    return { id: saved.id, email };
  };

  const owner = await makeUser(`owner+${slug}@test.com`);
  const admin = await makeUser(`admin+${slug}@test.com`);
  const member = await makeUser(`member+${slug}@test.com`);

  // Use the real server-side creation path (creator becomes owner) rather than
  // the testUtils org factory, which emits a `metadata` field our schema lacks.
  const org = await auth.api.createOrganization({
    body: { name: slug, slug: `${slug}-${slugify(slug)}`, userId: owner.id },
  });
  const organizationId = org.id as string;

  await test.addMember?.({ userId: admin.id, organizationId, role: "admin" });
  await test.addMember?.({ userId: member.id, organizationId, role: "member" });

  return { organizationId, users: { owner, admin, member } };
}

/**
 * Returns authenticated request headers (with a live session cookie) for the
 * given user, with the session's active organization set to `organizationId`.
 *
 * `requirePermission` resolves the member's role from the active organization,
 * so the session must be active in `organizationId` for RBAC to be evaluated.
 */
export async function loginAsRole(userId: string, organizationId: string): Promise<Headers> {
  const test = await testHelpers();
  const headers = await test.getAuthHeaders({ userId });
  // The session.create.before hook auto-creates a personal org and makes it
  // active; switch to the shared seeded org so getActiveMember resolves.
  await auth.api.setActiveOrganization({
    body: { organizationId },
    headers,
  });
  return headers;
}
