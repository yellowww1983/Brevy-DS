import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

const PAGE = "/blocks/card-grid"
const SPECIMEN = "/specimens/card-grid"

/** What the file draws: the Home pages' benefits grid (`20919:10703`), the
 *  same in all four seasons. Every one of those twelve sections is switched
 *  off in the file — DESIGN-FEEDBACK 78 — so these are the numbers the hidden
 *  nodes carry. */
const DRAWN = {
  pad: "96px 0px",
  headToGrid: 48,
  gap: "16px",
  column: 1200,
  card: 389,
  cardNarrow: 762,
  cardMobile: 358,
  panel: 341,
  panelTablet: 714,
  panelMobile: 310,
  panelHeight: 290,
  cardPad: "24px",
  cardGap: "24px",
  radius: "16px",
  copyGap: 8,
  /** olive-500 to white, the wash all four Home pages stand this on. */
  olive500: "rgb(215, 228, 201)",
  /** The panel: olive-300 to white under a 1px olive-200 to neutral-100. */
  olive300: "rgb(220, 231, 207)",
  olive200: "rgb(230, 238, 220)",
  zinc800: "oklch(0.274 0.006 286.033)",
  zinc700: "oklch(0.37 0.013 285.805)",
  /** The drawn pair `0 2 4 -2 @10%` + `0 4 6 -1 @10%`, which is `shadow-md`
   *  to the value — no new token. */
  shadow:
    "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px",
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
        x: Math.round(rectangle.x),
        y: Math.round(rectangle.y),
      }
    })

test("the section stands on the drawn wash and pads itself", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='card-grid']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return { padding: style.padding, ground: style.backgroundImage }
    })

  expect(read.padding, "96 above and below, the convention").toBe(DRAWN.pad)
  expect(read.ground).toContain(DRAWN.olive500)
  expect(read.ground).toContain("rgb(255, 255, 255)")
})

test("the header is a centred heading 48 over the grid", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='card-grid']")
    .evaluate((node) => {
      const header = node.querySelector("[data-slot='card-grid-header']")
      const list = node.querySelector("[data-slot='card-grid-list']")
      const heading = node.querySelector("[data-slot='card-grid-heading']")

      if (!header || !list || !heading) {
        return null
      }

      const style = getComputedStyle(heading)

      return {
        gap: Math.round(
          list.getBoundingClientRect().top -
            header.getBoundingClientRect().bottom,
        ),
        family: style.fontFamily,
        align: style.textAlign,
        colour: style.color,
        /** Neither is drawn, and neither shows unless asked for. */
        chip: node.querySelector("[data-slot='chip']") !== null,
        description:
          node.querySelector("[data-slot='card-grid-description']") !== null,
      }
    })

  expect(read?.gap).toBe(DRAWN.headToGrid)
  expect(read?.family).toContain("Hedvig")
  expect(read?.align).toBe("center")
  /** The system's own h2 colour, not the emerald the Home pages use here and
   *  nowhere else. DESIGN-FEEDBACK 76. */
  expect(read?.colour).toBe(DRAWN.zinc800)
  expect(read?.chip).toBe(false)
  expect(read?.description).toBe(false)
})

test("three columns of the drawn width, 16 apart", async ({ page }) => {
  await page.goto(SPECIMEN)

  const list = await page
    .locator("[data-slot='card-grid-list']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        width: Math.round(node.getBoundingClientRect().width),
        columns: style.gridTemplateColumns.split(" ").length,
        gap: style.gap,
      }
    })

  expect(list.width, "the content column").toBe(DRAWN.column)
  expect(list.columns).toBe(3)
  expect(list.gap).toBe(DRAWN.gap)

  const card = await box(page, "[data-slot='card-grid-card']")
  expect(card.width, "1200 less two 16 gaps, in three").toBe(DRAWN.card)
})

