import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { gunzipSync, strFromU8, unzipSync } from "fflate"

import { expect, test, type Page } from "./catalog-test"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..")
const MORE = "header button[aria-label='More ways to get the whole system']"
const FOLDER = "brevy-landing"

/** Every file a person unpacks, and nothing else: no `node_modules`, no build
 *  output, and not the half of CLAUDE.md the build joins to the snippet. */
const SHIPPED = [
  ".claude/launch.json",
  ".gitignore",
  "CLAUDE.md",
  "README.md",
  "next-env.d.ts",
  "next.config.ts",
  "package.json",
  "pnpm-lock.yaml",
  "postcss.config.mjs",
  "src/app/globals.css",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "tsconfig.json",
  "vendor/brevy-tokens-0.0.0.tgz",
  "vendor/brevy-ui-0.0.0.tgz",
]

/** The files inside a `.tgz`, by path. A tarball is 512-byte headers each
 *  followed by its file padded to 512, which is all a check needs to read. */
function untar(tgz: Uint8Array) {
  const tar = gunzipSync(tgz)
  const files = new Map<string, Uint8Array>()
  const field = (at: number, length: number) =>
    strFromU8(tar.subarray(at, at + length)).replace(/\0.*$/s, "")

  for (let at = 0; at + 512 <= tar.length;) {
    const name = field(at, 100)

    if (!name) break

    const size = parseInt(field(at + 124, 12).trim() || "0", 8)
    const prefix = field(at + 345, 155)

    files.set(
      prefix ? `${prefix}/${name}` : name,
      tar.subarray(at + 512, at + 512 + size),
    )
    at += 512 + Math.ceil(size / 512) * 512
  }

  return files
}

async function fromMenu(page: Page) {
  await page.goto("/")
  await page.locator(MORE).click()

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("menuitem", { name: "Download starter project" }).click(),
  ])

  return download
}

test("the menu hands over the starter under the name it is served as", async ({
  page,
}) => {
  const download = await fromMenu(page)

  expect(download.suggestedFilename()).toBe("brevy-landing-starter.zip")

  const served = await (
    await page.request.get("/brevy-landing-starter.zip")
  ).body()

  expect(
    Buffer.from(await readFile(await download.path())).equals(served),
  ).toBe(true)
})

test("the starter is one project folder and nothing else", async ({ page }) => {
  const zip = unzipSync(await readFile(await (await fromMenu(page)).path()))

  expect(Object.keys(zip).sort()).toEqual(
    SHIPPED.map((path) => `${FOLDER}/${path}`).sort(),
  )
})

test("the lockfile pins the tarballs the starter carries", async ({ page }) => {
  const zip = unzipSync(await readFile(await (await fromMenu(page)).path()))
  const lockfile = strFromU8(
    zip[`${FOLDER}/pnpm-lock.yaml`] ?? new Uint8Array(),
  )

  /** A pack is not byte-for-byte repeatable, so the hash changes with every
   *  build. One the lockfile does not name fails a frozen install. */
  for (const file of ["brevy-ui-0.0.0.tgz", "brevy-tokens-0.0.0.tgz"]) {
    const tarball = zip[`${FOLDER}/vendor/${file}`] ?? new Uint8Array()
    const hash = createHash("sha512").update(tarball).digest("base64")

    expect(tarball.length, file).toBeGreaterThan(0)
    expect(lockfile, file).toContain(
      `integrity: sha512-${hash}, tarball: file:vendor/${file}}`,
    )
  }
})

test("the tarball is the package as it was just built", async ({ page }) => {
  const zip = unzipSync(await readFile(await (await fromMenu(page)).path()))
  const packed = untar(
    zip[`${FOLDER}/vendor/brevy-ui-0.0.0.tgz`] ?? new Uint8Array(),
  )

  /** Read against the package on disk, which the same build produced. The
   *  entry point is the code and the index is the documentation; a tarball
   *  from an older build differs from at least one. */
  for (const path of ["dist/index.js", "dist/docs/index.md"]) {
    const built = await readFile(resolve(ROOT, "packages/ui", path))

    expect(
      Buffer.from(packed.get(`package/${path}`) ?? new Uint8Array()).equals(
        built,
      ),
      path,
    ).toBe(true)
  }

  /** And CLAUDE.md opens with the snippet the package carries, word for word,
   *  before the project's own half. */
  const snippet = await readFile(
    resolve(ROOT, "packages/ui/dist/docs/claude-md-snippet.md"),
    "utf8",
  )
  const claude = strFromU8(zip[`${FOLDER}/CLAUDE.md`] ?? new Uint8Array())

  expect(claude.startsWith(snippet.trimEnd())).toBe(true)
  expect(claude).toContain("## This project")
})

test("How to use offers the same starter to somebody who does not write code", async ({
  page,
}) => {
  await page.goto("/getting-started/how-to-use")

  const link = page.getByRole("link", { name: "Download starter project" })

  await expect(link).toBeVisible()

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    link.click(),
  ])

  expect(download.suggestedFilename()).toBe("brevy-landing-starter.zip")
})
