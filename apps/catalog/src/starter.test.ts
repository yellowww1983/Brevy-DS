import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, test } from "vitest"

import { tarballName } from "./starter"

/** The starter is a project of its own, committed at the root of the repo and
 *  shipped as a download. Nothing installs it here, so nothing here would
 *  notice it falling behind the package it is built on. These are the ways it
 *  can, checked without an install. */

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, "../../..")

type Manifest = {
  version: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  pnpm?: { overrides?: Record<string, string> }
}

const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8")
const manifest = (path: string) => JSON.parse(read(path)) as Manifest

const starter = manifest("starter/package.json")
const ui = manifest("packages/ui/package.json")
const tokens = manifest("packages/tokens/package.json")

/** The lowest version a specifier allows: `^19.3.0` and `19.3.0` both start
 *  at 19.3.0. The starter pins or carets, so that is all it has to read. */
function floor(specifier: string) {
  const match = /^\^?(\d+)\.(\d+)\.(\d+)$/.exec(specifier)

  if (!match) {
    throw new Error(`cannot read the version in ${specifier}`)
  }

  return match.slice(1).map(Number) as [number, number, number]
}

/** Whether a version is inside a caret range, which is the only kind the
 *  package declares its peers with. */
function withinCaret(version: readonly number[], range: string) {
  const [major, minor, patch] = floor(range)
  const [a = 0, b = 0, c = 0] = version

  if (major > 0) {
    return a === major && (b > minor || (b === minor && c >= patch))
  }

  return a === 0 && b === minor && c >= patch
}

describe("the starter against the package it installs", () => {
  /** A peer the starter does not install is an import that fails on the first
   *  page that reaches it, and one it installs outside the range is a warning
   *  nobody who downloads this can act on. */
  test.each(Object.entries(ui.peerDependencies ?? {}))(
    "installs %s inside %s",
    (name, range) => {
      const installed = starter.dependencies?.[name]

      expect(installed, `${name} is missing`).toBeDefined()
      expect(withinCaret(floor(installed ?? ""), range)).toBe(true)
    },
  )

  /** The build packs the tarballs under the names `pnpm pack` gives them; the
   *  starter has to ask for those names or the install finds nothing. */
  test("asks for the tarballs the build packs", () => {
    const uiFile = tarballName("@brevy/ui", ui.version)
    const tokensFile = tarballName("@brevy/tokens", tokens.version)

    expect(starter.dependencies?.["@brevy/ui"]).toBe(`file:vendor/${uiFile}`)
    expect(starter.dependencies?.["@brevy/tokens"]).toBe(
      `file:vendor/${tokensFile}`,
    )
    /** Without it the install looks for `@brevy/tokens` on npm. */
    expect(starter.pnpm?.overrides?.["@brevy/tokens"]).toBe(
      `file:./vendor/${tokensFile}`,
    )
  })

  /** The build rewrites these two lines to the tarballs it packs. It refuses
   *  when either is not there exactly once; this says so before a build does. */
  test("the lockfile pins each tarball once, where the build rewrites it", () => {
    const lockfile = read("starter/pnpm-lock.yaml")

    for (const file of [
      tarballName("@brevy/ui", ui.version),
      tarballName("@brevy/tokens", tokens.version),
    ]) {
      const pins = lockfile.match(
        new RegExp(
          `integrity: sha512-[A-Za-z0-9+/=]+, tarball: file:vendor/${file.replaceAll(".", "\\.")}\\}`,
          "g",
        ),
      )

      expect(pins, file).toHaveLength(1)
    }
  })

  /** The half of CLAUDE.md that is this project's own. The other half is the
   *  package's snippet, which the build takes from the generator. */
  test("carries the project's half of CLAUDE.md", () => {
    expect(read("starter/claude-project.md")).toMatch(/^## This project\n/)
  })
})
