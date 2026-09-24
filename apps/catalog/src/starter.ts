/** The starter project: a ready Next.js folder a person downloads from the
 *  catalog, opens in Claude Code and builds a page in by describing it.
 *
 *  Its committed half lives in `starter/` at the root of the repo; the build
 *  packs the rest in (`scripts/build-starter.ts`). These names are here rather
 *  than in the script because the menu, the How to use page and the tests
 *  point at the same file, and a name written twice is a link that breaks. */

/** What the file is called, where it is served and what it saves as. */
export const STARTER_FILE = "brevy-landing-starter.zip"

export const STARTER_HREF = `/${STARTER_FILE}`

/** The one folder everything sits under in the ZIP, so unpacking it makes a
 *  project rather than loose files. */
export const STARTER_FOLDER = "brevy-landing"

/** What in `starter/` is never shipped as it is: what an install or a build
 *  leaves behind, the tarballs the build packs fresh, and the half of
 *  `CLAUDE.md` the build joins to the package's own snippet. */
export const STARTER_SKIPPED = [
  "node_modules",
  ".next",
  "vendor",
  "tsconfig.tsbuildinfo",
  "claude-project.md",
] as const

/** The name `pnpm pack` gives a scoped package's tarball. */
export function tarballName(name: string, version: string) {
  return `${name.replace(/^@/, "").replace("/", "-")}-${version}.tgz`
}