test("the card is white on a shadow and wears no thread", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='card-grid-card']")
    .first()
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        padding: style.padding,
        gap: style.rowGap,
        radius: style.borderRadius,
        background: style.backgroundColor,
        border: style.borderWidth,
        shadow: style.boxShadow,
        /** `hairline` paints through ::before; every other card in this
         *  system has one and this one does not. DESIGN-FEEDBACK 77. */
        thread: getComputedStyle(node, "::before").content,
      }
    })

  expect(read.padding).toBe(DRAWN.cardPad)
  expect(read.gap).toBe(DRAWN.cardGap)
  expect(read.radius).toBe(DRAWN.radius)
  expect(read.background).toBe("rgb(255, 255, 255)")
  expect(read.border).toBe("0px")
  expect(read.thread, "no hairline, unlike every other card here").toBe("none")
  /** The drawn pair, which Tailwind already ships as `shadow-md`. */
  expect(read.shadow).toContain(DRAWN.shadow)
})

test("the illustration panel is the object the step cards already use", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const panel = await box(page, "[data-slot='illustration-panel']")

  expect(panel.width).toBe(DRAWN.panel)
  expect(panel.height, "fixed at every width; the copy is what grows").toBe(
    DRAWN.panelHeight,
  )

  const read = await page
    .locator("[data-slot='illustration-panel']")
    .first()
    .evaluate((node) => {
      const inner = node.firstElementChild
      return {
        radius: getComputedStyle(node).borderRadius,
        /** A padding ring over a gradient, because a border cannot hold
         *  one — the same construction the step marker uses. */
        padding: getComputedStyle(node).padding,
        edge: getComputedStyle(node).backgroundImage,
        ground: inner ? getComputedStyle(inner).backgroundImage : null,
      }
    })

  expect(read.radius).toBe(DRAWN.radius)
  expect(read.padding).toBe("1px")
  expect(read.edge).toContain(DRAWN.olive200)
  expect(read.ground).toContain(DRAWN.olive300)
  expect(read.ground).toContain("rgb(255, 255, 255)")
})

test("the same marker renders in the card grid and in the steps", async ({
  page,
}) => {
  /** One disc, three consumers. It is only worth extracting if both blocks
   *  really render the same element with the same paint. */
  const read = async (url: string) => {
    await page.goto(url)
    return page
      .locator("[data-slot='marker']")
      .first()
      .evaluate((node) => {
        const face = node.firstElementChild
        return {
          size: Math.round(node.getBoundingClientRect().width),
          edge: getComputedStyle(node).backgroundImage,
          shadow: getComputedStyle(node).boxShadow,
          ground: face ? getComputedStyle(face).backgroundImage : null,
          colour: face ? getComputedStyle(face).color : null,
        }
      })
  }

  const grid = await read(SPECIMEN)
  const steps = await read("/specimens/steps?markers=on")

  expect(grid).toEqual(steps)
  expect(grid.size, "36, the drawn step and card badge").toBe(36)
  /** olive-100 to olive-300 under olive-300 to olive-600, the number in
   *  brand-500 — not the white-to-olive disc with a near-black numeral the
   *  benefit card's artwork draws. DESIGN-FEEDBACK 79. */
  expect(grid.edge).toContain(DRAWN.olive300)
  expect(grid.edge).toContain("rgb(184, 199, 170)")
  expect(grid.ground).toContain("rgb(241, 246, 236)")
  expect(grid.colour).toBe("rgb(6, 110, 61)")
})

