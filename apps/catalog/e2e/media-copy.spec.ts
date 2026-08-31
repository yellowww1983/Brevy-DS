import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

const PAGE = "/blocks/media-copy"
const SPECIMEN = "/specimens/media-copy"

/** What the file draws (`20919:10786`), the same in all four seasons. */
const DRAWN = {
  pad: "96px 0px",
  headToRow: 48,
  column: 1200,
  gap: "16px",
  narrowGap: "32px",
  half: 592,
  picture: { desktop: 592, tablet: 762, mobile: 358 },
  pictureHeight: { desktop: 602, tablet: 775, mobile: 364 },
  disc: 64,
  marker: 10,
  olive500: "rgb(215, 228, 201)",
  yellow500: "rgb(244, 186, 87)",
  zinc800: "oklch(0.274 0.006 286.033)",
  zinc700: "oklch(0.37 0.013 285.805)",
}

const box = (page: Page, selector: string, index = 0) =>
  page
    .locator(selector)
    .nth(index)
    .evaluate((node) => {
      const rectangle = node.getBoundingClientRect()
      return {
        width: Math.round(rectangle.width),
        height: Math.round(rectangle.height),
      }
    })

test("the section stands on the olive wash and pads itself", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='media-copy']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return { padding: style.padding, ground: style.backgroundImage }
    })

  expect(read.padding).toBe(DRAWN.pad)
  expect(read.ground).toContain(DRAWN.olive500)
  expect(read.ground).toContain("rgb(255, 255, 255)")
})

test("the heading runs across the section, centred and in the text colour", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='media-copy']")
    .evaluate((node) => {
      const heading = node.querySelector("[data-slot='media-copy-heading']")
      const header = node.querySelector("[data-slot='media-copy-header']")
      const stepper = node.querySelector("[data-slot='media-copy-stepper']")

      if (!heading || !header || !stepper) {
        return null
      }

      const row = stepper.parentElement?.parentElement
      const style = getComputedStyle(heading)

      return {
        align: style.textAlign,
        colour: style.color,
        family: style.fontFamily,
        gap: row
          ? Math.round(
              row.getBoundingClientRect().top -
                header.getBoundingClientRect().bottom,
            )
          : null,
      }
    })

  /** Above both halves, not inside the copy column — which is what parts this
   *  from the split hero. And zinc-800, not the drawn emerald that this
   *  section and the benefits grid use alone. DESIGN-FEEDBACK 84. */
  expect(read?.align).toBe("center")
  expect(read?.colour).toBe(DRAWN.zinc800)
  expect(read?.family).toContain("Hedvig")
  expect(read?.gap).toBe(DRAWN.headToRow)
})

test("the highlighter takes its width from the words it marks", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='line-marker']")
    .first()
    .evaluate((node) => {
      const stroke = node.querySelector("[data-slot='line-marker-stroke']")
      if (!stroke) {
        return null
      }
      const style = getComputedStyle(stroke)
      return {
        width: Math.round(stroke.getBoundingClientRect().width),
        words: Math.round(node.getBoundingClientRect().width),
        height: Math.round(stroke.getBoundingClientRect().height),
        colour: style.backgroundColor,
        mask: style.maskImage,
        hidden: stroke.getAttribute("aria-hidden"),
      }
    })

  /** One drawing stretched, so the stroke is exactly as wide as what it
   *  underlines rather than one of seven fixed vectors. */
  expect(read?.width).toBe(read?.words)
  expect(read?.height).toBe(DRAWN.marker)
  expect(read?.colour).toBe(DRAWN.yellow500)
  expect(read?.mask).toContain("svg")
  expect(read?.hidden).toBe("true")
})

