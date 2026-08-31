import type { Locator } from "@playwright/test"

import { expect, test, type Page } from "./catalog-test"

const PAGE = "/components/icon-list"

/** What the file draws. The bare check is `23321:2569`, the small olive disc
 *  `25276:3983`, the large red disc `24966:1156`. */
const DRAWN = {
  glyph: 16,
  discSmall: 24,
  discLarge: 36,
  /** 8 beside a 16 glyph, 8 beside the 24 disc, 16 beside the 36. */
  gapSmall: "8px",
  gapLarge: "16px",
  /** 8 between check rows, 16 between small disc rows, 0 between large ones,
   *  which carry their own padding instead. */
  listCheck: "8px",
  listDiscSmall: "16px",
  listDiscLarge: "0px",
  caption: "14px",
  body: "16px",
  zinc800: "oklch(0.274 0.006 286.033)",
  zinc700: "oklch(0.37 0.013 285.805)",
  brand: "rgb(6, 110, 61)",
  red: "rgb(239, 68, 68)",
  neutral200: "oklch(0.922 0 none)",
}

const preview = (page: Page, section: string, caption: string) =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: section, exact: true }) })
    .locator("li")
    .filter({ hasText: caption })
    .first()

const readRow = (row: Locator) =>
  row.evaluate((node) => {
    const one = (selector: string) => node.querySelector(selector)
    const box = (element: Element | null) =>
      element ? Math.round(element.getBoundingClientRect().width) : null
    const style = getComputedStyle(node)
    const label = one("[data-slot='icon-list-label']")
    const disc = one("[data-slot='icon-list-disc']")
    const face = one("[data-slot='icon-list-face']")
    const glyph = one("svg")
    const marker = one("[data-slot='icon-list-marker']")

    return {
      gap: style.columnGap,
      align: style.alignItems,
      padding: style.padding,
      rule: `${style.borderBottomWidth} ${style.borderBottomColor}`,
      disc: box(disc),
      discRadius: disc ? getComputedStyle(disc).borderRadius : null,
      discShadow: disc ? getComputedStyle(disc).boxShadow : null,
      face: face ? getComputedStyle(face).backgroundImage : null,
      glyphColour: face ? getComputedStyle(face).color : null,
      glyph: box(glyph),
      stroke: glyph ? getComputedStyle(glyph).strokeWidth : null,
      markerHidden: marker?.getAttribute("aria-hidden"),
      label: label ? getComputedStyle(label).fontSize : null,
      labelColour: label ? getComputedStyle(label).color : null,
      /** The distance from the marker's right edge to the label's left, which
       *  is the gap the drawing measures. */
      column:
        label && marker
          ? Math.round(
              label.getBoundingClientRect().left -
                marker.getBoundingClientRect().right,
            )
          : null,
    }
  })

test("the bare check is the drawn 16 in the text's colour", async ({
  page,
}) => {
  await page.goto(PAGE)

  const list = preview(page, "Check", "Small · Plain").locator(
    "[data-slot='icon-list']",
  )
  const rows = list.locator("[data-slot='icon-list-row']")

  await expect(rows).toHaveCount(4)

  const read = await readRow(rows.first())

  expect(read.glyph, "the drawn 16 box").toBe(DRAWN.glyph)
  expect(read.gap).toBe(DRAWN.gapSmall)
  expect(read.column, "16 of glyph and 8 of gap put the text at 24").toBe(8)
  expect(read.label).toBe(DRAWN.caption)
  expect(read.labelColour).toBe(DRAWN.zinc800)
  /** No disc at all: the file draws this mark bare. */
  expect(read.discRadius).toBe("0px")
  expect(read.discShadow).toBe("none")
  expect(read.face).toBe("none")

  expect(
    await list.evaluate((node) => getComputedStyle(node).rowGap),
    "8 between the rows",
  ).toBe(DRAWN.listCheck)
})

