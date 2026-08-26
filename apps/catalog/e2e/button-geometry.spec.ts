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
