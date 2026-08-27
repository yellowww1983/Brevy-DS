import type { CtaBandTone } from "@brevy/ui"

import { join, preamble } from "./doc"

export const INTRO =
  "The closing band. A mark, a line, a sentence and one way onward, in a rounded card that spans the content column. Four of the website's pages end on this and they end on it identically."

export const USE = [
  "`CtaBand` takes a `heading`, a `description` and a `button`. Everything else is optional: a `chip` over the heading, a `note` under the button, and a `figures` layer behind the copy.",
  "`tone` picks the ground. `light` is the pale olive-to-white gradient two pages close on; `dark` is the deep green the other two use, with the button trading places to match. It is not the theme — the file draws both on the same light page.",
  "The heading is `h2`, not `h1`. The band closes a page rather than opening one, and the file sets it a size down from the heroes.",
  "Everything inside is a component the system already ships: the primary and secondary `Button`, and `Chip` in its eyebrow shape.",
]

export const LAYOUT = [
  "The card is the content column — 1200px, 762px, 358px — with a 16px radius, on a white section that breathes 96px above and below it. The copy is centred in both axes with 96px of its own, which makes the card 560px tall when the copy is short and taller when it is not.",
  "The mark sits 128px above the copy, 96px below the tablet width, and is the one place the file fills it with a gradient rather than a flat green.",
  "Inside the copy the rhythm is 32px from the mark, 8px between the chip, the heading and the line under it, 48px down to the button and 12px to the note.",
  "The figures are absent below the tablet width, which is where the file stops drawing them.",
]

/** The caregiving page's band: the pale ground, and the six photographs the
 *  file scatters behind the copy. */
export const LIGHT_PRESET: {
  tone: CtaBandTone
  heading: string
  description: string
  button: { label: string; href: string }
} = {
  tone: "light",
  heading: "Get paid for family caregiving",
  description:
    "Brevy helps you receive Medicaid reimbursement for caring for your family.",
  button: { label: "Get Started", href: "/get-started" },
}

/** The deep green band, which the file draws on two pages that close with a
 *  promise rather than an offer. Its chip is not drawn here — it is carried
 *  to show the slot, on the band that has room for it. */
export const DARK_PRESET: {
  tone: CtaBandTone
  heading: string
  description: string
  button: { label: string; href: string }
  note: string
} = {
  tone: "dark",
  heading: "Stop stressing over health plans. Let us do the work.",
  description:
    "Join the many families who have successfully unlocked their caregiving benefits. Take 2 minutes to start your care navigation today.",
  button: { label: "Start my care navigation", href: "/get-started" },
  note: "Takes 2 minutes · No cost · No commitment",
}

/** The chip the organizations page opens its band with, kept beside the
 *  presets because it is the only one the file draws. */
export const CHIP = "Free forever. No contracts. No integration required."

/** The six photographs, at the sizes and positions the file places them by
 *  hand: `22615:8408` at the desktop, `22639:11241` at the tablet. Both sets
 *  are measured from the card's own edges, so one inset reads from the left
 *  and from the right and the pairs stay mirrored at either width.
 *
 *  The tablet keeps its own numbers rather than the desktop's moved inward.
 *  Reading them is where the trap is: at the tablet the six hang off a
 *  `Wrapper` that starts 100 below the card's top, so their own coordinates
 *  say 0, 164 and 268 while the card sees 100, 264 and 368. Taken from the
 *  parent the whole arrangement rides 100 high and the foot of the card empties
 *  out.
 *
 *  Neither set is centred the way the desktop's is. The desktop leaves 112
 *  above the first row and 112 under the last; the tablet leaves 100 and 132.
 *  That is the drawing, not a rounding.
 *
 *  And the tablet drops the middle pair: the two 72s are switched off at that
 *  width on both pale bands, so the arrangement goes six, four, none rather
 *  than six, six, none. `wideOnly` carries that. */
export const FIGURES = [
  {
    src: "/cta/figure-a.webp",
    size: 96,
    inset: 24,
    wide: 88,
    top: 100,
    topWide: 112,
    side: "left",
  },
  {
    src: "/cta/figure-b.webp",
    size: 96,
    inset: 24,
    wide: 88,
    top: 100,
    topWide: 112,
    side: "right",
  },
  {
    src: "/cta/figure-c.webp",
    size: 72,
    inset: 56,
    wide: 218,
    top: 264,
    topWide: 268,
    side: "left",
    wideOnly: true,
  },
  {
    src: "/cta/figure-d.webp",
    size: 72,
    inset: 56,
    wide: 218,
    top: 264,
    topWide: 268,
    side: "right",
    wideOnly: true,
  },
  {
    src: "/cta/figure-e.webp",
    size: 60,
    inset: 24,
    wide: 88,
    top: 368,
    topWide: 388,
    side: "left",
  },
  {
    src: "/cta/figure-f.webp",
    size: 60,
    inset: 24,
    wide: 88,
    top: 368,
    topWide: 388,
    side: "right",
  },
] as const

export function ctaBandDoc() {
  return join([
    preamble("CtaBand", "block"),
    "",
    "# CtaBand",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { CtaBand } from "@brevy/ui"',
    "",
    "<CtaBand",
    '  tone="light"',
    "  heading={heading}",
    "  description={description}",
    '  button={{ label: "Get Started", href }}',
    "/>",
    "```",
    "",
    "### tone: one of two",
    "",
    "- `light`: the olive-to-white gradient, with the `primary` button on it",
    "- `dark`: the deep green ground, with the `secondary` button on it",
    "",
    "### the optional three",
    "",
    "- `chip`: a pill over the heading",
    "- `note`: a line under the button, at 12/16",
    "- `figures`: a decorative layer behind the copy, gone below the tablet width",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