test("the glyph takes the system's stroke, not the drawn 1", async ({
  page,
}) => {
  await page.goto(PAGE)

  /** DESIGN-FEEDBACK 73: three of the file's four marks are stroked at 1 and
   *  the fourth at 1.5, so the system's own weight settles it. */
  const strokes = await page
    .locator("[data-slot='icon-list-row'] svg")
    .evaluateAll((nodes) => [
      ...new Set(nodes.map((node) => getComputedStyle(node).strokeWidth)),
    ])

  expect(strokes, "one weight everywhere, and it is ours").toEqual(["1.5px"])
})

test("the heading sits over the list at caption in semibold", async ({
  page,
}) => {
  await page.goto(PAGE)

  const heading = preview(page, "Check", "Small · Plain").locator(
    "[data-slot='icon-list-heading']",
  )

  await expect(heading).toHaveText("Your eligible programs:")

  const read = await heading.evaluate((node) => {
    const style = getComputedStyle(node)
    const list = node.parentElement?.querySelector("[data-slot='icon-list']")
    return {
      size: style.fontSize,
      weight: style.fontWeight,
      colour: style.color,
      gap: list
        ? Math.round(
            list.getBoundingClientRect().top -
              node.getBoundingClientRect().bottom,
          )
        : null,
    }
  })

  expect(read.size, "caption, not a step of its own").toBe(DRAWN.caption)
  expect(read.weight).toBe("600")
  expect(read.colour).toBe(DRAWN.zinc800)
  expect(read.gap, "the list's own 8").toBe(8)
})

test("the small disc is the drawn olive ring", async ({ page }) => {
  await page.goto(PAGE)

  const list = preview(page, "Disc olive", "Small · Plain").locator(
    "[data-slot='icon-list']",
  )
  const read = await readRow(
    list.locator("[data-slot='icon-list-row']").first(),
  )

  expect(read.disc).toBe(DRAWN.discSmall)
  expect(read.discRadius).toBe("9999px")
  /** The drawn `0 1 2 0` at 5%, which is `shadow-xs`. */
  expect(read.discShadow).not.toBe("none")
  expect(read.gap).toBe(DRAWN.gapSmall)
  expect(read.glyph, "16 inside the ring at either size").toBe(DRAWN.glyph)
  expect(read.label).toBe(DRAWN.caption)

  /** olive-100 to olive-300 inside, and the mark in brand-500. */
  expect(read.face).toContain("rgb(241, 246, 236)")
  expect(read.face).toContain("rgb(220, 231, 207)")
  expect(read.glyphColour).toBe(DRAWN.brand)

  expect(
    await list.evaluate((node) => getComputedStyle(node).rowGap),
    "16 between the rows",
  ).toBe(DRAWN.listDiscSmall)
})

test("the large disc is the drawn red ring and pads its own row", async ({
  page,
}) => {
  await page.goto(PAGE)

  const list = preview(page, "Disc red", "Large · Plain").locator(
    "[data-slot='icon-list']",
  )
  const read = await readRow(
    list.locator("[data-slot='icon-list-row']").first(),
  )

  expect(read.disc).toBe(DRAWN.discLarge)
  expect(read.gap).toBe(DRAWN.gapLarge)
  expect(read.glyph, "still 16: only the ring grows").toBe(DRAWN.glyph)
  expect(read.label).toBe(DRAWN.body)
  expect(read.labelColour).toBe(DRAWN.zinc700)

  /** red-50 to red-200 inside, and the mark in red-500. */
  expect(read.face).toContain("rgb(254, 242, 242)")
  expect(read.face).toContain("rgb(254, 202, 202)")
  expect(read.glyphColour).toBe(DRAWN.red)

  /** The drawn row is 80 tall, padded 16 and 24, whether or not a rule
   *  separates it — so a plain list of wrapped lines cannot run together. */
  expect(read.padding).toBe("16px 24px")
  expect(await list.evaluate((node) => getComputedStyle(node).rowGap)).toBe(
    DRAWN.listDiscLarge,
  )
})

