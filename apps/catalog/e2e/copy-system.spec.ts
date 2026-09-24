import { readFile } from "node:fs/promises"

import { expect, test } from "./catalog-test"

const COPY = "header button[aria-label='Copy the whole system for Claude']"
const MORE = "header button[aria-label='More ways to get the whole system']"
const DOWNLOAD = "Download entire system"

test("the whole system reaches the clipboard, byte for byte", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/")

  const file = await (await page.request.get("/llms-full.txt")).text()

  await page.locator(COPY).click()
  await expect(page.locator(COPY)).toContainText("Copied")

  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(file)
})

test("the arrow opens the other way to get it, and Escape puts it away", async ({
  page,
}) => {
  await page.goto("/")

  const item = page.getByRole("menuitem", { name: DOWNLOAD })

  await expect(item).toBeHidden()

  await page.locator(MORE).click()
  await expect(item).toBeVisible()
  await expect(page.locator(MORE)).toHaveAttribute("aria-expanded", "true")

  await page.keyboard.press("Escape")
  await expect(item).toBeHidden()
  /** Focus goes back to the arrow, so a keyboard is where it started. */
  await expect(page.locator(MORE)).toBeFocused()
})

test("the download is the same file, named for what it is", async ({
  page,
}) => {
  await page.goto("/")

  const file = await (await page.request.get("/llms-full.txt")).body()

  await page.locator(MORE).click()

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("menuitem", { name: DOWNLOAD }).click(),
  ])

  expect(download.suggestedFilename()).toBe("brevy-design-system.md")

  /** The whole of it, which is the reason the file exists: a pasted message
   *  stops short of the system and an attachment does not. */
  const saved = await readFile(await download.path())

  expect(saved.equals(file)).toBe(true)
  expect(saved.length).toBeGreaterThan(100_000)
})
