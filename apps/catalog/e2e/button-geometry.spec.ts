import type { Page } from "@playwright/test"

import { expect, test } from "./catalog-test"

/** The board draws ghost as a square when it holds nothing but an icon and as a
 *  text-hugging pill when it holds a label. The component tells the two apart
 *  with :has(), which only resolves where CSS runs, not in jsdom. */
test("ghost is square when it carries an icon alone", async ({ page }) => {
  await page.goto("/components/button")

  const iconOnly = page
    .locator('[data-preview] button[aria-label="New chat"]')
    .first()
  const box = await iconOnly.boundingBox()

  expect(box).not.toBeNull()
  expect(box?.width).toBe(36)
  expect(box?.height).toBe(36)
})

test("ghost hugs its label when it carries one", async ({ page }) => {
  await page.goto("/components/button")

  const labelled = page
    .locator('[data-preview] button[data-slot="button"]', { hasText: "Button" })
    .last()
  const box = await labelled.boundingBox()

  expect(box?.height).toBe(36)
  expect(box?.width).toBeGreaterThan(36)
})

/** The footer's brand links. Four of them stand in a row in one preview, so
 *  the row is measured whole rather than one button at a time. */
test("the social buttons are the drawn square, thread and all", async ({
  page,
}) => {
  await page.goto("/components/button")

  const row = page
    .locator('[data-preview]:has([data-slot="button"][aria-label="Facebook"])')
    .first()
  const buttons = row.locator('[data-slot="button"]')

  await expect(buttons).toHaveCount(4)

  const read = await buttons.evaluateAll((nodes) =>
    nodes.map((node, index) => {
      const style = getComputedStyle(node)
      const before = getComputedStyle(node, "::before")
      const box = node.getBoundingClientRect()
      const mark = node.querySelector("svg")

      if (!mark) {
        throw new Error("a social button is missing its mark")
      }

      const previous = nodes[index - 1]?.getBoundingClientRect()

      return {
        label: node.getAttribute("aria-label"),
        width: Math.round(box.width),
        height: Math.round(box.height),
        radius: style.borderRadius,
        background: style.backgroundColor,
        shadow: style.boxShadow,
        border: style.borderColor,
        thread: before.backgroundImage,
        threadInset: `${before.top}/${before.padding}`,
        gapBefore: previous ? Math.round(box.left - previous.right) : null,
        mark: {
          size: Math.round(mark.getBoundingClientRect().width),
          colour: getComputedStyle(mark).color,
          weight: getComputedStyle(mark).strokeWidth,
          brand: mark.getAttribute("data-brand"),
        },
      }
    }),
  )

  expect(read.map((social) => social.label)).toEqual([
    "Facebook",
    "Instagram",
    "TikTok",
    "LinkedIn",
  ])

  for (const social of read) {
    expect(social.width, `${String(social.label)}: the drawn square`).toBe(36)
    expect(social.height).toBe(36)
    expect(social.radius, "radius 8, not the ghost's 10").toBe("8px")
    expect(social.background).toBe("rgb(255, 255, 255)")
    expect(social.shadow, "the drawn 0/1/2 at five per cent").toContain(
      "0px 1px 2px",
    )

    /** The outline is the system's thread, worn inside the edge, with the
     *  border underneath transparent so nothing doubles. */
    expect(social.thread, "the hairline overlay").toContain("linear-gradient")
    expect(social.threadInset).toBe("0px/1px")
    expect(social.border).toBe("rgba(0, 0, 0, 0)")

    /** A brand mark is drawn rather than composed on the icon grid, so it
     *  keeps the file's own weight where a lucide icon would be given 1.5. */
    expect(social.mark.size).toBe(16)
    expect(social.mark.colour, "zinc-700, as drawn").toBe(
      "oklch(0.37 0.013 285.805)",
    )
    expect(social.mark.weight, "the drawn 1, not the system's 1.5").toBe("1px")
    expect(social.mark.brand).not.toBeNull()
  }

  expect(
    read.slice(1).map((social) => social.gapBefore),
    "8 apart, the way the footer draws them",
  ).toEqual([8, 8, 8])
})

