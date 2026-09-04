import { expect, type Page } from "@playwright/test"

/** Waits for work the browser does after a navigation resolves.
 *
 *  The catalog measures rather than declares: a badge reads its size off the
 *  sample beside it, a swatch reads its hex off the colour it paints, a frame
 *  reads its height off its own content. That is what stops a page claiming
 *  something the system does not ship, and it is also why the numbers arrive
 *  after an effect rather than with the HTML. A spec that reads one the moment
 *  a goto returns is reading an empty string on a fast enough machine.
 *
 *  Everything here waits on a condition. A duration would be a guess about a
 *  machine we do not own. */

/** Waits until every element that reports a measured value has one.
 *
 *  The components say when they are ready rather than the suite guessing: a
 *  thing that measures itself carries `data-measures` from the start and gains
 *  `data-measured` once the number is in. That way a page added later is
 *  covered the day it ships, instead of the day someone remembers to teach a
 *  helper about its markup.
 *
 *  Child frames are searched too, because the typography specimens live inside
 *  one and a locator on the page never reaches them. */
export async function measured(page: Page) {
  await expect(
    page.locator("[data-measures]"),
    "nothing on this page measures itself, so waiting for it proves nothing",
  ).not.toHaveCount(0)

  await expect
    .poll(async () => {
      const pending = await Promise.all(
        page.frames().map((frame) =>
          frame
            .locator("[data-measures]:not([data-measured])")
            .count()
            /** A frame that goes away mid-poll has nothing left pending. */
            .catch(() => 0),
        ),
      )

      return pending.reduce((total, count) => total + count, 0)
    })
    .toBe(0)
}

/** What scrolls, named rather than spelled out at every call site. */
export const SCROLLER = {
  /** A document of its own: every specimen route, and anything outside the
   *  catalog's shell. */
  window: "",
  /** The catalog's reading column, which is what scrolls inside the shell. */
  content: "main",
} as const

/** The end of a page that measures itself is not where it first appears to be:
 *  labels arriving and frames reporting their height push it further down. The
 *  colours page grows by 320px this way, which is 320px of foot that stops
 *  being the foot, and a reader never sees that state, only a test fast
 *  enough to get there first.
 *
 *  Each round scrolls to whatever the foot currently is; only two rounds
 *  agreeing on the height end it.
 *
 *  Which thing scrolls is a parameter because the catalog is a shell rather
 *  than a long page: the window holds it and scrolls nothing, and the reading
 *  column scrolls itself. A page outside the shell, which is every specimen,
 *  is still the window's own scroller and gets the default. */
export async function atFoot(page: Page, scroller: string = SCROLLER.window) {
  let previous = -1

  await expect
    .poll(async () => {
      const height = await page.evaluate((selector) => {
        const node = selector
          ? document.querySelector(selector)
          : document.documentElement

        if (!node) {
          return -1
        }

        const room = node.scrollHeight - node.clientHeight

        if (selector) {
          node.scrollTo({ top: room, behavior: "instant" })
        } else {
          window.scrollTo({ top: room, behavior: "instant" })
        }

        return node.scrollHeight
      }, scroller)

      const stable = height === previous
      previous = height

      return stable
    })
    .toBe(true)
}

/** Reads the face every slotted element renders in, once they are all really
 *  rendering.
 *
 *  A slot can be in the page and out of the render tree at the same moment,
 *  and `getComputedStyle` answers an empty string for one of those: not the
 *  wrong face, no face at all. Radix opens that window on every avatar — it
 *  keeps the fallback mounted until the photograph arrives and removes it on
 *  the load event, so a read that lands between the two sees a node on its way
 *  out. The stand-in faces this catalog served first were small enough that the
 *  window never opened for long enough to be caught; real photographs opened
 *  it, and the sweep started failing about one run in three.
 *
 *  The condition is that no slot reports an empty family. A slot the browser
 *  is rendering always names one, so this settles as soon as the tree does. */
export async function slotFaces(page: Page) {
  let faces: { slot: string; family: string }[] = []

  await expect
    .poll(async () => {
      faces = await page.locator("[data-slot]").evaluateAll((nodes) =>
        nodes.map((node) => ({
          slot: node.getAttribute("data-slot") ?? "?",
          family: getComputedStyle(node).fontFamily,
        })),
      )

      return faces.filter(({ family }) => family === "").length
    })
    .toBe(0)

  return faces
}
