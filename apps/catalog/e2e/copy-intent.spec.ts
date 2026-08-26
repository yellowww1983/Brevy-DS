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

test("a component with no axes offers nothing to copy", async ({ page }) => {
  await page.goto("/components/card")

  await expect(
    page.locator(COPY),
    "no axis means no choice, and a prompt without a choice is the vagueness this avoids",
  ).toHaveCount(0)
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
