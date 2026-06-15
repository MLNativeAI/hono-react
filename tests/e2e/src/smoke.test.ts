import { expect, test } from "bun:test";
import { getBaseUrl } from "../helpers/api-client";

test("API health endpoint responds with 200", async () => {
  const response = await fetch(`${getBaseUrl()}/api/health`);
  expect(response.status).toBe(200);
});
