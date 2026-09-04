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
  "The column stops growing at 1248px, which is 1200 plus a gutter either side, and from there the extra room goes to the margins so a line of text never gets longer than the design draws it. Above that nothing sets the margin at all: it is whatever centring leaves over. That it comes to 120px on a 1440px screen is arithmetic rather than a threshold.",
]

export const GRID = [
  "The grid switches on at 1200px. That is the `content:` variant, and it is the width the container reaches its full 1200 at. Below it no block places on columns: content takes the container, and the twelve are a guide the file draws rather than something the page has.",
  "Above it there are five grids and no block shares one with another. Each declares its own on its own list: FAQ takes twelve, Tiles six, Testimonials three, and Steps three in its cards layout and two in its panel. Every `col-span` and `col-start` places a child inside the grid its own block drew. There is no twelve that blocks reach into, because no such grid is rendered anywhere.",
  "They still land on the same lines, and that is arithmetic rather than a shared drawing. All five stand at the full width of the container with equal tracks and the same 16px gutter, so each track comes to a whole number of twelfths: one, two, four, four and six. The twelve is what those five divide evenly into, not something any of them sits on.",
  "Reach for it when the design lines something up against a column rather than against the container. Twelve columns with a 16px gutter is `grid grid-cols-12 gap-4`; the narrower counts are the same gutter with fewer columns. Inside a 1200px container a twelfth measures 85.33px.",
  "It is a guide and nothing paints it. No block draws a column edge, and the bands on this page are the catalog showing you where the tracks fall, not a thing the system ships.",
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
