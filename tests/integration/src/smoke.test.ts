import { app } from "@repo/api/routes";
import { expect, test, beforeAll, beforeEach } from "bun:test";
import { migrateTestDb, truncateAll } from "./helpers/db";

beforeAll(async () => {
  await migrateTestDb();
});

beforeEach(async () => {
  await truncateAll();
});

test("health endpoint is reachable in-process", async () => {
  const res = await app.request("/api/health");
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body).toEqual({ status: "ok" });
});

test("info endpoint exposes deployment metadata", async () => {
  const res = await app.request("/api/info");
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body).toEqual({
    version: "dev",
    gitSha: "unknown",
    environment: "dev",
  });
});

test("v1 routes are protected (401 without auth)", async () => {
  const res = await app.request("/api/v1/projects");
  expect(res.status).toBe(401);
});
