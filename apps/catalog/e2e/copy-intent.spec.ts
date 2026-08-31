import { expect, test } from "./catalog-test"

const COPY = 'main button[aria-label^="Copy the prompt"]'

test("a component offers one prompt per real choice, not per state", async ({
  page,
}) => {
  await page.goto("/components/button")

  const sentences = await page
    .locator(COPY)
    .evaluateAll((nodes) =>
      nodes.map((node) =>
        (node.getAttribute("aria-label") ?? "").replace(
          "Copy the prompt: ",
          "",
        ),
      ),
    )

  expect(
    sentences,
    "the State axis describes how a component looks, so it is never a prompt",
  ).toEqual([
    "Use the Brevy Button: primary, with a text label.",
    "Use the Brevy Button: primary, with an icon before the label.",
    "Use the Brevy Button: primary at the compact height, with an icon before the label.",
    "Use the Brevy Button: outlined, with a text label.",
    "Use the Brevy Button: outlined, with an icon before the label.",
    "Use the Brevy Button: outlined, with an icon and no label.",
    "Use the Brevy Button: soft green, with a text label.",
    "Use the Brevy Button: ghost, with a text label.",
    "Use the Brevy Button: ghost, with an icon and no label.",
    "Use the Brevy Button: the chat's round send, an arrow and no label.",
    "Use the Brevy Button: the footer's brand links, four in a row.",
  ])
})

test("every component offers something to copy", async ({ page }) => {
  /** A component with no axes has no choice to name, and a prompt without a
   *  choice is the vagueness this whole feature avoids — so the page draws no
   *  button at all. There is no longer a component in that state: the one
   *  that was, the app's Card, shipped a vocabulary the website never draws
   *  and is gone. This walks the list rather than naming a subject, so the
   *  day something lands axis-less it fails here instead of quietly shipping
   *  a page nobody can copy from. */
  await page.goto("/components")

  const slugs = await page
    .locator("a[href^='/components/']")
    .evaluateAll((nodes) =>
      [
        ...new Set(
          nodes.flatMap((node) => {
            const href = node.getAttribute("href")
            const slug = href?.split("/components/")[1]
            return slug ? [slug] : []
          }),
        ),
      ].sort(),
    )

  expect(slugs.length).toBeGreaterThan(0)
  expect(slugs, "the app's Card is gone from the catalog").not.toContain("card")

  for (const slug of slugs) {
    await page.goto(`/components/${slug}`)
    await expect(
      page.locator(COPY),
      `${slug} names no choice, so its page offers no prompt`,
    ).not.toHaveCount(0)
  }
})

test("the prompt reaches the clipboard and the button says so", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/components/badge")

  const button = page.locator(COPY).last()
  await expect(button).toHaveText("Copy")

  await button.click()

  await expect(button).toHaveText("Copied")
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "Use the Brevy Badge: on the quiet beige.",
  )
  await expect(button).toHaveText("Copy", { timeout: 4000 })
})
