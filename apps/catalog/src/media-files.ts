import { closeSync, openSync, readFileSync, readSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import type { Animation, Background } from "./animations"
import { ANIMATIONS, BACKGROUNDS, GROUPS } from "./animations"

/** What each file in the library says about itself.
 *
 *  The gallery prints how long a piece runs and what it weighs, and neither
 *  number is written down anywhere: the length is the file's own out point
 *  over its own frame rate, the shape is its own canvas, the weight is the
 *  bytes on disk. Re-encode a file and the page says so without anyone
 *  remembering to edit a caption.
 *
 *  This is a separate module from the animations themselves because it opens
 *  files. The registry is imported by the sidebar, the sidebar is a client
 *  component, and anything the registry can reach is bundled for the browser,
 *  where `node:fs` does not exist. Only the page imports this. */

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "..", "public")
const LOTTIE = join(PUBLIC, "lottie")
const VIDEO = join(PUBLIC, "video")

export type Measured = Animation & {
  seconds: number
  bytes: number
}

/** The header is the first hundred and forty bytes of every one of them.
 *  Parsing two and a half megabytes to print sixteen numbers would be the
 *  same answer at a hundred times the cost. */
function header(file: string) {
  const handle = openSync(join(LOTTIE, file), "r")
  const buffer = Buffer.alloc(512)

  try {
    readSync(handle, buffer, 0, 512, 0)
  } finally {
    closeSync(handle)
  }

  const head = buffer.toString("utf8")
  const read = (key: string) => {
    const found = new RegExp(`"${key}":(\\d+)`).exec(head)

    return found ? Number(found[1]) : 0
  }

  return { fr: read("fr"), op: read("op") }
}

function measure(animation: Animation): Measured {
  const { fr, op } = header(animation.file)

  return {
    ...animation,
    seconds: fr ? op / fr : 0,
    bytes: statSync(join(LOTTIE, animation.file)).size,
  }
}

/** Everything, measured, in the order the gallery shows it. */
export function library(): readonly Measured[] {
  return GROUPS.flatMap((group) =>
    ANIMATIONS.filter((animation) => animation.group === group).map(measure),
  )
}

export type Sized = Background & {
  seconds: number
  width: number
  height: number
  bytes: number
}

/** How long a video runs and how large it was drawn.
 *
 *  A `.webm` will not answer that without being decoded, and decoding one here
 *  would mean the server reading five megabytes to print four numbers. So
 *  `scripts/video-posters.mjs` asks ffprobe once, beside the posters it draws,
 *  and writes the answers next to them. The weight is still read off the file:
 *  that one is only a stat. */
type Probe = { width: number; height: number; seconds: number }

function isProbe(value: unknown): value is Probe {
  return (
    typeof value === "object" &&
    value !== null &&
    ["width", "height", "seconds"].every(
      (key) =>
        typeof Object.getOwnPropertyDescriptor(value, key)?.value === "number",
    )
  )
}

function probed(file: string): Probe {
  const raw: unknown = JSON.parse(
    readFileSync(join(VIDEO, "poster", "meta.json"), "utf8"),
  )

  if (typeof raw !== "object" || raw === null) {
    throw new Error("video/poster/meta.json is not an object")
  }

  const found: unknown = Object.getOwnPropertyDescriptor(raw, file)?.value

  if (!isProbe(found)) {
    throw new Error(
      `${file} is not in video/poster/meta.json. Run pnpm --filter catalog posters.`,
    )
  }

  return found
}

export function backgrounds(): readonly Sized[] {
  return BACKGROUNDS.map((background) => ({
    ...background,
    ...probed(background.file),
    bytes: statSync(join(VIDEO, background.file)).size,
  }))
}
