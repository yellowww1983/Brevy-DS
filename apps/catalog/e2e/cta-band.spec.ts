import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 1400 } })

const PAGE = "/blocks/cta"
const SPECIMEN = "/specimens/cta-band"

/** What the four pages that close on this band draw (`22615:8408`,
 *  `23205:1817`, `25297:4519`, `25109:1684`), across the eight frames the
 *  file carries them in. */
const DRAWN = {
  height: 560,
  radius: "16px",
  card: { desktop: 1200, tablet: 762, mobile: 358 },
  mark: { wide: 128, narrow: 96 },
  heading: { desktop: "36px", narrow: "30px" },
  markToCopy: 32,
  insideCopy: 8,
  copyToButton: 48,
  buttonToNote: 12,
  button: 48,
  note: "12px",
  /** The white underlay's own air. The band's frame in the file is exactly the
   *  card's height; the 96 a reader sees above it is the previous section's
   *  bottom padding, on eight bands out of eight. The block carries its own so
   *  it can stand first, or alone. */
  breath: 96,
  /** The leaf the deep band tucks into two corners (`25297:4633`). */
  leaf: "168x168",
  /** The photographs, measured from the card's own edges. The tablet has its
   *  own rows rather than the desktop's moved in — read off the card at
   *  `22639:11241`, not off the `Wrapper` they hang from, which starts 100
   *  lower and would put every row 100 high.
   *
   *  It also drops the middle pair: six at the desktop, four at the tablet,
   *  none below it. */
  figureRows: {
    desktop: [
      { size: 96, inset: 88, top: 112, shown: true },
      { size: 72, inset: 218, top: 268, shown: true },
      { size: 60, inset: 88, top: 388, shown: true },
    ],
    tablet: [
      { size: 96, inset: 24, top: 100, shown: true },
      { size: 72, inset: 56, top: 264, shown: false },
      { size: 60, inset: 24, top: 368, shown: true },
    ],
  },
}

/** emerald-500, `--primary`: the deep green ground and the pale band's
 *  button. */
const EMERALD = "rgb(2, 54, 32)"
/** olive-500, `--primary-foreground`: the deep band's heading and button. */
const OLIVE = "rgb(215, 228, 201)"
/** zinc-700 — `#3f3f46`, the `63,63,70` the file writes the pale band's line
 *  in. Tailwind v4 ships the ramp in oklch, so this is what it computes to. */
const ZINC_700 = "oklch(0.37 0.013 285.805)"
const WHITE = "rgb(255, 255, 255)"
/** neutral-950, the page under a dark theme. */
const NEUTRAL_950 = "oklch(0.145 0 none)"
/** neutral-900, `--card`, where the pale band lands in the dark. */
const NEUTRAL_900 = "oklch(0.205 0 none)"

const light = (page: Page) => page.locator("figure[data-measures]").first()

const frameFor = (page: Page, query: string) =>
  page.locator(
    `figure[data-measures]:has(iframe[src$="/specimens/cta-band${query}"])`,
  )

const bandIn = (frame: ReturnType<typeof light>) =>
  frame.locator("iframe").contentFrame().locator("[data-slot='cta-band']")

/** Everything read straight off the frame's own document. Gaps are measured
 *  between boxes rather than taken off a class, so the assertion holds
 *  whatever the class is called. */
