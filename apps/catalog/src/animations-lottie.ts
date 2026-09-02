import { ANIMATIONS, GROUPS } from "./animations"
import { join, preamble, table } from "./doc"

/** The animated mockups: sixteen screens of the product, exported from After
 *  Effects and shown here as the files they are.
 *
 *  They are not rebuilt in code and this page does not tell anyone how to
 *  rebuild one. What it does is put them in one place, name them, say what
 *  each weighs, and say what they are for. The last of those is the point of
 *  the page and it is at the foot of it. */

export const INTRO =
  "Sixteen animated mockups of the product, as they were drawn. Each tile stands at the end of its own, and runs it from the beginning when you ask."

export const GALLERY_NOTE =
  "A tile shows a still of its own last frame until you press play, so arriving here loads no animation at all. These build from an empty frame, so the last is the whole drawing and the first is a blank card. Pressing play fetches that one file and the player with it, and runs it from the beginning. Nothing plays by itself, and nothing plays because you passed over it. Each tile carries how long its animation runs and what the file weighs, read off the file rather than written beside it."

export const REDUCED_NOTE =
  "Where motion is turned down, play holds the last frame instead of running to it, which is the frame the tile was already showing. The end of one of these is the state it was building, so the answer survives without the movement."

/** The point of the page, and the reason it is a foundation rather than a
 *  folder of files. Short on purpose. */
export const DIRECTION: readonly string[] = [
  "Every one of these is a mockup of the product built out of this system. The greens are the brand ramp, the soft grounds are olive and beige, the discs are the marker, the ticked lines are the icon list, the faces are avatars, the surfaces are the same white cards the blocks use. Nothing in them was invented in After Effects except the timing.",
  "So read them as the house style of movement, the way the blocks are the house style of layout. Three habits carry almost all of it. Things build from an empty frame rather than arriving finished. Text is typed a character at a time, one per frame at thirty frames a second. A mark that confirms something pops past its size and settles back, and it lands a beat before the line it belongs to.",
  "The direction is that new motion is written rather than exported. CSS keyframes cover all three habits: a stagger is a delay per child, a typewriter is a width animated in `steps()`, a pop is a scale through an overshoot. That keeps a component server rendered, costs no library, and gives `motion-reduce` the final frame for free, because an animation that ends at the natural size leaves the natural size behind when it does not run.",
  "Reach for a file when the subject is a photograph, and for code when the subject is the interface. Of the sixteen here, none is the former. The scenes on the Video page are.",
]

export function animationsLottieDoc() {
  return join([
    preamble("Animations, Lottie"),
    "",
    "# Animations: Lottie",
    "",
    INTRO,
    "",
    "## The library",
    "",
    GALLERY_NOTE,
    "",
    ...GROUPS.flatMap((group) => [
      `### ${group}`,
      "",
      table(
        ["Name", "Shows"],
        ANIMATIONS.filter((animation) => animation.group === group).map(
          (animation) => [animation.name, animation.shows],
        ),
      ),
      "",
    ]),
    "## Reduced motion",
    "",
    REDUCED_NOTE,
    "",
    "## Where new motion comes from",
    "",
    ...DIRECTION.flatMap((paragraph) => [paragraph, ""]),
  ])
}
