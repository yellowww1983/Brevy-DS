import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 1400 } })

const PAGE = "/blocks/testimonials"
const SPECIMEN = "/specimens/testimonials"

/** What the home page draws (`20919:10971`, `22624:8146`, `22629:10182`), the
 *  one section in the file that carries testimonials. */
const DRAWN = {
  /** The block's own, against the file's 96 and nothing. */
  breath: 96,
  radius: "16px",
  gap: 16,
  /** The distance from the top padding to the cards, which the file holds at
   *  all three widths by pinning them to y=363. */
  headerSlot: 267,
  cardsAt: 363,
  column: { desktop: 1200, tablet: 762, mobile: 358 },
  /** Three columns of the 1201 the file measures, less two 16s. */
  card: 389.7,
  featured: 796,
  /** A floor, not a height. Gone below the tablet. */
  floor: 270,
  portrait: 262,
  photo: { desktop: 736, tablet: 640, mobile: 486 },
  shade: 509,
  mark: { width: 321, height: 265, left: -20, top: 70 },
  avatar: 40,
  olive: "rgb(215, 228, 201)",
  taupe: "rgb(154, 139, 133)",
  emerald: "rgb(2, 54, 32)",
  beige: "rgb(245, 242, 239)",
  beige300: "rgb(248, 245, 242)",
  /** `0 1 2 0` at 5%, which is `shadow-xs`. */
  shadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
}

const frame = (page: Page, index = 0) => page.locator("iframe").nth(index)

const box = async (page: Page, selector: string, index = 0) =>
  page
    .locator(selector)
    .nth(index)
    .evaluate((node) => {
      const rectangle = node.getBoundingClientRect()
      return {
        width: Math.round(rectangle.width * 10) / 10,
        height: Math.round(rectangle.height * 10) / 10,
        x: Math.round(rectangle.x * 10) / 10,
        y: Math.round(rectangle.y * 10) / 10,
      }
    })

test("the section carries its own 96 above and below", async ({ page }) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='testimonials']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        top: style.paddingTop,
        bottom: style.paddingBottom,
        background: style.backgroundColor,
      }
    })

  /** Against the file's 96 and 0, which only works where something follows.
   *  DESIGN-FEEDBACK 64. */
  expect(read.top).toBe(`${String(DRAWN.breath)}px`)
  expect(read.bottom).toBe(`${String(DRAWN.breath)}px`)
  expect(read.background).toBe(DRAWN.beige)
})

test("the mosaic is three columns with the wide card across two", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const cards = await page
    .locator("[data-slot='testimonials-mosaic'] > li > div")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const rectangle = node.getBoundingClientRect()
        return {
          slot: node.getAttribute("data-slot"),
          width: Math.round(rectangle.width * 10) / 10,
          left: Math.round(rectangle.left * 10) / 10,
          right: Math.round(rectangle.right * 10) / 10,
          top: Math.round(rectangle.top),
        }
      }),
    )

  expect(cards.map((card) => card.slot)).toEqual([
    "testimonials-stat",
    "testimonials-featured",
    "quote-card",
    "quote-card",
    "quote-card",
  ])

  /** A third of the column, and the wide card two thirds plus the gap between
   *  them, which is what the file draws as 389.7 and 796. */
  const third = (DRAWN.column.desktop - DRAWN.gap * 2) / 3
  expect(cards[0]?.width).toBeCloseTo(third, 0)
  expect(cards[1]?.width).toBeCloseTo(third * 2 + DRAWN.gap, 0)
  expect(cards[2]?.width).toBeCloseTo(third, 0)

  /** 16 between every pair, across and down. */
  expect((cards[1]?.left ?? 0) - (cards[0]?.right ?? 0)).toBeCloseTo(
    DRAWN.gap,
    1,
  )
  expect((cards[3]?.left ?? 0) - (cards[2]?.right ?? 0)).toBeCloseTo(
    DRAWN.gap,
    1,
  )
  expect((cards[4]?.left ?? 0) - (cards[3]?.right ?? 0)).toBeCloseTo(
    DRAWN.gap,
    1,
  )

  /** Two rows: the first two share a top, the last three share another. */
  expect(cards[1]?.top).toBe(cards[0]?.top)
  expect(cards[3]?.top).toBe(cards[2]?.top)
  expect(cards[4]?.top).toBe(cards[2]?.top)
})

