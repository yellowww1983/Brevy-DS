import type { ActivityMarqueeRows } from "@brevy/ui"

import { join, preamble, table } from "./doc"

export const INTRO =
  "Three rows of activities sliding past, each at its own pace and the middle one the other way. It has no heading of its own: it is the band under one, and a page that wants a title puts its own above it."

export const USE = [
  "`ActivityMarquee` takes exactly three `rows` and a `label` saying what they are. An entry is a `label`, and `accent` draws it as a pill among the words. The rows arrive whole rather than as one list the block rearranges: the live page shifts each row and picks different pills in each, and that is a choice about the page rather than a rule the block could apply.",
  "`variant` is `mix` or `chips`. `mix` is the live page: words, with a few of them drawn as the filter chip. `chips` draws every entry as a chip and ignores `accent`, since everything is one already. The chip is the catalog's `filter` chip as it ships, and a word is set exactly as that chip's label is — so the two read as one run of type and only the ground changes.",
  "`label` is not decoration. There is no heading here to say what the rows are, so without it the section is three lists of words with no reason given.",
  "All three rows are read, because each is a row somebody wrote. What is not read twice is a row's own repeats: a row is four sets of the same entries so the loop never shows an end, and only the first set is announced.",
  "Motion stops for anyone who asked it to. The rows still read, standing at the start of their first set. Nothing holds them under the cursor, which is how the live page runs them.",
]

export const LAYOUT = [
  "Three rows 32px tall, each with 4px above and below it and 24px between them — so a row starts every 64px, the live page's pitch. The section breathes 96px above and below, the way every other section in the system does.",
  "The rows run edge to edge and stop widening at 1408px, where they are cut rather than faded: a word leaves at the edge. The live page draws it that way, which is the difference from the logo band's soft ends.",
  "Words stand 48px apart, and a pill among them keeps the 48. A row of nothing but pills closes to 16px, because each pill already carries 12px of padding either side of its label and 48 would leave 72 between two labels. Nothing draws a row of pills, so that number was chosen by eye, against 24 and 32, rather than measured.",
  "A lap is 80, 100 and 90 seconds, top to bottom, linear and from the moment the page loads; the middle row runs right, the others left. Each row slides half its track, which is two of its four sets, so the third set lands exactly where the first began. Two sets to a half because ten words are 1144px, short of a 1408px row. A set is never narrower than half the row, so a shorter row than that leaves space at its end rather than an empty stretch of the lap.",
  "In the dark the ground is the page's own, the words go to the foreground and the pills to their own dark ground, which is the chip's rule rather than anything of this block's.",
]

const ACTIVITIES = [
  "Walking",
  "Mobility",
  "Toileting",
  "Hygiene",
  "Independence",
  "Daily Routines",
  "Bathing",
  "Dressing",
  "Grooming",
  "Eating",
] as const

/** The ten in a row's own order, with the pills that row draws. */
const row = (order: readonly string[], accents: readonly string[]) =>
  order.map((label) =>
    accents.includes(label) ? { label, accent: true } : { label },
  )

/** The three rows the live page runs (brevy.com, Caregiving). The middle one
 *  starts further along the same ten; its live copy carries two of them twice
 *  and two not at all, which reads as a slip rather than a choice, so it is
 *  the ten here. */
export const PRESET: ActivityMarqueeRows = [
  row(ACTIVITIES, ["Daily Routines"]),
  row(
    [...ACTIVITIES.slice(7), ...ACTIVITIES.slice(0, 7)],
    ["Grooming", "Bathing"],
  ),
  row(ACTIVITIES, ["Hygiene", "Dressing"]),
]

export const LABEL = "Activities of daily living"

export function activityMarqueeDoc() {
  return join([
    preamble("ActivityMarquee", "block"),
    "",
    "# ActivityMarquee",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { ActivityMarquee } from "@brevy/ui"',
    "",
    "<ActivityMarquee",
    '  label="Activities of daily living"',
    "  rows={[",
    '    [{ label: "Walking" }, { label: "Daily Routines", accent: true }],',
    '    [{ label: "Dressing" }, { label: "Grooming", accent: true }],',
    '    [{ label: "Hygiene", accent: true }, { label: "Eating" }],',
    "  ]}",
    "/>",
    "```",
    "",
    "## Props",
    "",
    table(
      ["Prop", "Values", "Default", "What it does"],
      [
        [
          "`rows`",
          "three rows of `{ label, accent? }`",
          "none",
          "What slides, one list per row, in the order it is drawn",
        ],
        [
          "`label`",
          "`string`",
          "none",
          "What the rows are, for anyone who cannot see them",
        ],
        [
          "`variant`",
          "`mix` or `chips`",
          "`mix`",
          "Words with a few pills, or a pill for every entry",
        ],
      ],
    ),
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
