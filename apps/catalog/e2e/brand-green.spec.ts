import type { Locator } from "@playwright/test"

import { expect, test, type Page } from "./catalog-test"

/** Everything that reads as the brand on a dark page is one green.
 *
 *  It is `--primary`, the button's own token, and that is a decision about
 *  the brand rather than a reading of the app file — which paints the wordmark
 *  olive there and the serif heading in two greens. DESIGN-FEEDBACK 92.
 *
 *  It needs guarding because it had already come apart without anyone
 *  noticing: the logo was olive in the navbar, the footer and the catalog's own
 *  chrome, green on the login screen, and the sidebar lit its active row in a
 *  third shade again. Nothing was wrong enough to look wrong on any one page,
 *  and the four places were never on screen together.
 *
 *  What is asserted is that every one of them resolves to `--primary`, not
 *  that they resolve to `#0e8a4d`. The rule is that the brand is one colour,
 *  and pinning the hex would fail a deliberate change of that colour while
 *  saying nothing about whether the seven still agree. Today it is `#0e8a4d`. */

test.use({ viewport: { width: 1440, height: 900 } })

const inTheDark = async (page: Page) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
}

/** Through a canvas, because a token resolves to `oklch(...)` and an element
 *  to `rgb(...)`, and the two never compare as strings. */
const paint = (locator: Locator, read: "color" | "background") =>
  locator.evaluate((node, read) => {
    const canvas = document.createElement("canvas").getContext("2d")

    if (!canvas) {
      return null
    }

    const style = getComputedStyle(node)
    canvas.fillStyle = read === "color" ? style.color : style.backgroundColor

    return canvas.fillStyle
  }, read)

const railPaint = (locator: Locator) =>
  locator.evaluate((node) => {
    const canvas = document.createElement("canvas").getContext("2d")

    if (!canvas) {
      return null
    }

    canvas.fillStyle = getComputedStyle(node, "::before").backgroundColor

    return canvas.fillStyle
  })

const tokenPaint = (page: Page) =>
  page.evaluate(() => {
    const canvas = document.createElement("canvas").getContext("2d")

    if (!canvas) {
      return null
    }

    canvas.fillStyle = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--primary")

    return canvas.fillStyle
  })

test("everything the brand lights in the dark is the button's own green", async ({
  page,
}) => {
  await inTheDark(page)

  const found = new Map<string, string | null>()

  /** The button first, because it is the one the others have to match. */
  await page.goto("/components/button")
  await page.locator("main h1").waitFor()

  const primary = await tokenPaint(page)
  expect(primary, "--primary has to resolve to something").toBeTruthy()

  found.set(
    "the primary button's ground",
    await paint(
      page.locator("[data-preview] [data-slot='button']").first(),
      "background",
    ),
  )
  found.set(
    "the logo in the catalog's own chrome",
    await paint(page.locator("aside svg").first(), "color"),
  )
  found.set(
    "the active row in the sidebar",
    await paint(page.locator("aside nav a[aria-current='page']"), "color"),
  )
  found.set(
    "the rail beside it",
    await railPaint(page.locator("aside nav a[aria-current='page']")),
  )

  /** And the logo everywhere a block puts one. Four places, three of them
   *  pages of their own, which is why nobody saw them disagree. */
  for (const [where, path, selector] of [
    ["the logo in the navbar", "/specimens/navbar", "[data-slot='navbar'] svg"],
    [
      "the logo in the footer",
      "/specimens/footer",
      "[data-slot='footer-logo'] svg",
    ],
    [
      "the logo on the login screen",
      "/specimens/auth",
      "[data-slot='auth-split-copy'] svg",
    ],
  ] as const) {
    await page.goto(path)
    const mark = page.locator(selector).first()
    await mark.waitFor()
    found.set(where, await paint(mark, "color"))
  }

  expect(found.size).toBe(7)

  /** Every one of them, against the token rather than against each other, so
   *  a failure names the place that left rather than saying they differ. */
  for (const [where, painted] of found) {
    expect(painted, where).toBe(primary)
  }

  expect(
    new Set(found.values()).size,
    "the brand is one colour in the dark, not several",
  ).toBe(1)
})
