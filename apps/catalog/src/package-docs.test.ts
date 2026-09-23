import { describe, expect, test } from "vitest"

import {
  DOCS_DIR,
  namesCatalogAssets,
  packageDocs,
  pathOf,
} from "./package-docs"
import { registry } from "./registry"

/** What `@brevy/ui` carries has to be the registry, all of it and nothing
 *  else.
 *
 *  A project that installed the package reads these files instead of the
 *  catalog, and nothing there can tell it they are stale or short. So the
 *  things that would go wrong silently are pinned here: an entry with no
 *  file, a file the index never mentions, a page reworded on the way into the
 *  package, a link to a file that is not there. The build's own `--check`
 *  then holds the files on disk to this same map. */

const files = await packageDocs()

/** Every markdown link target in a file, in order. */
function linksOf(markdown: string): string[] {
  return [...markdown.matchAll(/\]\(([^)\s]+)\)/g)].map(
    (match) => match[1] ?? "",
  )
}

describe("the docs the package carries", () => {
  test("hold one file per registry entry, and three besides", () => {
    const paths = registry.map(pathOf)

    expect(new Set(paths).size).toBe(registry.length)
    expect([...files.keys()].sort()).toEqual(
      [...paths, "index.md", "rules.md", "claude-md-snippet.md"].sort(),
    )
  })

  test("give every entry its catalog page, byte for byte", async () => {
    for (const entry of registry) {
      expect(files.get(pathOf(entry)), entry.slug).toBe(await entry.doc())
    }
  })

  test("index exactly the registry, and the rules", () => {
    const linked = linksOf(files.get("index.md") ?? "")

    expect(new Set(linked).size).toBe(linked.length)
    expect([...linked].sort()).toEqual(
      [...registry.map(pathOf), "rules.md"].sort(),
    )
  })

  test("link only to files that are there", () => {
    for (const [path, markdown] of files) {
      if (!["index.md", "rules.md", "claude-md-snippet.md"].includes(path)) {
        continue
      }

      for (const link of linksOf(markdown)) {
        expect(files.has(link), `${path} → ${link}`).toBe(true)
      }
    }
  })

  test("point the consuming project's CLAUDE.md at files that exist", () => {
    const snippet = files.get("claude-md-snippet.md") ?? ""
    const root = `node_modules/@brevy/ui/${DOCS_DIR}/`
    const named = [...snippet.matchAll(/`([^`]+\.md)`/g)].map(
      (match) => match[1] ?? "",
    )

    expect(named).not.toHaveLength(0)

    for (const path of named) {
      expect(path.startsWith(root), path).toBe(true)
      expect(files.has(path.slice(root.length)), path).toBe(true)
    }
  })

  test("mark the pages that name artwork only the catalog has", async () => {
    const index = files.get("index.md") ?? ""

    for (const entry of registry) {
      const line = index
        .split("\n")
        .find((candidate) => candidate.includes(`](${pathOf(entry)})`))

      expect(line?.includes("not in this package"), entry.slug).toBe(
        namesCatalogAssets(await entry.doc()),
      )
    }
  })
})
