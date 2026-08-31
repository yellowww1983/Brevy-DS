import type { SegmentRowsItem } from "@brevy/ui"

import { join, preamble } from "./doc"

export const INTRO =
  "Segments, one card each, each in its own colour, with a list of their names beside the stack. The For Organizations page's own section — the benefits grid's sibling rather than a variant of it: same centred serif heading, and nothing under it in common."

export const USE = [
  "`SegmentRows` takes a `heading` and `items`. Each item is a `title`, a `description`, a `tone` and an `illustration` — and the illustration is a preset layer, the way the benefit cards' is: the file hand-places a mock of the product in a white card, and that artwork is Brevy's own rather than a shape the block can name.",
  "`tone` dresses the whole card: the ground it sits on, the ink its copy is set in, and the bar beside the line. The three the file draws are `violet`, `amber` and `olive`, and they are written out rather than derived — see below.",
  "The index beside the stack is not a link. The live page draws it in plain paragraphs with no anchor and no handler: it reports which segment you have reached rather than taking you there. `active` says which name is lit.",
  "Three segments are drawn and the block takes any number: the tone is per item, so the count is whatever the page has.",
]

export const TONES = [
  "A tone is three roles — ground, ink and bar — not one ramp. The file suggests a rule, `{ramp}-200` behind, `{ramp}-900` on the ink and `{ramp}-700` on the bar, and then keeps it exactly once.",
  "`violet` is the rule: violet-200, violet-900, violet-700.",
  "`amber` takes its ground from yellow-200 and its ink and bar from orange-900 and orange-700 — two ramps, not one.",
  "`olive` takes olive-300 rather than a 200, and swaps its ink for the brand's own emerald-500, keeping olive-700 on the bar.",
  "So two of the three are the rule with something overridden, which is why a tone is a named triple here rather than a ramp name the block expands. DESIGN-FEEDBACK 80.",
]

export const LAYOUT = [
  "The section pads 96px above and below and stands on the beige-to-white wash. The heading is centred, and the stack sits 48px under it.",
  "At the desktop the index takes 265px, the stack 896px, and what is left falls between them. Below the content width the index is not drawn at all and the stack has the column to itself.",
  "A card is two columns — copy beside picture — down to the tablet, and one below it, with the copy above the picture. The white card inside holds 372px at every width; the copy beside it is what grows.",
  "The bar is as tall as the line beside it rather than a fixed height: the file measures 72px where the copy runs two lines and 96px where it runs three.",
  "The card carries neither a thread nor a shadow — it is the only card in the system that stands on nothing but its own colour. The white card inside it is the one that floats.",
]

/** The For Organizations page's three, with the file's own copy. */
export const PRESET: readonly SegmentRowsItem[] = [
  {
    title: "Community Health Centers & FQHCs",
    description:
      "Your community health workers field dozens of benefit questions a week, and answer them one at a time.",
    tone: "violet",
  },
  {
    title: "Area Agencies on Aging",
    description:
      "You screen for eligibility by hand, and the screening is only as current as the last person who checked.",
    tone: "amber",
  },
  {
    title: "Hospital Discharge Teams",
    description:
      "A discharge plan that misses a benefit is a readmission waiting to happen, and nobody finds out for weeks.",
    tone: "olive",
  },
]

/** A fourth the file does not draw, to show the tone is per item rather than a
 *  closed set of three. */
export const FOURTH: SegmentRowsItem = {
  title: "Managed Care Plans",
  description:
    "Your members qualify for programs you do not administer, and the gap shows up in your star ratings.",
  tone: "violet",
}

export const HEADING = "Built for the organizations that serve seniors"

export function segmentRowsDoc() {
  return join([
    preamble("SegmentRows", "block"),
    "",
    "# SegmentRows",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { SegmentRows } from "@brevy/ui"',
    "",
    "<SegmentRows",
    "  heading={heading}",
    '  items={[{ title, description, tone: "violet", illustration }]}',
    "/>",
    "```",
    "",
    "## Tones",
    "",
    ...TONES.flatMap((paragraph) => [paragraph, ""]),
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
