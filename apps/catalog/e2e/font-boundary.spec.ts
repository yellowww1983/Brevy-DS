import { expect, test, type Page } from "./catalog-test"

const CATALOG_FACE = "Inter"
const SYSTEM_FACE = "Rethink Sans"
const FONT_FAMILY_CLASS = /\bfont-(sans|serif|mono|catalog)\b/

const firstFamily = (stack: string) =>
  stack
    .split(",")[0]
    ?.trim()
    .replace(/^["']|["']$/g, "") ?? ""

async function routes(page: Page) {
  await page.goto("/components")

  const hrefs = await page
    .locator('aside a[href^="/components"], header a[href^="/components"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("href") ?? ""),
    )

  return [...new Set(hrefs)].filter(Boolean).sort()
}

test("every design system element renders in the system face", async ({
  page,
}) => {
  const paths = await routes(page)
  expect(paths.length).toBeGreaterThan(1)

  const offenders: string[] = []
  let inspected = 0

  for (const path of paths) {
    await page.goto(path)

    const families = await page.locator("[data-slot]").evaluateAll((nodes) =>
      nodes.map((node) => ({
        slot: node.getAttribute("data-slot") ?? "?",
        family: getComputedStyle(node).fontFamily,
      })),
    )

    inspected += families.length

    for (const { slot, family } of families) {
      if (firstFamily(family) !== SYSTEM_FACE) {
        offenders.push(
          `${path} → [data-slot="${slot}"] resolves to ${firstFamily(family)}`,
        )
      }
    }
  }

  expect(
    inspected,
    "no design system elements were found on any route: the selector or the routes are wrong",
  ).toBeGreaterThan(0)

  expect(
    offenders,
    `Design system elements must inherit ${SYSTEM_FACE}. A surface that renders components ` +
      `outside a preview frame leaks the catalog face into them.`,
  ).toEqual([])
})

test("catalog chrome renders in the catalog face", async ({ page }) => {
  await page.goto("/components/button")

  const chrome = page.locator(
    "aside nav a, h1, nav[aria-label='Breadcrumb'] span",
  )
  const families = await chrome.evaluateAll((nodes) =>
    nodes.map((node) => getComputedStyle(node).fontFamily),
  )

  expect(families.length).toBeGreaterThan(0)
  expect(
    families.map(firstFamily).filter((face) => face !== CATALOG_FACE),
  ).toEqual([])
})

test("components carry no font family of their own", async ({ page }) => {
  await page.goto("/components/button")

  const button = page
    .locator('[data-preview] button[data-slot="button"]')
    .first()
  const declared = await button.evaluate(
    (node) => node.getAttribute("class") ?? "",
  )

  expect(declared).not.toMatch(FONT_FAMILY_CLASS)
  await expect(button).toHaveCSS("font-family", new RegExp(SYSTEM_FACE))
})

test("client-side navigation keeps the app alive", async ({ page }) => {
  const failures: string[] = []
  page.on("pageerror", (error) =>
    failures.push(error.message.split("\n")[0] ?? error.message),
  )

  await page.goto("/components")

  const links = page.locator("aside nav a")
  const count = await links.count()
  expect(count).toBeGreaterThan(1)

  for (let index = 0; index < count; index++) {
    await links.nth(index).click()
    await expect(page.locator("main h1")).toBeVisible()
  }

  expect(
    failures,
    "a soft navigation threw. Hard page loads hide errors that only fire when React renders on the client",
  ).toEqual([])
})
