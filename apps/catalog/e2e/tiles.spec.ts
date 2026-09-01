import { expect, test } from "./catalog-test"
import { measured } from "./settled"

const PAGE = "/blocks/tiles"
const SPECIMEN = "/specimens/tiles"

/** What the file draws (`20919:10826`), the same in all four seasons, with the
 *  tablet (`22624:7852`) and mobile (`22629:9927`) frames beside it. */
const DRAWN = {
  pad: "96px 0px",
  beige500: "rgb(245, 242, 239)",
  zinc800: "oklch(0.274 0.006 286.033)",
  headingBox: "502px",
  headToWall: 48,
  gap: "16px",
  row: 240,
  wide: 592,
  narrow: 389,
  cut: {
    desktop: { width: 236, height: 240 },
    mobile: { width: 357, height: 362 },
  },
  tablet: 762,
  mobile: 358,
  caption: 96,
  hairlines: 8,
  rule: 118,
  beige300: "rgb(248, 245, 242)",
  beige300Channels: [248, 245, 242],
  mark: { width: 321, height: 265, left: -20, tileTop: 40 },
}

test("the section stands on flat beige and pads itself", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page.locator("[data-slot='tiles']").evaluate((node) => {
    const style = getComputedStyle(node)
    return { padding: style.padding, ground: style.backgroundColor }
  })

  expect(read.padding).toBe(DRAWN.pad)
  expect(read.ground).toBe(DRAWN.beige500)
})

test("the heading holds to its box, centred, over the wall", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page.locator("[data-slot='tiles']").evaluate((node) => {
    const heading = node.querySelector("[data-slot='tiles-heading']")
    const wall = node.querySelector("[data-slot='tiles-list']")

    if (!heading || !wall) {
      return null
    }

    const style = getComputedStyle(heading)

    return {
      box: style.maxWidth,
      align: style.textAlign,
      colour: style.color,
      family: style.fontFamily,
      gap: Math.round(
        wall.getBoundingClientRect().top -
          heading.getBoundingClientRect().bottom,
      ),
    }
  })

  expect(read?.box).toBe(DRAWN.headingBox)
  expect(read?.align).toBe("center")
  expect(read?.colour).toBe(DRAWN.zinc800)
  expect(read?.family).toContain("Hedvig")
  expect(read?.gap).toBe(DRAWN.headToWall)
})

test("the wall is six columns, so both drawn widths come out", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const columns = await page
    .locator("[data-slot='tiles-list']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        count: style.gridTemplateColumns.split(" ").length,
        gap: style.gap,
      }
    })

  /** Three columns cannot hold this wall: the 1200 column in three is 389, and
   *  nothing in it is 592. In six, a tile over three is 592 and one over two
   *  is 390. */
  expect(columns.count).toBe(6)
  expect(columns.gap).toBe(DRAWN.gap)

  const tiles = await page
    .locator("[data-slot='tiles-tile']")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const box = node.getBoundingClientRect()
        return {
          kind: node.getAttribute("data-kind"),
          width: Math.round(box.width),
          height: Math.round(box.height),
        }
      }),
    )

  expect(tiles.map((tile) => tile.kind)).toEqual([
    "figure",
    "quote",
    "chart",
    "pill",
    "photo",
  ])

  expect(tiles.map((tile) => tile.width)).toEqual([
    DRAWN.wide,
    DRAWN.wide,
    DRAWN.narrow,
    DRAWN.narrow,
    DRAWN.narrow,
  ])

  for (const tile of tiles) {
    expect(tile.height).toBe(DRAWN.row)
  }
})

test("every tile wears the same radius, thread and shadow", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='tiles-tile']")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        /** The quotation tile's chrome is the shared card's, so the tile is
         *  a bare grid item holding it. */
        const face = node.querySelector("[data-slot='quote-card']") ?? node
        const style = getComputedStyle(face)
        const thread = getComputedStyle(face, "::before")
        return {
          radius: style.borderRadius,
          shadow: style.boxShadow,
          thread: thread.background,
        }
      }),
    )

  expect(read).toHaveLength(5)

  for (const tile of read) {
    expect(tile.radius).toBe("16px")
    expect(tile.shadow).toContain("0px 1px 2px")
    /** A padding ring over a gradient, because a border cannot hold one. */
    expect(tile.thread).toContain("linear-gradient")
  }
})

test("the dark tile is the shaped cut beside the figure", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-kind='figure'] [data-slot='shaped-image']")
    .evaluate((node) => {
      const box = node.getBoundingClientRect()
      return {
        width: Math.round(box.width),
        height: Math.round(box.height),
        mask: getComputedStyle(node).maskImage,
      }
    })

  /** The picture runs the full height of the tile: the copy carries the
   *  inset, not the tile. */
  expect({ width: read.width, height: read.height }).toEqual(DRAWN.cut.desktop)
  expect(read.mask).toContain("svg")
})