test("the header holds the cards at the drawn y without pinning them", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const section = await box(page, "[data-slot='testimonials']")
  const stat = await box(page, "[data-slot='testimonials-stat']")

  /** The one constant in a section the file lays out by hand: 96 of padding
   *  and a 267 slot puts the cards at 363, which is where the file pins them
   *  at every width. Here it is a floor rather than a coordinate, so a longer
   *  heading pushes them down instead of going under them —
   *  DESIGN-FEEDBACK 65. */
  expect(stat.y - section.y).toBe(DRAWN.breath + DRAWN.headerSlot)
  expect(stat.y - section.y).toBe(DRAWN.cardsAt)
})

test("every card wears the same radius, thread and shadow", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const read = await page
    .locator("[data-slot='testimonials-mosaic'] > li > div")
    .evaluateAll((nodes) =>
      nodes.slice(0, 3).map((node) => {
        const style = getComputedStyle(node)
        return {
          radius: style.borderRadius,
          shadow: style.boxShadow,
          background: style.backgroundColor,
          /** The thread is an overlay rather than a border, so it is read off
           *  the pseudo-element that paints it. */
          thread: getComputedStyle(node, "::before").backgroundImage,
        }
      }),
    )

  for (const card of read) {
    expect(card.radius).toBe(DRAWN.radius)
    expect(card.shadow).toContain(DRAWN.shadow)
  }

  expect(read[0]?.background).toBe(DRAWN.olive)
  expect(read[1]?.background).toBe(DRAWN.taupe)
  expect(read[2]?.background).toBe("rgb(255, 255, 255)")

  /** Each card's thread is its own fill one step darker: olive-600 flat on the
   *  stat, taupe-500 to taupe-600 on the wide card, and the neutral pair every
   *  other white surface in the system wears. */
  expect(read[0]?.thread).toContain("rgb(184, 199, 170)")
  expect(read[1]?.thread).toContain("rgb(154, 139, 133)")
  expect(read[1]?.thread).toContain("rgb(132, 118, 113)")
  expect(read[2]?.thread).toContain("oklch(0.922 0 none)")
})

test("the figure and its unit are one object, top-aligned", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const stat = page.locator("[data-slot='testimonials-stat']")
  const read = await stat.evaluate((node) => {
    const figure = node.querySelector("p")
    const unit = node.querySelector("span")

    if (!figure || !unit) {
      return null
    }

    const type = (element: Element) => {
      const style = getComputedStyle(element)
      return {
        size: style.fontSize,
        leading: style.lineHeight,
        weight: style.fontWeight,
        colour: style.color,
        tracking: style.letterSpacing,
      }
    }

    return {
      figure: type(figure),
      unit: type(unit),
      /** The file sets both boxes to y=0 inside their row, so the unit sits at
       *  the figure's shoulder rather than on its baseline. */
      aligned:
        Math.round(figure.getBoundingClientRect().top) ===
        Math.round(unit.getBoundingClientRect().top),
    }
  })

  /** Not `display`, which is 60 on 72 — DESIGN-FEEDBACK 67. */
  expect(read?.figure.size).toBe("60px")
  expect(read?.figure.leading).toBe("60px")
  expect(read?.figure.weight).toBe("700")
  expect(read?.figure.colour).toBe(DRAWN.emerald)
  expect(read?.figure.tracking, "the body's own -0.9%").toBe("-0.54px")

  expect(read?.unit.size).toBe("24px")
  expect(read?.unit.leading).toBe("24px")
  expect(read?.unit.weight).toBe("700")

  expect(read?.aligned).toBe(true)
})

test("the wide card holds its picture square and its copy 24 off the edge", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const card = await box(page, "[data-slot='testimonials-featured']")
  const picture = await box(
    page,
    "[data-slot='testimonials-featured'] > div:not([aria-hidden])",
  )
  const copy = await box(page, "[data-slot='testimonials-featured'] p")

  /** 4 all round the picture and 24 from the card's own edge to the copy,
   *  which is the rule that lands on the drawn 482. */
  expect(picture.width).toBe(DRAWN.portrait)
  expect(picture.height).toBe(DRAWN.portrait)
  expect(picture.x - card.x).toBe(4)
  expect(Math.round(card.x + card.width - (copy.x + copy.width))).toBe(4)

  const read = await page
    .locator("[data-slot='testimonials-featured'] p")
    .evaluate((node) => ({
      colour: getComputedStyle(node).color,
      padding: getComputedStyle(node).paddingRight,
    }))

  expect(read.colour).toBe("rgb(255, 255, 255)")
  expect(read.padding).toBe("20px")

  /** Nobody's name under it, which is the file's doing —
   *  DESIGN-FEEDBACK 66. */
  await expect(
    page.locator("[data-slot='testimonials-featured'] [data-slot='avatar']"),
  ).toHaveCount(0)
})