test("the picture is the shaped cut and carries its own proportion", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='shaped-image']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      const rectangle = node.getBoundingClientRect()
      return {
        width: Math.round(rectangle.width),
        height: Math.round(rectangle.height),
        aspect: style.aspectRatio,
        mask: style.maskImage,
        slot: node.getAttribute("data-slot"),
      }
    })

  expect(read.width).toBe(DRAWN.picture.desktop)
  expect(read.height).toBe(DRAWN.pictureHeight.desktop)
  /** 0.983, which every mask in the file measures. */
  expect(read.aspect).toBe("592 / 602")
  expect(read.mask).toContain("svg")
})

test("the same shaped cut renders in the split hero", async ({ page }) => {
  await page.goto("/specimens/hero-split")

  /** One shape, two blocks — the extraction is only worth anything if the
   *  hero is really drawing it too. */
  const read = await page
    .locator("[data-slot='shaped-image']")
    .first()
    .evaluate((node) => ({
      aspect: getComputedStyle(node).aspectRatio,
      mask: getComputedStyle(node).maskImage,
      width: Math.round(node.getBoundingClientRect().width),
    }))

  expect(read.aspect).toBe("592 / 602")
  expect(read.mask).toContain("svg")
  expect(read.width, "the hero sets only a width now").toBe(592)
})

test("each disc holds a coloured pebble, not an icon", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='media-copy-dot']")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node)
        const box = node.getBoundingClientRect()
        return {
          width: Math.round(box.width),
          height: Math.round(box.height),
          colour: style.backgroundColor,
          mask: style.maskImage,
        }
      }),
    )

  expect(read).toHaveLength(3)

  /** 15 by 16, which is what the file draws at every breakpoint. */
  for (const dot of read) {
    expect(dot.width).toBe(15)
    expect(dot.height).toBe(16)
    /** A pebble rather than a circle: the drawn blob is irregular, so it is a
     *  mask rather than a border radius. */
    expect(dot.mask).toContain("svg")
  }

  /** One colour per rung, never repeated — green-500, taupe-300, violet-500,
   *  three unrelated ramps rather than a series. */
  expect(read.map((dot) => dot.colour)).toEqual([
    "rgb(148, 207, 161)",
    "rgb(200, 190, 187)",
    "rgb(212, 196, 252)",
  ])

  /** And nothing draws an icon in there any more. */
  await expect(page.locator("[data-slot='media-copy-disc'] svg")).toHaveCount(0)
})

test("every disc sits on the first line of its own step", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='media-copy-stepper']")
    .evaluate((node) =>
      [...node.querySelectorAll("[data-slot='media-copy-step']")].map(
        (step) => {
          const disc = step.querySelector("[data-slot='media-copy-disc']")
          const title = step.querySelector(
            "[data-slot='media-copy-step-title']",
          )

          if (!disc || !title) {
            return null
          }

          const ring = disc.getBoundingClientRect()
          const words = title.getBoundingClientRect()
          const leading = parseFloat(getComputedStyle(title).lineHeight)

          return {
            size: Math.round(ring.width),
            offset: Math.round(
              ring.top + ring.height / 2 - (words.top + leading / 2),
            ),
            lines: Math.round(words.height / leading),
          }
        },
      ),
    )

  expect(read).toHaveLength(3)

  for (const step of read) {
    expect(step?.size).toBe(DRAWN.disc)
    /** Computed from the disc and the leading, not dialled in per rung the
     *  way the file does it. DESIGN-FEEDBACK 85. */
    expect(step?.offset).toBe(0)
  }

  /** And it still holds where the column narrows enough to wrap the titles —
   *  the case the drawn padding could not have covered, because it was
   *  measured against copy that fits on one line. */
  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto(SPECIMEN)

  const narrow = await page
    .locator("[data-slot='media-copy-stepper']")
    .evaluate((node) =>
      [...node.querySelectorAll("[data-slot='media-copy-step']")].map(
        (step) => {
          const disc = step.querySelector("[data-slot='media-copy-disc']")
          const title = step.querySelector(
            "[data-slot='media-copy-step-title']",
          )

          if (!disc || !title) {
            return null
          }

          const ring = disc.getBoundingClientRect()
          const words = title.getBoundingClientRect()
          const leading = parseFloat(getComputedStyle(title).lineHeight)

          return {
            offset: Math.round(
              ring.top + ring.height / 2 - (words.top + leading / 2),
            ),
            lines: Math.round(words.height / leading),
          }
        },
      ),
    )

  expect(
    narrow.some((step) => (step?.lines ?? 0) > 1),
    "the fixture has to wrap for this to mean anything",
  ).toBe(true)

  for (const step of narrow) {
    expect(step?.offset).toBe(0)
  }
})