const geometry = (node: HTMLElement) => {
  const pick = (slot: string) =>
    node.querySelector<HTMLElement>(`[data-slot='${slot}']`)

  const card = pick("cta-band-card")
  const heading = pick("cta-band-heading")
  const description = pick("cta-band-description")
  const button = node.querySelector("a")

  if (!card || !heading || !description || !button) {
    return null
  }

  const mark = pick("cta-band-mark")
  const note = pick("cta-band-note")
  const figures = pick("cta-band-figures")
  const chip = node.querySelector<HTMLElement>("[data-slot='chip']")
  const box = (element: Element) => element.getBoundingClientRect()
  const cardBox = box(card)

  return {
    document: node.ownerDocument.documentElement.clientWidth,
    section: {
      height: Math.round(box(node).height),
      ground: getComputedStyle(node).backgroundColor,
    },
    breath: {
      top: Math.round(cardBox.top - box(node).top),
      bottom: Math.round(box(node).bottom - cardBox.bottom),
    },
    card: {
      width: Math.round(cardBox.width),
      height: Math.round(cardBox.height),
      radius: getComputedStyle(card).borderTopLeftRadius,
      ground: getComputedStyle(card).backgroundColor,
      gradient: getComputedStyle(card).backgroundImage,
    },
    mark: mark
      ? {
          size: Math.round(box(mark).width),
          toCopy: Math.round(box(heading).top - box(mark).bottom),
          gradient: getComputedStyle(mark).backgroundImage,
        }
      : null,
    chip: chip ? Math.round(box(heading).top - box(chip).bottom) : null,
    heading: {
      size: getComputedStyle(heading).fontSize,
      family: getComputedStyle(heading).fontFamily,
      colour: getComputedStyle(heading).color,
      toDescription: Math.round(box(description).top - box(heading).bottom),
    },
    description: {
      colour: getComputedStyle(description).color,
      toButton: Math.round(box(button).top - box(description).bottom),
    },
    button: {
      height: Math.round(box(button).height),
      ground: getComputedStyle(button).backgroundColor,
      colour: getComputedStyle(button).color,
    },
    note: note
      ? {
          size: getComputedStyle(note).fontSize,
          weight: getComputedStyle(note).fontWeight,
          colour: getComputedStyle(note).color,
          fromButton: Math.round(box(note).top - box(button).bottom),
        }
      : null,
    figures: figures ? getComputedStyle(figures).display : null,
    leaves: figures
      ? [...figures.children].map((leaf) => {
          const b = box(leaf)
          return {
            size: `${String(Math.round(b.width))}x${String(Math.round(b.height))}`,
            fromLeft: Math.round(b.left - cardBox.left),
            fromTop: Math.round(b.top - cardBox.top),
            fromRight: Math.round(cardBox.right - b.right),
            fromBottom: Math.round(cardBox.bottom - b.bottom),
            shown: getComputedStyle(leaf).display !== "none",
            fill: (() => {
              const picture = leaf.querySelector("img")

              if (!picture) {
                return null
              }

              const p = picture.getBoundingClientRect()

              return {
                covers:
                  Math.round(p.width) === Math.round(b.width) &&
                  Math.round(p.height) === Math.round(b.height),
                fit: getComputedStyle(picture).objectFit,
                square: picture.naturalWidth === picture.naturalHeight,
              }
            })(),
            mask: getComputedStyle(leaf).maskImage === "none" ? "none" : "leaf",
          }
        })
      : null,
  }
}

const at = async (
  page: Page,
  tab: string,
  frame: ReturnType<typeof light> = light(page),
) => {
  await page.getByRole("button", { name: tab, exact: true }).click()
  await measured(page)
  return bandIn(frame).evaluate(geometry)
}

test("the skeleton is the drawn one at every width", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const desktop = await at(page, "Desktop")
  const tablet = await at(page, "Tablet")
  const mobile = await at(page, "Mobile")

  expect(desktop?.card.width, "the content column").toBe(DRAWN.card.desktop)
  expect(tablet?.card.width).toBe(DRAWN.card.tablet)
  expect(mobile?.card.width).toBe(DRAWN.card.mobile)

  for (const read of [desktop, tablet, mobile]) {
    expect(read?.card.radius, "16 on all four corners").toBe(DRAWN.radius)
    expect(read?.mark?.toCopy, "32 from the mark to the copy").toBe(
      DRAWN.markToCopy,
    )
    expect(read?.heading.toDescription, "8 inside the copy").toBe(
      DRAWN.insideCopy,
    )
    expect(read?.description.toButton, "48 down to the action").toBe(
      DRAWN.copyToButton,
    )
    expect(read?.button.height, "the drawn 48").toBe(DRAWN.button)
    expect(read?.heading.family, "the serif carries the heading").toContain(
      "Hedvig",
    )
  }

  expect(
    desktop?.heading.size,
    "h2 rather than h1: the band closes a page",
  ).toBe(DRAWN.heading.desktop)
  expect(tablet?.heading.size).toBe(DRAWN.heading.narrow)
  expect(mobile?.heading.size).toBe(DRAWN.heading.narrow)

  expect(desktop?.mark?.size, "128 where there is room").toBe(DRAWN.mark.wide)
  expect(tablet?.mark?.size).toBe(DRAWN.mark.wide)
  expect(mobile?.mark?.size, "96 where the column narrows").toBe(
    DRAWN.mark.narrow,
  )
})

test("the white underlay breathes above and below the card", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  for (const tab of ["Desktop", "Tablet", "Mobile"]) {
    const read = await at(page, tab)

    expect(read?.breath.top, `${tab}: 96 over the card`).toBe(DRAWN.breath)
    expect(read?.breath.bottom, `${tab}: and 96 under it`).toBe(DRAWN.breath)
    expect(
      read?.section.height,
      `${tab}: the section is the card and its air, nothing else`,
    ).toBe((read?.card.height ?? 0) + DRAWN.breath * 2)
    expect(
      read?.section.ground,
      `${tab}: the air is the section's, so it is white`,
    ).toBe(WHITE)
  }
})

