import { expect, test, type Browser } from "@playwright/test"

const OVERLAY = "[data-preloader-overlay]"
/** The stage the player draws into. The static logo is an svg inside the
 *  overlay too, so a looser selector matches it while the player is still
 *  being fetched and reads the wrong element's colours. */
const STAGE = "[data-preloader-stage]"

/** The overlay removes itself on a timer. With the clock frozen it stays put
 *  until a test advances time on purpose, so an assertion that it is on screen
 *  can no longer lose a race with a slow page load. Comfortably past every
 *  timer the component sets, rather than repeating their exact durations. */
const PAST_EVERY_TIMER = 5_000

/** This build of Playwright does not type reducedMotion/colorScheme as test
 *  options, so the emulated contexts are built by hand. */
async function visit(
  browser: Browser,
  options: { reducedMotion?: "reduce"; colorScheme?: "dark" },
) {
  const context = await browser.newContext(options)
  const page = await context.newPage()
  await page.clock.install()
  await page.goto("/components")

  return { page, context }
}

test("the first visit plays the animation and clears itself", async ({
  page,
}) => {
  await page.clock.install()
  await page.goto("/components")

  await expect(page.locator(`${STAGE} svg`)).toBeVisible()
  expect(
    await page.evaluate(() => sessionStorage.getItem("preloader")),
    "the flag has to be written on the first visit or the reload will replay it",
  ).toBe("seen")

  await page.clock.runFor(PAST_EVERY_TIMER)

  await expect(page.locator(OVERLAY)).toHaveCount(0)
})

test("a reload in the same session never shows a frame of it", async ({
  page,
}) => {
  await page.clock.install()
  await page.goto("/components")

  expect(await page.evaluate(() => sessionStorage.getItem("preloader"))).toBe(
    "seen",
  )

  await page.reload()

  expect(
    await page.evaluate(() => document.documentElement.dataset.preloader),
  ).toBe("skip")
  await expect(page.locator(OVERLAY)).toBeHidden()
})

test("Escape takes it down", async ({ page }) => {
  await page.clock.install()
  await page.goto("/components")

  await expect(page.locator(OVERLAY)).toBeVisible()

  await page.keyboard.press("Escape")
  await page.clock.runFor(PAST_EVERY_TIMER)

  await expect(page.locator(OVERLAY)).toHaveCount(0)
})

test("reduced motion gets the static logo and never fetches the player", async ({
  browser,
}) => {
  const { page, context } = await visit(browser, { reducedMotion: "reduce" })

  await expect(
    page.locator(OVERLAY),
    "the overlay must survive until a timer fires, not until the machine gets there",
  ).toBeVisible()

  await page.clock.runFor(PAST_EVERY_TIMER)

  await expect(
    page.locator(OVERLAY),
    "without a transition to listen to, the overlay has to come down on a timer",
  ).toHaveCount(0)

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

  await expect(page.locator(`${STAGE} svg`)).toBeVisible()

  /** Far short of the ceiling, but enough frames for the player to draw. */
  await page.clock.runFor(400)

  const painted = await page
    .locator(`${STAGE} svg path`)
    .evaluateAll((nodes) =>
      nodes.map(
        (node) => node.getAttribute("stroke") ?? node.getAttribute("fill"),
      ),
    )

  expect(painted).toContain("rgb(215,228,201)")

  await context.close()
})
