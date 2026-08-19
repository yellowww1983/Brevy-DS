import { expect, type Page } from "@playwright/test"

/** Waits for work the browser does after a navigation resolves.
 *
 *  The catalog measures rather than declares: a badge reads its size off the
 *  sample beside it, a swatch reads its hex off the colour it paints, a frame
 *  reads its height off its own content. That is what stops a page claiming
 *  something the system does not ship — and it is also why the numbers arrive
 *  after an effect rather than with the HTML. A spec that reads one the moment
 *  a goto returns is reading an empty string on a fast enough machine.
 *
 *  Everything here waits on a condition. A duration would be a guess about a
 *  machine we do not own. */

/** The end of a page that measures itself is not where it first appears to be:
 *  labels arriving and frames reporting their height push it further down. The
 *  colours page grows by 320px this way, which is 320px of foot that stops
 *  being the foot — and a reader never sees that state, only a test fast
 *  enough to get there first.
 *
 *  Each round scrolls to whatever the foot currently is; only two rounds
 *  agreeing on the height end it. */
export async function atFoot(page: Page) {
  let previous = -1

  await expect
    .poll(async () => {
      const height = await page.evaluate(() => {
        const room = document.documentElement.scrollHeight - window.innerHeight
        window.scrollTo({ top: room, behavior: "instant" })
        return document.documentElement.scrollHeight
      })

      const stable = height === previous
      previous = height

      return stable
    })
    .toBe(true)
}
