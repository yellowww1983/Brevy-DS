/** Writes the registry into `@brevy/ui` as markdown, or checks that what is
 *  there is what the registry says now.
 *
 *  Run by the package's own build, after tsup: tsup cleans `dist` first, so
 *  anything written before it is gone. `--check` writes nothing and fails on
 *  any file that is missing, extra or different — it runs before the package
 *  is packed, so a tarball cannot carry docs from an older registry.
 *
 *  The docs are read from the catalog but land in the package, so turbo would
 *  otherwise replay a cached `@brevy/ui#build` after a doc changed and nothing
 *  in `packages/ui` did. `turbo.json` names the catalog's `src` and `scripts`
 *  among that task's inputs for exactly that reason.
 *
 *  Run through tsx with the tsconfig beside this file. The registry draws
 *  every component's previews, and the catalog's own tsconfig preserves JSX
 *  for Next, which leaves node nothing to run. */
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

import { DOCS_DIR, packageDocs } from "../src/package-docs"

const HERE = dirname(fileURLToPath(import.meta.url))
const TARGET = join(HERE, "..", "..", "..", "packages", "ui", DOCS_DIR)

/** Every file under the directory, keyed the way `packageDocs` keys them. */
function onDisk(dir: string): Map<string, string> {
  const found = new Map<string, string>()

  for (const entry of readdirSync(dir, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!entry.isFile()) continue

    const path = join(entry.parentPath, entry.name)

    found.set(
      relative(dir, path).split(sep).join("/"),
      readFileSync(path, "utf8"),
    )
  }

  return found
}

function write(files: ReadonlyMap<string, string>) {
  rmSync(TARGET, { recursive: true, force: true })

  for (const [path, markdown] of files) {
    const file = join(TARGET, path)

    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, markdown)
  }

  console.log(
    `Wrote ${String(files.size)} files to ${relative(process.cwd(), TARGET)}`,
  )
}

function check(files: ReadonlyMap<string, string>) {
  let written: Map<string, string>

  try {
    written = onDisk(TARGET)
  } catch {
    written = new Map()
  }

  const problems = [
    ...[...files.keys()]
      .filter((path) => !written.has(path))
      .map((path) => `missing   ${path}`),
    ...[...written.keys()]
      .filter((path) => !files.has(path))
      .map((path) => `extra     ${path}`),
    ...[...files]
      .filter(
        ([path, markdown]) =>
          written.has(path) && written.get(path) !== markdown,
      )
      .map(([path]) => `different ${path}`),
  ]

  if (problems.length > 0) {
    console.error(
      [
        `The docs in ${relative(process.cwd(), TARGET)} do not match the registry:`,
        ...problems.map((problem) => `  ${problem}`),
        "Rebuild the package: pnpm --filter @brevy/ui build",
      ].join("\n"),
    )
    process.exit(1)
  }

  console.log(`${String(files.size)} files match the registry`)
}

const files = await packageDocs()

if (process.argv.includes("--check")) {
  check(files)
} else {
  write(files)
}
