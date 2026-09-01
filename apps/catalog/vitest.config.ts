import { defineConfig } from "vitest/config"

/** The catalog's own tests are node-side: they read what the pages hand to
 *  Claude and check it against the package those pages describe. Nothing
 *  renders here, so there is no DOM — the browser's share of this app is the
 *  Playwright suite's.
 *
 *  JSX is transformed rather than preserved. The app's own tsconfig preserves
 *  it for Next to handle, and the docs are now found through the registry,
 *  which draws every component's previews. Nothing here renders one; the
 *  loader only has to be able to parse the file that holds them. */
export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
