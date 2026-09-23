import { expect, test, type Page } from "./catalog-test"
import { measured } from "./settled"

test.use({ viewport: { width: 1440, height: 1200 } })

/** The widths the tabs name (`viewport-frame.tsx`). */
const TABS = [
  ["Desktop", 1440],
  ["Tablet", 810],
  ["Mobile", 390],
] as const

/** Every page that carries the width switcher, with a slot that proves its
 *  document has arrived. */
const PAGES = [
  ["/blocks/faq", "faq-list"],
  ["/blocks/footer", "footer-about"],
  ["/blocks/navbar", "navbar"],
  ["/blocks/hero/centered", "hero-centered"],
  ["/blocks/hero/split", "hero-split"],
  ["/components/social-proof", "social-proof"],
  ["/components/chat", "chat"],
] as const

const documentWidth = async (page: Page, slot: string) =>
  page
    .locator("[data-viewport]")
    .first()
    .locator("iframe")
    .contentFrame()
    .locator(`[data-slot='${slot}']`)
    .first()
    .evaluate(() => document.documentElement.clientWidth)

/** The tab is a claim about a width, and the frame has to make it true.
 *
 *  It did not, for every block but one. The frames shrank to the catalog's
 *  column when the tab was wider than it, so the Desktop tab rendered a 1056
 *  document and called it Desktop. Nothing failed, because the specs that
 *  cared derived what the block owed from the width the frame actually stood
 *  at — including this file's own `the frame draws the block true at every
 *  tab`, which branches on `read.frame >= 1200` and so agreed with the frame
 *  about a width the reader was never shown.
 *
 *  This is the assertion that does not adapt: the document is the width on the
 *  tab, or the tab is lying. */
for (const [url, slot] of PAGES) {
  test(`the tab names the width the document is at ${url}`, async ({
    page,
  }) => {
    await page.goto(url)
    await measured(page)

    for (const [tab, width] of TABS) {
      await page.getByRole("button", { name: tab, exact: true }).first().click()
      await measured(page)

      expect(
        await documentWidth(page, slot),
        `${url} · ${tab} is ${String(width)}, not the catalog's column`,
      ).toBe(width)
    }
  })
}

/** The one the shrinking actually cost. The FAQ pairs its columns at the
 *  content breakpoint, 1200, which is above the 1056 the frame used to clamp
 *  to — so the two columns had never once been visible in the catalog. */
test("the FAQ shows the two columns the desktop tab promises", async ({
  page,
}) => {
  await page.goto("/blocks/faq")
  await measured(page)
  await page.getByRole("button", { name: "Desktop", exact: true }).click()
  await measured(page)

  const read = await page
    .locator("[data-viewport]")
    .first()
    .locator("iframe")
    .contentFrame()
    .locator("[data-slot='faq']")
    .evaluate((section) => {
      const intro = section
        .querySelector("[data-slot='faq-intro']")
        ?.getBoundingClientRect()
      const list = section
        .querySelector("[data-slot='faq-list']")
        ?.getBoundingClientRect()

      if (!intro || !list) {
        throw new Error("the frame is missing a slot")
      }

      return {
        width: document.documentElement.clientWidth,
        paired: Math.round(list.left) >= Math.round(intro.right),
        level: Math.round(intro.top) === Math.round(list.top),
      }
    })

  expect(read.width).toBe(1440)
  expect(read.paired, "the list stands beside the intro").toBe(true)
  expect(read.level, "and starts level with it").toBe(true)
})

/** Where the pixels are read: a 2x screen, which is where a half pixel shows. */
const SHARP = { deviceScaleFactor: 2 } as const

/** Block pages whose frames are checked for how they paint. */
const PAINTED = [
  "/blocks/activity-marquee",
  "/blocks/footer",
  "/blocks/faq",
  "/blocks/cta",
] as const

/** Screenshot the viewport and read device pixels back out of it: one column
 *  down through a y, or one row across through an x. Each entry is the grey of
 *  that pixel, which is all a border or a black line needs. */
async function paint(page: Page) {
  const shot = (await page.screenshot()).toString("base64")

  return {
    column: (x: number, from: number, to: number) =>
      page.evaluate(
        async ({ shot, x, from, to }) => {
          const bitmap = await createImageBitmap(
            await (await fetch(`data:image/png;base64,${shot}`)).blob(),
          )
          const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
          const context = canvas.getContext("2d")
          context?.drawImage(bitmap, 0, 0)

          return Array.from(
            { length: to - from + 1 },
            (_, index) =>
              context?.getImageData(x, from + index, 1, 1).data[0] ?? -1,
          )
        },
        { shot, x, from, to },
      ),
    row: (y: number, from: number, to: number) =>
      page.evaluate(
        async ({ shot, y, from, to }) => {
          const bitmap = await createImageBitmap(
            await (await fetch(`data:image/png;base64,${shot}`)).blob(),
          )
          const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
          const context = canvas.getContext("2d")
          context?.drawImage(bitmap, 0, 0)

          return Array.from(
            { length: to - from + 1 },
            (_, index) =>
              context?.getImageData(from + index, y, 1, 1).data[0] ?? -1,
          )
        },
        { shot, y, from, to },
      ),
  }
}

