import { join, preamble, table } from "./doc"

export const INTRO = "The yellow highlighter swipe under a word in a heading."

export const USE = [
  "`LineMarker` wraps the words it marks. The stroke takes its width from them, so it cannot drift when the copy changes and there is no width to pass.",
  "Mark a phrase, not the line. The design puts it under two or three words of an `h2` to point at the part that matters. A whole heading under a highlighter says nothing about which part is the point.",
  "It is yellow-500 on a dark page as well as a light one. A highlighter is a saturated accent rather than a tint, so it holds rather than darkening with the ground.",
  "One phrase to a heading. Two marks in one line compete, and the design never draws it.",
]

const PROPS: readonly (readonly string[])[] = [
  ["`children`", "`ReactNode`", "none", "The words the stroke runs under"],
  ["`className`", "`string`", "none", "Extra classes, rarely needed"],
]

export function lineMarkerDoc() {
  return join([
    preamble("LineMarker", "component"),
    "",
    "# LineMarker",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { LineMarker } from "@brevy/ui"',
    "",
    '<h2 className="text-center font-serif text-h2 text-zinc-800">',
    "  Your superhuman <LineMarker>social worker</LineMarker>",
    "</h2>",
    "```",
    "",
    "## Props",
    "",
    table(["Prop", "Values", "Default", "What it does"], PROPS),
  ])
}
