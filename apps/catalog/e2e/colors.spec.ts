import { expect, test } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/getting-started/colors"

test("every swatch reports the colour it is painted", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  /** Zero opacity is the failure worth naming. A ramp nothing else in the build
   *  uses gets its variables dropped, and every swatch of it then measures a
   *  perfectly well-formed `#000000` at 0% — invisible on the page and a pass
   *  for any check that only looks at the shape of the string. */
  const wrong = await page
    .locator("[data-hex]")
    .evaluateAll((nodes) =>
      nodes
        .map((node) => node.getAttribute("data-hex") ?? "")
        .filter(
          (hex) =>
            !/^#[0-9a-f]{6}( · \d+% opaque)?$/.test(hex) ||
            / · 0% opaque$/.test(hex),
        ),
    )

  expect(
    wrong,
    "a swatch that measures nothing is a token the build never emitted",
  ).toEqual([])
})

test("a semantic token lands on the colour it says it does", async ({
  page,
}) => {
  await page.goto(PAGE)

  /** The page states where each token points, and that is the one thing on it
   *  that is written down rather than measured — so it is the one thing that
   *  can drift from the token file. Resolving both sides in the browser and
   *  comparing is what keeps the claim honest. */
  const drift = await page.evaluate(() => {
    const probe = document.createElement("span")
    document.body.append(probe)

    const paint = (value: string, theme: string) => {
      probe.className = theme
      probe.style.background = value
      return getComputedStyle(probe).backgroundColor
    }

    const wrong: string[] = []

    for (const row of document.querySelectorAll("[data-token]")) {
      const token = row.getAttribute("data-token") ?? ""

      for (const theme of ["light", "dark"]) {
        const source =
          row
            .querySelector(`[data-swatch="${theme}"] [data-source]`)
            ?.getAttribute("data-source") ?? ""

        /** "white 10%" and the like describe a colour rather than name one. */
        if (!/^[a-z]+(-[a-z0-9]+)?$/.test(source)) {
          continue
        }

        /** Most sources name a shade of a ramp, but a few name another
         *  semantic token — dark's hover surface is simply the accent. The
         *  fallback covers both without the test having to know which. */
        const actual = paint(`var(--${token})`, theme)
        const claimed = paint(`var(--color-${source}, var(--${source}))`, theme)

        if (actual !== claimed) {
          wrong.push(`${token} in ${theme}: paints ${actual}, claims ${source}`)
        }
      }
    }

    probe.remove()
    return wrong
  })

  expect(drift).toEqual([])
})

test("the two themes are shown at once, whichever one the reader is in", async ({
  page,
}) => {
  await page.goto(PAGE)

  const backgrounds = async () =>
    page.evaluate(() => {
      const row = document.querySelector('[data-token="background"]')
      const read = (theme: string) =>
        getComputedStyle(
          row?.querySelector(`[data-swatch="${theme}"] [data-block]`) ??
            document.body,
        ).backgroundColor

      return { light: read("light"), dark: read("dark") }
    })

  const inLight = await backgrounds()
  expect(
    inLight.light,
    "the two columns showing the same colour would defeat the point of the page",
  ).not.toBe(inLight.dark)

  await page.getByRole("button", { name: "Toggle color theme" }).click()

  /** Checked before the columns are, because a click that lands before the page
   *  is interactive changes nothing — and "nothing changed" is exactly what the
   *  assertion below wants to see. Without this it would pass either way. */
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  expect(
    await backgrounds(),
    "a column pinned to a theme must ignore the page's own theme",
  ).toEqual(inLight)
})

test("a swatch copies its name rather than its hex", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto(PAGE)
  await measured(page)

  await page.getByRole("button", { name: "Copy brand-500" }).click()

  expect(
    await page.evaluate(() => navigator.clipboard.readText()),
    "a hex on the clipboard is the one thing the lint gate rejects in a class",
  ).toBe("brand-500")
})
