import { expect, test } from "./catalog-test"
import { measured } from "./settled"

const PAGE = "/blocks/logo-cloud"
const SPECIMEN = "/specimens/logo-cloud"

/** The band as the file draws it (`22616:8666`) and as the live page runs it —
 *  the file draws it standing still, so the motion is measured off brevy.com. */
const DRAWN = {
  band: 122,
  narrow: 90,
  olive500: "rgb(215, 228, 201)",
  gap: "40px",
  marks: 4,
  lap: "40s",
}

test("the band is a band and not a section", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='logo-cloud']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        height: Math.round(node.getBoundingClientRect().height),
        ground: style.backgroundColor,
        padding: style.padding,
        clipped: style.overflow,
        label: node.getAttribute("aria-label"),
      }
    })

  expect(read.height).toBe(DRAWN.band)
  expect(read.ground).toBe(DRAWN.olive500)
  /** Every other section in the file breathes 96 above and below. This one is
   *  given none, which is what makes it a band. */
  expect(read.padding).toBe("0px")
  expect(read.clipped).toBe("hidden")
  /** Without it the band announces a list of pictures with no reason for
   *  being there. */
  expect(read.label).toBeTruthy()
})

test("the marks are doubled, and the copy is not announced twice", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const rows = await page
    .locator("[data-slot='logo-cloud-row']")
    .evaluateAll((nodes) =>
      nodes.map((node) => ({
        hidden: node.getAttribute("aria-hidden"),
        width: Math.round(node.getBoundingClientRect().width),
        marks: node.querySelectorAll("[data-slot='logo-cloud-logo']").length,
        gap: getComputedStyle(node).gap,
      })),
    )

  expect(rows).toHaveLength(2)
  expect(rows[0]?.hidden).toBeNull()
  /** The spare copy exists so the loop has no seam, not so a reader hears the
   *  partners twice. */
  expect(rows[1]?.hidden).toBe("true")
  expect(rows[0]?.marks).toBe(DRAWN.marks)
  expect(rows[1]?.marks).toBe(DRAWN.marks)
  expect(rows[0]?.gap).toBe(DRAWN.gap)
  expect(rows[0]?.width).toBe(rows[1]?.width)

  const track = await page
    .locator("[data-slot='logo-cloud-track']")
    .evaluate((node) => Math.round(node.getBoundingClientRect().width))

  /** The slide is exactly one copy's width, so it can only be seamless if the
   *  track is exactly two of them. */
  expect(track).toBe((rows[0]?.width ?? 0) * 2)
})

test("the band scrolls, and holds under the cursor", async ({ page }) => {
  await page.goto(SPECIMEN)

  const state = () =>
    page
      .locator("[data-slot='logo-cloud-track']")
      .evaluate((node) => getComputedStyle(node).animationPlayState)

  const animation = await page
    .locator("[data-slot='logo-cloud-track']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        name: style.animationName,
        lap: style.animationDuration,
        timing: style.animationTimingFunction,
        laps: style.animationIterationCount,
      }
    })

  expect(animation.name).toBe("marquee")
  expect(animation.lap).toBe(DRAWN.lap)
  expect(animation.timing).toBe("linear")
  expect(animation.laps).toBe("infinite")

  /** It is really moving, not merely declared to be. */
  const at = () =>
    page
      .locator("[data-slot='logo-cloud-track']")
      .evaluate((node) => node.getBoundingClientRect().x)

  const start = await at()
  await expect.poll(async () => (await at()) !== start).toBe(true)

  expect(await state()).toBe("running")

  /** The band is the hover target and not the track: a cursor cannot hold
   *  still on a strip that is sliding out from under it. */
  const box = await page.locator("[data-slot='logo-cloud']").boundingBox()
  await page.mouse.move(
    (box?.x ?? 0) + (box?.width ?? 0) / 2,
    (box?.y ?? 0) + (box?.height ?? 0) / 2,
  )

  await expect.poll(state).toBe("paused")

  await page.mouse.move((box?.x ?? 0) + (box?.width ?? 0) / 2, -20)
  await expect.poll(state).toBe("running")
})

test("the sliding stops for anyone who asked it to", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='logo-cloud-track']")
    .evaluate((node) => getComputedStyle(node).animationName)

  expect(read).toBe("none")

  /** The band still reads. Only the sliding goes. */
  await expect(
    page.locator("[data-slot='logo-cloud-logo']").first(),
  ).toBeVisible()

  await context.close()
})

test("the marks are flattened, and flipped on the dark band", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  expect(
    await page
      .locator("[data-slot='logo-cloud-logo']")
      .first()
      .evaluate((node) => getComputedStyle(node).filter),
  ).toBe("grayscale(1)")

  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(SPECIMEN)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  const dark = await page
    .locator("[data-slot='logo-cloud']")
    .evaluate((node) => {
      const mark = node.querySelector("[data-slot='logo-cloud-logo']")
      return {
        ground: getComputedStyle(node).backgroundColor,
        filter: mark ? getComputedStyle(mark).filter : null,
      }
    })

  /** The olive band is a tint and darkens with the page — a pale band under a
   *  dark page is a light plate. */
  expect(dark.ground).toBe("oklch(0.145 0 none)")
  /** And the flattened marks invert, because a dark mark on a dark band is a
   *  hole. */
  expect(dark.filter).toBe("grayscale(1) invert(1)")
})

test("the band narrows on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await page.goto(SPECIMEN)

  expect(
    await page
      .locator("[data-slot='logo-cloud']")
      .evaluate((node) => Math.round(node.getBoundingClientRect().height)),
  ).toBe(DRAWN.narrow)
})

test("the catalog frames the band at all three widths", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  await expect(page.locator("iframe")).toHaveCount(1)

  expect(
    await page
      .locator("iframe")
      .first()
      .evaluate((node) => Math.round(node.getBoundingClientRect().width)),
  ).toBe(1440)

  await page.getByRole("button", { name: "Mobile", exact: true }).click()
  await measured(page)

  expect(
    await page
      .locator("iframe")
      .first()
      .evaluate((node) => Math.round(node.getBoundingClientRect().width)),
  ).toBe(390)
})
