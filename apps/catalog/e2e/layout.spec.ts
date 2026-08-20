import type { Page } from "@playwright/test"

import { expect, test } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 900 } })

const PAGE = "/getting-started/layout"

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
    .locator(`[data-viewport="${String(width)}"] iframe`)
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

test("the column stops growing above 1440", async ({ page }) => {
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
      .locator(`[data-viewport="${String(width.width)}"] [data-reading]`)
      .innerText()
    const owed = `content ${String(read.content)}px · gutter ${String(read.gutter)}px · max-width ${read.maxWidth} · padding ${String(parseFloat(read.padLeft))}px`

    if (said !== owed) {
      wrong.push(`${said} against ${owed}`)
    }
  }

  expect(wrong).toEqual([])
})
