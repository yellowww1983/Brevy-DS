import { join, preamble, table } from "./doc"

/** The container is the one measurement every block depends on, so its prose
 *  lives here beside the numbers, the way the other foundations keep theirs. */

export const INTRO =
  "A block paints its background across the full width of the screen and puts everything readable inside a container. The container is at most 1200px wide, centred, and the gutter beside it is the only part that changes between widths."

export const CONTAINER = [
  "Wrap readable content in `Container` from `@brevy/ui`, or use the `container-content` class where a component is not warranted.",
  "The container carries no padding of its own, so what it measures is the column. Padding inside a card is the card's business, not the container's.",
  "A background that runs edge to edge belongs on the element around the container. That is what full bleed means here: the band is the full width, the reading is not.",
]

export const GUTTER = [
  "The gutter is the room between the column and the edge of the screen. It is margin rather than padding, so the column measures a clean 1200px wherever there is room for one.",
  "Above 1440px the column stops growing and the extra room goes to the margins, so a line of text never gets longer than the design draws it.",
]

export const GRID = [
  "Blocks that place something on a column edge use twelve columns with a 16px gutter, which is `grid grid-cols-12 gap-4`. Inside the container a column measures 85.33px.",
  "Most blocks do not need it. Reach for the grid when the design lines something up against a column rather than against the container.",
]

/** Width is the input, the other two are what the container owes at that width.
 *  The page reads them off the rendered container instead of printing them, and
 *  a spec checks the two against each other. */
export const WIDTHS = [
  { label: "Mobile", width: 390, gutter: 16, content: 358 },
  { label: "Tablet", width: 810, gutter: 24, content: 762 },
  { label: "Desktop", width: 1440, gutter: 120, content: 1200 },
] as const

export type Width = (typeof WIDTHS)[number]

export function layoutDoc() {
  return join([
    preamble("Layout"),
    "",
    "# Layout",
    "",
    INTRO,
    "",
    "## The container",
    "",
    ...CONTAINER.flatMap((paragraph) => [paragraph, ""]),
    "## The gutter",
    "",
    ...GUTTER.flatMap((paragraph) => [paragraph, ""]),
    table(
      ["Width", "Gutter", "Content"],
      WIDTHS.map((entry) => [
        `${String(entry.width)}px`,
        `${String(entry.gutter)}px`,
        `${String(entry.content)}px`,
      ]),
    ),
    "",
    "## The grid",
    "",
    ...GRID.flatMap((paragraph) => [paragraph, ""]),
  ])
}
