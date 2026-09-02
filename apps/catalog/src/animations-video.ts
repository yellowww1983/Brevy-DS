import { BACKGROUNDS } from "./animations"
import { join, preamble, table } from "./doc"

/** The background scenes: four watercolours drawn as video.
 *
 *  Nothing here is interface. They go behind a page, where a block takes a
 *  picture today, and the only thing this page has to settle is which one to
 *  reach for and what it costs. */

export const INTRO =
  "Four watercolour scenes, drawn as video. These stand behind a page rather than in front of it."

export const USE =
  "They go where a page paints a still wash today: behind a hero, or behind the picture half of the login screen. A brief that says use the seasons behind the hero means one of these. Pass one where a block already takes a picture."

export const NOT_CODE =
  "They are artwork in the way a photograph is artwork, so nothing here is rebuilt in code. That is the line between this page and the other one: a mockup of the interface is written, a landscape is drawn. Two of them carry beige-500 painted into the export rather than a clear ground, which the file name says and the table below repeats, so they sit on that colour and not on another."

export const PAIR =
  "The welcome scene was drawn twice, once wide and once tall, the way a photograph is cut for a desktop and for a phone. They are two files rather than one cropped, and the two are different compositions rather than the same drawing turned: the wide one is a footbridge, the tall one a path through a park."

export const GALLERY_NOTE =
  "A tile shows a still of its first frame until you press play, so arriving here loads no video at all. It is not enough to ask for that: a browser handed a video with a source will go and fetch a frame whether or not anyone watches, so the element gets no source until the button is pressed. It then plays once and stops. Each tile carries how long the scene runs, how large it was drawn and what the file weighs."

export const REDUCED_NOTE =
  "Where motion is turned down, the still stays and the video is handed over paused with its own controls. A landscape has no last frame that stands in for the other twenty three seconds, the way an animation building to an answer does, so the choice to run it belongs to the reader. Nothing is downloaded until they make it."

export function animationsVideoDoc() {
  return join([
    preamble("Animations, Video"),
    "",
    "# Animations: Video",
    "",
    INTRO,
    "",
    "## What they are for",
    "",
    USE,
    "",
    NOT_CODE,
    "",
    PAIR,
    "",
    "## The library",
    "",
    GALLERY_NOTE,
    "",
    table(
      ["Name", "Shows", "Orientation", "Ground", "Use"],
      BACKGROUNDS.map((background) => [
        background.name,
        background.shows,
        background.orientation,
        background.ground ?? "clear",
        background.use,
      ]),
    ),
    "",
    "## Reduced motion",
    "",
    REDUCED_NOTE,
  ])
}
