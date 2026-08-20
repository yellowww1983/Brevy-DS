import { expect, test } from "./catalog-test"

test("every sidebar entry is either a working link or plainly inert", async ({
  page,
}) => {
  await page.goto("/components/button")

  /** Entries graduate from inert to linked as pages land, and Colors was the
   *  last one, so the count is deliberately not pinned. What has to hold either way
   *  is that an inert entry is never an anchor, because an anchor with nowhere
   *  to go is a link that silently does nothing. */
  const pending = page.locator('aside [aria-disabled="true"]')

  const tags = await pending.evaluateAll((nodes) =>
    nodes.map((node) => node.tagName),
  )
  expect(tags.filter((tag) => tag === "A")).toEqual([])

  const links = await page
    .locator("aside nav a")
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("href") ?? ""),
    )

  expect(
    links.length,
    "with nothing inert left to check, an empty sidebar would otherwise pass",
  ).toBeGreaterThan(0)

  const responses = await Promise.all(
    [...new Set(links)].map(async (href) => ({
      href,
      status: (await page.request.get(href)).status(),
    })),
  )

  expect(
    responses.filter((entry) => entry.status !== 200),
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
