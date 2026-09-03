import { join, preamble, table } from "./doc"

/** The identity: one drawing, the rules that fall out of it, and the one
 *  animation it has.
 *
 *  There are no brand guidelines to quote. The logo was drawn without them, so
 *  everything on this page under `Clear space`, `Minimum size` and
 *  `Proportions` is read off the drawing rather than handed down, and the page
 *  says so where a reader will see it. DESIGN-FEEDBACK 93 asks for the real
 *  ones and offers to be replaced by them. */

/** What the lockup measures, in the units of its own 115 by 40 box. Every
 *  rule below is one of these numbers, which is why they are here and not
 *  written into a sentence. */
export type Measurement = {
  what: string
  value: string
  /** The same value against the lockup's height, which is the unit the rules
   *  are written in. */
  inHeights: string
}

export const GEOMETRY: readonly Measurement[] = [
  { what: "The lockup's box", value: "115 × 40", inHeights: "2.875 : 1" },
  {
    what: "The mark",
    value: "40 × 40",
    inHeights: "1 : 1, and exactly one height",
  },
  { what: "The wordmark", value: "62.6 × 22.7", inHeights: "0.568 h tall" },
  { what: "Mark to wordmark", value: "12", inHeights: "0.300 h" },
  { what: "One quadrant of the mark", value: "17.78", inHeights: "0.444 h" },
  {
    what: "Between the quadrants",
    value: "4.425",
    inHeights: "11.06% of the mark",
  },
]

/** Every height the system draws it at today, so the page can say what it
 *  costs to break the floor rather than only where the floor is. */
export type Size = {
  /** The rendered height in CSS pixels. */
  px: number
  what: "lockup" | "mark"
  where: string
  /** Set on the two the rules put a floor at. */
  floor?: true
}

export const SIZES: readonly Size[] = [
  { px: 128, what: "mark", where: "The closing band, at the desktop" },
  { px: 96, what: "mark", where: "The closing band, narrower" },
  { px: 40, what: "lockup", where: "The navbar, the footer, the login screen" },
  { px: 24, what: "lockup", where: "The catalog's own head", floor: true },
  { px: 16, what: "mark", where: "Inside a drawn card", floor: true },
]

export const DONTS: readonly { rule: string; why: string }[] = [
  {
    rule: "Do not stretch it",
    why: "Both shapes are fixed: 2.875 to 1 and square. The mark's mask carries no `preserveAspectRatio='none'` for this reason, unlike the one that cuts photographs.",
  },
  {
    rule: "Do not turn it",
    why: "The mark reads as four leaves around a centre and every drawn placement stands it upright. Nothing in the file turns it.",
  },
  {
    rule: "Do not repaint it",
    why: "One colour throughout, brand-500 on a light page and the brand's one green on a dark one. There is no third state and no second colour inside it.",
  },
  {
    rule: "Do not rebuild it",
    why: "`BrevyLockup` is the drawing. A second copy is how the catalog came to ship proportions from an Open Graph image for months.",
  },
]

export const INTRO =
  "One drawing, at one set of proportions, in one colour. The mark and the wordmark together are the lockup; the mark stands alone where there is no room for words."

export const NO_GUIDELINES =
  "There are no brand guidelines to quote here. The logo was drawn without them, so the rules on this page are read off the drawing itself: every number below is a measurement of the lockup, expressed against its own height. They are a reasonable reading rather than an instruction, and an official set replaces them the day one exists."

export const LOCKUP_NOTE =
  "It is one colour throughout. All six paths take `currentColor`, so whatever places the lockup decides the green, and the two themes are the only two states it has."

export const MARK_NOTE =
  "The mark alone is a mask rather than a component. That is what lets the closing band fill it with a gradient, which an SVG on `currentColor` cannot do without an id that collides the moment a page carries two of them. A second mask, `mask-brevy-mark`, is a different drawing of the same shape and exists to cut photographs; it is not the logo."

export const CLEAR_SPACE =
  "Keep half the logo's height clear on every side. The lockup's own parts sit 0.300 of its height apart, so half a height means nothing outside it ever crowds closer than the wordmark sits to the mark. At the drawn 40 that is 20 either way."

export const MINIMUM =
  "24px tall for the lockup and 16px for the mark. Below 20px the wordmark stops painting a single fully opaque pixel and the serifs grey out, so 24 keeps a step in hand. The mark goes smaller because it carries no text: what limits it is the gap between its quadrants, 11.06% of its size, which falls under one pixel at about 9px."

export const PROPORTIONS =
  "2.875 to 1 for the lockup and square for the mark, both fixed. Scale it by height and let the width follow."

export const COLOUR_NOTE =
  "Brand-500 on a light page and the brand's one green on a dark one, everywhere it appears. The animation is the only one that has to be told: its colour is baked into the export, so the preloader rewrites every fill to whatever the static logo resolves to before the player starts."

export const MOTION =
  "The logo has one animation, and the catalog opens with it once a session. It draws the mark as two outlines growing from their middles, settles it from oversized through an overshoot, fades the filled mark in underneath, slides it left, and pops the five letters in one after another a tenth of a second apart. It runs at double speed and stops at the frame the last letter lands, which is 2.4 seconds."

export function logoDoc() {
  return join([
    preamble("Logo"),
    "",
    "# Logo",
    "",
    INTRO,
    "",
    "## Where these rules come from",
    "",
    NO_GUIDELINES,
    "",
    table(
      ["Measured", "In its own units", "Against the height"],
      GEOMETRY.map((row) => [row.what, row.value, row.inHeights]),
    ),
    "",
    "## The lockup",
    "",
    LOCKUP_NOTE,
    "",
    "```tsx",
    'import { BrevyLockup } from "@brevy/ui"',
    "",
    '<BrevyLockup className="h-10 w-auto text-brand-500 dark:text-primary" />',
    "```",
    "",
    "## The mark",
    "",
    MARK_NOTE,
    "",
    "## Clear space",
    "",
    CLEAR_SPACE,
    "",
    "## Minimum size",
    "",
    MINIMUM,
    "",
    table(
      ["Height", "What", "Where"],
      SIZES.map((size) => [
        `${String(size.px)}px${size.floor ? " (the floor)" : ""}`,
        size.what,
        size.where,
      ]),
    ),
    "",
    "## Proportions",
    "",
    PROPORTIONS,
    "",
    "## Colour",
    "",
    COLOUR_NOTE,
    "",
    "## In motion",
    "",
    MOTION,
    "",
    "## Don't",
    "",
    table(
      ["Rule", "Why"],
      DONTS.map((row) => [row.rule, row.why]),
    ),
  ])
}
