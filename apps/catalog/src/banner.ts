import { join, preamble, table } from "./doc"

export const INTRO =
  "A strip a page can open with: one sentence on the brand's deepest green, with the mark hanging off both ends. It stands above the navbar and pushes the whole page down by its own 48px."

export const USE = [
  '`Banner` takes a `label` and the `platforms` the sentence lifts out of it. The platforms are set in olive and the sentence puts `and` between them, so `label="Available Now on"` with `platforms={["iOS", "Android"]}` reads as one line rather than a list.',
  "`prefix` is the words before the announcement. It is optional because a narrow page drops it: below 640px the strip keeps `Available Now on iOS and Android` and lets the rest go. That is the shipped behaviour, and it is a truncation rather than a wrap — the strip is 48px tall at every width and the line never runs to two.",
  "It costs the page its height, so anything fixed above the fold has to be told. `Navbar` takes `banner` for exactly this: it is a fixed bar and cannot see what stands in front of it in the document. Without a banner nothing changes, which is what every page that has one today needs to keep getting.",
  "There is no call to action and no way to close it. Neither the drawing nor the shipped page has either, and nothing is remembered between visits because there is nothing to remember.",
]

export const LAYOUT = [
  "48px tall at every width, which is `spacing/12` in the file. The sentence sits on one 24px line with 12px above and below it.",
  "It is `relative`, not sticky and not fixed. It scrolls away with the page and does not return: on the shipped page it is gone by 48px of scroll, at which point the navbar has reached the top.",
  "Two marks, 96px square, hang off the ends and the strip clips them. The left one starts 59px before the strip does; the right one sits 38px in from its end and 56px above it. Those positions hold at every width on the shipped page, so the right one tracks the edge and the left one does not move.",
  "The text sits above the marks. That is the only thing the stacking order inside the strip has to settle; the navbar is above both at `z-50`.",
]

export const DARK = [
  "Nothing changes. The ground is emerald-500, which is a brand accent rather than a surface, so it holds in both themes the way the dark CTA band and the illustration panel do. The white sentence and the olive platform names hold with it.",
  "Neither the file nor the shipped page draws a dark banner, so this is read from the rule rather than measured off a drawing.",
]

/** The one the file draws, and the one the shipped page carries. */
export const PRESET = {
  prefix: "For Brevy Caregivers:",
  label: "Available Now on",
  platforms: ["iOS", "Android"],
}

export function bannerDoc() {
  return join([
    preamble("Banner", "block"),
    "",
    "# Banner",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Banner, Navbar } from "@brevy/ui"',
    "",
    "export function Page() {",
    "  return (",
    "    <>",
    "      <Banner",
    `        prefix="${PRESET.prefix}"`,
    `        label="${PRESET.label}"`,
    `        platforms={["${PRESET.platforms[0] ?? ""}", "${PRESET.platforms[1] ?? ""}"]}`,
    "      />",
    "      <Navbar banner logo={logo} links={links} />",
    "    </>",
    "  )",
    "}",
    "```",
    "",
    "## Props",
    "",
    table(
      ["Prop", "Values", "Default", "What it does"],
      [
        [
          "`label`",
          "`string`",
          "none",
          "The announcement, kept at every width",
        ],
        [
          "`platforms`",
          "`readonly string[]`",
          "none",
          "The names lifted into olive, joined by `and`",
        ],
        [
          "`prefix`",
          "`string`",
          "none",
          "The words before it, dropped below 640px",
        ],
        [
          "`className`",
          "`string`",
          "none",
          "Extra classes, for spacing rather than skin",
        ],
      ],
    ),
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
    "## In the dark",
    "",
    ...DARK.flatMap((paragraph) => [paragraph, ""]),
  ])
}
