import { auth } from "@repo/auth";
import { expect, test, beforeAll, beforeEach, describe } from "bun:test";
import { loginAsRole, seedOrgWithMembers } from "./helpers/auth";
import { migrateTestDb, truncateAll } from "./helpers/db";

async function testHelpers() {
  const ctx = await auth.$context;
  return (ctx as unknown as { test: import("better-auth/plugins").TestHelpers }).test;
}

beforeAll(async () => {
  await migrateTestDb();
});

beforeEach(async () => {
  await truncateAll();
});

describe("auth lifecycle", () => {
  test("a new session has an active organization (auto-org hook)", async () => {
    const test = await testHelpers();
    const user = test.createUser({ email: "newbie@test.com", emailVerified: true });
    await test.saveUser(user);

    const headers = await test.getAuthHeaders({ userId: user.id });
    const session = await auth.api.getSession({ headers });

    expect(session).not.toBeNull();
    // The session.create.before hook should have set an active organization.
    expect(session?.session.activeOrganizationId).toBeTruthy();
  });

  test("accepting an invitation switches the active organization", async () => {
    const test = await testHelpers();
    const org = await seedOrgWithMembers("acme");

    // A second user who starts in their own auto-created org.
    const invitee = test.createUser({ email: "invitee@test.com", emailVerified: true });
    await test.saveUser(invitee);
    const inviteeHeaders = await test.getAuthHeaders({ userId: invitee.id });

    const before = await auth.api.getSession({ headers: inviteeHeaders });
    expect(before?.session.activeOrganizationId).not.toBe(org.organizationId);

    // Owner invites the invitee into the shared org.
    const ownerHeaders = await loginAsRole(org.users.owner.id, org.organizationId);
    const invitation = await auth.api.createInvitation({
      body: { email: "invitee@test.com", role: "member", organizationId: org.organizationId },
      headers: ownerHeaders,
    });

    // Invitee accepts.
    await auth.api.acceptInvitation({
      body: { invitationId: invitation.id },
      headers: inviteeHeaders,
    });

    // The afterAcceptInvitation hook should have switched the active org.
    const after = await auth.api.getSession({ headers: inviteeHeaders });
    expect(after?.session.activeOrganizationId).toBe(org.organizationId);
  });
});
