/** Draws the last frame of every animation in the library and saves it as a
 *  poster the gallery can show before anything is loaded.
 *
 *  The gallery is sixteen files and 767KB of them. A tile that drew its still
 *  by loading the animation would load all sixteen on the way down the page,
 *  which is the weight the library was re-encoded to avoid. So the frame is
 *  drawn once, here, and the animation itself is fetched only when someone
 *  presses play.
 *
 *  Drawn rather than declared: the poster is the player's own output on a
 *  transparent ground, so it cannot show something the animation does not.
 *  Run `pnpm --filter catalog posters` after adding or replacing a file. */
import { execFileSync } from "node:child_process"
import { mkdirSync, readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "@playwright/test"

const HERE = dirname(fileURLToPath(import.meta.url))
const LOTTIE = join(HERE, "..", "public", "lottie")
const POSTERS = join(HERE, "..", "public", "lottie", "poster")
const PLAYER = join(
  HERE,
  "..",
  "node_modules",
  "lottie-web",
  "build",
  "player",
  "lottie.min.js",
)

/** Twice the widest a tile is drawn, so the poster holds up on a dense
 *  screen without carrying a size nothing asks for. */
const WIDTH = 800

/** The frame the poster is taken at. The last one, because these build from
 *  an empty frame: postered at zero, the three mockups are a blank card and a
 *  gallery of them says nothing about what is inside. The end is the whole
 *  drawing, which is also the frame reduced motion is shown. Set this to 0 to
 *  poster the first frame instead. */
const FRAME = -1

mkdirSync(POSTERS, { recursive: true })

const files = readdirSync(LOTTIE)
  .filter((name) => name.endsWith(".json") && name !== "brevy-logo.json")
  .sort()

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto("about:blank")
await page.addScriptTag({ content: readFileSync(PLAYER, "utf8") })

for (const name of files) {
  const data = JSON.parse(readFileSync(join(LOTTIE, name), "utf8"))
  const height = Math.round((WIDTH * data.h) / data.w)

  await page.setViewportSize({ width: WIDTH, height })
  await page.evaluate(
    async ({ data, WIDTH, height, FRAME }) => {
      document.body.style.cssText = "margin:0;background:transparent"
      document.body.innerHTML = `<div id="stage" style="width:${String(WIDTH)}px;height:${String(height)}px"></div>`
      const animation = globalThis.lottie.loadAnimation({
        container: document.getElementById("stage"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: data,
      })
      await new Promise((resolve) => {
        animation.addEventListener("DOMLoaded", resolve)
      })
      animation.goToAndStop(FRAME < 0 ? animation.totalFrames - 1 : FRAME, true)
      /* The frame holds images now, and an <image> that has not decoded
         paints nothing. */
      await Promise.all(
        [...document.images].map((image) =>
          image.complete ? undefined : image.decode().catch(() => undefined),
        ),
      )
    },
    { data, WIDTH, height, FRAME },
  )

  const png = join(POSTERS, `${name.replace(".json", "")}.png`)
  const webp = png.replace(".png", ".webp")
  await page.locator("#stage").screenshot({ path: png, omitBackground: true })
  execFileSync("cwebp", [
    "-q",
    "82",
    "-alpha_q",
    "100",
    "-m",
    "6",
    "-quiet",
    png,
    "-o",
    webp,
  ])

  console.log(
    `${name.padEnd(22)} ${WIDTH}x${String(height).padEnd(4)} ` +
      `png ${String(Math.round(statSync(png).size / 1024)).padStart(4)}KB ` +
      `webp ${String(Math.round(statSync(webp).size / 1024)).padStart(4)}KB`,
  )

  execFileSync("rm", ["-f", png])
}

await browser.close()
