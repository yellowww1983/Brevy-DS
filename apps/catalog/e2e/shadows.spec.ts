import { expect, test } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/getting-started/shadows"

/** What each class owes on its first layer, in the order the page lists them.
 *  These are Tailwind's own values, which the design reproduces exactly. */
const SCALE = [
  ["shadow-xs", "1px down, 2px blur"],
  ["shadow-md", "4px down, 6px blur"],
  ["shadow-lg", "10px down, 15px blur"],
  ["shadow-xl", "20px down, 25px blur"],
  ["shadow-2xl", "25px down, 50px blur"],
] as const

test("every label reports the shadow its own tile carries", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const drawn = await page
    .locator("[data-shadow]")
    .evaluateAll((nodes) =>
      nodes.map((node) => [
        node.getAttribute("data-shadow"),
        node.querySelector("[data-size]")?.textContent ?? "",
      ]),
    )

  expect(drawn).toEqual(SCALE.map(([name, size]) => [name, size]))
})

test("each step lifts further than the one before it", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const blur = await page
    .locator("[data-shadow] [data-tile]")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        /** Parsed here rather than shared with the component: a test that
         *  reuses the code it checks cannot catch a fault in that code. The
         *  four transparent slots Tailwind reserves for rings are skipped. */
        const painted = getComputedStyle(node)
          .boxShadow.split(/,(?![^(]*\))/)
          .find((layer) => !/,\s*0\)/.test(layer))
        const lengths = (painted ?? "")
          .replace(/rgba?\([^)]*\)/, "")
          .match(/-?\d+(\.\d+)?px/g)

        return parseFloat(lengths?.[2] ?? "0")
      }),
    )

  expect(blur, "a scale whose steps do not grow is not a scale").toEqual(
    [...blur].sort((a, b) => a - b),
  )
  expect(new Set(blur).size, "two steps blurring the same is a duplicate").toBe(
    blur.length,
  )
})

test("a shadow is visible against the surface behind it, in both themes", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  /** A shadow that does not darken the stage it falls on is a shadow nobody
   *  can see. Dark mode is where this fails: a black shadow on a near-black
   *  page shows nothing at all. */
  const separation = () =>
    page.evaluate(() => {
      const stage = document.querySelector("[data-stage]")
      const tile = document.querySelector("[data-tile]")

      if (!stage || !tile) {
        return 0
      }

      const read = (value: string) => {
        const canvas = document.createElement("canvas")
        canvas.width = 1
        canvas.height = 1
        const context = canvas.getContext("2d")

        if (!context) {
          return 0
        }

        context.fillStyle = value
        context.fillRect(0, 0, 1, 1)
        const [red = 0, green = 0, blue = 0] = [
          ...context.getImageData(0, 0, 1, 1).data,
        ]

        return (red + green + blue) / 3
      }

      return Math.abs(
        read(getComputedStyle(stage).backgroundColor) -
          read(getComputedStyle(tile).backgroundColor),
      )
    })

  expect(
    await separation(),
    "the tile has to differ from its stage or there is nothing to cast onto",
  ).toBeGreaterThan(8)

  await page.getByRole("button", { name: "Toggle color theme" }).click()
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  expect(
    await separation(),
    "dark is where a shadow disappears",
  ).toBeGreaterThan(8)
})

test("a step copies the class rather than the offset", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto(PAGE)
  await measured(page)

  await page.getByRole("button", { name: "Copy shadow-md" }).click()

  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "shadow-md",
  )
})
