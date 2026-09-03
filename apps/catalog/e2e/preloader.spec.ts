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

/** Installing the clock does not stop it: time keeps flowing at real speed
 *  until pauseAt, and a flowing clock let the overlay's own timers fire on
 *  the machine's schedule, which is the race this suite exists to prevent.
 *  Worse, advancing a flowing clock jumps the page's wall time, and the app
 *  reacts to a five second jump by remounting, which resurrects the overlay
 *  a test had already watched leave. Pause first, always. */
async function frozen(page: import("@playwright/test").Page) {
  await page.clock.install()
  await page.clock.pauseAt(Date.now())
}

/** The flag and every timer are armed by the same effect, so the flag landing
 *  proves the timers exist. Advancing a frozen clock before that proves
 *  nothing: a timer scheduled afterwards is measured against time that has
 *  already passed and never fires, and the overlay stays up for good. */
async function hydrated(page: import("@playwright/test").Page) {
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("preloader")))
    .toBe("seen")
}

/** Advances the clock until the overlay is gone. One big advance is not
 *  enough: the removal timer is armed by a React effect, and React schedules
 *  its render through a channel the fake clock does not drive, so under load
 *  the effect can land after a single runFor has already returned. Nudging
 *  keeps time moving until whatever was armed late has fired. */
async function cleared(page: import("@playwright/test").Page) {
  await expect
    .poll(async () => {
      await page.clock.runFor(500)
      return page.locator(OVERLAY).count()
    })
    .toBe(0)
}

/** This build of Playwright does not type reducedMotion/colorScheme as test
 *  options, so the contexts are built by hand. */
async function visit(
  browser: Browser,
  options: { reducedMotion?: "reduce"; dark?: true },
) {
  const { dark, ...context } = options
  const opened = await browser.newContext(context)
  const page = await opened.newPage()

  /** Asked for rather than emulated. The catalog opens light whatever the
   *  machine prefers, so a dark page here is a stored choice. */
  if (dark) {
    await page.addInitScript(() => {
      localStorage.setItem("theme", "dark")
    })
  }

  await frozen(page)
  await page.goto("/components")

  return { page, context: opened }
}

test("the first visit plays the animation and clears itself", async ({
  page,
}) => {
  await frozen(page)
  await page.goto("/components")

  await expect(page.locator(`${STAGE} svg`)).toBeVisible()
  /** Polled, not read once: the flag is written by an effect, and a single
   *  read races hydration the way the reload test's setup once did. */
  await hydrated(page)

  await page.clock.runFor(PAST_EVERY_TIMER)
  await cleared(page)
})

test("a reload in the same session never shows a frame of it", async ({
  page,
}) => {
  await frozen(page)
  await page.goto("/components")

  /** The flag is written by an effect, so it lands some time after the
   *  navigation resolves rather than with it. Reading it once raced hydration
   *  and failed roughly one run in three under load; this is the setup for the
   *  reload below, not the assertion the test is about. */
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("preloader")))
    .toBe("seen")

  await page.reload()

  expect(
    await page.evaluate(() => document.documentElement.dataset.preloader),
  ).toBe("skip")
  await expect(page.locator(OVERLAY)).toBeHidden()
})

test("Escape takes it down", async ({ page }) => {
  await frozen(page)
  await page.goto("/components")

  await expect(page.locator(OVERLAY)).toBeVisible()
  /** The Escape listener is registered by the same effect as the timers, so a
   *  press before hydration lands on nothing. */
  await hydrated(page)

  await page.keyboard.press("Escape")
  await page.clock.runFor(PAST_EVERY_TIMER)
  await cleared(page)
})

test("reduced motion gets the static logo and never fetches the player", async ({
  browser,
}) => {
  const { page, context } = await visit(browser, { reducedMotion: "reduce" })

  await expect(
    page.locator(OVERLAY),
    "the overlay must survive until a timer fires, not until the machine gets there",
  ).toBeVisible()
  await hydrated(page)

  await page.clock.runFor(PAST_EVERY_TIMER)
  /** Still on a timer, never on the machine's speed: cleared() only ever
   *  advances the frozen clock, so the overlay coming down here proves the
   *  reduced motion timer fired rather than a transition. */
  await cleared(page)

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
  const { page, context } = await visit(browser, { dark: true })

  await expect(page.locator(`${STAGE} svg`)).toBeVisible()
  await hydrated(page)

  /** Far short of the ceiling, but enough frames for the player to draw. */
  await page.clock.runFor(400)

  const painted = await page
    .locator(`${STAGE} svg path`)
    .evaluateAll((nodes) =>
      nodes.map(
        (node) => node.getAttribute("stroke") ?? node.getAttribute("fill"),
      ),
    )

  /** Against the token rather than a hex, the way `brand-green.spec` reads
   *  the other seven places the brand lights in the dark. This one cannot be
   *  read there: every spec but this file's own seeds the flag that keeps the
   *  overlay from swallowing clicks, so the preloader is the one logo the
   *  guard never sees. Pinning the value here would have to be edited by hand
   *  the day the brand green moves, which is how it came to be olive while
   *  everything around it was green.
   *
   *  The player writes `rgb(r,g,b)` without the spaces `getComputedStyle`
   *  returns, so the token is squeezed to match rather than the other way
   *  round. */
  const green = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim(),
  )
  const squeezed = await page.evaluate((value) => {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1

    const context = canvas.getContext("2d")

    if (!context) {
      return ""
    }

    /* Sizing the canvas resets the context, so the fill is set after it. */
    context.fillStyle = value
    context.fillRect(0, 0, 1, 1)

    const [r, g, b] = context.getImageData(0, 0, 1, 1).data

    return `rgb(${String(r)},${String(g)},${String(b)})`
  }, green)

  expect(squeezed, "--primary has to resolve to something").not.toBe("")
  expect(painted, "the animation wears the brand's one green").toContain(
    squeezed,
  )

  await context.close()
})
