import type { HeroSplitAction, HeroSplitCard, HeroSplitIntro } from "@brevy/ui"

import { PEOPLE } from "./avatar"
import { join, preamble } from "./doc"
import { LABEL } from "./social-proof"

export const INTRO =
  "The split hero. A column of copy with a photograph beside it, cut to the Brevy mark, and a card of reassurance hanging across the two. It is the centred hero's sibling: the same skeleton, the same ground, the same slots, parting at one node where this one sets its content in a row."

export const USE = [
  "`HeroSplit` takes the same `heading`, `description`, `intro` and `action` the centred hero takes, and they mean the same things. What it adds is `image`, which carries the wash and the photograph, and `card`, the promise that hangs off it.",
  "Both `image` and `card` are optional. Without the photograph the hero is a centred column; without the card it simply ends at the copy.",
  "The photograph is cut to the Brevy mark and that shape is not a prop. A client swaps the picture inside it; the silhouette is the identity.",
  "Everything else is a component the system already ships: the `Chat` and its `Chip` suggestions, the primary `Button`, and `SocialProof` in its stacked form.",
]

export const LAYOUT = [
  "At the desktop the row is 576px of copy, 32px of gutter and a 592px picture, which is the 1200px the file measures. Below that the picture is not there at all: it does not shrink and it does not drop under the copy, so the copy centres itself in the space the file gives it.",
  "The copy runs 8px from heading to description, 24px down to the proof, and 64px to the action, or 48px where the column narrows. It is set to the left only where the picture stands beside it.",
  "The section is at least 670px tall at every width, and the card is what carries it there below the desktop: a band along the foot, rounded at the top only, flat. At the desktop the card lifts off that foot and floats across the picture's left edge instead.",
]

/** The Caregiving page's hero, which is the only place the file draws this
 *  layout. */
export const PRESET: {
  heading: string
  description: string
  intro: HeroSplitIntro
  action: HeroSplitAction
  card: HeroSplitCard
} = {
  heading: "Get paid for family caregiving",
  description:
    "Brevy helps you receive Medicaid reimbursement for caring for your family.",
  intro: {
    kind: "socialProof",
    people: PEOPLE.map((person) => ({
      name: person.name,
      initials: person.initials,
      photo: person.photo,
    })),
    label: LABEL,
  },
  action: { kind: "button", label: "Get Started", href: "/get-started" },
  card: {
    highlight: "$1,500/month on average",
    sentence:
      "Brevy helps you receive Medicaid reimbursement for caring for your family.",
  },
}

/** The wash is the one the centred hero already carries — the file paints the
 *  same `Mountains` behind both — so it is not stored twice. */
export const IMAGE = {
  wash: "/hero/wash.jpg",
  picture: "/hero/split.jpg",
  alt: "Two women outdoors, arms raised, looking up together",
}

export function heroSplitDoc() {
  return join([
    preamble("HeroSplit", "block"),
    "",
    "# HeroSplit",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { HeroSplit } from "@brevy/ui"',
    "",
    "<HeroSplit",
    "  heading={heading}",
    "  description={description}",
    '  intro={{ kind: "socialProof", people, label }}',
    '  action={{ kind: "button", label: "Get Started", href }}',
    "  image={{ wash, picture, alt }}",
    "  card={{ highlight, sentence }}",
    "/>",
    "```",
    "",
    "### intro: one of three",
    "",
    '- `{ kind: "eyebrow", text }`: a line under the copy',
    '- `{ kind: "socialProof", people, label }`: the faces, the stars and a claim, stacked',
    '- `{ kind: "none" }`: the copy runs straight to the action',
    "",
    "### action: one of two",
    "",
    '- `{ kind: "button", label, href, note? }`: a primary button, with an optional line under it',
    '- `{ kind: "chat", placeholder, sendLabel, suggestions }`: the chat card, with as many suggestions as you pass',
    "",
    "### image: optional",
    "",
    "`{ wash, picture, alt }`. The wash covers the whole hero; the picture stands beside the copy at the desktop and is absent below it. The mark it is cut to is fixed.",
    "",
    "### card: optional",
    "",
    "`{ highlight, sentence }`. Floats across the picture at the desktop, lies along the foot as a band below it.",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
