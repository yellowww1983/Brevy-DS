import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 1200 } })

const PAGE = "/components/social-proof"

/** What the website draws. The row holds all three parts inline down to the
 *  tablet (`20919:10393`, `22624:7399`) and breaks at mobile (`22626:8745`):
 *  the sentence drops beneath the faces and drops a size with it. */
const DRAWN = {
  gap: 12,
  faces: { width: 196, height: 32 },
  star: { width: 16, height: 15 },
  starGap: 6,
  rating: { width: 104, height: 15 },
  inline: { size: "18px", lineHeight: "28px" },
  stacked: { size: "14px", lineHeight: "24px" },
  /** The file strokes each star white, 2 on the outside. SVG centres a
   *  stroke, so the drawn 2 is a 4 painted under the fill. */
  rim: { colour: "rgb(255, 255, 255)", width: "4px", order: "stroke" },
}

const AMBER = "rgb(244, 186, 87)"
/** `#7d7872`, beige-900, the warm grey the website writes the line in. */
const WARM_GREY = "rgb(125, 120, 114)"
/** neutral-400, where the app puts secondary text in the dark. */
const NEUTRAL_400 = "oklch(0.708 0 none)"

/** The frames, in the order the page shows them: photographs, then initials.
 *  Each is a document of its own at the width the tabs are on. */
const photographs = (page: Page) =>
  page.locator("figure[data-measures]").first()
const initials = (page: Page) => page.locator("figure[data-measures]").nth(1)

const rowIn = (frame: ReturnType<typeof photographs>) =>
  frame.locator("iframe").contentFrame().locator("[data-slot='social-proof']")

/** The row is only sound once its faces have arrived: Radix mounts a picture
 *  when it loads, and a stack still swapping fallbacks out measures wrong. */
const settled = async (page: Page, frame = photographs(page)) => {
  await measured(page)
  const row = rowIn(frame)
  await expect(row.locator("[data-slot='avatar-image']").first()).toBeVisible()
  return row
}

const geometry = (node: HTMLElement) => {
  const faces = node.querySelector("[data-slot='social-proof-faces']")
  const rating = node.querySelector("[data-slot='social-proof-rating']")
  const label = node.querySelector("[data-slot='social-proof-label']")

  if (!faces || !rating || !label) {
    return null
  }

  const stars = [...rating.querySelectorAll("svg")]
  const first = stars[0]
  const second = stars[1]

  if (!first || !second) {
    return null
  }

  const box = node.getBoundingClientRect()
  const facesBox = faces.getBoundingClientRect()
  const labelBox = label.getBoundingClientRect()
  const ratingBox = rating.getBoundingClientRect()
  const firstBox = first.getBoundingClientRect()
  const secondBox = second.getBoundingClientRect()
  const labelStyle = getComputedStyle(label)
  const starStyle = getComputedStyle(first)

  /** Stacked when the sentence starts at or below where the faces end. The
   *  arrangement is read off the boxes rather than off the class, so the
   *  assertion holds whatever the class is called. */
  const stacked = Math.round(labelBox.top) >= Math.round(facesBox.bottom)

  return {
    document: node.ownerDocument.documentElement.clientWidth,
    height: Math.round(box.height),
    stacked,
    /** The one 12 doing both jobs: beside the faces, or beneath them. */
    gap: stacked
      ? Math.round(labelBox.top - facesBox.bottom)
      : Math.round(labelBox.left - facesBox.right),
    faces: {
      width: Math.round(facesBox.width),
      height: Math.round(facesBox.height),
    },
    rating: {
      width: Math.round(ratingBox.width),
      height: Math.round(ratingBox.height),
      hidden: rating.getAttribute("aria-hidden"),
    },
    starCount: stars.length,
    star: {
      width: Math.round(firstBox.width),
      height: Math.round(firstBox.height),
      gap: Math.round(secondBox.left - firstBox.right),
      fill: starStyle.fill,
      stroke: starStyle.stroke,
      strokeWidth: starStyle.strokeWidth,
      paintOrder: starStyle.paintOrder,
    },
    label: {
      size: labelStyle.fontSize,
      lineHeight: labelStyle.lineHeight,
      colour: labelStyle.color,
      family: labelStyle.fontFamily.split(",")[0]?.replace(/["']/g, "") ?? "",
    },
  }
}

const at = async (page: Page, tab: string, frame = photographs(page)) => {
  await page.getByRole("button", { name: tab, exact: true }).click()
  const row = await settled(page, frame)
  return row.evaluate(geometry)
}

test("the row holds its line down to the tablet and breaks at mobile", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  const desktop = await at(page, "Desktop")
  const tablet = await at(page, "Tablet")
  const mobile = await at(page, "Mobile")

  expect(desktop?.stacked, "the wide row keeps the sentence beside it").toBe(
    false,
  )
  expect(tablet?.stacked, "the tablet still draws one line").toBe(false)
  expect(
    mobile?.stacked,
    "the file drops the sentence under the faces at mobile",
  ).toBe(true)

  expect(desktop?.height, "one line of avatars").toBe(32)
  expect(tablet?.height).toBe(32)
  expect(
    mobile?.height,
    "the drawn 68: 32 of faces, 12 of gap, 24 of text",
  ).toBe(68)

  for (const read of [desktop, tablet, mobile]) {
    expect(read?.gap, "the same 12, beside or beneath").toBe(DRAWN.gap)
    expect(read?.faces, "the faces and the stars never part").toEqual(
      DRAWN.faces,
    )
  }
})

test("the sentence drops a size when it drops a line", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const desktop = await at(page, "Desktop")
  const tablet = await at(page, "Tablet")
  const mobile = await at(page, "Mobile")

  expect(desktop?.label.size).toBe(DRAWN.inline.size)
  expect(desktop?.label.lineHeight).toBe(DRAWN.inline.lineHeight)
  expect(tablet?.label.size).toBe(DRAWN.inline.size)
  expect(tablet?.label.lineHeight).toBe(DRAWN.inline.lineHeight)

  expect(mobile?.label.size, "18 beside, 14 beneath").toBe(DRAWN.stacked.size)
  expect(mobile?.label.lineHeight).toBe(DRAWN.stacked.lineHeight)

  for (const read of [desktop, tablet, mobile]) {
    expect(read?.label.family).toBe("Rethink Sans")
    expect(read?.label.colour).toBe(WARM_GREY)
  }
})

