import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.DASHBOARD_BASE_URL ?? "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "cd ../../apps/dashboard && bun run dev -- --host 127.0.0.1",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "anonymous-chromium",
      testMatch: /smoke\.test\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "authenticated-chromium",
      testMatch: /projects\.test\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "./.auth/owner.json",
      },
    },
  ],
});
