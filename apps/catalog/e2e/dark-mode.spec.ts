import { expect, test, type Page } from "./catalog-test"

/** Dark mode is read off the app file, which draws one for every component:
 *  a page is neutral-950, a card is neutral-900, a raised layer is
 *  neutral-800, every outline is flat white at a low alpha — 10% on a card
 *  (`17085:178010`), 15% on a field (`17086:205826`) — and text is
 *  `--foreground` over `--muted-foreground`. Those are the values the token
 *  file already binds, so what is asserted here is that the surfaces reach for
 *  them rather than carrying colours of their own.
 *
 *  Legibility is asserted with them, because a surface can take the right
 *  value and still be written on in the wrong one: that is how an answer sat
 *  at 1.9 to 1 on a card that had turned correctly. */

const inTheDark = async (page: Page) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
}

const isDark = async (page: Page) =>
  page.evaluate(() => document.documentElement.classList.contains("dark"))

test("the catalog opens light on a machine that prefers dark", async ({
  browser,
}) => {
  /** What is on screen here is the system's own light drawing. Someone
   *  arriving on a dark machine used to meet a dark page and have to work out
   *  that the design was not what they were looking at. Dark is a mode this
   *  catalog can show, reached by asking. */
  const context = await browser.newContext({ colorScheme: "dark" })
  const page = await context.newPage()

  await page.goto("/components/button")
  expect(
    await isDark(page),
    "the machine's preference is not the catalog's",
  ).toBe(false)

  await page.getByRole("button", { name: "Toggle color theme" }).click()
  expect(await isDark(page)).toBe(true)

  /** And the asking is remembered, which is the half that would make a
   *  default of light unbearable if it were missing. */
  await page.reload()
  await expect.poll(() => isDark(page)).toBe(true)

  await context.close()
})

/** What the app file draws, and what the token file binds for it. */
const NEUTRAL_950 = "oklch(0.145 0 none)"
const NEUTRAL_900 = "oklch(0.205 0 none)"
const NEUTRAL_800 = "oklch(0.269 0 none)"
const FLAT_WHITE_10 = "rgba(255, 255, 255, 0.1)"

const surfaces = [
  {
    name: "accordion card",
    path: "/components/accordion",
    slot: "[data-slot='accordion-item']",
    ground: NEUTRAL_900,
    text: "[data-slot='accordion-content'] div",
    floor: 4.5,
  },
  {
    name: "chat card",
    path: "/specimens/chat",
    slot: "[data-slot='chat']",
    ground: NEUTRAL_900,
    text: "textarea",
    floor: 4.5,
  },
  {
    name: "FAQ band",
    path: "/specimens/faq",
    slot: "[data-slot='faq']",
    ground: NEUTRAL_950,
    text: "h2",
    floor: 4.5,
  },
  {
    name: "footer band",
    path: "/specimens/footer",
    slot: "[data-slot='footer']",
    ground: NEUTRAL_950,
    text: "[data-slot='footer-about'] p",
    floor: 4.5,
  },
] as const

test("every surface takes the ground the app file draws for it", async ({
  page,
}) => {
  await inTheDark(page)
  await page.goto("/components/accordion")
  await expect.poll(() => isDark(page)).toBe(true)

  for (const surface of surfaces) {
    await page.goto(surface.path)

    const read = await page
      .locator(surface.slot)
      .first()
      .evaluate((node, textSelector) => {
        const style = getComputedStyle(node)
        const text = node.querySelector(textSelector)

        return {
          background: style.backgroundColor,
          gradient: style.backgroundImage,
          thread: getComputedStyle(node, "::before").backgroundImage,
          colour: text ? getComputedStyle(text).color : null,
        }
      }, surface.text)

    expect(read.background, `${surface.name}: the drawn ground`).toBe(
      surface.ground,
    )
    /** A band that painted a gradient in the light paints none here. */
    expect(
      read.gradient,
      `${surface.name}: no light gradient left`,
    ).not.toContain("beige")

    if (read.thread !== "none") {
      expect(
        read.thread,
        `${surface.name}: the thread goes flat white, not a neutral gradient`,
      ).toContain(FLAT_WHITE_10)
    }
  }
})

