import { defineConfig } from "vitest/config"

/** The catalog's own tests are node-side: they read what the pages hand to
 *  Claude and check it against the package those pages describe. Nothing
 *  renders here, so there is no DOM — the browser's share of this app is the
 *  Playwright suite's. */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