test("the figure is one object wherever it is drawn", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='stat-figure']")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node)
        return {
          size: style.fontSize,
          leading: style.lineHeight,
          weight: style.fontWeight,
          tracking: style.letterSpacing,
        }
      }),
    )

  expect(read).toHaveLength(2)

  for (const figure of read) {
    expect(figure.size).toBe("60px")
    expect(figure.leading).toBe("60px")
    /** The pill is drawn at 600 and ships at 700 with the other thirty-eight.
     *  DESIGN-FEEDBACK 87. */
    expect(figure.weight).toBe("700")
    /** -0.9% of 60. */
    expect(figure.tracking).toBe("-0.54px")
  }

  const unit = await page
    .locator("[data-slot='stat-figure-unit']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        size: style.fontSize,
        leading: style.lineHeight,
        weight: style.fontWeight,
      }
    })

  expect(unit).toEqual({ size: "24px", leading: "24px", weight: "700" })
})

test("the same figure renders in the testimonial wall", async ({ page }) => {
  await page.goto("/specimens/testimonials")

  /** One object, three containers — the extraction is only worth anything if
   *  the wall it came out of is really drawing it. */
  const read = await page
    .locator("[data-slot='stat-figure']")
    .first()
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return { size: style.fontSize, weight: style.fontWeight }
    })

  expect(read).toEqual({ size: "60px", weight: "700" })
})

test("the quotation tile is the wall's card and not a copy of it", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  /** It was a second drawing of the same markup, and the two had already
   *  drifted apart on the mark's offset before anyone read them side by
   *  side. */
  await expect(
    page.locator("[data-kind='quote'] [data-slot='quote-card']"),
  ).toHaveCount(1)

  const read = await page
    .locator("[data-kind='quote'] [data-slot='quote-card']")
    .evaluate((node) => {
      const mark = node.querySelector("[data-slot='quote-card-mark']")

      if (!mark) {
        return null
      }

      const card = node.getBoundingClientRect()
      const box = mark.getBoundingClientRect()
      const style = getComputedStyle(mark)

      return {
        width: Math.round(box.width),
        height: Math.round(box.height),
        left: Math.round(box.left - card.left),
        top: Math.round(box.top - card.top),
        colour: style.backgroundColor,
        mask: style.maskImage,
        /** Without one of its own, a negative layer goes behind the card's
         *  white rather than over it — which is how the mark went missing
         *  from the mosaic in the first place. */
        isolation: getComputedStyle(node).isolation,
      }
    })

  expect(read?.width).toBe(DRAWN.mark.width)
  expect(read?.height).toBe(DRAWN.mark.height)
  expect(read?.left).toBe(DRAWN.mark.left)
  /** 40 in the mosaic against 70 in the wall — the file's own two placements
   *  of one drawing. DESIGN-FEEDBACK 90. */
  expect(read?.top).toBe(DRAWN.mark.tileTop)
  expect(read?.colour).toBe(DRAWN.beige300)
  expect(read?.mask).toContain("svg")
  expect(read?.isolation).toBe("isolate")
})

test("the mark is really painted, not merely present", async ({ page }) => {
  await page.goto(SPECIMEN)

  /** Read off the pixels rather than the tree. The mark was in the markup the
   *  whole time it was invisible: a negative layer in a card with no stacking
   *  context of its own paints behind that card's white, and every property a
   *  spec could ask the element about was correct while nothing showed. */
  const shot = (await page.screenshot({ fullPage: true })).toString("base64")

  const painted = await page
    .locator("[data-kind='quote'] [data-slot='quote-card']")
    .evaluate(async (node, shot) => {
      const bitmap = await createImageBitmap(
        await (await fetch(`data:image/png;base64,${shot}`)).blob(),
      )
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const context = canvas.getContext("2d")

      if (!context) {
        return null
      }

      context.drawImage(bitmap, 0, 0)

      const ratio = bitmap.width / document.documentElement.clientWidth
      const box = node.getBoundingClientRect()

      /** Two points inside the stroke of the mark, well clear of the copy. */
      return [
        [40, 110],
        [20, 150],
      ].map(([x = 0, y = 0]) => {
        const pixel = context.getImageData(
          Math.round((box.left + x + scrollX) * ratio),
          Math.round((box.top + y + scrollY) * ratio),
          1,
          1,
        ).data

        return [pixel[0] ?? 0, pixel[1] ?? 0, pixel[2] ?? 0]
      })
    }, shot)

  expect(painted).toEqual([DRAWN.beige300Channels, DRAWN.beige300Channels])
})

test("the chart is eight dashed rules under one bar", async ({ page }) => {
  await page.goto(SPECIMEN)

  await expect(page.locator("[data-slot='tiles-chart'] span.w-px")).toHaveCount(
    DRAWN.hairlines,
  )

  const rules = await page
    .locator("[data-slot='tiles-chart'] span.w-px")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const box = node.getBoundingClientRect()
        return {
          width: Math.round(box.width),
          height: Math.round(box.height),
          image: getComputedStyle(node).backgroundImage,
          left: Math.round(box.left),
        }
      }),
    )

  for (const rule of rules) {
    expect(rule.width).toBe(1)
    expect(rule.height).toBe(DRAWN.rule)
    /** Dashed 2 on 2 in the border colour, which is the drawn neutral-300 to
     *  the value. A border cannot be dashed to a pattern, so it is a
     *  repeating gradient down the column. */
    expect(rule.image).toContain("repeating-linear-gradient")
    expect(rule.image).toContain("2px")
  }

  /** 49 apart, which is the drawn pitch. */
  for (const [index, rule] of rules.slice(1).entries()) {
    const pitch = rule.left - (rules[index]?.left ?? 0)
    expect(pitch).toBeGreaterThanOrEqual(48)
    expect(pitch).toBeLessThanOrEqual(49)
  }

  const bar = await page
    .locator("[data-kind='chart'] span.h-10")
    .evaluate((node) => getComputedStyle(node).backgroundImage)

  expect(bar).toContain("linear-gradient")
})