test("the thread runs between the discs and not past the last", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  await expect(page.locator("[data-slot='media-copy-thread']")).toHaveCount(2)
})

test("the row is two halves, then one column with the picture under", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const wide = await page
    .locator("[data-slot='media-copy-stepper']")
    .evaluate((node) => {
      const row = node.parentElement?.parentElement
      return row
        ? {
            direction: getComputedStyle(row).flexDirection,
            gap: getComputedStyle(row).gap,
            width: Math.round(row.getBoundingClientRect().width),
          }
        : null
    })

  expect(wide?.direction).toBe("row")
  expect(wide?.gap).toBe(DRAWN.gap)
  expect(wide?.width).toBe(DRAWN.column)
  expect((await box(page, "[data-slot='media-copy-stepper']")).width).toBe(
    DRAWN.half,
  )

  for (const [width, picture] of [
    [810, DRAWN.picture.tablet],
    [390, DRAWN.picture.mobile],
  ] as const) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(SPECIMEN)

    const narrow = await page
      .locator("[data-slot='media-copy-stepper']")
      .evaluate((node) => {
        const row = node.parentElement?.parentElement
        return row
          ? {
              direction: getComputedStyle(row).flexDirection,
              gap: getComputedStyle(row).gap,
            }
          : null
      })

    expect(narrow?.direction).toBe("column")
    expect(narrow?.gap).toBe(DRAWN.narrowGap)
    /** The picture goes under the ladder rather than away. */
    await expect(page.locator("[data-slot='shaped-image']")).toBeVisible()
    expect((await box(page, "[data-slot='shaped-image']")).width).toBe(picture)
  }
})

test("dark keeps the arrangement and turns the surfaces", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(SPECIMEN)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  const read = await page
    .locator("[data-slot='media-copy']")
    .evaluate((node) => {
      const disc = node.querySelector("[data-slot='media-copy-disc']")
      const stroke = node.querySelector("[data-slot='line-marker-stroke']")
      const picture = node.querySelector("[data-slot='shaped-image']")
      const heading = node.querySelector("[data-slot='media-copy-heading']")

      return {
        ground: getComputedStyle(node).backgroundColor,
        image: getComputedStyle(node).backgroundImage,
        heading: heading ? getComputedStyle(heading).color : null,
        disc: disc ? getComputedStyle(disc).backgroundImage : null,
        stroke: stroke ? getComputedStyle(stroke).backgroundColor : null,
        picture: picture
          ? {
              shown: getComputedStyle(picture).display !== "none",
              width: Math.round(picture.getBoundingClientRect().width),
            }
          : null,
      }
    })

  /** The wash is a tint and darkens. */
  expect(read.ground).toBe("oklch(0.145 0 none)")
  expect(read.image).toBe("none")
  expect(read.heading).toBe("oklch(0.985 0 none)")
  /** The discs step to the page's own surfaces. */
  expect(read.disc).toContain("oklch(0.205")
  /** The photograph stays — it is a photograph, not a pale mock. */
  expect(read.picture?.shown).toBe(true)
  expect(read.picture?.width).toBe(DRAWN.picture.desktop)
  /** And the highlighter stays: a saturated accent, not a tint. */
  expect(read.stroke).toBe(DRAWN.yellow500)
})

test("the catalog frames the section at all three widths", async ({ page }) => {
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
