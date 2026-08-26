import { expect, test, type Page } from "./catalog-test"

const PAGE = "/components/social-proof"

/** What the website draws at `20919:10393`, which four of its five heroes
 *  carry unchanged. */
const DRAWN = {
  height: 32,
  gap: 12,
  group: { width: 80, height: 32 },
  star: { width: 16, height: 15 },
  starGap: 6,
  rating: { width: 104, height: 15 },
  label: { size: "18px", lineHeight: "28px" },
  /** The file strokes each star white, 2 on the outside (`strokeAlign:
   *  OUTSIDE`). SVG centres a stroke, so the drawn 2 outside is a 4 painted
   *  under the fill, which leaves exactly half of it showing beyond the
   *  shape. */
  rim: { width: "4px", order: "stroke", join: "round" },
}

/** `#f4ba57`, the amber the file fills each star with and the one the app
 *  keeps unchanged on a dark page (`22060:33296`). */
const AMBER = "rgb(244, 186, 87)"
const WHITE = "rgb(255, 255, 255)"
/** `#7d7872`, beige-900, the warm grey the website writes the line in. */
const WARM_GREY = "rgb(125, 120, 114)"
/** neutral-400, where the app puts secondary text in the dark. */
const NEUTRAL_400 = "oklch(0.708 0 none)"
/** neutral-950, the page under a dark theme. */
const NEUTRAL_950 = "oklch(0.145 0 none)"

const section = (page: Page, title: string) =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: title, exact: true }) })

const row = (page: Page, faces: "Photographs" | "Initials" = "Photographs") =>
  section(page, faces).locator("[data-slot='social-proof']").first()

/** The faces arrive over the network and Radix mounts a picture only once it
 *  has loaded. Reading before that measures a stack still swapping fallbacks
 *  out for photographs. */
const settled = async (page: Page) => {
  const it = row(page)
  await expect(it.locator("[data-slot='avatar-image']").first()).toBeVisible()
  return it
}

