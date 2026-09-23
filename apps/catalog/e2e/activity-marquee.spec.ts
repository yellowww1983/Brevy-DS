import { expect, test } from "./catalog-test"
import { measured } from "./settled"

const PAGE = "/blocks/activity-marquee"
const SPECIMEN = "/specimens/activity-marquee"

/** The section as brevy.com runs it (Caregiving). Nothing in the design file
 *  draws it, so every number here is the live page's, except the pill row's
 *  gap, which nothing draws at all. */
const LIVE = {
  laps: [80_000, 100_000, 90_000],
  directions: ["normal", "reverse", "normal"],
  row: 32,
  pitch: 64,
  widest: 1408,
  wordGap: "48px",
  chipGap: "16px",
  entries: 10,
  /** One pill in the first row, two in each of the others. */
  accents: 5,
}

const tracks = "[data-slot='activity-marquee-track']"

test("three rows, each at its own pace, the middle one the other way", async ({
  page,
}) => {
  for (const query of ["", "?variant=chips"]) {
    await page.goto(`${SPECIMEN}${query}`)

    const laps = await page.locator(tracks).evaluateAll((nodes) =>
      nodes.map((node) => {
        const [animation] = node.getAnimations()
        const timing = animation?.effect?.getTiming()
        const keyframes =
          animation?.effect instanceof KeyframeEffect
            ? animation.effect.getKeyframes()
            : []

        return {
          name: getComputedStyle(node).animationName,
          duration: timing?.duration,
          direction: timing?.direction,
          easing: getComputedStyle(node).animationTimingFunction,
          iterations: timing?.iterations,
          to: keyframes.at(-1)?.transform,
        }
      }),
    )

    expect(laps).toHaveLength(3)

    for (const [index, lap] of laps.entries()) {
      /** Its own slide, not the logo band's: the two blocks are timed by
       *  different pages and one moving should not move the other. */
      expect(lap.name).toBe("activity-marquee")
      expect(lap.duration).toBe(LIVE.laps[index])
      expect(lap.direction).toBe(LIVE.directions[index])
      expect(lap.easing).toBe("linear")
      expect(lap.iterations).toBe(Infinity)
      /** Half the track, which is two of its four sets. The production build
       *  writes `translateX` as the shorter `translate`, which is the same
       *  move. */
      expect(lap.to).toMatch(/^translateX?\(-50%\)$/)
    }
  }
})

test("a lap slides exactly two sets, so the loop has no seam", async ({
  page,
}) => {
  for (const width of [1920, 1440, 390]) {
    for (const query of ["", "?variant=chips"]) {
      await page.setViewportSize({ width, height: 600 })
      await page.goto(`${SPECIMEN}${query}`)

      const rows = await page.locator(tracks).evaluateAll((nodes) =>
        nodes.map((node) => {
          const sets = [...node.children].map(
            (set) => set.getBoundingClientRect().width,
          )

          return {
            shrink: getComputedStyle(node).flexShrink,
            track: node.getBoundingClientRect().width,
            sets,
            clip: node.parentElement?.getBoundingClientRect().width ?? 0,
          }
        }),
      )

      for (const row of rows) {
        expect(row.shrink).toBe("0")
        expect(row.sets).toHaveLength(4)
        /** Every set measures the same, including the gap it carries after its
         *  last entry, so half the track lands the third set on the first. */
        for (const set of row.sets) {
          expect(set).toBeCloseTo(row.sets[0] ?? 0, 1)
        }
        expect(row.track).toBeCloseTo((row.sets[0] ?? 0) * 4, 1)
        /** And the half a lap slides always covers the row, or its far end
         *  sits empty for part of every lap. */
        expect((row.sets[0] ?? 0) * 2).toBeGreaterThanOrEqual(row.clip)
      }

      /** Edge to edge until 1408, and no wider. */
      expect(Math.round(rows[0]?.clip ?? 0)).toBe(Math.min(width, LIVE.widest))
    }
  }
})

