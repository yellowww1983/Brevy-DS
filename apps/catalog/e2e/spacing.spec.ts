import { expect, test } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/getting-started/spacing"

/** The nine rungs the design reaches for, and the pixel each one owes. */
const SCALE = [
  [1, 4],
  [2, 8],
  [3, 12],
  [4, 16],
  [6, 24],
  [8, 32],
  [12, 48],
  [16, 64],
  [24, 96],
] as const

test("every bar is drawn at the size its step owes", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const drawn = await page
    .locator("[data-step]")
    .evaluateAll((nodes) =>
      nodes.map((node) => [
        Number(node.getAttribute("data-step")),
        Math.round(
          node.querySelector("[data-bar]")?.getBoundingClientRect().width ?? 0,
        ),
      ]),
    )

  expect(
    drawn,
    "a bar sized by anything other than Tailwind's own spacing would drift from the class beside it",
  ).toEqual(SCALE.map(([step, px]) => [step, px]))
})

test("every label reports what its own bar measures", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const wrong = await page.locator("[data-step]").evaluateAll((nodes) =>
    nodes
      .map((node) => {
        const width =
          node.querySelector("[data-bar]")?.getBoundingClientRect().width ?? 0
        const said = node.querySelector("[data-size]")?.textContent ?? ""
        const owed = `${String(Math.round(width))}px · ${String(Math.round((width / 16) * 1000) / 1000)}rem`

        return said === owed
          ? null
          : `${node.getAttribute("data-step") ?? ""}: says ${said}, measures ${owed}`
      })
      .filter((entry) => entry !== null),
  )

  expect(wrong).toEqual([])
})

test("the scale carries the steps the design draws and no others", async ({
  page,
}) => {
  await page.goto(PAGE)

  const steps = await page
    .locator("[data-step]")
    .evaluateAll((nodes) =>
      nodes.map((node) => Number(node.getAttribute("data-step"))),
    )

  expect(
    steps,
    "the logo strip's hand-fitted 40, 56 and 60 belong in the feedback file, not here",
  ).toEqual(SCALE.map(([step]) => step))
})

test("a step copies the class rather than the pixel", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto(PAGE)
  await measured(page)

  await page.getByRole("button", { name: "Copy p-6" }).click()

  expect(
    await page.evaluate(() => navigator.clipboard.readText()),
    "24px on the clipboard is a number nobody can paste into a class",
  ).toBe("p-6")
})
