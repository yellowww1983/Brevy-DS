import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 1400 } })

const PAGE = "/blocks/hero/split"
const SPECIMEN = "/specimens/hero-split"

/** What the Caregiving page draws (`22653:4849`), which is the only place the
 *  file sets a hero this way. */
const DRAWN = {
  height: 670,
  row: 1200,
  gutter: 32,
  copy: { desktop: 576, mobile: 358 },
  heading: { desktop: 42, tablet: 36, mobile: 30 },
  picture: {
    width: 592,
    height: 602,
    left: 728,
    rightFromEdge: 120,
    inset: 34,
  },
  card: {
    width: 422,
    leftInHero: 544,
    bottomFromFoot: 141,
    overlapsPictureBy: 238,
  },
  gapHeadingToDescription: 8,
  gapDescriptionToProof: 24,
  gapProofToAction: { wide: 64, mobile: 48 },
}

/** brand-500, the green the file writes every hero heading in. */
const BRAND = "rgb(6, 110, 61)"
/** brand-vivid, where `--primary` lands on a dark page. */
const BRAND_VIVID = "rgb(14, 138, 77)"
/** The line along the top of the band: flat black at 10%, which is what the
 *  file strokes it with (`22657:503`). */
const BAND_EDGE = "rgba(0, 0, 0, 0.1)"
/** neutral-950, the page under a dark theme. */
const NEUTRAL_950 = "oklch(0.145 0 none)"
/** violet-50 and violet-900, the card's ground and its leading line. */
const VIOLET_50 = "rgb(252, 250, 255)"
const VIOLET_900 = "rgb(94, 82, 140)"

/** The frames the page shows, in order: as drawn, without the card, without
 *  the picture. */
const drawn = (page: Page) => page.locator("figure[data-measures]").first()
const noCard = (page: Page) => page.locator("figure[data-measures]").nth(1)
const noPicture = (page: Page) => page.locator("figure[data-measures]").nth(2)

const heroIn = (frame: ReturnType<typeof drawn>) =>
  frame.locator("iframe").contentFrame().locator("[data-slot='hero-split']")

