import { expect, test, type Page } from "@playwright/test"

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
