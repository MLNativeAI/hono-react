import { expect, test } from "@playwright/test";
import { getBaseUrl } from "./helpers/api-client";

test("API health endpoint exposes its contract", async ({ request }) => {
  const response = await request.get(`${getBaseUrl()}/api/health`);
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});

test("a visitor can open the sign-in experience", async ({ page }) => {
  await page.goto("/auth/sign-in");
  await expect(page.getByText("Sign in to your account", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
});