/** What a run of pixels paints between the ground at one end and the ground
 *  at the other. The two are not always one colour: across a frame's edge one
 *  is the page and the other is whatever the block paints just inside it. */
const ink = (run: readonly number[]) => {
  const start = run.findIndex((value) => value !== run[0])
  const end =
    run.length - [...run].reverse().findIndex((value) => value !== run.at(-1))

  return start === -1 ? [] : run.slice(start, end)
}

test.describe("on a 2x screen", () => {
  test.use(SHARP)

  /** The frame's edge is one line, painted the same on every side.
   *
   *  The frames used to be nudged up to whatever whole pixel sat above them,
   *  with a fractional transform on the bordered box. Its parent scrolls
   *  sideways, which makes it clip up and down as well, so the nudge carried
   *  three quarters of the top border out of sight: 233 in one row of device
   *  pixels where every other side painted 212 in two.
   *
   *  Read off the screen because the number was never the problem. The box
   *  reported a whole pixel the whole time the edge was missing. The right
   *  side is left out: at the desktop tab it is 1440 wide in a narrower
   *  column, and scrolled out of view by design. */
  for (const theme of ["light", "dark"] as const) {
    test(`the frame's edge paints the same on every side, ${theme}`, async ({
      page,
    }) => {
      await page.addInitScript((name) => {
        localStorage.setItem("theme", name)
      }, theme)

      for (const path of PAINTED) {
        await page.goto(path)
        await measured(page)

        const box = await page
          .locator("main figure iframe")
          .first()
          .evaluate((frame) => {
            const edge = frame.parentElement

            edge?.scrollIntoView({ block: "center" })

            const rect = edge?.getBoundingClientRect()

            return {
              top: rect?.top ?? 0,
              bottom: rect?.bottom ?? 0,
              left: rect?.left ?? 0,
            }
          })

        const scale = SHARP.deviceScaleFactor
        const x = Math.round((box.left + 300) * scale)
        const y = Math.round(((box.top + box.bottom) / 2) * scale)
        const read = await paint(page)

        const top = ink(
          await read.column(
            x,
            Math.floor(box.top * scale) - 3,
            Math.floor(box.top * scale) + 4,
          ),
        )
        const bottom = ink(
          await read.column(
            x,
            Math.floor(box.bottom * scale) - 4,
            Math.floor(box.bottom * scale) + 3,
          ),
        )
        const left = ink(
          await read.row(
            y,
            Math.floor(box.left * scale) - 3,
            Math.floor(box.left * scale) + 4,
          ),
        )

        /** One CSS pixel of border is two device rows, both at full colour. */
        expect(left, `${path}: the left edge`).toHaveLength(scale)
        expect(top, `${path}: the top edge`).toEqual(left)
        expect(bottom, `${path}: the bottom edge`).toEqual(left)
      }
    })
  }

  /** What a frame holds is painted as sharp as the document would paint it on
   *  its own.
   *
   *  The same nudge blurred it. A fractional transform makes the browser draw
   *  the whole layer and then resample it, so a 1px line inside the frame
   *  painted 127, 0, 127 across three rows of device pixels rather than two
   *  rows of black. The frame's own position is fractional — the prose above
   *  it does not add up to a round number — and that is fine: the browser
   *  snaps a document to device pixels when nothing is transforming it.
   *
   *  A line is drawn into the document rather than read off an icon, because
   *  an icon's own edges are antialiased and a line's are not: the only way a
   *  line paints grey is if something between it and the screen blurred it. */
  test("a line inside a frame paints as a line", async ({ page }) => {
    for (const path of PAINTED) {
      await page.goto(path)
      await measured(page)

      const frame = page.locator("main figure iframe").first()

      /** White around it, so the ground it is read against is known whatever
       *  the block paints there. */
      await frame
        .contentFrame()
        .locator("body")
        .evaluate((body) => {
          const ground = document.createElement("div")
          const line = document.createElement("div")

          ground.style.cssText =
            "position:absolute;left:200px;top:40px;width:300px;height:9px;background:white;z-index:2147483647"
          line.style.cssText =
            "position:absolute;left:0;top:4px;width:300px;height:1px;background:black"
          ground.dataset.probe = ""
          ground.append(line)
          body.append(ground)
        })

      await expect(frame.contentFrame().locator("[data-probe]")).toBeAttached()

      const at = await frame.evaluate((node) => {
        node.parentElement?.scrollIntoView({ block: "center" })

        const rect = node.getBoundingClientRect()

        return { left: rect.left, top: rect.top }
      })

      const scale = SHARP.deviceScaleFactor
      const y = Math.floor((at.top + 44) * scale)
      const read = await paint(page)
      const run = await read.column(
        Math.round((at.left + 350) * scale),
        y - 3,
        y + 4,
      )

      expect(
        ink(run),
        `${path}: two rows of black and nothing between`,
      ).toEqual([0, 0])
    }
  })
})
