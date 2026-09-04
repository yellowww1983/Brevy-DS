import { join, preamble, table } from "./doc"

export const INTRO =
  "A small label for a fact about something: a status, a category, a state that is already settled."

export const USE = [
  "`Badge` takes the words and a `variant`. It stands 24px tall on a radius of 8, sets its label at 14 semibold, and leaves room for a 16px icon before it.",
  "`outline` is the default and reads on any ground. `olive` is the brand's own and is for something good: enrolled, approved, covered. `beige` is the quiet one, for a category rather than a state.",
  "It is not a control. Nothing on it answers a pointer, and nothing in the design draws one that does. If it has to be pressed or dismissed it is a button, not a badge.",
  "Use it beside the thing it describes rather than on its own. A badge with nothing next to it is a label for the page, which is a heading.",
  "Reach for a `Chip` instead when the thing is part of the page's furniture rather than something said about an item on it. A badge states a fact; a chip is a piece of interface. Which shapes a chip comes in is `Chip`'s own page to say — listing them here is a second copy that goes stale the day a shape is added, which is how this sentence came to name three of four.",
  "`asChild` renders the child in the badge's place, for a badge that is also a link.",
]

const VARIANTS: readonly (readonly string[])[] = [
  ["`outline`", "White, thin grey thread", "Anything, on any ground"],
  ["`olive`", "Soft green, brand green label", "A settled good state"],
  ["`beige`", "Beige, muted label", "A category rather than a state"],
]

const PROPS: readonly (readonly string[])[] = [
  [
    "`variant`",
    "`outline` `olive` `beige`",
    "`outline`",
    "Which skin it wears",
  ],
  ["`children`", "`ReactNode`", "none", "The words, and an icon before them"],
  [
    "`asChild`",
    "`boolean`",
    "`false`",
    "Render the child instead, keeping the badge's look",
  ],
  ["`className`", "`string`", "none", "Extra classes, for placement"],
]

export function badgeDoc() {
  return join([
    preamble("Badge", "component"),
    "",
    "# Badge",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Badge } from "@brevy/ui"',
    'import { Check } from "lucide-react"',
    "",
    "<Badge>Draft</Badge>",
    "",
    '<Badge variant="olive">',
    "  <Check />",
    "  Enrolled",
    "</Badge>",
    "",
    '<Badge variant="beige">Texas</Badge>',
    "```",
    "",
    "## Variants",
    "",
    table(["Variant", "How it looks", "What it is for"], VARIANTS),
    "",
    "## Props",
    "",
    table(["Prop", "Values", "Default", "What it does"], PROPS),
  ])
}
