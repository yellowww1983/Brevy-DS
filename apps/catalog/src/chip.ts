import { join, preamble, table } from "./doc"

export const INTRO =
  "The pill the site uses for a small piece of interface: an eyebrow over a heading, a suggestion to tap, a filter naming a category, and a prompt the reader can press."

export const USE = [
  "`Chip` takes the words and a `variant`, and the variant sets both the shape and the job. `eyebrow` is 24px and sits over a section heading. `suggestion` is 32px and is a line of chat waiting to be picked, the only one of the still shapes the design draws a hover for. `filter` is 32px and names a category in a row of them. `prompt` is 32px and is a question the reader sends: the pills under the chat on both heroes.",
  "`count` puts a small olive disc before the label, carrying a number. The design draws it on the eyebrow, where it numbers a step.",
  "A chip is fully round on a soft white gradient under a thin thread. A `Badge` is a rounded rectangle and flat. That is the whole difference and it decides which to reach for: a chip is furniture the page is made of, a badge is a fact about something else on the page.",
  'The element follows the variant. Three of the four are something the page says and say nothing back, so they render a span; `prompt` is something the reader sends, so it renders a `<button type="button">` and takes the props a button takes. Do not wrap a chip in a button of your own to make it pressable — that is what `prompt` is, and a button inside a button is not valid markup.',
  "All four stand on the same ground. A prompt is not a different colour from the pill beside it: it carries `shadow-xs`, lifts it away while it is held, and shows a focus ring, because what makes it different is that it can be pressed.",
  "Dark needs nothing passed. The pill steps into the neutral surface, its thread goes to a flat white, and the eyebrow's label takes the olive that reads there.",
]

const VARIANTS: readonly (readonly string[])[] = [
  ["`eyebrow`", "24px, brand green label", "Over a section heading"],
  ["`suggestion`", "32px, darkens under the pointer", "A line of chat to pick"],
  ["`filter`", "32px, larger label", "A category in a row of them"],
  [
    "`prompt`",
    "32px, lifted, and a button",
    "A question the reader sends to the chat",
  ],
]

const PROPS: readonly (readonly string[])[] = [
  [
    "`variant`",
    "`eyebrow` `suggestion` `filter` `prompt`",
    "`eyebrow`",
    "Which of the four it is",
  ],
  ["`count`", "`number`", "none", "A number in an olive disc before the label"],
  ["`children`", "`ReactNode`", "none", "The words"],
  ["`className`", "`string`", "none", "Extra classes, for placement"],
]

export function chipDoc() {
  return join([
    preamble("Chip", "component"),
    "",
    "# Chip",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Chip } from "@brevy/ui"',
    "",
    "<Chip count={3}>How it works</Chip>",
    "",
    '<Chip variant="suggestion">What benefits am I eligible for?</Chip>',
    "",
    '<Chip variant="filter">Medicaid</Chip>',
    "",
    '<Chip variant="prompt">What benefits am I eligible for?</Chip>',
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
