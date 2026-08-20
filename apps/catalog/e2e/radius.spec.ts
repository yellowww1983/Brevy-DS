import { expect, test } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/getting-started/radius"

/** What each class owes, in the sizes this system ships rather than the ones
 *  the same names carry in stock Tailwind. */
const SCALE = [
  ["rounded-sm", 6],
  ["rounded-md", 8],
  ["rounded-lg", 10],
  ["rounded-2xl", 16],
] as const

test("every square is drawn at the radius its class owes", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const drawn = await page
    .locator("[data-radius]")
    .evaluateAll((nodes) =>
      nodes.map((node) => [
        node.getAttribute("data-radius"),
        Math.round(
          parseFloat(
            getComputedStyle(node.querySelector("[data-box]") ?? node)
              .borderTopLeftRadius,
          ),
        ),
      ]),
    )

  const scale = drawn.filter(([name]) => name !== "rounded-full")

  expect(
    scale,
    "these names carry different sizes in stock Tailwind, so drift here is silent",
  ).toEqual(SCALE.map(([name, px]) => [name, px]))
})

test("the full radius rounds a corner as far as it goes", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const radius = await page
    .locator('[data-radius="rounded-full"] [data-box]')
    .evaluate((node) => parseFloat(getComputedStyle(node).borderTopLeftRadius))

  expect(
    radius,
    "anything short of half the box would show a corner instead of a circle",
  ).toBeGreaterThan(32)
})

test("the leaf is the same shape wherever it is used", async ({ page }) => {
  await page.goto(PAGE)

  const corners = await page.locator(".rounded-leaf").evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node)
      return [
        style.borderTopLeftRadius,
        style.borderTopRightRadius,
        style.borderBottomRightRadius,
        style.borderBottomLeftRadius,
      ].join(" ")
    }),
  )

  expect(
    corners.length,
    "the page should show the leaf more than once",
  ).toBeGreaterThan(1)
  expect(
    [...new Set(corners)],
    "a leaf that differs between a button and a photograph is not a signature",
  ).toEqual(["6px 16px 6px 16px"])
})

test("a radius copies the class rather than the pixel", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto(PAGE)
  await measured(page)

  await page.getByRole("button", { name: "Copy rounded-2xl" }).click()

  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "rounded-2xl",
  )
})