const geometry = (node: HTMLElement) => {
  const pick = (slot: string) => node.querySelector(`[data-slot='${slot}']`)
  const copy = pick("hero-split-copy")
  const heading = pick("hero-split-heading")
  const description = pick("hero-split-description")
  const action = pick("hero-split-action")
  const row = pick("hero-split-row")

  if (!copy || !heading || !description || !action || !row) {
    return null
  }

  const box = node.getBoundingClientRect()
  const copyBox = copy.getBoundingClientRect()
  const headingBox = heading.getBoundingClientRect()
  const descriptionBox = description.getBoundingClientRect()
  const actionBox = action.getBoundingClientRect()
  const headingStyle = getComputedStyle(heading)
  const picture = pick("shaped-image")
  const card = pick("hero-split-card")
  const proof = pick("social-proof")
  const pictureBox = picture?.getBoundingClientRect()
  const cardBox = card?.getBoundingClientRect()
  const cardStyle = card ? getComputedStyle(card) : null
  const proofBox = proof?.getBoundingClientRect()

  return {
    document: node.ownerDocument.documentElement.clientWidth,
    height: Math.round(box.height),
    direction: getComputedStyle(row).flexDirection,
    rowWidth: Math.round(row.getBoundingClientRect().width),
    copyWidth: Math.round(copyBox.width),
    copyAlign: getComputedStyle(copy).textAlign,
    heading: {
      size: Math.round(Number.parseFloat(headingStyle.fontSize)),
      family: headingStyle.fontFamily.split(",")[0]?.replace(/["']/g, "") ?? "",
      colour: headingStyle.color,
    },
    gapHeadingToDescription: Math.round(descriptionBox.top - headingBox.bottom),
    gapDescriptionToProof: proofBox
      ? Math.round(proofBox.top - descriptionBox.bottom)
      : null,
    gapProofToAction: proofBox
      ? Math.round(actionBox.top - proofBox.bottom)
      : null,
    proofLayout: proof?.getAttribute("data-layout") ?? null,
    /** The picture is either drawn beside the copy or not there at all: the
     *  file has no middle state, so a zero box is the honest reading of the
     *  widths where it is absent. */
    picture:
      picture && pictureBox && pictureBox.width > 0
        ? {
            width: Math.round(pictureBox.width),
            height: Math.round(pictureBox.height),
            leftInHero: Math.round(pictureBox.left - box.left),
            rightFromEdge: Math.round(box.right - pictureBox.right),
            topInHero: Math.round(pictureBox.top - box.top),
            bottomFromFoot: Math.round(box.bottom - pictureBox.bottom),
            masked: getComputedStyle(picture).maskImage !== "none",
            gutter: Math.round(pictureBox.left - copyBox.right),
          }
        : null,
    card:
      card && cardBox && cardStyle
        ? {
            width: Math.round(cardBox.width),
            position: cardStyle.position,
            radius: cardStyle.borderTopLeftRadius,
            bottomRadius: cardStyle.borderBottomLeftRadius,
            shadow: cardStyle.boxShadow === "none" ? "none" : "some",
            edge: {
              top: cardStyle.borderTopWidth,
              colour: cardStyle.borderTopColor,
              rest: [
                cardStyle.borderRightWidth,
                cardStyle.borderBottomWidth,
                cardStyle.borderLeftWidth,
              ].join(" "),
            },
            ground: cardStyle.backgroundColor,
            leftInHero: Math.round(cardBox.left - box.left),
            bottomFromFoot: Math.round(box.bottom - cardBox.bottom),
            reachesFoot: Math.round(box.bottom - cardBox.bottom) === 0,
          }
        : null,
    ground: getComputedStyle(node).backgroundImage,
  }
}

const at = async (
  page: Page,
  tab: string,
  frame: ReturnType<typeof drawn> = drawn(page),
) => {
  await page.getByRole("button", { name: tab, exact: true }).click()
  await measured(page)
  return heroIn(frame).evaluate(geometry)
}

test("the skeleton is the drawn one at every width", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const desktop = await at(page, "Desktop")
  const tablet = await at(page, "Tablet")
  const mobile = await at(page, "Mobile")

  for (const [width, read] of Object.entries({ desktop, tablet, mobile })) {
    expect(read, `${width}: the hero is missing a part`).not.toBeNull()
    expect(read?.height, `${width}: the drawn canvas`).toBe(DRAWN.height)
    expect(read?.heading.family, `${width}: the serif`).toBe(
      "Hedvig Letters Serif",
    )
    expect(read?.heading.colour, `${width}: brand-500`).toBe(BRAND)
    expect(read?.gapHeadingToDescription, `${width}: 8 under the heading`).toBe(
      DRAWN.gapHeadingToDescription,
    )
    expect(read?.gapDescriptionToProof, `${width}: 24 down to the proof`).toBe(
      DRAWN.gapDescriptionToProof,
    )
  }

  expect(desktop?.direction, "a row where the picture stands beside it").toBe(
    "row",
  )
  expect(tablet?.direction, "a column where it does not").toBe("column")
  expect(mobile?.direction).toBe("column")

  expect(desktop?.copyAlign, "set to the left beside the picture").toBe("left")
  expect(tablet?.copyAlign, "centred without it").toBe("center")
  expect(mobile?.copyAlign).toBe("center")

  expect(desktop?.copyWidth, "the drawn 576").toBe(DRAWN.copy.desktop)
  expect(mobile?.copyWidth, "the drawn 358").toBe(DRAWN.copy.mobile)

  expect(desktop?.gapProofToAction, "64 down to the action").toBe(
    DRAWN.gapProofToAction.wide,
  )
  expect(tablet?.gapProofToAction).toBe(DRAWN.gapProofToAction.wide)
  expect(mobile?.gapProofToAction, "48 where the column narrows").toBe(
    DRAWN.gapProofToAction.mobile,
  )
})

test("the heading is the drawn size at the three drawn widths", async ({
  page,
}) => {
  /** Read in a document of the drawn width rather than through the tabs: the
   *  h1 is fluid, so the three numbers only exist at 1440, 810 and 390. */
  for (const [width, drawnSize] of [
    [1440, DRAWN.heading.desktop],
    [810, DRAWN.heading.tablet],
    [390, DRAWN.heading.mobile],
  ] as const) {
    await page.setViewportSize({ width, height: 1400 })
    await page.goto(SPECIMEN)

    const size = await page
      .locator("[data-slot='hero-split-heading']")
      .evaluate((node) =>
        Math.round(Number.parseFloat(getComputedStyle(node).fontSize)),
      )

    expect(size, `${String(width)}: the drawn step`).toBe(drawnSize)
  }
})

test("the picture stands beside the copy at the desktop and nowhere else", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const desktop = await at(page, "Desktop")
  const tablet = await at(page, "Tablet")
  const mobile = await at(page, "Mobile")

  expect(desktop?.rowWidth, "576 and 592 with 32 between").toBe(DRAWN.row)
  expect(desktop?.picture?.gutter).toBe(DRAWN.gutter)
  expect(desktop?.picture?.width).toBe(DRAWN.picture.width)
  expect(desktop?.picture?.height).toBe(DRAWN.picture.height)
  expect(desktop?.picture?.leftInHero).toBe(DRAWN.picture.left)
  expect(desktop?.picture?.rightFromEdge).toBe(DRAWN.picture.rightFromEdge)
  expect(desktop?.picture?.topInHero).toBe(DRAWN.picture.inset)
  expect(desktop?.picture?.bottomFromFoot).toBe(DRAWN.picture.inset)
  expect(desktop?.picture?.masked, "cut to the Brevy mark").toBe(true)

  expect(
    tablet?.picture,
    "the file draws no picture here: it does not shrink and it does not drop",
  ).toBeNull()
  expect(mobile?.picture).toBeNull()
})