test("the panel centres what it holds, in both blocks", async ({ page }) => {
  const centring = async (url: string) => {
    await page.goto(url)
    return page
      .locator("[data-slot='illustration-panel']")
      .first()
      .evaluate((node) => {
        const inner = node.firstElementChild
        if (!inner) {
          return null
        }
        const style = getComputedStyle(inner)
        return { justify: style.justifyContent, align: style.alignItems }
      })
  }

  const centred = { justify: "center", align: "center" }

  expect(await centring(SPECIMEN)).toEqual(centred)
  expect(await centring("/specimens/steps")).toEqual(centred)

  /** And the artwork really sits in the middle rather than against a corner:
   *  the panel is 341 wide at the desktop and 714 at the tablet, and a
   *  composition pinned to one drifts at the other. */
  await page.goto(SPECIMEN)

  const offsets = await page
    .locator("[data-slot='illustration-panel']")
    .first()
    .evaluate((node) => {
      const inner = node.firstElementChild
      /** The marker sits in the corner on purpose and is positioned out of
       *  the flow; the artwork is whatever is left standing in it. */
      const art = [...(inner?.children ?? [])].find(
        (child) => getComputedStyle(child).position === "static",
      )

      if (!inner || !art) {
        return null
      }

      const box = inner.getBoundingClientRect()
      const shape = art.getBoundingClientRect()

      return {
        left: Math.round(shape.left - box.left),
        right: Math.round(box.right - shape.right),
        top: Math.round(shape.top - box.top),
        bottom: Math.round(box.bottom - shape.bottom),
      }
    })

  expect(offsets?.left).toBe(offsets?.right)
  expect(offsets?.top).toBe(offsets?.bottom)
})

test("the same panel renders inside the step cards", async ({ page }) => {
  await page.goto("/specimens/steps")

  /** One object, two blocks: the extraction is only worth anything if Steps
   *  is really drawing it too. */
  const panel = page.locator("[data-slot='illustration-panel']").first()

  await expect(panel).toBeVisible()
  expect(
    await panel.evaluate((node) =>
      Math.round(node.getBoundingClientRect().height),
    ),
  ).toBe(DRAWN.panelHeight)
})

test("the copy runs title over line, 8 apart", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='card-grid-card']")
    .first()
    .evaluate((node) => {
      const title = node.querySelector("[data-slot='card-grid-title']")
      const line = node.querySelector(
        "[data-slot='card-grid-card-description']",
      )

      if (!title || !line) {
        return null
      }

      return {
        gap: Math.round(
          line.getBoundingClientRect().top -
            title.getBoundingClientRect().bottom,
        ),
        title: {
          size: getComputedStyle(title).fontSize,
          weight: getComputedStyle(title).fontWeight,
          colour: getComputedStyle(title).color,
        },
        line: {
          size: getComputedStyle(line).fontSize,
          colour: getComputedStyle(line).color,
        },
        /** No action: the file draws none on any of the twelve. */
        action: node.querySelector("a, button") !== null,
      }
    })

  expect(read?.gap).toBe(DRAWN.copyGap)
  expect(read?.title.size).toBe("20px")
  expect(read?.title.weight).toBe("600")
  expect(read?.title.colour).toBe(DRAWN.zinc800)
  expect(read?.line.size).toBe("20px")
  expect(read?.line.colour).toBe(DRAWN.zinc700)
  expect(read?.action).toBe(false)
})

test("the cards in a row are the same height and their pictures level", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='card-grid-list']")
    .evaluate((node) => {
      const cards = [...node.querySelectorAll("[data-slot='card-grid-card']")]
      const panels = [
        ...node.querySelectorAll("[data-slot='illustration-panel']"),
      ]
      return {
        heights: [
          ...new Set(
            cards.map((card) =>
              Math.round(card.getBoundingClientRect().height),
            ),
          ),
        ],
        widths: [
          ...new Set(
            cards.map((card) => Math.round(card.getBoundingClientRect().width)),
          ),
        ],
        panelTops: [
          ...new Set(
            panels.map((panel) =>
              Math.round(panel.getBoundingClientRect().top),
            ),
          ),
        ],
      }
    })

  /** A fixed grid, not a mosaic: unlike the testimonial wall, no card here
   *  takes two columns or stands taller than its neighbour. */
  expect(read.heights).toHaveLength(1)
  expect(read.widths).toHaveLength(1)
  expect(read.panelTops, "the pictures line up across the row").toHaveLength(1)
})

