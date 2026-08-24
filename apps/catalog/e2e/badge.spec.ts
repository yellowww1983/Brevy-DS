import { expect, test } from "./catalog-test"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/components/badge"

test("every badge draws the website's box", async ({ page }) => {
  await page.goto(PAGE)

  const boxes = await page
    .locator("main [data-slot='badge']")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node)
        const icon = node.querySelector("svg")

        return {
          height: Math.round(node.getBoundingClientRect().height),
          radius: style.borderRadius,
          pad: style.paddingRight,
          font: `${style.fontSize}/${style.fontWeight}`,
          background: style.backgroundColor,
          color: style.color,
          icon: icon ? Math.round(icon.getBoundingClientRect().width) : null,
        }
      }),
    )

  expect(boxes.length).toBeGreaterThan(0)

  /** One box for every skin: 24 tall, radius 8, 8 aside, the label at 14
   *  SemiBold, and any icon at 16 rather than the app file's 12. */
  const shapes = new Set(
    boxes.map(
      (box) => `${String(box.height)}|${box.radius}|${box.pad}|${box.font}`,
    ),
  )
  expect([...shapes]).toEqual(["24|8px|8px|14px/600"])

  for (const box of boxes) {
    if (box.icon !== null) {
      expect(box.icon).toBe(16)
    }
  }

  /** Exactly the three drawn skins, and none of the app file's: nothing red,
   *  nothing blue. */
  const skins = new Set(boxes.map((box) => `${box.background} ${box.color}`))
  expect([...skins].sort()).toEqual(
    [
      "rgb(255, 255, 255) oklch(0.274 0.006 286.033)",
      "rgb(215, 228, 201) rgb(6, 110, 61)",
      "rgb(245, 242, 239) oklch(0.552 0.016 285.938)",
    ].sort(),
  )
})

test("the chip family draws its three shapes on the gradient", async ({
  page,
}) => {
  await page.goto("/components/chip")

  const chips = await page
    .locator("main [data-slot='chip']")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node)
        const count = node.querySelector("[data-slot='chip-count']")

        return {
          height: Math.round(node.getBoundingClientRect().height),
          radius: style.borderRadius,
          pad: style.paddingRight,
          font: `${style.fontSize}/${style.fontWeight}`,
          color: style.color,
          gradient: style.backgroundImage.includes("linear-gradient"),
          ring: getComputedStyle(node, "::before").backgroundImage,
          shadow: style.boxShadow,
          count: count
            ? `${String(Math.round(count.getBoundingClientRect().height))} ${getComputedStyle(count).backgroundColor}`
            : null,
        }
      }),
    )

  expect(chips.length).toBeGreaterThan(0)

  for (const chip of chips) {
    expect(chip.radius, "fully round, every one of them").toBe("9999px")
    expect(chip.gradient, "and painted with the gradient").toBe(true)
    expect(
      chip.ring,
      "the hairline overlay carries the drawn gradient, inside the edge",
    ).toContain("linear-gradient")
    expect(chip.shadow, "and no shadow stands in for it any more").toBe("none")
  }

  /** The three drawn shapes and nothing else. */
  const shapes = new Set(
    chips.map(
      (chip) => `${String(chip.height)}|${chip.pad}|${chip.font}|${chip.color}`,
    ),
  )
  expect([...shapes].sort()).toEqual(
    [
      "24|8px|14px/400|rgb(2, 54, 32)",
      "32|12px|14px/400|oklch(0.274 0.006 286.033)",
      "32|12px|16px/500|oklch(0.37 0.013 285.805)",
    ].sort(),
  )

  /** The eyebrow's counter: a 16px olive disc. */
  const counted = chips.filter((chip) => chip.count !== null)
  expect(counted.length).toBeGreaterThan(0)
  for (const chip of counted) {
    expect(chip.count).toBe("16 rgb(215, 228, 201)")
  }
})
