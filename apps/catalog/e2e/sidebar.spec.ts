import { expect, test } from "@playwright/test"

test("nothing inert is reachable as a link", async ({ page }) => {
  await page.goto("/components/button")

  const pending = page.locator('aside [aria-disabled="true"]')
  await expect(pending).toHaveCount(4)

  const tags = await pending.evaluateAll((nodes) =>
    nodes.map((node) => node.tagName),
  )
  expect(tags.filter((tag) => tag === "A")).toEqual([])

  const links = await page
    .locator("aside nav a")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")))

  expect(
    links.filter((href) => !href?.startsWith("/components/")),
    "every link inside the sidebar nav must point at a route that exists",
  ).toEqual([])
})

test("every section is expanded on load and collapses on click", async ({
  page,
}) => {
  await page.goto("/components/button")

  const sections = page.locator("aside details")
  await expect(sections).toHaveCount(4)

  const open = () =>
    sections.evaluateAll((nodes) =>
      nodes.map((node) => node instanceof HTMLDetailsElement && node.open),
    )
  expect(await open()).toEqual([true, true, true, true])

  await page.locator("aside details summary").first().click()
  expect(await open()).toEqual([false, true, true, true])
})

test("the rail marks the active component and nothing else", async ({
  page,
}) => {
  await page.goto("/components/badge")

  const marked = await page
    .locator("aside nav a")
    .evaluateAll((nodes) =>
      nodes
        .filter((node) => getComputedStyle(node, "::before").width === "2px")
        .map((node) => node.textContent),
    )

  expect(marked).toEqual(["Badge"])
})