test("the white card carries a face at 40 and a mark bled off its edge", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const card = await box(page, "[data-slot='quote-card']")
  const avatar = await box(
    page,
    "[data-slot='quote-card'] [data-slot='avatar']",
  )
  const mark = await box(page, "[data-slot='quote-card-mark']")

  /** The one place in the file that draws a 40 avatar, which is why the
   *  component grew a size rather than a class at this call site. */
  expect(avatar.width).toBe(DRAWN.avatar)
  expect(avatar.height).toBe(DRAWN.avatar)

  expect(mark.width).toBe(DRAWN.mark.width)
  expect(mark.height).toBe(DRAWN.mark.height)
  expect(mark.x - card.x).toBe(DRAWN.mark.left)
  expect(mark.y - card.y).toBe(DRAWN.mark.top)

  const read = await page
    .locator("[data-slot='quote-card-mark']")
    .first()
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return { background: style.backgroundColor, mask: style.maskImage }
    })

  expect(read.background).toBe(DRAWN.beige300)
  /** Painted through a mask rather than typeset: no size in the ramp reaches
   *  265 tall, and the shape is a vector in the file rather than the
   *  typeface's own quote. */
  expect(read.mask).toContain("svg")

  const name = await page
    .locator("[data-slot='quote-card'] p")
    .nth(1)
    .evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        size: style.fontSize,
        leading: style.lineHeight,
        weight: style.fontWeight,
      }
    })

  /** Bold here and SemiBold on the app page — DESIGN-FEEDBACK 68. */
  expect(name.size).toBe("18px")
  expect(name.leading).toBe("28px")
  expect(name.weight).toBe("700")

  /** The card clips the mark, which is what makes it a corner of a drawing
   *  rather than a drawing. */
  const clipped = await page
    .locator("[data-slot='quote-card']")
    .first()
    .evaluate((node) => getComputedStyle(node).overflow)

  expect(clipped).toBe("hidden")
})

test("the photograph is a band with a wash over it, and the copy is white", async ({
  page,
}) => {
  await page.goto(SPECIMEN)

  const photo = await box(page, "[data-slot='testimonials-photo']")
  const shade = await box(page, "[data-slot='testimonials-shade']")
  const section = await box(page, "[data-slot='testimonials']")

  expect(photo.height).toBe(DRAWN.photo.desktop)
  expect(photo.y).toBe(section.y)
  expect(shade.height).toBe(DRAWN.shade)
  expect(shade.y).toBe(section.y)

  const mask = await page
    .locator("[data-slot='testimonials-photo']")
    .evaluate((node) => getComputedStyle(node).maskImage)

  /** Only the middle third is opaque: the file's own 0, 30, 63 and 95 read off
   *  a reversed axis, which lands on 0, 32, 67 and 98. */
  expect(mask).toContain("32%")
  expect(mask).toContain("67%")

  const copy = await page
    .locator("[data-slot='testimonials-heading']")
    .evaluate((node) => getComputedStyle(node).color)

  expect(copy).toBe("rgb(255, 255, 255)")
})

test("without the picture the ground is beige and the copy goes dark", async ({
  page,
}) => {
  await page.goto(`${SPECIMEN}?background=beige`)

  await expect(page.locator("[data-slot='testimonials-photo']")).toHaveCount(0)
  await expect(page.locator("[data-slot='testimonials-shade']")).toHaveCount(0)

  const read = await page
    .locator("[data-slot='testimonials']")
    .evaluate((node) => {
      const heading = node.querySelector("[data-slot='testimonials-heading']")
      const lede = node.querySelector("[data-slot='testimonials-description']")

      return {
        background: getComputedStyle(node).backgroundColor,
        heading: heading ? getComputedStyle(heading).color : null,
        lede: lede ? getComputedStyle(lede).color : null,
        /** The 267 slot is the room the picture needs. Without one it would be
         *  an empty stripe, so the header falls back to the 56 every block in
         *  this system leaves under its heading. */
        slot: heading?.parentElement
          ? getComputedStyle(heading.parentElement).minHeight
          : null,
      }
    })

  expect(read.background).toBe(DRAWN.beige)
  expect(read.heading).toBe("oklch(0.274 0.006 286.033)")
  expect(read.lede).toBe("oklch(0.37 0.013 285.805)")
  expect(read.slot).toBe("auto")
})