test("the grid turns three to one, with no stage between", async ({ page }) => {
  await page.setViewportSize({ width: 810, height: 1000 })
  await page.goto(SPECIMEN)

  /** The file draws no two-column stage: at the tablet its three cards run
   *  the full 762 one under the other, with room to spare. */
  const tablet = await page
    .locator("[data-slot='card-grid-list']")
    .evaluate(
      (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
    )

  expect(tablet).toBe(1)
  expect((await box(page, "[data-slot='card-grid-card']")).width).toBe(
    DRAWN.cardNarrow,
  )
  expect((await box(page, "[data-slot='illustration-panel']")).width).toBe(
    DRAWN.panelTablet,
  )

  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto(SPECIMEN)

  expect((await box(page, "[data-slot='card-grid-card']")).width).toBe(
    DRAWN.cardMobile,
  )
  const panel = await box(page, "[data-slot='illustration-panel']")
  expect(panel.width).toBe(DRAWN.panelMobile)
  expect(panel.height, "290 at every width the column gives it").toBe(
    DRAWN.panelHeight,
  )
})

test("two cards share the row the way three do", async ({ page }) => {
  await page.goto(`${SPECIMEN}?cards=2`)

  const read = await page
    .locator("[data-slot='card-grid-list']")
    .evaluate((node) => {
      const cards = [...node.querySelectorAll("[data-slot='card-grid-card']")]
      return {
        columns: getComputedStyle(node).gridTemplateColumns.split(" ").length,
        cards: cards.length,
        width: Math.round(cards[0]?.getBoundingClientRect().width ?? 0),
      }
    })

  expect(read.cards).toBe(2)
  expect(read.columns).toBe(2)
  /** 1200 less one 16 gap, in two. */
  expect(read.width).toBe(592)
})

test("the chip and the line show only when asked for", async ({ page }) => {
  await page.goto(`${SPECIMEN}?options=on`)

  await expect(page.locator("[data-slot='chip']")).toHaveCount(1)
  await expect(page.locator("[data-slot='card-grid-description']")).toHaveCount(
    1,
  )

  const centred = await page
    .locator("[data-slot='card-grid-description']")
    .evaluate((node) => getComputedStyle(node).textAlign)

  expect(centred).toBe("center")
})

test("the other two grounds replace the wash", async ({ page }) => {
  await page.goto(`${SPECIMEN}?background=beige`)

  const beige = await page
    .locator("[data-slot='card-grid']")
    .evaluate((node) => getComputedStyle(node).backgroundColor)

  expect(beige).toBe("rgb(245, 242, 239)")

  await page.goto(`${SPECIMEN}?background=white`)

  const white = await page
    .locator("[data-slot='card-grid']")
    .evaluate((node) => getComputedStyle(node).backgroundColor)

  expect(white).toBe("rgb(255, 255, 255)")
})

test("on a dark page the wash goes and the panel holds", async ({ page }) => {
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
    .locator("[data-slot='card-grid']")
    .evaluate((node) => {
      const card = node.querySelector("[data-slot='card-grid-card']")
      const panel = node.querySelector("[data-slot='illustration-panel']")
      const inner = panel?.firstElementChild

      return {
        ground: getComputedStyle(node).backgroundColor,
        image: getComputedStyle(node).backgroundImage,
        card: card ? getComputedStyle(card).backgroundColor : null,
        panel: inner ? getComputedStyle(inner).backgroundImage : null,
      }
    })

  expect(read.ground).toBe("oklch(0.145 0 none)")
  expect(read.image).toBe("none")
  expect(read.card).toBe("oklch(0.205 0 none)")
  /** A brand surface, like the step marker and the icon list's disc. */
  expect(read.panel).toContain(DRAWN.olive300)
})

test("the catalog frames the grid at all three widths", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  await expect(page.locator("iframe")).toHaveCount(4)

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