test("the two grounds carry the two buttons the system ships", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const pale = await at(page, "Desktop")
  const deep = await at(page, "Desktop", frameFor(page, "?tone=dark"))

  expect(pale?.card.gradient, "olive to white, vertical").toContain("gradient")
  expect(pale?.heading.colour).toBe(EMERALD)
  expect(pale?.description.colour).toBe(ZINC_700)
  expect(pale?.button.ground, "primary on the pale ground").toBe(EMERALD)
  expect(pale?.button.colour).toBe(OLIVE)

  expect(deep?.card.ground, "solid emerald").toBe(EMERALD)
  expect(deep?.card.gradient).toBe("none")
  expect(deep?.heading.colour).toBe(OLIVE)
  expect(deep?.description.colour).toBe(WHITE)
  expect(deep?.button.ground, "secondary on the deep ground").toBe(OLIVE)
  expect(deep?.button.colour).toBe(EMERALD)
})

test("the mark belongs to the pale ground", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const pale = await at(page, "Desktop")
  const deep = await at(page, "Desktop", frameFor(page, "?tone=dark"))

  expect(pale?.mark?.gradient, "brand-500 down to olive-500").toContain(
    "gradient",
  )
  expect(
    deep?.mark,
    "both deep bands hide it: brand-500 on emerald-500 is a mark nobody sees",
  ).toBeNull()
})

test("the chip, the note and the figures are each optional", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const plain = await at(page, "Desktop")
  const withChip = await at(
    page,
    "Desktop",
    frameFor(page, "?chip=on&figures=off"),
  )
  const deep = await at(page, "Desktop", frameFor(page, "?tone=dark"))

  expect(plain?.chip, "the pale preset draws none").toBeNull()
  expect(withChip?.chip, "8 from the chip to the heading").toBe(
    DRAWN.insideCopy,
  )

  expect(plain?.note, "no note on the pale band").toBeNull()
  expect(deep?.note?.size, "12/16 rather than the label token's 500").toBe(
    DRAWN.note,
  )
  expect(deep?.note?.weight).toBe("400")
  expect(deep?.note?.fromButton).toBe(DRAWN.buttonToNote)

  expect(plain?.figures, "behind the copy where the file draws them").toBe(
    "block",
  )
  expect(withChip?.figures, "and absent when they are left out").toBeNull()
  expect(
    deep?.figures,
    "the deep band's layer carries leaves rather than photographs",
  ).toBe("block")
})

test("the deep band tucks a leaf into two opposite corners", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const deep = await at(page, "Desktop", frameFor(page, "?tone=dark"))
  const leaves = deep?.leaves ?? []

  expect(leaves, "two, and only two").toHaveLength(2)
  expect(
    leaves.every((leaf) => leaf.shown),
    "both drawn",
  ).toBe(true)

  const [foot, head] = leaves

  expect(foot?.size, "the drawn 168 square").toBe(DRAWN.leaf)
  expect(head?.size).toBe(DRAWN.leaf)

  expect(
    { left: foot?.fromLeft, bottom: foot?.fromBottom },
    "flush into the foot on the left (`25297:4633`)",
  ).toEqual({ left: 0, bottom: 0 })

  expect(
    { right: head?.fromRight, top: head?.fromTop },
    "flush into the head on the right (`25297:4635`)",
  ).toEqual({ right: 0, top: 0 })

  for (const leaf of leaves) {
    expect(leaf.mask, "cut to the leaf rather than drawn as a box").toBe("leaf")
  }
})

