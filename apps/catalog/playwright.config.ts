import { defineConfig, devices } from "@playwright/test"

const PORT = 3100
const baseURL = `http://127.0.0.1:${String(PORT)}`

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? "list" : "line",
  use: { baseURL, trace: "off" },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
  webServer: {
    command: `pnpm start --port ${String(PORT)}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
