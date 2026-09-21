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

test("the primary button fills its icon when it is pointed at or pressed", async ({
  page,
}) => {
  await page.goto("/components/button")

  /** Measured on the shipped site: every button on that ground carries
   *  `hover:[&_svg]:fill-olive-500`, so what was an outline on a dark ground
   *  becomes an outline around a pale one. The catalog drew the label and the
   *  ground changing and left the icon alone. */
  const icons = await fills(page)
  const primary = icons.filter((icon) => icon.primary)

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

test("no other variant fills an icon, in any state", async ({ page }) => {
  await page.goto("/components/button")

  /** The rule lives on one variant. Written as a whole-board check rather than
   *  a list of the others, so a variant added next month is covered without
   *  anyone remembering this file. */
  const others = (await fills(page)).filter((icon) => !icon.primary)

  expect(others.length).toBeGreaterThan(0)
  expect(
    [...new Set(others.map((icon) => icon.fill))],
    "every other variant leaves its icon unfilled",
  ).toEqual(["none"])
})