const geometry = (node: HTMLElement) => {
  const group = node.querySelector("[data-slot='avatar-group']")
  const rating = node.querySelector("[data-slot='social-proof-rating']")
  const label = node.querySelector("[data-slot='social-proof-label']")

  if (!group || !rating || !label) {
    return null
  }

  const stars = [...rating.querySelectorAll("svg")]
  const first = stars[0]
  const second = stars[1]

  if (!first || !second) {
    return null
  }

  const box = node.getBoundingClientRect()
  const firstBox = first.getBoundingClientRect()
  const secondBox = second.getBoundingClientRect()
  const groupBox = group.getBoundingClientRect()
  const ratingBox = rating.getBoundingClientRect()
  const labelBox = label.getBoundingClientRect()
  const labelStyle = getComputedStyle(label)
  const starStyle = getComputedStyle(first)

  return {
    height: Math.round(box.height),
    align: getComputedStyle(node).alignItems,
    gapToStars: Math.round(ratingBox.left - groupBox.right),
    gapToLabel: Math.round(labelBox.left - ratingBox.right),
    group: {
      width: Math.round(groupBox.width),
      height: Math.round(groupBox.height),
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
      join: starStyle.strokeLinejoin,
      overflow: starStyle.overflow,
    },
    label: {
      size: labelStyle.fontSize,
      lineHeight: labelStyle.lineHeight,
      colour: labelStyle.color,
      family: labelStyle.fontFamily.split(",")[0]?.replace(/["']/g, "") ?? "",
    },
    /** What the page under the row actually paints, so a claim about a colour
     *  on a dark page can be held to the page being dark. */
    standsOn: getComputedStyle(document.body).backgroundColor,
  }
}

test("the row stands at the drawn height with the drawn spacing", async ({
  page,
}) => {
  await page.goto(PAGE)

  const read = await (await settled(page)).evaluate(geometry)

  expect(read, "the row is missing one of its three parts").not.toBeNull()
  expect(read?.height, "the avatars set the height").toBe(DRAWN.height)
  expect(read?.align, "the three parts are centred on one another").toBe(
    "center",
  )
  expect(read?.gapToStars).toBe(DRAWN.gap)
  expect(read?.gapToLabel).toBe(DRAWN.gap)
  expect(read?.group).toEqual(DRAWN.group)
})

test("five stars, at the size and spacing the file draws them", async ({
  page,
}) => {
  await page.goto(PAGE)

  const read = await (await settled(page)).evaluate(geometry)

  expect(read?.starCount).toBe(5)
  expect(read?.star.width).toBe(DRAWN.star.width)
  expect(read?.star.height).toBe(DRAWN.star.height)
  expect(read?.star.gap).toBe(DRAWN.starGap)
  expect(read?.star.fill, "the amber the file fills them with").toBe(AMBER)
  expect(
    read?.rating.width,
    "the rim spills outside the box without moving it",
  ).toBe(DRAWN.rating.width)
  expect(read?.rating.height).toBe(DRAWN.rating.height)
  expect(
    read?.rating.hidden,
    "the file draws no number, so the stars announce nothing and the sentence carries the meaning",
  ).toBe("true")
})

test("each star wears the white edge the file strokes it with", async ({
  page,
}) => {
  await page.goto(PAGE)

  const read = await (await settled(page)).evaluate(geometry)

  expect(read?.star.strokeWidth, "the drawn 2 outside").toBe(DRAWN.rim.width)
  expect(
    read?.star.paintOrder,
    "painted under the fill, so only the outside half shows",
  ).toBe(DRAWN.rim.order)
  expect(read?.star.join).toBe(DRAWN.rim.join)
  expect(
    read?.star.overflow,
    "the rim lands outside a 16 by 15 box and the file lets it",
  ).toBe("visible")
  expect(
    read?.star.stroke,
    "a real white edge belonging to the star, not the colour of whatever it stands on",
  ).toBe(WHITE)
})

test("the sentence is the drawn size and belongs to the catalog", async ({
  page,
}) => {
  await page.goto(PAGE)

  const read = await (await settled(page)).evaluate(geometry)

  expect(read?.label.size).toBe(DRAWN.label.size)
  expect(read?.label.lineHeight).toBe(DRAWN.label.lineHeight)
  expect(read?.label.family).toBe("Rethink Sans")
  expect(read?.label.colour, "the website's warm grey").toBe(WARM_GREY)

  await expect(
    page.getByText("Join 2,000+ caregivers already using Brevy"),
    "the claim belongs to the catalog, not the component",
  ).toBeVisible()
})

test("a face with no picture falls back to initials", async ({ page }) => {
  await page.goto(PAGE)

  const initials = row(page, "Initials")
  await expect(initials.locator("[data-slot='avatar-fallback']")).toHaveCount(3)
  await expect(
    initials.locator("[data-slot='avatar-image']"),
    "no picture was asked for, so Radix mounts none",
  ).toHaveCount(0)

  const read = await initials.evaluate(geometry)

  expect(
    read?.height,
    "a stack of initials stands as tall as a stack of faces",
  ).toBe(DRAWN.height)
  expect(read?.starCount).toBe(5)
})

test("on a dark page the rim holds and only the sentence moves", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark")
  })
  await page.goto(PAGE)

  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.classList.contains("dark")),
    )
    .toBe(true)

  const read = await (await settled(page)).evaluate(geometry)

  expect(read?.standsOn, "the page really is dark").toBe(NEUTRAL_950)
  expect(
    read?.star.fill,
    "a brand surface stays itself, and the app paints this amber unchanged in the dark",
  ).toBe(AMBER)
  expect(
    read?.star.stroke,
    "the white edge is the star's own, so a dark page is where it shows rather than where it goes",
  ).toBe(WHITE)
  expect(read?.label.colour, "secondary text goes where the app puts it").toBe(
    NEUTRAL_400,
  )
  expect(read?.height).toBe(DRAWN.height)
})