test("the card floats at the desktop and lies along the foot below it", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const desktop = await at(page, "Desktop")
  const tablet = await at(page, "Tablet")
  const mobile = await at(page, "Mobile")

  expect(desktop?.card?.position).toBe("absolute")
  expect(desktop?.card?.width, "the drawn 422").toBe(DRAWN.card.width)
  expect(desktop?.card?.leftInHero).toBe(DRAWN.card.leftInHero)
  expect(desktop?.card?.bottomFromFoot).toBe(DRAWN.card.bottomFromFoot)
  expect(desktop?.card?.shadow, "lifted off the picture").toBe("some")
  expect(desktop?.card?.bottomRadius, "round on all four").toBe("16px")

  for (const [width, read] of Object.entries({ tablet, mobile })) {
    expect(read?.card?.position, `${width}: in the flow`).toBe("relative")
    expect(read?.card?.reachesFoot, `${width}: against the foot`).toBe(true)
    expect(read?.card?.radius, `${width}: rounded at the top`).toBe("16px")
    expect(read?.card?.bottomRadius, `${width}: square at the bottom`).toBe(
      "0px",
    )
    expect(read?.card?.shadow, `${width}: flat`).toBe("none")
  }

  expect(desktop?.card?.ground, "violet-50").toBe(VIOLET_50)

  expect(
    desktop?.card?.edge.top,
    "the floating card has `strokes: []`: a shadow instead of a line",
  ).toBe("0px")

  const highlight = heroIn(drawn(page)).locator(
    "[data-slot='hero-split-card'] p",
  )
  await expect(highlight.first()).toHaveCSS("color", VIOLET_900)
  await expect(highlight.first()).toHaveCSS("font-weight", "600")
})

