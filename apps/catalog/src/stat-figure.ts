import { join, preamble, table } from "./doc"

export const INTRO =
  "A headline number with its unit beside it, and no opinion about the colour."

export const USE = [
  "`StatFigure` is the type and nothing else. Thirty-nine of them across the file sit in three different containers that agree on nothing but this: a card sets it in emerald, a dark tile inverts that to olive, a pill turns the weight down. What they share is the size, which is why the figure is the component and the container is not.",
  "Wrap it in whatever the section needs and let that decide the colour. The panel paints; this measures. A `className` on the figure inherits down to the unit, so one colour set outside covers both.",
  "The unit hangs from the number's top rather than its baseline, which is what the file draws: a short box against a tall one, both starting at the same line. Leave `unit` off and the number stands alone.",
  "Use it for a fact a reader should carry away: a payment, a count, a share. A number that only makes sense inside a sentence belongs in the sentence.",
]

const PROPS: readonly (readonly string[])[] = [
  ["`value`", "`string`", "required", "The number, written the way it reads"],
  [
    "`unit`",
    "`string`",
    "none",
    "The `%` or `+` beside it, a step and a half down",
  ],
  [
    "`className`",
    "`string`",
    "none",
    "The colour, and anything else the container decides",
  ],
]

export function statFigureDoc() {
  return join([
    preamble("StatFigure", "component"),
    "",
    "# StatFigure",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { StatFigure } from "@brevy/ui"',
    "",
    '<div className="rounded-2xl bg-surface-olive p-6 text-emerald-500">',
    '  <StatFigure value="1500" unit="+" />',
    '  <p className="text-caption text-zinc-700">average monthly payment</p>',
    "</div>",
    "```",
    "",
    "## Props",
    "",
    table(["Prop", "Values", "Default", "What it does"], PROPS),
  ])
}
