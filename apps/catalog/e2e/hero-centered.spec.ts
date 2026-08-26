import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 1400 } })

const PAGE = "/blocks/hero/centered"
const SPECIMEN = "/specimens/hero-centered"

/** What the file draws, from the Home hero for the chat and the partner page
 *  for the button. Both stand in the same skeleton. */
const DRAWN = {
  padTop: 40,
  gapToAction: 24,
  gapInColumn: 8,
  band: 426,
  copy: { desktop: 794, tablet: 794, mobile: 358 },
  heading: { desktop: 42, tablet: 36, mobile: 30 },
  height: { desktop: 670, tablet: 670, mobile: 757 },
  suggestionGap: 12,
}

/** brand-500, the green the file writes every hero heading in. */
const BRAND = "rgb(6, 110, 61)"
/** brand-vivid, where `--primary` lands on a dark page. */
const BRAND_VIVID = "rgb(14, 138, 77)"
/** neutral-950, the page under a dark theme. */
const NEUTRAL_950 = "oklch(0.145 0 none)"

/** The frames the page shows, in order: the chat, the button, and the one
 *  with no picture. Each is a document of its own at the width the tabs are
 *  on. */
const chat = (page: Page) => page.locator("figure[data-measures]").first()
const button = (page: Page) => page.locator("figure[data-measures]").nth(1)
const bare = (page: Page) => page.locator("figure[data-measures]").nth(2)

const heroIn = (frame: ReturnType<typeof chat>) =>
  frame.locator("iframe").contentFrame().locator("[data-slot='hero-centered']")

const geometry = (node: HTMLElement) => {
  const pick = (slot: string) => node.querySelector(`[data-slot='${slot}']`)
  const copy = pick("hero-centered-copy")
  const heading = pick("hero-centered-heading")
  const description = pick("hero-centered-description")
  const action = pick("hero-centered-action")

  if (!copy || !heading || !description || !action) {
    return null
  }

  const box = node.getBoundingClientRect()
  const copyBox = copy.getBoundingClientRect()
  const headingBox = heading.getBoundingClientRect()
  const descriptionBox = description.getBoundingClientRect()
  const actionBox = action.getBoundingClientRect()
  const headingStyle = getComputedStyle(heading)
  const band = pick("hero-centered-band")
  const wash = pick("hero-centered-wash")
  const eyebrow = pick("hero-centered-eyebrow")
  const proof = pick("social-proof")
  const note = pick("hero-centered-note")
  const suggestions = [...node.querySelectorAll("[data-slot='chip']")]
  const first2 = suggestions[0]
  const second2 = suggestions[1]
  const rows = new Set(
    suggestions.map((chip) => Math.round(chip.getBoundingClientRect().top)),
  )
  /** The first thing in the column, whatever it is: the intro when there is
   *  one, the heading group when there is not. */
  const first = copy.firstElementChild?.getBoundingClientRect()

  return {
    document: node.ownerDocument.documentElement.clientWidth,
    height: Math.round(box.height),
    padTop: Math.round(copyBox.top - box.top),
    copyWidth: Math.round(copyBox.width),
    gapToAction: first ? Math.round(actionBox.top - first.bottom) : null,
    gapHeadingToDescription: Math.round(descriptionBox.top - headingBox.bottom),
    heading: {
      size: Math.round(Number.parseFloat(headingStyle.fontSize)),
      family: headingStyle.fontFamily.split(",")[0]?.replace(/["']/g, "") ?? "",
      colour: headingStyle.color,
      align: headingStyle.textAlign,
    },
    intro: eyebrow ? "eyebrow" : proof ? "socialProof" : "none",
    action: node.querySelector("[data-slot='chat']") ? "chat" : "button",
    suggestions: suggestions.length,
    suggestionRows: rows.size,
    suggestionGap:
      first2 && second2
        ? Math.round(
            second2.getBoundingClientRect().top -
              first2.getBoundingClientRect().bottom,
          )
        : null,
    note: note ? getComputedStyle(note).fontSize : null,
    band: band
      ? {
          height: Math.round(band.getBoundingClientRect().height),
          masked: getComputedStyle(band).maskImage !== "none",
          /** Against the foot, which is where the file puts it. */
          atFoot:
            Math.round(band.getBoundingClientRect().bottom) ===
            Math.round(box.bottom),
        }
      : null,
    wash: Boolean(wash),
    ground: getComputedStyle(node).backgroundImage,
  }
}

const at = async (
  page: Page,
  tab: string,
  frame: ReturnType<typeof chat> = chat(page),
) => {
  await page.getByRole("button", { name: tab, exact: true }).click()
  await measured(page)
  return heroIn(frame).evaluate(geometry)
}

test("the skeleton is the drawn one at every width", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const reads = {
    desktop: await at(page, "Desktop"),
    tablet: await at(page, "Tablet"),
    mobile: await at(page, "Mobile"),
  }

  for (const [width, read] of Object.entries(reads)) {
    expect(read, `${width}: the hero is missing a part`).not.toBeNull()
    expect(read?.padTop, `${width}: 40 above the copy`).toBe(DRAWN.padTop)
    expect(read?.gapToAction, `${width}: 24 down to the action`).toBe(
      DRAWN.gapToAction,
    )
    expect(
      read?.gapHeadingToDescription,
      `${width}: 8 between heading and description`,
    ).toBe(DRAWN.gapInColumn)
    expect(read?.heading.align, `${width}: centred`).toBe("center")
    expect(read?.heading.family, `${width}: the serif`).toBe(
      "Hedvig Letters Serif",
    )
    expect(read?.heading.colour, `${width}: brand-500`).toBe(BRAND)
  }

  expect(reads.tablet?.document).toBe(810)
  expect(reads.mobile?.document).toBe(390)

  expect(reads.desktop?.copyWidth, "the drawn 794").toBe(DRAWN.copy.desktop)
  expect(reads.mobile?.copyWidth, "the drawn 358").toBe(DRAWN.copy.mobile)

  expect(reads.desktop?.height, "the drawn canvas").toBe(DRAWN.height.desktop)
  expect(reads.tablet?.height).toBe(DRAWN.height.tablet)
  expect(reads.mobile?.height, "taller where the copy stacks").toBe(
    DRAWN.height.mobile,
  )
})

test("the heading is the drawn size at the three drawn widths", async ({
  page,
}) => {
  /** Read in a document of the drawn width rather than through the tabs. The
   *  h1 is fluid, and the Desktop tab is as wide as the catalog's column can
   *  make it — 1056 here — where the scale is on its way to 42 rather than at
   *  it. The three numbers only exist at 1440, 810 and 390. */
  for (const [width, drawn] of [
    [1440, DRAWN.heading.desktop],
    [810, DRAWN.heading.tablet],
    [390, DRAWN.heading.mobile],
  ] as const) {
    await page.setViewportSize({ width, height: 1400 })
    await page.goto(SPECIMEN)

    const size = await page
      .locator("[data-slot='hero-centered-heading']")
      .evaluate((node) =>
        Math.round(Number.parseFloat(getComputedStyle(node).fontSize)),
      )

    expect(size, `${String(width)}: the drawn step`).toBe(drawn)
  }
})

test("the action slot holds the chat and its suggestions", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const desktop = await at(page, "Desktop")
  const mobile = await at(page, "Mobile")

  expect(desktop?.action).toBe("chat")
  expect(desktop?.suggestions, "as many as the caller passes").toBe(4)
  expect(desktop?.suggestionRows, "two by two where there is room").toBe(2)
  expect(mobile?.suggestionRows, "one under the other where there is not").toBe(
    4,
  )
  expect(
    mobile?.suggestionGap,
    "the 12 the file's Menubar wrapper leaves between rows",
  ).toBe(DRAWN.suggestionGap)
})

