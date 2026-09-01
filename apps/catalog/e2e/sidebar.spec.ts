import { expect, test } from "./catalog-test"

test("the way in is the introduction, not the component list", async ({
  page,
}) => {
  /** Nothing covered this, which is how it came to point at `/components` —
   *  a list of twelve cards answering a question nobody has asked yet. */
  await page.goto("/")

  await expect(page).toHaveURL(/\/getting-started\/introduction$/)
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(
    "Components",
  )
})

test("the logo goes where the root goes", async ({ page }) => {
  await page.goto("/components/button")

  /** They used to disagree, so the way in depended on whether you typed the
   *  address or pressed the logo. */
  await expect(page.locator("aside a").first()).toHaveAttribute(
    "href",
    "/getting-started/introduction",
  )
})

test("the toggle stands before the search rather than in its place", async ({
  page,
}) => {
  const toggle = page.getByRole("button", { name: /the navigation/ })
  const search = page.getByRole("searchbox", { name: "Search components" })

  await page.goto("/components")

  /** Both, in that order. The toggle arrived beside the field rather than
   *  instead of it, and the two are easy to confuse because the field is
   *  absent everywhere else by design. */
  await expect(toggle).toBeVisible()
  await expect(search).toBeVisible()

  const left = await toggle.boundingBox()
  const right = await search.boundingBox()

  expect(left?.x ?? 0).toBeLessThan(right?.x ?? 0)

  /** And it still narrows the list, which is the only reason it is there. */
  await search.fill("but")
  await expect(page.locator("aside nav ul li a")).toHaveCount(3)

  /** Off the component pages the field is absent and the toggle is not. */
  await page.goto("/blocks/tiles")

  await expect(toggle).toBeVisible()
  await expect(search).toHaveCount(0)
})

test("the bar is indented to the page's column, not to itself", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/components/button")

  /** The bar carried 24 where the page carries 48, which nobody could see
   *  until something stood at the left end of it. */
  const left = async (locator: ReturnType<typeof page.locator>) =>
    Math.round((await locator.boundingBox())?.x ?? -1)

  const toggle = await left(
    page.getByRole("button", { name: /the navigation/ }),
  )

  expect(toggle).toBe(await left(page.locator("nav[aria-label='Breadcrumb']")))
  expect(toggle).toBe(await left(page.locator("main h1")))
  expect(toggle).toBe(await left(page.locator("main [data-preview]").first()))

  /** And it holds when the navigation is put away and the column moves. */
  await page.getByRole("button", { name: /the navigation/ }).click()

  const moved = await left(page.getByRole("button", { name: /the navigation/ }))

  expect(moved).toBeLessThan(toggle)
  expect(moved).toBe(await left(page.locator("main h1")))
})

test("the navigation can be put away, and the page takes the room", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/blocks/tiles")

  const nav = page.locator("#catalog-nav")
  const toggle = page.getByRole("button", { name: /the navigation/ })
  const room = () =>
    page
      .locator("main")
      .evaluate((node) => Math.round(node.getBoundingClientRect().width))

  await expect(nav).toBeVisible()
  await expect(toggle).toHaveAttribute("aria-expanded", "true")

  const narrow = await room()

  await toggle.click()

  await expect(nav).toBeHidden()
  await expect(toggle).toHaveAttribute("aria-expanded", "false")
  /** The point of it: a preview drawn at 1440 gets the window. */
  expect(await room()).toBeGreaterThan(narrow)

  await toggle.click()

  await expect(nav).toBeVisible()
  expect(await room()).toBe(narrow)
})

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
  await expect(sections).toHaveCount(5)

  const open = () =>
    sections.evaluateAll((nodes) =>
      nodes.map((node) => node instanceof HTMLDetailsElement && node.open),
    )
  expect(await open()).toEqual([true, true, true, true, true])

  await page.locator("aside details summary").first().click()
  expect(await open()).toEqual([false, true, true, true, true])
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