test("the rows stand where the live page stands them, and cut at the edge", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const clips = await page
    .locator("[data-slot='activity-marquee-clip']")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node)
        const track = node.firstElementChild

        return {
          top: node.getBoundingClientRect().top,
          row: track ? Math.round(track.getBoundingClientRect().height) : 0,
          overflow: style.overflow,
          mask: style.maskImage,
        }
      }),
    )

  expect(clips).toHaveLength(3)

  for (const [index, clip] of clips.entries()) {
    expect(clip.row).toBe(LIVE.row)
    /** Cut rather than faded: a word leaves at the edge. */
    expect(clip.overflow).toBe("hidden")
    expect(clip.mask).toBe("none")

    if (index > 0) {
      expect(clip.top - (clips[index - 1]?.top ?? 0)).toBe(LIVE.pitch)
    }
  }
})

test("mix is words with a few pills, and chips is nothing but pills", async ({
  page,
}) => {
  const read = () =>
    page
      .locator("[data-slot='activity-marquee-set']:not([aria-hidden])")
      .evaluateAll((nodes) => ({
        entries: nodes.map((node) => node.children.length),
        chips: nodes.reduce(
          (total, node) =>
            total + node.querySelectorAll("[data-slot='chip']").length,
          0,
        ),
        words: nodes.reduce(
          (total, node) =>
            total +
            node.querySelectorAll("[data-slot='activity-marquee-word']").length,
          0,
        ),
        gap: nodes[0] ? getComputedStyle(nodes[0]).columnGap : "",
      }))

  await page.goto(SPECIMEN)
  const mix = await read()

  expect(mix.entries).toEqual([LIVE.entries, LIVE.entries, LIVE.entries])
  expect(mix.chips).toBe(LIVE.accents)
  expect(mix.words).toBe(LIVE.entries * 3 - LIVE.accents)
  expect(mix.gap).toBe(LIVE.wordGap)

  await page.goto(`${SPECIMEN}?variant=chips`)
  const chips = await read()

  expect(chips.chips).toBe(LIVE.entries * 3)
  expect(chips.words).toBe(0)
  /** A pill carries its own padding, so the words' 48 would leave 72 between
   *  two labels. */
  expect(chips.gap).toBe(LIVE.chipGap)
})

test("a word is set exactly as the pill's own label", async ({ page }) => {
  for (const theme of ["light", "dark"] as const) {
    await page.addInitScript((scheme) => {
      localStorage.setItem("theme", scheme)
    }, theme)
    await page.goto(SPECIMEN)
    await expect
      .poll(() =>
        page.evaluate(() =>
          document.documentElement.classList.contains("dark"),
        ),
      )
      .toBe(theme === "dark")

    const type = (selector: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((node) => {
          const style = getComputedStyle(node)
          return {
            size: style.fontSize,
            leading: style.lineHeight,
            weight: style.fontWeight,
            colour: style.color,
            family: style.fontFamily,
          }
        })

    expect(await type("[data-slot='activity-marquee-word']"), theme).toEqual(
      await type("[data-slot='activity-marquee'] [data-slot='chip']"),
    )
  }
})

test("every row is read once, and its repeats not at all", async ({ page }) => {
  await page.goto(SPECIMEN)

  const section = page.locator("[data-slot='activity-marquee']")

  /** No heading says what the rows are, so the section has to. */
  await expect(section).toHaveAttribute("aria-label", /.+/)

  const sets = await page
    .locator(tracks)
    .evaluateAll((nodes) =>
      nodes.map((node) =>
        [...node.children].map((set) => set.getAttribute("aria-hidden")),
      ),
    )

  /** All three rows are read, since each is a row the caller wrote. The three
   *  repeats in each exist only so the loop never shows an end. */
  expect(sets).toEqual([
    [null, "true", "true", "true"],
    [null, "true", "true", "true"],
    [null, "true", "true", "true"],
  ])

  await expect(section.getByRole("list")).toHaveCount(3)
})

test("the sliding stops for anyone who asked it to", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto(SPECIMEN)

  const read = await page
    .locator(tracks)
    .evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).animationName),
    )

  expect(read).toEqual(["none", "none", "none"])

  /** The rows still read. Only the sliding goes. */
  await expect(
    page.locator("[data-slot='activity-marquee-word']").first(),
  ).toBeVisible()

  await context.close()
})

test("the catalog frames both variants", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const frames = page.locator("main iframe[src^='/specimens/activity-marquee']")

  await expect(frames.first()).toBeVisible()
  expect(
    await frames.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("src")),
    ),
  ).toEqual(
    expect.arrayContaining([
      "/specimens/activity-marquee",
      "/specimens/activity-marquee?variant=chips",
    ]),
  )
})
