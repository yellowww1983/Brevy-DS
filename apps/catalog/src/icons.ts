import { join, preamble, table } from "./doc"

/** The icons page is a convention rather than a scale, so its prose is the
 *  substance. It lives here as markdown for the same reason the other
 *  foundations keep theirs here: the page and the copied text are one source. */

export const INTRO =
  "Icons come from lucide, sized and styled to match the rest of the system. Drop one into a component and it inherits the right size and stroke."

export const SET = [
  "Every icon comes from [lucide](https://lucide.dev), which ships with `@brevy/ui`. Search it for the icon you need and use it by name. There is no shorter approved list: the set is whatever lucide offers.",
  "A few the design already uses, to show the convention rather than to limit it. Click a name to copy it.",
]

export const SIZE =
  "Components set the size, so most of the time there is nothing to choose. Where you are placing an icon yourself, 24px is the usual size and 16px suits a dense row. Every size is one class, and lucide scales the glyph and its stroke together."

export const STROKE = [
  "Icons are drawn at a stroke of 1.5, applied with `icon-stroke`. Lucide's own default is 2, which reads heavy beside Brevy type, so the system overrides it.",
  "The 1.5 is measured on the icon's own 24 unit grid, so it scales with the glyph: a 16px icon draws its line at 1. That matches the design, which draws 1.5 in a 24 frame and 1 in a 16 frame.",
]

export const IN_A_COMPONENT =
  "Components normalise both size and stroke, so pass the icon and nothing else."

export const SIZES = ["size-4", "size-5", "size-6", "size-8"]

export const SAMPLES = [
  "Check",
  "ChevronDown",
  "ArrowUp",
  "Play",
  "Bell",
] as const

export function iconsDoc() {
  return join([
    preamble("Icons"),
    "",
    "# Icons",
    "",
    INTRO,
    "",
    "## The set",
    "",
    ...SET.flatMap((paragraph) => [paragraph, ""]),
    `Icons the design already uses: ${SAMPLES.map((name) => `\`${name}\``).join(", ")}.`,
    "",
    "## Size",
    "",
    SIZE,
    "",
    table(
      ["Class", "Size"],
      SIZES.map((size) => [
        `\`${size}\``,
        `${String(Number(size.replace("size-", "")) * 4)}px`,
      ]),
    ),
    "",
    "## Stroke",
    "",
    ...STROKE.flatMap((paragraph) => [paragraph, ""]),
    "## In a component",
    "",
    IN_A_COMPONENT,
  ])
}