test("the mosaic is one column below the content width", async ({ page }) => {
  await page.setViewportSize({ width: 810, height: 1400 })
  await page.goto(SPECIMEN)

  const cards = await page
    .locator("[data-slot='testimonials-mosaic'] > li > div")
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const rectangle = node.getBoundingClientRect()
        return {
          width: Math.round(rectangle.width),
          height: Math.round(rectangle.height),
          top: Math.round(rectangle.top),
        }
      }),
    )

  /** Five cards down one column of 762, 16 apart, all at the drawn 270 — the
   *  wide card included, which keeps its picture beside its quote here. */
  for (const card of cards) {
    expect(card.width).toBe(DRAWN.column.tablet)
    expect(card.height).toBe(DRAWN.floor)
  }

  for (const [index, card] of cards.slice(1).entries()) {
    expect(card.top - (cards[index]?.top ?? 0) - DRAWN.floor).toBe(DRAWN.gap)
  }

  expect(
    await page
      .locator("[data-slot='testimonials-featured']")
      .evaluate((node) => getComputedStyle(node).flexDirection),
  ).toBe("row")

  const photo = await box(page, "[data-slot='testimonials-photo']")
  expect(photo.height).toBe(DRAWN.photo.tablet)
})

test("at mobile the wide card stacks and the floor goes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1400 })
  await page.goto(SPECIMEN)

  expect(
    await page
      .locator("[data-slot='testimonials-featured']")
      .evaluate((node) => getComputedStyle(node).flexDirection),
  ).toBe("column")

  /** The picture goes above the words and takes the card's width, which is
   *  what grows the drawn card to 715. */
  const card = await box(page, "[data-slot='testimonials-featured']")
  const picture = await box(
    page,
    "[data-slot='testimonials-featured'] > div:not([aria-hidden])",
  )

  expect(picture.width).toBe(card.width - 8)
  expect(picture.height).toBe(picture.width)

  /** The file hugs its white cards here — 292, 208 and 320 — so a short quote
   *  is a short card rather than half a card of white. */
  const heights = await page
    .locator("[data-slot='quote-card']")
    .evaluateAll((nodes) =>
      nodes.map((node) => Math.round(node.getBoundingClientRect().height)),
    )

  expect(new Set(heights).size, "each card is as tall as its quote").toBe(3)
  expect(Math.min(...heights)).toBeLessThan(DRAWN.floor)

  expect(
    await page
      .locator("[data-slot='quote-card']")
      .first()
      .evaluate((node) => getComputedStyle(node).minHeight),
  ).toBe("auto")

  const photo = await box(page, "[data-slot='testimonials-photo']")
  expect(photo.height).toBe(DRAWN.photo.mobile)
})

test("on a dark page the two grounds converge and the brand cards stay", async ({
  page,
}) => {
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
    .locator("[data-slot='testimonials']")
    .evaluate((node) => {
      const style = (selector: string, property: string) => {
        const element = node.querySelector(selector)
        return element
          ? getComputedStyle(element).getPropertyValue(property)
          : null
      }

      return {
        section: getComputedStyle(node).backgroundColor,
        pictureHidden: style("[data-slot='testimonials-picture']", "display"),
        stat: style("[data-slot='testimonials-stat']", "background-color"),
        featured: style(
          "[data-slot='testimonials-featured']",
          "background-color",
        ),
        quote: style("[data-slot='quote-card']", "background-color"),
        mark: style("[data-slot='quote-card-mark']", "background-color"),
      }
    })

  /** The picture goes, the way the centred hero's does: a lit photograph under
   *  a dark page is a light section wearing dark parts. */
  expect(read.pictureHidden).toBe("none")
  expect(read.section).toBe("oklch(0.145 0 none)")

  /** Brand surfaces stay exactly as drawn, the way the olive button does. */
  expect(read.stat).toBe(DRAWN.olive)
  expect(read.featured).toBe(DRAWN.taupe)

  /** Only the white card is a light object, so only it steps to `--card`,
   *  which is neutral-900. The mark behind it goes to `--muted`, neutral-800 —
   *  one step off its ground, which is what beige-300 is to white. */
  expect(read.quote, "--card").toBe("oklch(0.205 0 none)")
  expect(read.mark, "--muted, one step off it").toBe("oklch(0.269 0 none)")
})

test("the catalog frames the section at all three widths", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  await expect(page.locator("iframe")).toHaveCount(2)

  const width = await frame(page).evaluate(
    (node) => node.getBoundingClientRect().width,
  )

  expect(width, "the desktop tab's own width, never shrunk").toBe(1440)

  await page.getByRole("button", { name: "Tablet", exact: true }).click()
  await measured(page)

  expect(
    await frame(page).evaluate((node) => node.getBoundingClientRect().width),
  ).toBe(810)
})