test("five stars keep their size and their white edge at every width", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  for (const tab of ["Desktop", "Tablet", "Mobile"]) {
    const read = await at(page, tab)

    expect(read?.starCount, `${tab}: five`).toBe(5)
    expect(read?.star.width, `${tab}: the drawn width`).toBe(DRAWN.star.width)
    expect(read?.star.height).toBe(DRAWN.star.height)
    expect(read?.star.gap).toBe(DRAWN.starGap)
    expect(read?.rating.width, `${tab}: the drawn 104`).toBe(DRAWN.rating.width)
    expect(read?.rating.height).toBe(DRAWN.rating.height)
    expect(read?.star.fill, `${tab}: the amber`).toBe(AMBER)
    expect(read?.star.stroke, `${tab}: the white edge`).toBe(DRAWN.rim.colour)
    expect(read?.star.strokeWidth).toBe(DRAWN.rim.width)
    expect(read?.star.paintOrder).toBe(DRAWN.rim.order)
    expect(
      read?.rating.hidden,
      `${tab}: the file draws no number, so the stars announce nothing`,
    ).toBe("true")
  }
})

test("the frame is the width the tab is on", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  /** Desktop is wider than the column the catalog can give it, so the frame
   *  takes the column, the way the chat's does. Tablet and mobile fit. */
  const desktop = await at(page, "Desktop")
  const tablet = await at(page, "Tablet")
  const mobile = await at(page, "Mobile")

  expect(tablet?.document, "the drawn tablet").toBe(810)
  expect(mobile?.document, "the drawn mobile").toBe(390)
  expect(
    desktop?.document,
    "wider than the tablet, which is what the tab has to prove",
  ).toBeGreaterThan(810)
})

test("a face with no picture falls back to initials", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const row = rowIn(initials(page))

  await expect(row.locator("[data-slot='avatar-fallback']")).toHaveCount(3)
  await expect(
    row.locator("[data-slot='avatar-image']"),
    "no picture was asked for, so Radix mounts none",
  ).toHaveCount(0)

  const read = await row.evaluate(geometry)

  expect(read?.starCount).toBe(5)
  expect(
    read?.faces,
    "a stack of initials measures as a stack of faces",
  ).toEqual(DRAWN.faces)
})

test("on a dark page the amber and the edge hold, and the sentence moves", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(PAGE)
  await measured(page)

  for (const tab of ["Desktop", "Mobile"]) {
    const read = await at(page, tab)

    expect(read?.star.fill, `${tab}: a brand surface stays itself`).toBe(AMBER)
    expect(read?.star.stroke, `${tab}: the star's own white edge`).toBe(
      DRAWN.rim.colour,
    )
    expect(
      read?.label.colour,
      `${tab}: secondary text goes where the app puts it`,
    ).toBe(NEUTRAL_400)
  }
})