test("the figures sit where each width draws them, in mirrored pairs", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  for (const [tab, rows] of [
    ["Desktop", DRAWN.figureRows.desktop],
    ["Tablet", DRAWN.figureRows.tablet],
  ] as const) {
    const read = await at(page, tab)
    const figures = read?.leaves ?? []

    expect(figures, `${tab}: six of them`).toHaveLength(6)

    rows.forEach((row, index) => {
      const nth = String(index + 1)
      const left = figures[index * 2]
      const right = figures[index * 2 + 1]

      expect(left?.shown, `${tab}: row ${nth} on the left`).toBe(row.shown)
      expect(right?.shown, `${tab}: row ${nth} on the right`).toBe(row.shown)

      if (!row.shown) {
        return
      }

      const size = `${String(row.size)}x${String(row.size)}`

      expect(left?.size).toBe(size)
      expect(right?.size).toBe(size)

      expect(left?.fromLeft, `${tab}: row ${nth} inset`).toBe(row.inset)
      expect(right?.fromRight, `${tab}: row ${nth} mirrors it`).toBe(row.inset)

      expect(left?.fromTop, `${tab}: row ${nth} height`).toBe(row.top)
      expect(right?.fromTop).toBe(row.top)
    })

    /** The thing that went wrong: read off their parent instead of the card,
     *  every row lands 100 high and the foot of the card empties out. The
     *  span is measured rather than the air under it, because the air is the
     *  card's height minus the span and the card grows with its copy. */
    const first = figures[0]
    const last = figures[5]
    const span = (last?.fromTop ?? 0) + 60 - (first?.fromTop ?? 0)

    expect(span, `${tab}: first row to last, as the file draws it`).toBe(
      tab === "Desktop" ? 336 : 328,
    )

    expect(
      figures.filter((figure) => figure.shown).length,
      `${tab}: the file draws six wide and four narrow`,
    ).toBe(tab === "Desktop" ? 6 : 4)
  }
})

test("every photograph fills its leaf", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  /** The file cuts these with `clipsContent` and an image larger than the
   *  frame, so the photograph reaches all four edges. Ours has to as well: a
   *  picture that stops short of the clip leaves a strip of the card's own
   *  gradient inside the leaf, which reads as a border nobody drew.
   *
   *  What this can check is the layout half — the picture is the size of the
   *  leaf and covers rather than contains. The other half is in the file the
   *  picture points at, and is measured by hand: rendering the band with and
   *  without the images and comparing, no pixel on any leaf's edge is the same
   *  in both. */
  for (const tab of ["Desktop", "Tablet"]) {
    const read = await at(page, tab)
    const shown = (read?.leaves ?? []).filter((figure) => figure.shown)

    expect(shown.length, `${tab}: something to check`).toBeGreaterThan(0)

    for (const [index, figure] of shown.entries()) {
      const nth = String(index + 1)

      expect(figure.fill?.covers, `${tab}: ${nth} fills its leaf`).toBe(true)
      expect(
        figure.fill?.fit,
        `${tab}: ${nth} covers rather than contains`,
      ).toBe("cover")
      expect(
        figure.fill?.square,
        `${tab}: ${nth} is square, so cover crops nothing`,
      ).toBe(true)
    }
  }
})

test("the figures go where the file stops drawing them", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  expect((await at(page, "Desktop"))?.figures).toBe("block")
  expect((await at(page, "Tablet"))?.figures).toBe("block")
  expect(
    (await at(page, "Mobile"))?.figures,
    "no narrow band in the file carries one",
  ).toBe("none")
})

test("the height is a floor and a long heading raises it", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const deep = await at(page, "Desktop", frameFor(page, "?tone=dark"))
  expect(deep?.card.height, "the drawn 560 when the copy is short").toBe(
    DRAWN.height,
  )

  const long = page.locator("figure[data-measures]").last()
  const grown = await at(page, "Desktop", long)

  expect(
    grown?.card.height,
    "a heading the drawing has no case for grows the band",
  ).toBeGreaterThan(DRAWN.height)
})

test("tone is not the theme: the deep band is deep on a light page", async ({
  page,
}) => {
  await page.goto(`${SPECIMEN}?tone=dark`)

  const read = await page.locator("[data-slot='cta-band']").evaluate(geometry)

  expect(
    read?.section.ground,
    "the page around it is still the light one",
  ).toBe(WHITE)
  expect(read?.card.ground).toBe(EMERALD)
})

test("on a dark page the pale band follows the app and the deep one holds", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })

  for (const [tone, expected] of [
    ["light", NEUTRAL_900],
    ["dark", EMERALD],
  ] as const) {
    await page.goto(tone === "dark" ? `${SPECIMEN}?tone=dark` : SPECIMEN)

    await expect
      .poll(() =>
        page.evaluate(() =>
          document.documentElement.classList.contains("dark"),
        ),
      )
      .toBe(true)

    const read = await page.locator("[data-slot='cta-band']").evaluate(geometry)

    expect(read?.section.ground, `${tone}: the app's dark page`).toBe(
      NEUTRAL_950,
    )
    expect(
      read?.card.ground,
      tone === "dark"
        ? "a brand surface holds in both themes, the way olive does"
        : "a light object cannot: it drops its gradient for the card",
    ).toBe(expected)

    if (tone === "light") {
      expect(read?.card.gradient, "the olive gradient goes").toBe("none")
    }
  }
})