test("the caption is frosted rather than solid", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='tiles-caption']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        height: Math.round(node.getBoundingClientRect().height),
        ground: style.backgroundColor,
        frost: style.backdropFilter,
        stacking: style.position,
      }
    })

  expect(read.height).toBe(DRAWN.caption)
  /** Black at 22% under a 12 blur, which is what the file draws. */
  expect(read.ground).toContain("0.22")
  expect(read.frost).toBe("blur(12px)")
  /** Positioned, so it stacks over the photograph rather than under it. */
  expect(read.stacking).toBe("relative")
})

test("the photograph is really behind the caption", async ({ page }) => {
  await page.goto(SPECIMEN)
  await page.waitForFunction(() =>
    [...document.images].every((image) => image.complete),
  )

  const behind = await page
    .locator("[data-kind='photo'] img")
    .evaluate((node) => {
      const box = node.getBoundingClientRect()
      const under = document.elementFromPoint(box.left + 8, box.top + 8)
      return under?.tagName ?? null
    })

  /** The picture used to sit a layer below the tile's own ground, which paints
   *  over it — the caption then read white on white. */
  expect(behind).toBe("IMG")
})

test("below the content width the wall is one column", async ({ page }) => {
  for (const [width, tile, direction, cut] of [
    [810, DRAWN.tablet, "row", DRAWN.cut.desktop],
    [390, DRAWN.mobile, "column", DRAWN.cut.mobile],
  ] as const) {
    await page.setViewportSize({ width, height: 1200 })
    await page.goto(SPECIMEN)

    const read = await page
      .locator("[data-slot='tiles-tile']")
      .evaluateAll((nodes) =>
        nodes.map((node) => Math.round(node.getBoundingClientRect().width)),
      )

    expect(read).toHaveLength(5)

    for (const width of read) {
      expect(width).toBe(tile)
    }

    /** And on a phone the dark tile stands its cut above its words, which is
     *  what the mobile frame draws. */
    expect(
      await page
        .locator("[data-kind='figure']")
        .evaluate((node) => getComputedStyle(node).flexDirection),
    ).toBe(direction)

    expect(
      await page
        .locator("[data-kind='figure'] [data-slot='shaped-image']")
        .evaluate((node) => {
          const box = node.getBoundingClientRect()
          return {
            width: Math.round(box.width),
            height: Math.round(box.height),
          }
        }),
    ).toEqual(cut)
  }
})

test("dark keeps the arrangement and turns the tints", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(SPECIMEN)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  const read = await page.locator("[data-slot='tiles']").evaluate((node) => {
    const at = (selector: string) => node.querySelector(selector)
    const ground = (selector: string) => {
      const found = at(selector)
      return found ? getComputedStyle(found).backgroundColor : null
    }
    const ink = (selector: string) => {
      const found = at(selector)
      return found ? getComputedStyle(found).color : null
    }
    const bar = at("[data-kind='chart'] span.h-10")

    return {
      section: getComputedStyle(node).backgroundColor,
      dark: ground("[data-kind='figure']"),
      pale: ground("[data-kind='quote'] [data-slot='quote-card']"),
      pill: ground("[data-slot='tiles-pill']"),
      figure: ink("[data-slot='stat-figure']"),
      title: ink("[data-kind='chart'] h3"),
      bar: bar ? getComputedStyle(bar).backgroundImage : null,
      picture: at("[data-kind='photo'] img") !== null,
    }
  })

  /** The beige wash is a tint and darkens to the page's own ground. */
  expect(read.section).toBe("oklch(0.145 0 none)")
  /** The white tiles step to the card. */
  expect(read.pale).toBe("oklch(0.205 0 none)")
  /** The dark tile and the olive pill are brand surfaces and hold. */
  expect(read.dark).toBe("rgb(2, 54, 32)")
  expect(read.pill).toBe("rgb(215, 228, 201)")
  expect(read.figure).toBe("rgb(215, 228, 201)")
  /** Both of the chart's greens are picked against a light card and cannot
   *  come along: the title read 4.06 where 4.5 was needed and the bar 1.41
   *  where 3 was. Measured on the painted pixels. */
  expect(read.title).toBe("rgb(121, 207, 171)")
  expect(read.bar).toContain("rgb(63, 175, 127)")
  /** The photograph stays. A photograph is not a tint. */
  expect(read.picture).toBe(true)
})

test("the catalog frames the wall at all three widths", async ({ page }) => {
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