test("the olive disc reaches the size the file only draws in red", async ({
  page,
}) => {
  await page.goto(PAGE)

  /** DESIGN-FEEDBACK 74: tone and size are square to one another, which means
   *  a large olive ✓ the drawing has never carried. */
  const read = await readRow(
    preview(page, "Disc olive", "Large · Plain")
      .locator("[data-slot='icon-list-row']")
      .first(),
  )

  expect(read.disc).toBe(DRAWN.discLarge)
  expect(read.glyphColour).toBe(DRAWN.brand)
  expect(read.face).toContain("rgb(241, 246, 236)")
})

test("a marker beside two lines aligns to the first, not between them", async ({
  page,
}) => {
  await page.goto(PAGE)

  /** DESIGN-FEEDBACK 75: the file centres the marker on the whole paragraph,
   *  which only shows on a wrapped row. */
  const read = await preview(page, "Disc olive", "Large · Plain")
    .locator("[data-slot='icon-list-row']")
    .first()
    .evaluate((node) => {
      const label = node.querySelector("[data-slot='icon-list-label']")
      const disc = node.querySelector("[data-slot='icon-list-disc']")

      if (!label || !disc) {
        return null
      }

      const box = label.getBoundingClientRect()
      const leading = parseFloat(getComputedStyle(label).lineHeight)
      const ring = disc.getBoundingClientRect()

      return {
        lines: Math.round(box.height / leading),
        firstLineCentre: Math.round(leading / 2),
        markerCentre: Math.round(ring.top + ring.height / 2 - box.top),
      }
    })

  expect(read?.lines, "the fixture has to wrap for this to mean anything").toBe(
    2,
  )
  expect(read?.markerCentre).toBe(read?.firstLineCentre)
})

test("a divided list trades its gap for a rule", async ({ page }) => {
  await page.goto(PAGE)

  const list = preview(page, "Disc olive", "Small · Divided").locator(
    "[data-slot='icon-list']",
  )
  const rows = list.locator("[data-slot='icon-list-row']")
  const read = await readRow(rows.first())

  expect(
    await list.evaluate((node) => getComputedStyle(node).rowGap),
    "the gap closes, the padding takes over",
  ).toBe("0px")
  expect(read.padding).toBe("16px 0px")
  expect(read.rule).toBe(`1px ${DRAWN.neutral200}`)

  /** The last row carries no rule: a divider goes between, not beneath. */
  expect(
    await rows
      .last()
      .evaluate((node) => getComputedStyle(node).borderBottomWidth),
  ).toBe("0px")
})

test("the marker is decorative and the line speaks for it", async ({
  page,
}) => {
  await page.goto(PAGE)

  const read = await readRow(
    preview(page, "Check", "Small · Plain")
      .locator("[data-slot='icon-list-row']")
      .first(),
  )

  expect(read.markerHidden, "a check read before every item is noise").toBe(
    "true",
  )

  /** It is a list to a screen reader, not a stack of divs. */
  await expect(
    preview(page, "Check", "Small · Plain").getByRole("list"),
  ).toHaveCount(1)
  await expect(
    preview(page, "Check", "Small · Plain").getByRole("listitem"),
  ).toHaveCount(4)
})

test("on a dark page the discs hold and the rule turns", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(PAGE)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  const read = await readRow(
    preview(page, "Disc olive", "Small · Divided")
      .locator("[data-slot='icon-list-row']")
      .first(),
  )

  /** The disc is a brand surface and does not turn, the way the step marker
   *  and the CTA band's dark tone do not. */
  expect(read.face).toContain("rgb(241, 246, 236)")
  expect(read.glyphColour).toBe(DRAWN.brand)

  /** The rule does: flat white at 10%, which is what the app draws for every
   *  dark outline. Tailwind mixes the opacity in oklab, so that is how the
   *  browser hands the colour back. */
  expect(read.rule).toBe("1px oklab(0.999994 0.0000455678 0.0000200868 / 0.1)")

  const label = await preview(page, "Check", "Small · Plain")
    .locator("[data-slot='icon-list-label']")
    .first()
    .evaluate((node) => getComputedStyle(node).color)

  expect(label, "the bare glyph follows the text, being currentColor").toBe(
    "oklch(0.985 0 none)",
  )
})
