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

/** A frame lands on a whole pixel, and the drawings inside it land with it.
 *
 *  The prose above a frame is a few lines whose heights do not add up to a
 *  round number, so a figure would start at 361.75 and its document at
 *  362.75. Everything inside then inherited the fraction: a 16px social icon
 *  in the footer landed on 614.75, half a device pixel on a 2x screen, and a
 *  sharp vector drawn across two rows of pixels is a blurred one.
 *
 *  Read off the rendered box rather than off the style that produces it. The
 *  correction is a transform, and a transform is exactly the kind of thing
 *  that reads as applied while the element it is on has not moved — the
 *  number that matters is where the browser put the thing. */
test("every frame lands on a whole pixel, in both themes", async ({ page }) => {
  for (const theme of ["light", "dark"] as const) {
    await page.addInitScript((name) => {
      document.addEventListener("DOMContentLoaded", () => {
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(name)
      })
    }, theme)

    for (const [path] of PAGES) {
      await page.goto(path)
      await measured(page)
      await expect(page.locator("html")).toHaveClass(
        new RegExp(`\\b${theme}\\b`),
      )

      const tops = await page.evaluate(() =>
        [...document.querySelectorAll("iframe")].map(
          (frame) => frame.getBoundingClientRect().top + window.scrollY,
        ),
      )

      expect(tops.length, `${path} has frames to measure`).toBeGreaterThan(0)

      for (const top of tops) {
        expect(
          top % 1,
          `${path} in the ${theme}: a frame at ${String(top)} would blur what it holds`,
        ).toBe(0)
      }
    }
  }
})

test("the icons in the footer land on a whole device pixel", async ({
  page,
}) => {
  await page.goto("/blocks/footer")
  await measured(page)

  const frame = page.locator("iframe").first()
  const top = await frame.evaluate(
    (node) => node.getBoundingClientRect().top + window.scrollY,
  )

  /** Four 16px icons in a row, which is why the footer is where this was
   *  noticed rather than where it happened. */
  const icon = await frame
    .contentFrame()
    .locator("a[aria-label='Facebook'] svg")
    .evaluate((node) => node.getBoundingClientRect().top)

  const screen = top + icon

  expect(screen % 1, "on the page").toBe(0)
  expect((screen * 2) % 1, "and on a 2x screen").toBe(0)
})
