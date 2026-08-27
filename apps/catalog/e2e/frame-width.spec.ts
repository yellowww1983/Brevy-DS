import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 1200 } })

/** The widths the tabs name (`viewport-frame.tsx`). */
const TABS = [
  ["Desktop", 1440],
  ["Tablet", 810],
  ["Mobile", 390],
] as const

/** Every page that carries the width switcher, with a slot that proves its
 *  document has arrived. */
const PAGES = [
  ["/blocks/faq", "faq-list"],
  ["/blocks/footer", "footer-about"],
  ["/blocks/navbar", "navbar"],
  ["/blocks/hero/centered", "hero-centered"],
  ["/blocks/hero/split", "hero-split"],
  ["/components/social-proof", "social-proof"],
  ["/components/chat", "chat"],
] as const

const documentWidth = async (page: Page, slot: string) =>
  page
    .locator("[data-viewport]")
    .first()
    .locator("iframe")
    .contentFrame()
    .locator(`[data-slot='${slot}']`)
    .first()
    .evaluate(() => document.documentElement.clientWidth)

/** The tab is a claim about a width, and the frame has to make it true.
 *
 *  It did not, for every block but one. The frames shrank to the catalog's
 *  column when the tab was wider than it, so the Desktop tab rendered a 1056
 *  document and called it Desktop. Nothing failed, because the specs that
 *  cared derived what the block owed from the width the frame actually stood
 *  at — including this file's own `the frame draws the block true at every
 *  tab`, which branches on `read.frame >= 1200` and so agreed with the frame
 *  about a width the reader was never shown.
 *
 *  This is the assertion that does not adapt: the document is the width on the
 *  tab, or the tab is lying. */
for (const [url, slot] of PAGES) {
  test(`the tab names the width the document is at ${url}`, async ({
    page,
  }) => {
    await page.goto(url)
    await measured(page)

    for (const [tab, width] of TABS) {
      await page.getByRole("button", { name: tab, exact: true }).first().click()
      await measured(page)

      expect(
        await documentWidth(page, slot),
        `${url} · ${tab} is ${String(width)}, not the catalog's column`,
      ).toBe(width)
    }
  })
}

/** The one the shrinking actually cost. The FAQ pairs its columns at the
 *  content breakpoint, 1200, which is above the 1056 the frame used to clamp
 *  to — so the two columns had never once been visible in the catalog. */
test("the FAQ shows the two columns the desktop tab promises", async ({
  page,
}) => {
  await page.goto("/blocks/faq")
  await measured(page)
  await page.getByRole("button", { name: "Desktop", exact: true }).click()
  await measured(page)

  const read = await page
    .locator("[data-viewport]")
    .first()
    .locator("iframe")
    .contentFrame()
    .locator("[data-slot='faq']")
    .evaluate((section) => {
      const intro = section
        .querySelector("[data-slot='faq-intro']")
        ?.getBoundingClientRect()
      const list = section
        .querySelector("[data-slot='faq-list']")
        ?.getBoundingClientRect()

      if (!intro || !list) {
        throw new Error("the frame is missing a slot")
      }

      return {
        width: document.documentElement.clientWidth,
        paired: Math.round(list.left) >= Math.round(intro.right),
        level: Math.round(intro.top) === Math.round(list.top),
      }
    })

  expect(read.width).toBe(1440)
  expect(read.paired, "the list stands beside the intro").toBe(true)
  expect(read.level, "and starts level with it").toBe(true)
})
