import type { Page } from "@playwright/test"

import { expect, test } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/getting-started/layout"

/** Two frames now stand at each width, one drawing the container and one the
 *  columns dividing it, so a width alone no longer names a frame. Both are
 *  addressed by what they draw. */
const CONTAINER_FRAME = (width: number) =>
  `figure[data-viewport="${String(width)}"]:not(:has([data-columns]))`

const GRID_FRAME = (width: number) =>
  `figure[data-viewport="${String(width)}"]:has([data-columns])`

/** What the container owes at each of the three widths the design draws. The
 *  page reads these off the rendered container rather than printing them, so a
 *  number here and a number on screen coming apart is a failure worth having. */
const WIDTHS = [
  { width: 390, gutter: 16, content: 358 },
  { width: 810, gutter: 24, content: 762 },
  { width: 1440, gutter: 120, content: 1200 },
] as const

/** Reads the container inside the frame drawn at one of the three widths. The
 *  frame is scaled to fit the column, and a transform leaves layout alone, so
 *  everything below is the real geometry at that width. */
async function container(page: Page, width: number) {
  return page
    .locator(`${CONTAINER_FRAME(width)} iframe`)
    .contentFrame()
    .locator("[data-container]")
    .evaluate((element) => {
      const band = element.parentElement

      if (!band) {
        throw new Error("the container is not inside a full width band")
      }

      const style = getComputedStyle(element)

      return {
        content: Math.round(element.getBoundingClientRect().width),
        gutter: Math.round(
          element.getBoundingClientRect().left -
            band.getBoundingClientRect().left,
        ),
        maxWidth: style.maxWidth,
        padLeft: style.paddingLeft,
        padRight: style.paddingRight,
      }
    })
}

test("the column is capped at 1200 and carries no padding", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  for (const width of WIDTHS) {
    const read = await container(page, width.width)

    expect(read.maxWidth, `max-width at ${String(width.width)}px`).toBe(
      "1200px",
    )
    expect(
      [read.padLeft, read.padRight],
      `the gutter is margin, so padding stays at zero at ${String(width.width)}px`,
    ).toEqual(["0px", "0px"])
  }
})

test("the gutter is 16, 24 and 120 at the three widths", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const drawn = []

  for (const width of WIDTHS) {
    const read = await container(page, width.width)
    drawn.push({
      width: width.width,
      gutter: read.gutter,
      content: read.content,
    })
  }

  expect(drawn).toEqual(
    WIDTHS.map((width) => ({
      width: width.width,
      gutter: width.gutter,
      content: width.content,
    })),
  )
})

test("the column stops growing at 1248, not at 1440", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  /** The frames on the page are fixed at the three drawn widths, so a width
   *  past the last of them is asked of the catalog's own document.
   *
   *  Both numbers are read against the room the document actually has rather
   *  than against the window, because a scrollbar takes width from one and not
   *  the other, and this would otherwise fail by however wide that bar is. */
  await page.setViewportSize({ width: 2560, height: 900 })

  const wide = await page.evaluate(() => {
    const element = document.createElement("div")
    element.className = "container-content"
    document.body.append(element)
    const box = element.getBoundingClientRect()
    const room = document.body.getBoundingClientRect()
    element.remove()
    return { width: box.width, left: box.left - room.left, room: room.width }
  })

  expect(wide.width, "the column does not grow past its cap").toBe(1200)
  expect(
    Math.round(wide.left),
    "the room left over is split evenly, so the column stays centred",
  ).toBe(Math.round((wide.room - 1200) / 2))
  expect(
    wide.room,
    "a window this wide is the case worth proving",
  ).toBeGreaterThan(1440)
})

test("every frame reports what its own container renders", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  const wrong = []

  for (const width of WIDTHS) {
    const read = await container(page, width.width)
    const said = await page
      .locator(`${CONTAINER_FRAME(width.width)} [data-reading]`)
      .innerText()
    const owed = `content ${String(read.content)}px · gutter ${String(read.gutter)}px · max-width ${read.maxWidth} · padding ${String(parseFloat(read.padLeft))}px`

    if (said !== owed) {
      wrong.push(`${said} against ${owed}`)
    }
  }

  expect(wrong).toEqual([])
})