test("the chip steps into the neutral ramp and stays legible", async ({
  page,
}) => {
  const read = async () =>
    page
      .locator("main [data-slot='chip']")
      .nth(2)
      .evaluate((node) => ({
        gradient: getComputedStyle(node).backgroundImage,
        thread: getComputedStyle(node, "::before").backgroundImage,
        colour: getComputedStyle(node).color,
      }))

  await page.goto("/components/chip")
  const light = await read()
  expect(light.gradient).toContain("rgb(255, 255, 255)")

  await inTheDark(page)
  await page.goto("/components/chip")
  await expect.poll(() => isDark(page)).toBe(true)

  const night = await read()

  /** neutral-900 to neutral-800, which is a surface and the layer above it. */
  expect(night.gradient).toContain(NEUTRAL_900)
  expect(night.gradient).toContain(NEUTRAL_800)
  expect(night.thread).toContain(FLAT_WHITE_10)
  expect(
    night.colour,
    "the label is pinned in both directions, because a dark green is unreadable here",
  ).not.toBe(light.colour)
})

test("nothing on a dark surface is written below the legible floor", async ({
  page,
}) => {
  await inTheDark(page)
  await page.goto("/components/accordion")
  await expect.poll(() => isDark(page)).toBe(true)

  const failures: string[] = []

  for (const surface of surfaces) {
    await page.goto(surface.path)

    const ratio = await page
      .locator(surface.slot)
      .first()
      .evaluate((node, textSelector) => {
        const resolve = (colour: string) => {
          const canvas = document.createElement("canvas")
          canvas.width = 1
          canvas.height = 1
          const context = canvas.getContext("2d")

          if (!context) {
            throw new Error("no 2d context")
          }

          context.fillStyle = colour
          context.fillRect(0, 0, 1, 1)
          const data = context.getImageData(0, 0, 1, 1).data

          return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0] as const
        }

        const luminance = (rgb: readonly [number, number, number]) => {
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

        const text = node.querySelector(textSelector)

        if (!text) {
          throw new Error("the surface is missing its text")
        }

        const front = luminance(resolve(getComputedStyle(text).color))
        const behind = luminance(
          resolve(getComputedStyle(node).backgroundColor),
        )
        const [lighter, darker] =
          front > behind ? [front, behind] : [behind, front]

        return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100
      }, surface.text)

    if (ratio < surface.floor) {
      failures.push(`${surface.name} at ${String(ratio)}:1`)
    }
  }

  expect(
    failures,
    "these read at 1.9 and 2.56 to 1 before the surfaces were brought to the app file's values",
  ).toEqual([])
})

test("a pinned subtree stops the dark variant, not just the dark tokens", async ({
  page,
}) => {
  await inTheDark(page)
  await page.goto("/components/input")
  await expect.poll(() => isDark(page)).toBe(true)

  /** Built from classes the stylesheet already carries, so the probe measures
   *  the mechanism rather than a rule written for the test. `bg-white` with a
   *  `dark:` override is exactly the shape the Input ships. */
  const read = await page.evaluate(() => {
    const make = (parent: Element) => {
      const probe = document.createElement("div")
      probe.className = "bg-white dark:bg-input/30"
      parent.append(probe)
      return probe
    }

    const loose = make(document.body)

    const pinned = document.createElement("div")
    pinned.className = "light"
    document.body.append(pinned)
    const inside = make(pinned)

    const read = {
      loose: getComputedStyle(loose).backgroundColor,
      pinned: getComputedStyle(inside).backgroundColor,
    }

    loose.remove()
    pinned.remove()

    return read
  })

  expect(
    read.loose,
    "outside a pin, the dark variant still wins on a dark page",
  ).not.toBe("rgb(255, 255, 255)")
  expect(
    read.pinned,
    "inside one, the light value stands: the pin stops the variant",
  ).toBe("rgb(255, 255, 255)")
})
