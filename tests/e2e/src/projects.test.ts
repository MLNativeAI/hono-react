import { expect, test } from "@playwright/test";

test("an authenticated owner can list and create projects", async ({ page }) => {
  await page.goto("/projects");

  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Seeded E2E Project" })).toBeVisible();

  await page.getByRole("button", { name: "New Project" }).first().click();
  await page.getByLabel("Name").fill("Browser-created Project");
  await page.getByLabel("Description").fill("Created through the real dashboard flow");
  await page.getByRole("button", { name: "Create Project" }).click();

  await expect(page.getByText("Project created", { exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Browser-created Project" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Created through the real dashboard flow" })).toBeVisible();
});
