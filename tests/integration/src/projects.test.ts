import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { request } from "./helpers/api";
import { loginAsRole, seedOrgWithMembers } from "./helpers/auth";
import { migrateTestDb, truncateAll } from "./helpers/db";

beforeAll(async () => {
  await migrateTestDb();
});

beforeEach(async () => {
  await truncateAll();
});

describe("projects API", () => {
  test("admin can create and list a project", async () => {
    const org = await seedOrgWithMembers("acme");
    const headers = await loginAsRole(org.users.admin.id, org.organizationId);

    const created = await request<{ id: string; name: string }>("/api/v1/projects", {
      method: "POST",
      headers,
      body: { name: "Project A", description: "demo" },
    });
    expect(created.status).toBe(200);
    expect(created.body.name).toBe("Project A");

    const list = await request<{ id: string; name: string }[]>("/api/v1/projects", { headers });
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    const project = list.body.at(0);
    if (!project) throw new Error("Expected one project in list response");
    expect(project.id).toBe(created.body.id);
  });

  test("member can read but cannot create a project (RBAC)", async () => {
    const org = await seedOrgWithMembers("acme");
    const headers = await loginAsRole(org.users.member.id, org.organizationId);

    const list = await request("/api/v1/projects", { headers });
    expect(list.status).toBe(200);

    const create = await request("/api/v1/projects", {
      method: "POST",
      headers,
      body: { name: "Forbidden" },
    });
    expect(create.status).toBe(403);
  });

  test("admin cannot delete; owner can (RBAC)", async () => {
    const org = await seedOrgWithMembers("acme");

    // Seed a project as the owner.
    const ownerHeaders = await loginAsRole(org.users.owner.id, org.organizationId);
    const created = await request<{ id: string }>("/api/v1/projects", {
      method: "POST",
      headers: ownerHeaders,
      body: { name: "To Delete" },
    });
    expect(created.status).toBe(200);

    // Admin: update allowed, delete forbidden.
    const adminHeaders = await loginAsRole(org.users.admin.id, org.organizationId);
    const updated = await request(`/api/v1/projects/${created.body.id}`, {
      method: "PATCH",
      headers: adminHeaders,
      body: { name: "Renamed" },
    });
    expect(updated.status).toBe(200);

    const adminDelete = await request(`/api/v1/projects/${created.body.id}`, {
      method: "DELETE",
      headers: adminHeaders,
    });
    expect(adminDelete.status).toBe(403);

    // Owner: delete allowed.
    const ownerDelete = await request(`/api/v1/projects/${created.body.id}`, {
      method: "DELETE",
      headers: ownerHeaders,
    });
    expect(ownerDelete.status).toBe(200);
  });

  test("a project from another org is not visible (org-scoping)", async () => {
    const orgA = await seedOrgWithMembers("acme");
    const orgB = await seedOrgWithMembers("globex");

    // Create a project in org B.
    const orgBOwner = await loginAsRole(orgB.users.owner.id, orgB.organizationId);
    const created = await request<{ id: string }>("/api/v1/projects", {
      method: "POST",
      headers: orgBOwner,
      body: { name: "Globex Project" },
    });
    expect(created.status).toBe(200);

    // Org A's owner cannot see org B's project.
    const orgAOwner = await loginAsRole(orgA.users.owner.id, orgA.organizationId);
    const list = await request<{ id: string }[]>("/api/v1/projects", { headers: orgAOwner });
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(0);

    // And a direct delete by id returns 404 (not a leak, not a 500).
    const crossDelete = await request(`/api/v1/projects/${created.body.id}`, {
      method: "DELETE",
      headers: orgAOwner,
    });
    expect(crossDelete.status).toBe(404);
  });

  test("empty name is rejected (validation)", async () => {
    const org = await seedOrgWithMembers("acme");
    const headers = await loginAsRole(org.users.admin.id, org.organizationId);

    const created = await request("/api/v1/projects", {
      method: "POST",
      headers,
      body: { name: "" },
    });
    expect(created.status).toBe(400);
  });
});
