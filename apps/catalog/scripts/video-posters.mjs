/** Draws the first frame of every background video and saves it as a poster
 *  the gallery can show before anything is loaded.
 *
 *  Four files and five and a half megabytes of them. A tile that showed a
 *  still by loading its video would spend all of that on the way down the
 *  page, and a browser given a `<video>` fetches enough of it to draw one
 *  whether or not anyone presses play. So the frame is drawn once, here, and
 *  the source is attached only when someone does.
 *
 *  The first frame rather than the last: these are watercolour scenes that
 *  hold their subject the whole way through, so the opening frame is the
 *  picture. The animated mockups are the other way around and postered from
 *  the end, which is written where that happens.
 *
 *  It also writes `poster/meta.json`, which is how long each one runs and how
 *  large it was drawn. A `.webm` will not tell a server that without being
 *  decoded, and a page that asked a `<video>` would be loading the thing it
 *  promised not to load. So ffprobe is asked once, here, and the answer is
 *  written down beside the posters rather than typed into a page.
 *
 *  Run `pnpm --filter catalog posters` after adding or replacing a file. */
import { execFileSync } from "node:child_process"
import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
const VIDEO = join(HERE, "..", "public", "video")
const POSTERS = join(VIDEO, "poster")

/** Twice the widest a tile is drawn. The sources run to 2036 across and a
 *  poster carrying that would weigh more than it can show. */
const WIDTH = 800

mkdirSync(POSTERS, { recursive: true })

const meta = {}

for (const name of readdirSync(VIDEO)
  .filter((file) => file.endsWith(".webm"))
  .sort()) {
  const png = join(POSTERS, `${name.replace(".webm", "")}.png`)
  const webp = png.replace(".png", ".webp")

  execFileSync("ffmpeg", [
    "-loglevel",
    "error",
    "-y",
    "-i",
    join(VIDEO, name),
    "-frames:v",
    "1",
    "-vf",
    `scale=${String(WIDTH)}:-2`,
    png,
  ])
  execFileSync("cwebp", ["-q", "82", "-m", "6", "-quiet", png, "-o", webp])

  const [width, height, seconds] = execFileSync("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height",
    "-show_entries",
    "format=duration",
    "-of",
    "csv=p=0:s=,",
    join(VIDEO, name),
  ])
    .toString()
    .trim()
    .split(/[,\n]/)
    .map(Number)

  meta[name] = { width, height, seconds }

  console.log(
    `${name.padEnd(34)} ${String(width)}x${String(height).padEnd(5)} ` +
      `${seconds.toFixed(1)}s  webp ${String(Math.round(statSync(webp).size / 1024)).padStart(4)}KB`,
  )

  execFileSync("rm", ["-f", png])
}

writeFileSync(join(POSTERS, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`)
