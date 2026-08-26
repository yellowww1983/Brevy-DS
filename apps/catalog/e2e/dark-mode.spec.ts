import { expect, test, type Page } from "./catalog-test"

/** The two objects the design draws in ramp colours only: the pill and the
 *  FAQ's beige band. Neither can turn dark, so nothing written on them may
 *  either. A label that reaches for a theme token turns while its surface
 *  stays put, which is how a chip once rendered near-white on white at 1.04
 *  to 1.
 *
 *  Both halves are asserted, because either alone would pass the wrong thing:
 *  the colour has to be the same in both themes, and it has to be legible on
 *  the surface it is actually painted on. */

const inTheDark = async (page: Page) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
}

const isDark = async (page: Page) =>
  page.evaluate(() => document.documentElement.classList.contains("dark"))

/** Read in the page so the browser resolves the colours: a computed colour
 *  arrives in whatever space the stylesheet used, oklch included, and a canvas
 *  will convert any of them. The surface comes from the token file through a
 *  custom property rather than from a value written down here. */
const CONTRAST = (nodes: Element[], token: string) => {
  const resolve = (colour: string) => {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext("2d")

    if (!context) {
      throw new Error("no 2d context to resolve a colour with")
    }

    context.fillStyle = colour
    context.fillRect(0, 0, 1, 1)
    const data = context.getImageData(0, 0, 1, 1).data

    return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0] as [
      number,
      number,
      number,
    ]
  }

  const luminance = (rgb: [number, number, number]) => {
    const channel = (value: number) => {
      const c = value / 255
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    }

    return (
      0.2126 * channel(rgb[0]) +
      0.7152 * channel(rgb[1]) +
      0.0722 * channel(rgb[2])
    )
  }

  const surface = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim()

  if (!surface) {
    throw new Error(`the token ${token} resolves to nothing`)
  }

  const behind = luminance(resolve(surface))

  return nodes.map((node) => {
    const colour = getComputedStyle(node).color
    const front = luminance(resolve(colour))
    const [lighter, darker] = front > behind ? [front, behind] : [behind, front]

    return {
      text: node.textContent.trim(),
      colour,
      ratio: Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100,
    }
  })
}

test("the chip reads the same on a dark page as on a light one", async ({
  page,
}) => {
  /** The pill's foot, which is the darkest thing under a chip's label and so
   *  the worst case for it. */
  const token = "--color-neutral-100"
  const chips = page.locator("main [data-slot='chip']")

  await page.goto("/components/chip")
  const light = await chips.evaluateAll(CONTRAST, token)
  expect(light.length).toBeGreaterThan(0)

  await inTheDark(page)
  await page.goto("/components/chip")
  await expect.poll(() => isDark(page)).toBe(true)

  const night = await chips.evaluateAll(CONTRAST, token)

  expect(
    night.map((chip) => chip.colour),
    "the pill is a light object: its labels do not turn with the page",
  ).toEqual(light.map((chip) => chip.colour))

  for (const chip of night) {
    expect(
      chip.ratio,
      `"${chip.text}" on the pill's own foot, in the dark`,
    ).toBeGreaterThanOrEqual(4.5)
  }
})

test("the FAQ heading reads the same on a dark page as on a light one", async ({
  page,
}) => {
  const token = "--color-beige-500"
  const heading = page.locator("[data-slot='faq'] h2")

  await page.goto("/specimens/faq")
  const light = await heading.evaluateAll(CONTRAST, token)

  await inTheDark(page)
  await page.goto("/specimens/faq")
  await expect.poll(() => isDark(page)).toBe(true)

  const night = await heading.evaluateAll(CONTRAST, token)

  expect(night).toHaveLength(1)
  expect(
    night[0]?.colour,
    "the band cannot turn dark, so the heading on it does not either",
  ).toBe(light[0]?.colour)
  expect(
    night[0]?.ratio,
    "on the band it is painted on",
  ).toBeGreaterThanOrEqual(4.5)
})
