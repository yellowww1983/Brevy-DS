import { expect, test, type Page } from "./catalog-test"
import { slotFaces } from "./settled"

const CATALOG_FACE = "Inter"
/** Both of the system's own faces. The leak this guards against is the
 *  catalog's Inter reaching a component; a component deliberately set in the
 *  serif — a heading, or the marker that runs under one — is not one. */
const SYSTEM_FACES = ["Rethink Sans", "Hedvig Letters Serif"]
const SYSTEM_FACE = SYSTEM_FACES[0] ?? "Rethink Sans"
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

    const families = await slotFaces(page)

    inspected += families.length

    for (const { slot, family } of families) {
      if (!SYSTEM_FACES.includes(firstFamily(family))) {
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
    `Design system elements must render in one of the system's own faces ` +
      `(${SYSTEM_FACES.join(" or ")}). A surface that renders components outside ` +
      `a preview frame leaks the catalog face into them.`,
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

  /** Addressed by href rather than by position. A soft navigation re-renders
   *  the sidebar, and a locator holding the tenth link can be pointing at a
   *  node that has been replaced by the time the click lands. */
  const hrefs = await page
    .locator("aside nav a")
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("href") ?? ""),
    )

  expect(hrefs.length).toBeGreaterThan(1)

  for (const href of hrefs) {
    await page.locator(`aside nav a[href="${href}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${href}$`))
    await expect(page.locator("main h1")).toBeVisible()
  }

  expect(
    failures,
    "a soft navigation threw. Hard page loads hide errors that only fire when React renders on the client",
  ).toEqual([])
})

test("every framed specimen renders in the product's faces, not the catalog's", async ({
  page,
}) => {
  /** The frames are found by crawling rather than listed here, so a specimen
   *  added later is covered the moment a page frames it. */
  await page.goto("/components")

  const pages = await page
    .locator("aside nav a")
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("href") ?? ""),
    )

  const offenders: string[] = []
  let frames = 0
  let inspected = 0

  for (const path of [...new Set(pages)].filter(Boolean)) {
    await page.goto(path)

    const sources = await page
      .locator("iframe")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("src") ?? ""),
      )

    for (const source of [...new Set(sources)].filter(Boolean)) {
      await page.goto(source)
      frames += 1

      const families = await page
        .locator("[data-slot], textarea, input")
        .evaluateAll((nodes) =>
          nodes.map((node) => ({
            what: node.getAttribute("data-slot") ?? node.tagName.toLowerCase(),
            family: getComputedStyle(node).fontFamily,
          })),
        )

      inspected += families.length

      for (const { what, family } of families) {
        if (firstFamily(family) === CATALOG_FACE) {
          offenders.push(`${source} → ${what} renders in ${CATALOG_FACE}`)
        }
      }
    }
  }

  expect(
    frames,
    "no framed specimens were found: the crawl is wrong",
  ).toBeGreaterThan(0)
  expect(inspected).toBeGreaterThan(0)
  expect(
    offenders,
    `A specimen is the product, not the catalog. Anything inside a frame that ` +
      `resolves to ${CATALOG_FACE} is inheriting the catalog's body face.`,
  ).toEqual([])
})

test("the catalog's code face is a real one", async ({ page }) => {
  await page.goto("/blocks/faq")

  const code = page.locator("main code").first()
  await expect(code).toBeVisible()

  const family = await code.evaluate(
    (node) => getComputedStyle(node).fontFamily,
  )

  expect(
    firstFamily(family),
    "the token names Geist Mono, so the catalog has to load it or the browser falls back to Courier",
  ).toBe("Geist Mono")
  expect(
    await page.evaluate(() => document.fonts.check("14px 'Geist Mono'")),
    "and it has to be loaded, not merely named",
  ).toBe(true)
})
