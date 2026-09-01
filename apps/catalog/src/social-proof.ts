import { join, preamble, table } from "./doc"

/** The sentence the website writes beside the faces. It lives here rather than
 *  in the component because it is a claim about this business — a number of
 *  people and a product name — and a component that hard-codes a claim can
 *  only ever be used by one site. */
export const LABEL = "Join 2,000+ caregivers already using Brevy"

/** The same row with a face missing, so the preview shows what the component
 *  does when a picture does not arrive rather than only its best case. */
export const LABEL_PARTIAL = "Trusted by teams in 14 states"

export const INTRO =
  "The reassurance row under a hero: a stack of faces, five stars, and a line saying how many people are already here."

export const USE = [
  "`SocialProof` takes the `people` and the `label`. Neither is baked in, because the faces and the sentence belong to the page rather than to the component.",
  "Each person is a `name`, their `initials` and an optional `photo`. Leave the photo out and the initials show, which is a real state rather than a placeholder: a stack of faces is rarely complete.",
  "`layout` decides how the sentence sits against the faces. `inline` puts it beside them and drops it underneath on a phone, which is what four of the five heroes draw. `stacked` holds the lower form at every width, for a hero with a picture beside the copy and no room for a wide row.",
  "Stacked takes no alignment of its own. It lays out as a block, so whatever `text-align` the column around it has carries both the sentence and the faces. Set it where you place the row rather than passing a second prop here.",
  "Put it under the hero's copy, near the button. It is a claim about the product, so it belongs where someone is deciding, not at the foot of the page.",
  "Five stars is the shape rather than a rating. There is no number to pass and none to read: the stars are decorative and the sentence beside them carries the meaning.",
]

const PROPS: readonly (readonly string[])[] = [
  [
    "`people`",
    "`{ name, initials, photo? }[]`",
    "none",
    "The faces, in the order they stack",
  ],
  ["`label`", "`string`", "none", "The sentence beside or under them"],
  [
    "`layout`",
    "`inline` `stacked`",
    "`inline`",
    "Sentence beside the faces, or always under",
  ],
  ["`className`", "`string`", "none", "Extra classes, for placement"],
]

export function socialProofDoc() {
  return join([
    preamble("SocialProof", "component"),
    "",
    "# SocialProof",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { SocialProof } from "@brevy/ui"',
    "",
    "<SocialProof",
    "  people={[",
    '    { name: "Maria Wells", initials: "MW", photo: "/people/mw.jpg" },',
    '    { name: "Sam Doyle", initials: "SD", photo: "/people/sd.jpg" },',
    '    { name: "Ava Lindqvist", initials: "AL" },',
    "  ]}",
    '  label="Join 2,000+ caregivers already using Brevy"',
    "/>",
    "",
    "<SocialProof",
    '  layout="stacked"',
    "  people={people}",
    '  label="Trusted by families across Texas"',
    "/>",
    "```",
    "",
    "## Props",
    "",
    table(["Prop", "Values", "Default", "What it does"], PROPS),
  ])
}