test("the band wears a line where the floating card wears a shadow", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  for (const width of ["Tablet", "Mobile"]) {
    const read = await at(page, width)

    expect(read?.card?.edge.top, `${width}: the drawn 1`).toBe("1px")
    expect(read?.card?.edge.rest, `${width}: one side only`).toBe("0px 0px 0px")
    expect(read?.card?.edge.colour, `${width}: flat black at 10%`).toBe(
      BAND_EDGE,
    )
    expect(read?.card?.shadow, `${width}: a line instead of a shadow`).toBe(
      "none",
    )
  }
})

test("without the card the hero ends at the copy", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await at(page, "Desktop", noCard(page))

  expect(read?.card).toBeNull()
  expect(read?.height, "the canvas does not move when the card goes").toBe(
    DRAWN.height,
  )
})

test("without the picture every width is the centred column", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await at(page, "Desktop", noPicture(page))

  expect(read?.picture).toBeNull()
  expect(read?.ground, "the gradient the section paints itself").toContain(
    "gradient",
  )
})

test("the proof stacks at every width", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  for (const tab of ["Desktop", "Tablet", "Mobile"]) {
    const read = await at(page, tab)

    expect(
      read?.proofLayout,
      `${tab}: the split hero has no room for the row`,
    ).toBe("stacked")
  }

  /** Stacked lays out as a block with the faces inline, so the alignment the
   *  copy carries reaches both of them without a prop of its own. */
  const faces = heroIn(drawn(page))
    .locator("[data-slot='social-proof']")
    .evaluate((node) => getComputedStyle(node).display)

  await expect(faces).resolves.toBe("block")
})

test("on a dark page the ground and the heading follow the app", async ({
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
    .locator("[data-slot='hero-split']")
    .evaluate((node) => {
      const style = getComputedStyle(node)
      const wash = node.querySelector("[data-slot='hero-split-wash']")
      const heading = node.querySelector("[data-slot='hero-split-heading']")

      return {
        ground: style.backgroundColor,
        gradient: style.backgroundImage,
        washShown: wash ? getComputedStyle(wash).display : "absent",
        heading: heading ? getComputedStyle(heading).color : null,
      }
    })

  expect(read.ground, "the ground the app gives a dark page").toBe(NEUTRAL_950)
  expect(read.gradient, "the beige gradient goes").toBe("none")
  expect(
    read.washShown,
    "a lit photograph under a dark card is a light hero",
  ).toBe("none")
  expect(read.heading, "brand-vivid, which reads at 4.49 on a dark page").toBe(
    BRAND_VIVID,
  )
})

/** The band's line holds its colour in the dark, because the thing it is drawn
 *  on holds its colour too.
 *
 *  The app's rule — every dark outline is flat white at 10% — is a rule about
 *  surfaces that darken. This card is a brand surface: violet-50 in both
 *  themes, the way olive and amber are. So the edge follows the surface rather
 *  than the theme. Measured before it was decided: white at 10% over
 *  violet-50 leaves the row reading (252, 250, 255) either side of it, which
 *  is not a faint line but no line.
 *
 *  If the card is ever given a dark ground, this test is the one that should
 *  change, and the edge goes back to the white-at-10% rule with it. */
test("on a dark page the band's line follows its surface, not the theme", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.setViewportSize({ width: 810, height: 900 })
  await page.goto(SPECIMEN)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  const card = page.locator("[data-slot='hero-split-card']")

  await expect(card).toHaveCSS("border-top-width", "1px")
  await expect(
    card,
    "the same black the light page draws, on the same violet-50",
  ).toHaveCSS("border-top-color", BAND_EDGE)
  await expect(
    card,
    "a brand surface, which is why the edge did not follow the theme",
  ).toHaveCSS("background-color", VIOLET_50)
})
