import { join, preamble, table } from "./doc"

export const INTRO =
  "The white card a quotation sits on: the words, the person, and a quotation mark the size of the card behind them."

export const USE = [
  "`QuoteCard` is one construction rather than three. The mark behind, the quote and the author row are drawn together wherever they appear, so the card carries all three and a caller passes only what is said and who said it.",
  "It became a component when the tile mosaic reached for the testimonial wall's card instead of redrawing it. Both consumers get the same object, which is the point.",
  "`author` takes the same three fields a face in a hero takes — a name, initials and a photograph — because it is the same person type rather than a second copy of it. The initials are the fallback when the photograph is missing.",
  "`mark` moves the quotation mark, and the two values are two hand-placed offsets rather than a rule. `card` hangs it where the wall's cards do, which is eleven of the twelve the file draws. `tile` hangs it higher, for the mosaic's one card that is wider and shorter. Both show exactly the same amount of the mark before the card clips it.",
  "Keep the quote short enough to read at a glance. The card grows with the words and a long one pushes the author row away from the quote it belongs to.",
]

const PROPS: readonly (readonly string[])[] = [
  ["`quote`", "`string`", "required", "What was said"],
  [
    "`author`",
    "`QuoteCardAuthor`",
    "required",
    "Name, initials and photograph",
  ],
  ["`mark`", "`card`, `tile`", "`card`", "Where the quotation mark hangs"],
  ["`className`", "`string`", "none", "Extra classes, rarely needed"],
]

export function quoteCardDoc() {
  return join([
    preamble("QuoteCard", "component"),
    "",
    "# QuoteCard",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { QuoteCard } from "@brevy/ui"',
    "",
    "<QuoteCard",
    '  quote="They made it easy to get hired, and they answer every question."',
    '  author={{ name: "Maria Wells", initials: "MW", photo: "/people/mw.jpg" }}',
    "/>",
    "```",
    "",
    "## Props",
    "",
    table(["Prop", "Values", "Default", "What it does"], PROPS),
  ])
}