test("pointed at, a social button trades its thread for a ring", async ({
  page,
}) => {
  await page.goto("/components/button")

  const facebook = page
    .locator('[data-preview] [data-slot="button"][aria-label="Facebook"]')
    .first()

  const read = async () =>
    facebook.evaluate((node) => {
      const style = getComputedStyle(node)
      const before = getComputedStyle(node, "::before")
      const box = node.getBoundingClientRect()

      return {
        border: style.borderColor,
        thread: before.display,
        width: Math.round(box.width),
        height: Math.round(box.height),
      }
    })

  const resting = await read()
  expect(resting.thread, "at rest the thread is painted").not.toBe("none")
  expect(resting.border).toBe("rgba(0, 0, 0, 0)")

  await facebook.hover()

  await expect
    .poll(async () => (await read()).border, {
      message: "pointed at, the drawn ring comes on",
    })
    .toBe("rgb(2, 54, 32)")

  const hovered = await read()
  expect(hovered.thread, "and the thread goes out, so nothing doubles").toBe(
    "none",
  )
  expect(
    { width: hovered.width, height: hovered.height },
    "the box does not move",
  ).toEqual({ width: resting.width, height: resting.height })
})

/** olive-500, the colour the primary button's label stands in at rest. */
const OLIVE_500 = "rgb(215, 228, 201)"

/** Reads every button on the board that carries an icon, grouped by whether it
 *  is the primary variant and which state the board is forcing on it.
 *
 *  `bg-primary` is matched as a whole class rather than as a substring, because
 *  `outline` carries `hover:bg-primary` and a looser test counts it as primary. */
async function fills(page: Page) {
  return await page
    .locator("main [data-slot='button']")
    .evaluateAll((buttons) =>
      buttons.flatMap((button) => {
        const icon = button.querySelector("svg")

        if (!icon || !(button instanceof HTMLElement)) {
          return []
        }

        return [
          {
            primary: /(^|\s)bg-primary(\s|$)/.test(button.className),
            state: button.getAttribute("data-force") ?? "rest",
            fill: getComputedStyle(icon).fill,
          },
        ]
      }),
    )
}

/** Reads the board in one theme, set before the first style is computed so the
 *  fill is not read off a stale computed style. */
async function fillsIn(page: Page, theme: "light" | "dark") {
  await page.addInitScript((name) => {
    document.addEventListener("DOMContentLoaded", () => {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(name)
    })
  }, theme)
  await page.goto("/components/button")

  return await fills(page)
}

test("on a light page the primary button fills its icon", async ({ page }) => {
  /** Measured on the shipped site, where every button on that ground carries
   *  it: what was an outline on a dark ground becomes an outline around a pale
   *  one. Pressed as well as pointed at, because this variant's active state is
   *  its hover state and filling on one alone blinks the icon empty. */
  const primary = (await fillsIn(page, "light")).filter((icon) => icon.primary)

  expect(
    primary.length,
    "an empty board would pass on nothing",
  ).toBeGreaterThan(0)

  for (const icon of primary) {
    const owed = icon.state === "hover" || icon.state === "active"

    expect(
      icon.fill,
      `primary at ${icon.state}: ${owed ? "olive" : "nothing"}`,
    ).toBe(owed ? OLIVE_500 : "none")
  }
})

test("on a dark page it does not, in any state", async ({ page }) => {
  /** The one thing here that was decided rather than measured off a drawing,
   *  and the numbers that decided it. Olive on white is 1.33 to 1 against the
   *  ground against the outline's 13.54, so the fill reads as a tint. On near
   *  black the same olive is 14.92 and the outline 4.49, so the quietest part
   *  of the icon becomes the loudest thing on the button.
   *
   *  Nothing takes its place. The ground going from brand-vivid to nothing is
   *  already a 4.49 to 1 change, so the signal is made without it. */
  const primary = (await fillsIn(page, "dark")).filter((icon) => icon.primary)

  expect(primary.length).toBeGreaterThan(0)
  expect(
    [...new Set(primary.map((icon) => icon.fill))],
    "the icon is the same in every state on a dark page",
  ).toEqual(["none"])
})

test("no other variant fills an icon, in any state or theme", async ({
  page,
}) => {
  /** The rule lives on one variant. Written as a whole-board check rather than
   *  a list of the others, so a variant added next month is covered without
   *  anyone remembering this file. */
  const others = (await fillsIn(page, "light")).filter((icon) => !icon.primary)

  expect(others.length).toBeGreaterThan(0)
  expect(
    [...new Set(others.map((icon) => icon.fill))],
    "every other variant leaves its icon unfilled",
  ).toEqual(["none"])
})
