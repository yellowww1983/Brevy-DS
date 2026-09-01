import type { TilesItem } from "@brevy/ui"
import type { ReactNode } from "react"

import { PEOPLE } from "./avatar"
import { join, preamble } from "./doc"

export const INTRO =
  "A mixed wall of tiles: a figure on a dark ground, a quotation, a chart, a figure in a pill, and a photograph under a frosted caption. The research called it the statistics section; the file draws five tiles and only two of them hold a number, so it is named for the tile."

export const USE = [
  "`Tiles` takes a `heading` and `items`, and each item names its own shape — `figure`, `quote`, `chart`, `pill` or `photo`. They are five different things sharing a grid, which is what makes this a different block from the testimonial wall, where five items are five of one thing.",
  "The quotation tile is `QuoteCard` — the testimonial wall's own card, reached for rather than redrawn. The card is a component because this block is its second consumer, and the mark behind it, the quote and the author row are one construction wherever they are drawn.",
  "The figure tile and the pill both hold `StatFigure`, which is the type and nothing else — 60 on 60 beside 24 on 24. The container decides the colour, and the three that exist agree on nothing else.",
  "`leaves` is the decoration the file drops in the top right of the column. A slot, because it is Brevy's own composition.",
  "The chart's eight rules are dashed 2 on 2 in the border colour, which is the drawn neutral-300 to the value. A border cannot be dashed to a pattern, so the dashes are a repeating gradient down each 1px column.",
  "The pictures are preset layers, the way every photograph in this system is.",
]

export const LAYOUT = [
  "The section pads 96px above and below on flat beige, and the wall sits 48px under a heading that holds to 502px and centres.",
  "Six columns at the content width, 16px between: a wide tile takes three of them and comes out 592px, a narrow one takes two and comes out 390px. Three columns cannot hold both — the 1200px column in three is 389px, and there is nothing in it that is 592. Below the content width every tile runs the full column, one under the other, and the dark tile puts its cut above its words rather than beside them.",
  "A row is 240px tall. The cut inside the dark tile is 236px, and it carries its own proportion the way every shaped cut does.",
  "The frosted caption is black at 22% over a 12px blur, which is what the file draws rather than a solid bar. It is also the one place the block does not clear AA: white on the drawn scrim measures 3.97 over the photograph the file itself puts behind it. The value is the drawn one and the finding is DESIGN-FEEDBACK 88.",
  "Dark turns the ground and the pale tiles and leaves the rest — the dark tile and the olive pill are brand surfaces and hold. Two things in the chart cannot come along: the brand green is picked against a light card, so on the dark one the title reads 4.06 and the bar 1.41. The title steps to brand-300 and the bar's sweep lifts to brand-400 into green-400.",
]

export const HEADING = "Most caregivers miss benefits they already qualify for"

/** The home pages' own five. */
export function preset(pictures: {
  figure?: ReactNode
  photo?: ReactNode
}): readonly TilesItem[] {
  const [first, second, third] = PEOPLE

  return [
    {
      kind: "figure",
      value: "78",
      unit: "%",
      sentence: "of family caregivers don't know paid care is available",
      picture: pictures.figure,
    },
    {
      kind: "quote",
      quote:
        "Brevy has been one of the best companies I have worked with. They found benefits I did not know existed.",
      author: {
        name: "Brevy Caregiver",
        initials: first?.initials ?? "BC",
        photo: first?.photo,
      },
    },
    {
      kind: "chart",
      title: "Don't just discover benefits — actually enrol in them",
      label: "99.99% of eligible caregivers successful",
    },
    {
      kind: "pill",
      value: "5,000+",
      sentence: "families helped across Texas",
      people: [first, second, third].flatMap((person) =>
        person
          ? [
              {
                name: person.name,
                initials: person.initials,
                photo: person.photo,
              },
            ]
          : [],
      ),
    },
    {
      kind: "photo",
      caption: "Up to $28,000/year through Medicaid for family caregiving",
      picture: pictures.photo,
    },
  ]
}

export const PICTURES = {
  figure: {
    src: "/tiles/figure.webp",
    width: 472,
    height: 480,
    alt: "A caregiver sitting with an older woman",
  },
  photo: {
    src: "/tiles/photo.webp",
    width: 780,
    height: 480,
    alt: "Two people talking over paperwork at a kitchen table",
  },
}

export function tilesDoc() {
  return join([
    preamble("Tiles", "block"),
    "",
    "# Tiles",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Tiles } from "@brevy/ui"',
    "",
    "<Tiles",
    "  heading={heading}",
    '  items={[{ kind: "figure", value, unit, sentence, picture }]}',
    "  leaves={leaves}",
    "/>",
    "```",
    "",
    "### items: one of five shapes",
    "",
    "- `figure`: a cut picture, a number and a line, on the dark ground",
    "- `quote`: the testimonial wall's card, drawn again",
    "- `chart`: a claim over a bar",
    "- `pill`: a number in an olive pill, a line, and faces",
    "- `photo`: a photograph under a frosted caption",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
