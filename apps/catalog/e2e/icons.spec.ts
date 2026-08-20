import { expect, test } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/getting-started/icons"

/** A class, the pixels it renders, and the stroke on screen. The stroke is the
 *  same at every size on purpose: taken out of the glyph's scaling so a small
 *  icon does not read thinner than a large one. */
const SIZES = [
  ["size-4", 16, 1.5],
  ["size-5", 20, 1.5],
  ["size-6", 24, 1.5],
  ["size-8", 32, 1.5],
] as const

test("each size renders the pixels its class owes", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const drawn = await page
    .locator("[data-icon-size]")
    .evaluateAll((nodes) =>
      nodes.map((node) => [
        node.getAttribute("data-icon-size"),
        Math.round(
          node.querySelector("svg")?.getBoundingClientRect().width ?? 0,
        ),
      ]),
    )

  expect(drawn).toEqual(SIZES.map(([name, px]) => [name, px]))
})

test("the stroke is 1.5 on screen at every size", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const strokes = await page.locator("[data-icon-size]").evaluateAll((nodes) =>
    nodes.map((node) => {
      const svg = node.querySelector("svg")

      if (!svg) {
        return 0
      }

      const shape = svg.querySelector("path, circle, line, polyline, polygon")
      const scaled =
        shape && getComputedStyle(shape).vectorEffect === "non-scaling-stroke"
          ? 1
          : svg.getBoundingClientRect().width / 24

      return (
        Math.round(
          parseFloat(getComputedStyle(svg).strokeWidth) * scaled * 100,
        ) / 100
      )
    }),
  )

  expect(
    strokes,
    "lucide ships 2 as an attribute, so a missing icon-stroke shows up here",
  ).toEqual(SIZES.map(([, , stroke]) => stroke))
})

test("every label reports what its own icon renders", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const wrong = await page.locator("[data-icon-size]").evaluateAll((nodes) =>
    nodes
      .map((node) => {
        const svg = node.querySelector("svg")
        const width = svg?.getBoundingClientRect().width ?? 0
        const declared = parseFloat(
          svg ? getComputedStyle(svg).strokeWidth : "0",
        )
        const owed = `${String(Math.round(width))}px · ${String(
          Math.round(declared * 100) / 100,
        )} stroke`
        const said = node.querySelector("[data-size]")?.textContent ?? ""

        return said === owed ? null : `${said} against ${owed}`
      })
      .filter((entry) => entry !== null),
  )

  expect(wrong).toEqual([])
})

test("a button normalises the icon it is handed", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const inside = await page
    .locator("[data-component-demo] button svg")
    .first()
    .evaluate((svg) => ({
      size: Math.round(svg.getBoundingClientRect().width),
      stroke: parseFloat(getComputedStyle(svg).strokeWidth),
    }))

  expect(
    inside,
    "scoped to the demo: the page's own copy button carries a smaller icon",
  ).toEqual({ size: 24, stroke: 1.5 })
})

test("an icon copies its name rather than a class", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto(PAGE)
  await measured(page)

  await page.getByRole("button", { name: "Copy ChevronDown" }).click()

  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "ChevronDown",
  )
})
