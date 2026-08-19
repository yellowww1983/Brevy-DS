import { expect, test, type Page } from "./catalog-test"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/getting-started/introduction"

/** Puts a heading where a reader would have it — near the top of the viewport,
 *  which is the band the contents list watches. */
async function bringToReadingPosition(page: Page, id: string) {
  await page.evaluate((target: string) => {
    const heading = document.getElementById(target)
    if (!heading) {
      return
    }
    window.scrollTo(
      0,
      window.scrollY + heading.getBoundingClientRect().top - 150,
    )
  }, id)
}

test("the contents list matches the headings on the page", async ({ page }) => {
  await page.goto(PAGE)

  const listed = await page
    .locator('nav[aria-label="On this page"] a')
    .evaluateAll((nodes) =>
      nodes.map((node) => ({
        href: node.getAttribute("href"),
        title: node.textContent.trim(),
      })),
    )

  const headings = await page.locator("article h2").evaluateAll((nodes) =>
    nodes.map((node) => ({
      href: `#${node.id}`,
      title: node.textContent.trim(),
    })),
  )

  expect(
    listed,
    "a heading added to the page without an entry here disappears from the contents",
  ).toEqual(headings)
  expect(headings.length).toBeGreaterThan(1)
})

test("a contents link scrolls its section into view", async ({ page }) => {
  await page.goto(PAGE)

  const target = page.locator("#two-things-worth-knowing")
  expect(await page.evaluate(() => window.scrollY)).toBe(0)

  await page
    .locator(
      'nav[aria-label="On this page"] a[href="#two-things-worth-knowing"]',
    )
    .click()

  await expect(target).toBeInViewport()
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
})

test("scrolling marks the section being read", async ({ page }) => {
  await page.goto(PAGE)

  const current = page.locator('nav[aria-label="On this page"] a[aria-current]')
  await expect(current).toHaveText("Who this is for")

  await bringToReadingPosition(page, "how-it-works")
  await expect(current).toHaveText("How it works")

  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight)
  })
  await expect(
    current,
    "the last section must still be reachable at the bottom of the page",
  ).toHaveText("Two things worth knowing")
})

/** Introduction happens to end on a section long enough to reach the band on
 *  its own, which is why watching only this page hid the problem on the other
 *  two. Every page that carries a contents list is checked, one test each:
 *  waiting for a page to settle takes long enough that three of them in a row
 *  ran past a single test's budget. */
const WITH_CONTENTS = [
  "/getting-started/introduction",
  "/getting-started/how-to-use",
  "/getting-started/typography",
] as const

/** The typography page measures its frames once they load, so the document goes
 *  on growing for a moment after it is ready. Scrolling to the foot before that
 *  settles lands on a foot that is about to move, which is not the state a
 *  reader ever sees. */
async function scrollToFoot(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const room = document.documentElement.scrollHeight - window.innerHeight
        window.scrollTo({ top: room, behavior: "instant" })
        return window.scrollY >= room - 2
      }),
    )
    .toBe(true)
}

for (const path of WITH_CONTENTS) {
  test(`the last entry is reachable at the foot of ${path}`, async ({
    page,
  }) => {
    await page.goto(path)

    const links = page.locator('nav[aria-label="On this page"] a')
    const last = await links.last().textContent()

    await scrollToFoot(page)

    await expect(
      page.locator('nav[aria-label="On this page"] a[aria-current]'),
      "a short last section never lifts its heading into the band",
    ).toHaveText(last ?? "")
  })
}

test("the text keeps the same left edge as a component page", async ({
  page,
}) => {
  const left = async (path: string) => {
    await page.goto(path)
    const box = await page.locator("main h1").boundingBox()
    return box?.x
  }

  expect(await left(PAGE)).toBe(await left("/components/button"))
})
