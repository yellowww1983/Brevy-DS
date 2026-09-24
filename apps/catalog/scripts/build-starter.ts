import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { zipSync, type Zippable } from "fflate"

import { packageDocs } from "../src/package-docs"
import {
  STARTER_FILE,
  STARTER_FOLDER,
  STARTER_SKIPPED,
  tarballName,
} from "../src/starter"

/** Builds the starter project a person downloads from the catalog.
 *
 *  Most of it is committed in `starter/` at the root of the repo. Three parts
 *  are made here, because each is a copy of something else and a copy that is
 *  committed goes stale:
 *
 *  - the two tarballs in `vendor/`, packed from the packages as they are right
 *    now, so the download always carries the current system;
 *  - the two `integrity` lines in the lockfile, rewritten to those tarballs.
 *    A pack is not byte-for-byte repeatable — the type declarations list a
 *    union in whatever order the compiler reached it — so every build has new
 *    hashes, and a lockfile that pins the old ones fails a frozen install;
 *  - the top of `CLAUDE.md`, which is the package's own snippet, taken from the
 *    generator that writes it into the package rather than retyped.
 *
 *  Everything goes under one folder in the ZIP, so unpacking it makes one
 *  project rather than a scatter of files in the downloads folder. */

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, "..", "..", "..")
const STARTER = join(ROOT, "starter")
const TARGET = join(HERE, "..", "public", STARTER_FILE)

/** iCloud's numbered copies of a file, which it makes on its own and which
 *  are never ours. The repo ignores them; the walk has to as well. */
const NUMBERED = /\s\d+(\.[^/]*)?$/

function committed(dir: string): Map<string, Uint8Array> {
  const files = new Map<string, Uint8Array>()

  for (const entry of readdirSync(dir, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!entry.isFile()) continue

    const path = relative(dir, join(entry.parentPath, entry.name))
      .split(sep)
      .join("/")

    if (STARTER_SKIPPED.some((skipped) => path.startsWith(skipped))) continue
    if (NUMBERED.test(entry.name)) continue

    files.set(path, readFileSync(join(dir, path)))
  }

  return files
}

function pack(name: string, into: string) {
  execFileSync("pnpm", ["--filter", name, "pack", "--pack-destination", into], {
    cwd: ROOT,
    stdio: "ignore",
  })
}

function integrity(tarball: Uint8Array) {
  return `sha512-${createHash("sha512").update(tarball).digest("base64")}`
}

/** Points the lockfile's entry for one tarball at the tarball actually in the
 *  ZIP. Refuses rather than guessing when the entry is not where it is
 *  expected, because a lockfile left pinning the wrong hash is exactly the
 *  failure this exists to prevent. */
function repin(lockfile: string, file: string, hash: string) {
  const line = new RegExp(
    `(integrity: )sha512-[A-Za-z0-9+/=]+(, tarball: file:vendor/${file.replaceAll(".", "\\.")}\\})`,
    "g",
  )
  const found = lockfile.match(line)?.length ?? 0

  if (found !== 1) {
    throw new Error(
      `starter/pnpm-lock.yaml pins vendor/${file} ${String(found)} times, not once`,
    )
  }

  return lockfile.replace(line, `$1${hash}$2`)
}

const scratch = mkdtempSync(join(tmpdir(), "brevy-starter-"))

try {
  const files = committed(STARTER)
  const vendor = new Map<string, Uint8Array>()

  for (const name of ["@brevy/ui", "@brevy/tokens"]) {
    pack(name, scratch)

    const { version } = JSON.parse(
      readFileSync(
        join(ROOT, "packages", name.replace("@brevy/", ""), "package.json"),
        "utf8",
      ),
    ) as { version: string }
    const file = tarballName(name, version)

    vendor.set(file, readFileSync(join(scratch, file)))
  }

  let lockfile = readFileSync(join(STARTER, "pnpm-lock.yaml"), "utf8")

  for (const [file, tarball] of vendor) {
    lockfile = repin(lockfile, file, integrity(tarball))
  }

  const snippet = (await packageDocs()).get("claude-md-snippet.md")

  if (!snippet) {
    throw new Error("the package docs no longer carry claude-md-snippet.md")
  }

  const project = readFileSync(join(STARTER, "claude-project.md"), "utf8")
  const text = new TextEncoder()

  const zip: Zippable = {}

  for (const [path, content] of files) {
    zip[`${STARTER_FOLDER}/${path}`] = content
  }

  zip[`${STARTER_FOLDER}/pnpm-lock.yaml`] = text.encode(lockfile)
  zip[`${STARTER_FOLDER}/CLAUDE.md`] = text.encode(`${snippet}\n\n${project}`)

  /** Already compressed, so stored rather than squeezed a second time. */
  for (const [file, tarball] of vendor) {
    zip[`${STARTER_FOLDER}/vendor/${file}`] = [tarball, { level: 0 }]
  }

  mkdirSync(dirname(TARGET), { recursive: true })
  writeFileSync(TARGET, zipSync(zip, { level: 9 }))

  console.log(
    `${relative(ROOT, TARGET)}: ${String(Object.keys(zip).length)} files, ${String(readFileSync(TARGET).length)} bytes`,
  )
} finally {
  rmSync(scratch, { recursive: true, force: true })
}
