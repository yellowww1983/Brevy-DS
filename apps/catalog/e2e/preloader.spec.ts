import { expect, test, type Browser } from "@playwright/test"

const OVERLAY = "[data-preloader-overlay]"

/** This build of Playwright does not type reducedMotion/colorScheme as test
 *  options, so the emulated contexts are built by hand. */
async function visit(
  browser: Browser,
  options: { reducedMotion?: "reduce"; colorScheme?: "dark" },
) {
  const context = await browser.newContext(options)
  const page = await context.newPage()
  await page.goto("/components")

  return { page, context }
}

test("the first visit plays the animation and clears itself", async ({
  page,
}) => {
  await page.goto("/components")

  await expect(page.locator(`${OVERLAY} div > svg`)).toBeVisible()
  expect(
    await page.evaluate(() => sessionStorage.getItem("preloader")),
    "the flag has to be written on the first visit or the reload will replay it",
  ).toBe("seen")

  await expect(page.locator(OVERLAY)).toHaveCount(0, { timeout: 4000 })
})

test("a reload in the same session never shows a frame of it", async ({
  page,
}) => {
  await page.goto("/components")
  await expect(page.locator(OVERLAY)).toHaveCount(0, { timeout: 4000 })

  await page.reload()

  expect(
    await page.evaluate(() => document.documentElement.dataset.preloader),
  ).toBe("skip")
  await expect(page.locator(OVERLAY)).toBeHidden()
})

test("Escape takes it down", async ({ page }) => {
  await page.goto("/components")
  await expect(page.locator(OVERLAY)).toBeVisible()

  await page.keyboard.press("Escape")

  await expect(page.locator(OVERLAY)).toHaveCount(0, { timeout: 2000 })
})

test("reduced motion gets the static logo and never fetches the player", async ({
  browser,
}) => {
  const { page, context } = await visit(browser, { reducedMotion: "reduce" })

  await expect(
    page.locator(OVERLAY),
    "without a transition to listen to, the overlay has to come down on a timer",
  ).toHaveCount(0, { timeout: 2000 })

  const fetched = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .some((entry) => entry.name.includes("lottie")),
  )
  expect(fetched, "reduced motion must not pay for the player").toBe(false)

  await context.close()
})

test("dark mode repaints the animation to the dark logo colour", async ({
  browser,
}) => {
  const { page, context } = await visit(browser, { colorScheme: "dark" })

  await expect(page.locator(`${OVERLAY} div > svg`)).toBeVisible()
  const painted = await page
    .locator(`${OVERLAY} div > svg path`)
    .evaluateAll((nodes) =>
      nodes.map(
        (node) => node.getAttribute("stroke") ?? node.getAttribute("fill"),
      ),
    )

  expect(painted).toContain("rgb(215,228,201)")

  await context.close()
})
