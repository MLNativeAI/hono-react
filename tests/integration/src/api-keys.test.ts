import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { db } from "@repo/db/db";
import { apikey } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { request } from "./helpers/api";
import { loginAsRole, seedOrgWithMembers } from "./helpers/auth";
import { migrateTestDb, truncateAll } from "./helpers/db";

beforeAll(async () => {
  await migrateTestDb();
});

beforeEach(async () => {
  await truncateAll();
});

describe("api-keys API", () => {
  test("admin creates an org-owned key in a single write", async () => {
    const org = await seedOrgWithMembers("acme");
    const headers = await loginAsRole(org.users.admin.id, org.organizationId);

    const created = await request<{ id: string; name: string; key: string }>("/api/v1/api-keys", {
      method: "POST",
      headers,
      body: { name: "CI key" },
    });
    expect(created.status).toBe(200);
    expect(created.body.key).toBeTruthy();

    // Exactly one key row, and it is owned by the org (single write, no orphan).
    // The owner is stored on referenceId (the api-key plugin's owner field).
    const rows = await db.select().from(apikey).where(eq(apikey.id, created.body.id));
    expect(rows).toHaveLength(1);
    const row = rows.at(0);
    if (!row) throw new Error("Expected one API key row");
    expect(row.referenceId).toBe(org.organizationId);
    expect(row.name).toBe("CI key");
  });

  test("member cannot create keys (RBAC)", async () => {
    const org = await seedOrgWithMembers("acme");
    const headers = await loginAsRole(org.users.member.id, org.organizationId);

    const created = await request("/api/v1/api-keys", {
      method: "POST",
      headers,
      body: { name: "should fail" },
    });
    expect(created.status).toBe(403);
  });

  test("list is scoped to the active organization", async () => {
    const orgA = await seedOrgWithMembers("acme");
    const orgB = await seedOrgWithMembers("globex");

    const headersA = await loginAsRole(orgA.users.admin.id, orgA.organizationId);
    const createA = await request<{ id: string }>("/api/v1/api-keys", {
      method: "POST",
      headers: headersA,
      body: { name: "A key" },
    });
    expect(createA.status).toBe(200);

    const headersB = await loginAsRole(orgB.users.admin.id, orgB.organizationId);
    const listB = await request<{ id: string; name: string }[]>("/api/v1/api-keys", {
      headers: headersB,
    });
    expect(listB.status).toBe(200);
    expect(listB.body).toHaveLength(0);

    const listA = await request<{ id: string; name: string }[]>("/api/v1/api-keys", {
      headers: headersA,
    });
    expect(listA.status).toBe(200);
    expect(listA.body).toHaveLength(1);
    const apiKey = listA.body.at(0);
    if (!apiKey) throw new Error("Expected one API key in list response");
    expect(apiKey.id).toBe(createA.body.id);
  });

  test("deleting another org's key returns 404 (no cross-org leak)", async () => {
    const orgA = await seedOrgWithMembers("acme");
    const orgB = await seedOrgWithMembers("globex");

    const headersB = await loginAsRole(orgB.users.admin.id, orgB.organizationId);
    const created = await request<{ id: string }>("/api/v1/api-keys", {
      method: "POST",
      headers: headersB,
      body: { name: "B key" },
    });
    expect(created.status).toBe(200);

    const headersA = await loginAsRole(orgA.users.admin.id, orgA.organizationId);
    const deleted = await request(`/api/v1/api-keys/${created.body.id}`, {
      method: "DELETE",
      headers: headersA,
    });
    expect(deleted.status).toBe(404);
  });
});