test("1248 is where the cap bites, to the pixel", async ({ page }) => {
  await page.goto(PAGE)

  /** The page said `above 1440px` for as long as it had a grid section with no
   *  grid in it, and it was wrong by 192px: 1200 plus a gutter either side is
   *  1248, and from there the margins take everything. 1440 is only where the
   *  leftover happens to come to 120, which is what the design draws and what
   *  made the wrong number look right.
   *
   *  Read off the catalog's own document at three widths around the crossing,
   *  against the room the document has rather than the window, because a
   *  scrollbar takes width from one and not the other. */
  const at = async (width: number) => {
    await page.setViewportSize({ width, height: 900 })

    return await page.evaluate(() => {
      const element = document.createElement("div")
      element.className = "container-content"
      document.body.append(element)
      const box = element.getBoundingClientRect()
      const room = document.body.getBoundingClientRect()
      element.remove()

      return { width: Math.round(box.width), room: Math.round(room.width) }
    })
  }

  const before = await at(1247)
  const at1248 = await at(1248)

  expect(
    at1248.room,
    "the document has to be the width asked for, or this proves nothing",
  ).toBe(1248)
  expect(before.width, "one pixel short of the cap, the column is short").toBe(
    1199,
  )
  expect(at1248.width, "at 1248 the column is full and stops").toBe(1200)
})

test("the bands drawn at 1440 are the columns a block really gets", async ({
  page,
}) => {
  await page.goto(PAGE)
  await measured(page)

  /** The drawing is the claim, so it is checked against the thing rather than
   *  against a number: the twelve bands on the desktop frame against the twelve
   *  tracks FAQ resolves to, which is the one block in the system that takes
   *  all twelve. */
  const drawn = await page
    .locator(`${GRID_FRAME(1440)} iframe`)
    .contentFrame()
    .locator("[data-guide]")
    .evaluate((element) => {
      const style = getComputedStyle(element)

      return {
        tracks: style.gridTemplateColumns.split(" ").map(parseFloat),
        gutter: parseFloat(style.columnGap),
      }
    })

  const shipped = await page.evaluate(async () => {
    const frame = document.createElement("iframe")
    frame.style.width = "1440px"
    frame.src = "/specimens/faq"
    document.body.append(frame)

    await new Promise((resolve) => {
      frame.addEventListener("load", resolve, { once: true })
    })

    const inner = frame.contentDocument
    const grid = inner
      ? [...inner.querySelectorAll("*")].find((node) => {
          const style = inner.defaultView?.getComputedStyle(node)

          return (
            style?.display === "grid" &&
            style.gridTemplateColumns.split(" ").length === 12
          )
        })
      : undefined

    const style =
      grid && inner?.defaultView
        ? inner.defaultView.getComputedStyle(grid)
        : undefined
    const reading = style
      ? {
          tracks: style.gridTemplateColumns.split(" ").map(parseFloat),
          gutter: parseFloat(style.columnGap),
        }
      : undefined

    frame.remove()

    return reading
  })

  expect(
    shipped,
    "FAQ has to still be laying out on twelve, or this compares nothing",
  ).toBeDefined()
  expect(drawn.tracks).toHaveLength(12)
  expect(drawn.gutter).toBe(shipped?.gutter)
  expect(
    drawn.tracks.map((track) => Math.round(track * 100) / 100),
    "the bands on the page and the columns a block gets are the same twelve",
  ).toEqual(shipped?.tracks.map((track) => Math.round(track * 100) / 100))
})

test("the grid is live above 1200 and a guide below it", async ({ page }) => {
  await page.goto(PAGE)
  await measured(page)

  /** The frames do not decide this; they ask the specimen whether the twelve
   *  behind `content:` resolved to a grid. So what is guarded here is the fact
   *  itself: no block places on columns below 1200, and the page says so at
   *  exactly the two widths where it is true. */
  for (const width of [390, 810]) {
    await expect(page.locator(GRID_FRAME(width))).not.toHaveAttribute(
      "data-live",
      "",
    )
    await expect(
      page.locator(`${GRID_FRAME(width)} [data-guide-only]`),
    ).toBeVisible()
  }

  await expect(page.locator(GRID_FRAME(1440))).toHaveAttribute("data-live", "")
  await expect(
    page.locator(`${GRID_FRAME(1440)} [data-guide-only]`),
  ).toHaveCount(0)
})
