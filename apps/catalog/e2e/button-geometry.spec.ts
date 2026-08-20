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
