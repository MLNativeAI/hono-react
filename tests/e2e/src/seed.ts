import { mkdir } from "node:fs/promises";
import path from "node:path";
import { auth } from "@repo/auth";
import { createProject } from "@repo/db";
import { db } from "@repo/db/db";
import { slugify } from "@repo/shared/id";
import type { TestHelpers } from "better-auth/plugins";
import { migrate } from "drizzle-orm/postgres-js/migrator";

export const AUTH_STATE_PATH = path.resolve(import.meta.dir, "../.auth/owner.json");

async function seedAuthenticatedOwner() {
  if (process.env.ENABLE_TEST_UTILS !== "1") {
    throw new Error("E2E tests require ENABLE_TEST_UTILS=1");
  }

  await migrate(db, {
    migrationsFolder: path.resolve(import.meta.dir, "../../../packages/db/migrations"),
  });

  const context = await auth.$context;
  const helpers = (context as unknown as { test: TestHelpers }).test;
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const user = helpers.createUser({
    email: `e2e-owner+${runId}@test.com`,
    emailVerified: true,
    name: "E2E Owner",
  });
  const savedUser = await helpers.saveUser(user);
  const organization = await auth.api.createOrganization({
    body: {
      name: "E2E Organization",
      slug: `e2e-${slugify(runId)}`,
      userId: savedUser.id,
    },
  });
  const headers = await helpers.getAuthHeaders({ userId: savedUser.id });

  await auth.api.setActiveOrganization({
    body: { organizationId: organization.id },
    headers,
  });
  await createProject({
    organizationId: organization.id,
    createdByUserId: savedUser.id,
    name: "Seeded E2E Project",
    description: "Created by Playwright global setup",
  });

  const cookieHeader = headers.get("cookie");
  if (!cookieHeader) throw new Error("Better Auth test helper did not return a session cookie");

  const cookies = cookieHeader.split(/;\s*/).map((entry) => {
    const separator = entry.indexOf("=");
    return {
      name: entry.slice(0, separator),
      value: entry.slice(separator + 1),
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax" as const,
    };
  });

  await mkdir(path.dirname(AUTH_STATE_PATH), { recursive: true });
  await Bun.write(AUTH_STATE_PATH, JSON.stringify({ cookies, origins: [] }));
}

await seedAuthenticatedOwner();
process.exit(0);
