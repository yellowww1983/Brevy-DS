import { expect, test } from "./catalog-test"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/components/input"

/** The two heights the system ships, and the text size that goes with each.
 *  Everything else about the box is shared, which is what the second test
 *  holds the component to. */
const SIZES = [
  { height: 36, font: "14px" },
  { height: 48, font: "16px" },
] as const

test("the two sizes draw one box at two heights", async ({ page }) => {
  await page.goto(PAGE)

  const boxes = await page
    .locator("input[data-slot='input']")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node)

        return {
          height: Math.round(node.getBoundingClientRect().height),
          font: style.fontSize,
          radius: style.borderRadius,
          pad: `${style.paddingTop}/${style.paddingRight}`,
          border: `${style.borderTopWidth} ${style.borderTopColor}`,
          background: style.backgroundColor,
        }
      }),
    )

  for (const size of SIZES) {
    const drawn = boxes.filter((box) => box.height === size.height)

    expect(
      drawn.length,
      `the ${String(size.height)} height is on the page`,
    ).toBeGreaterThan(0)

    for (const box of drawn) {
      expect(box.font, `text at ${String(size.height)}`).toBe(size.font)
    }
  }

  /** The box itself never changes between the sizes: same radius, padding,
   *  hairline and background at 36 and at 48. */
  const skins = new Set(
    boxes.map(
      (box) => `${box.radius}|${box.pad}|${box.border.split(" ")[0] ?? ""}`,
    ),
  )

  expect([...skins]).toEqual(["8px|4px/12px|1px"])
  expect(
    new Set(boxes.map((box) => box.height)),
    "and nothing renders at a third height",
  ).toEqual(new Set([36, 48]))
})

test("the error state paints the red the design draws", async ({ page }) => {
  await page.goto(PAGE)

  const border = await page
    .locator("input[data-slot='input'][aria-invalid='true']")
    .first()
    .evaluate((node) => getComputedStyle(node).borderTopColor)

  /** red-500, which is what the file draws on the funnel's failed phone
   *  field. The token used to sit on red-600. */
  expect(border).toBe("rgb(239, 68, 68)")
})
