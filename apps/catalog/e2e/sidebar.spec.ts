import type { Page } from "@playwright/test"

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

  /** And it still narrows the list, which is the only reason it is there.
   *  The component list rather than every nested row in the sidebar: a block
   *  family and a foundation split into parts both nest rows of their own,
   *  and neither has anything to do with the field. */
  await search.fill("but")
  await expect(page.locator("aside [data-nav='components'] li a")).toHaveCount(
    1,
  )

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

/** The label of every row a section shows, in the order it shows them.
 *
 *  A family is one row here, named for the family, because that is what the
 *  reader sees: `Hero` with its shapes indented under it. The shapes are read
 *  separately by whoever cares about them. */
async function rowsOf(page: Page, section: string) {
  return await page
    .locator("aside details", { has: page.getByText(section, { exact: true }) })
    .first()
    .locator(":scope > div")
    .evaluate((root) =>
      [...root.children].flatMap((node) => {
        if (node instanceof HTMLElement && node.dataset.family !== undefined) {
          const heading = node.querySelector("p")

          return heading ? [heading.textContent.trim()] : []
        }

        if (node.tagName === "UL") {
          return [...node.querySelectorAll("li > a")].map((link) =>
            link.textContent.trim(),
          )
        }

        return [node.textContent.trim()]
      }),
    )
}

const alphabetical = (rows: readonly string[]) =>
  [...rows].sort((left, right) => left.localeCompare(right))

test("the three lists you look a name up in are alphabetical", async ({
  page,
}) => {
  await page.goto("/components/button")

  /** These three have no order of their own: a component is not before or
   *  after another component, so the registry's order was only the order they
   *  happened to be written in, and a reader looking for `Label` had to read
   *  all twelve to find out it was last. */
  for (const section of ["Components", "Blocks", "Screens"]) {
    const rows = await rowsOf(page, section)

    expect(
      rows.length,
      `${section} is empty, so it would pass on nothing`,
    ).toBeGreaterThan(0)
    expect(rows, `${section} is not in alphabetical order`).toEqual(
      alphabetical(rows),
    )
  }
})

test("a family sorts under its own name, and keeps its shapes in order", async ({
  page,
}) => {
  await page.goto("/components/button")

  /** `Hero` sorts as `Hero` rather than as `Centered`, which is where sorting
   *  before the grouping would have put it. Underneath, the file's order
   *  stands: the centered hero is the one it draws first. */
  const blocks = await rowsOf(page, "Blocks")
  expect(blocks).toContain("Hero")

  const shapes = await page
    .locator('aside [data-family="Hero"] a')
    .allTextContents()
  expect(shapes.map((text) => text.trim())).toEqual(["Centered", "Split"])
})

test("the two lists that already read as a sequence are left alone", async ({
  page,
}) => {
  await page.goto("/components/button")

  /** The guard on the paragraph above. A sort applied to the sidebar as a
   *  whole would pass every check up to here and quietly destroy the only
   *  order these two have: Foundations moves from the tokens outward, and
   *  Getting Started from the first page somebody reads to the second. */
  for (const section of ["Getting Started", "Foundations"]) {
    const rows = await rowsOf(page, section)

    expect(
      rows,
      `${section} has an order of its own and must keep it`,
    ).not.toEqual(alphabetical(rows))
  }
})

test("the registry's own order is by kind, and the sidebar did not touch it", async ({
  page,
}) => {
  /** The sort lives in the sidebar because the sidebar is presentation. The
   *  registry feeds `llms-full.txt`, which reads as a document rather than an
   *  index: foundations, then components, then blocks, then the screens. If
   *  the sort ever reaches the registry this is what notices. */
  const map = await (await page.request.get("/llms.txt")).text()

  const sections = [...map.matchAll(/^## (.+)$/gm)].map((match) => match[1])
  expect(sections).toEqual(["Foundations", "Components", "Blocks", "Optional"])

  const components = map
    .slice(map.indexOf("## Components"), map.indexOf("## Blocks"))
    .match(/^- \[([^\]]+)\]/gm)

  expect(components?.[0]).toContain("Button")
  expect(
    components?.slice(0, 3).join(),
    "the map lists components in the order the registry writes them",
  ).toContain("Input")
})