test("the action slot holds a button and its line of reassurance", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await at(page, "Desktop", button(page))

  expect(read?.action).toBe("button")
  expect(read?.suggestions, "no chat, no chips").toBe(0)
  expect(read?.note, "14 under the button").toBe("14px")

  await expect(
    heroIn(button(page)).getByRole("link", { name: "Get started now" }),
    "the primary Button, as a link",
  ).toBeVisible()
})

test("the intro slot is one slot with three states", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const withProof = await at(page, "Desktop")
  const withEyebrow = await at(page, "Desktop", button(page))

  expect(withProof?.intro).toBe("socialProof")
  expect(withEyebrow?.intro).toBe("eyebrow")

  /** Never both: the state is one value, so the markup cannot carry two. */
  for (const frame of [chat(page), button(page)]) {
    const together = await heroIn(frame).evaluate(
      (node) =>
        Boolean(node.querySelector("[data-slot='hero-centered-eyebrow']")) &&
        Boolean(node.querySelector("[data-slot='social-proof']")),
    )

    expect(
      together,
      "the file never draws an eyebrow and the faces at once",
    ).toBe(false)
  }

  await page.goto(`${SPECIMEN}?intro=none`)
  const bareIntro = await page
    .locator("[data-slot='hero-centered']")
    .evaluate(geometry)

  expect(bareIntro?.intro).toBe("none")
  expect(
    bareIntro?.gapHeadingToDescription,
    "the rhythm under the heading does not move when nothing sits above it",
  ).toBe(DRAWN.gapInColumn)
})

test("the picture is two layers, masked and against the foot", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await at(page, "Desktop")

  expect(read?.wash, "the full height wash").toBe(true)
  expect(read?.band?.height, "the drawn 426").toBe(DRAWN.band)
  expect(read?.band?.masked, "faded by a mask, the way the file does it").toBe(
    true,
  )
  expect(read?.band?.atFoot).toBe(true)
})

test("without a picture the hero stands on its own gradient", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const read = await at(page, "Desktop", bare(page))

  expect(read?.wash, "no wash").toBe(false)
  expect(read?.band, "no band").toBeNull()
  expect(read?.ground, "the gradient the section paints itself").toContain(
    "gradient",
  )
  expect(read?.height, "the canvas does not move when the picture goes").toBe(
    DRAWN.height.desktop,
  )
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

  const hero = page.locator("[data-slot='hero-centered']")
  const read = await hero.evaluate((node) => {
    const style = getComputedStyle(node)
    const picture = node.querySelector("[data-slot='hero-centered-picture']")
    const heading = node.querySelector("[data-slot='hero-centered-heading']")

    return {
      ground: style.backgroundColor,
      gradient: style.backgroundImage,
      pictureShown: picture ? getComputedStyle(picture).display : "absent",
      heading: heading ? getComputedStyle(heading).color : null,
    }
  })

  expect(read.ground, "the ground the app gives a dark page").toBe(NEUTRAL_950)
  expect(read.gradient, "the beige gradient goes").toBe("none")
  expect(
    read.pictureShown,
    "a pale watercolour under a dark card is a light hero wearing dark parts",
  ).toBe("none")
  expect(
    read.heading,
    "brand-vivid, which reads at 4.49 where brand-500 reads at 3.08",
  ).toBe(BRAND_VIVID)
})
