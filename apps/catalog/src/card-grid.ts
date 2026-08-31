import { join, preamble } from "./doc"

export const INTRO =
  "A row of cards, each showing a piece of the product and saying what it is for. Drawn on the Home pages as the benefits grid, in all four seasons, and built from the same illustration panel the step cards already use."

export const USE = [
  "`CardGrid` takes a `heading` and `items`. Each item is a `title`, a `description` and an `illustration` — and the illustration is a preset layer, the way the testimonial photographs are: the file hand-places a mock of the product in every panel, and that artwork is Brevy's own rather than a shape the block can name.",
  "`chip` and `description` are optional and the file draws neither. They are offered for the same reason the CTA band offers its chip: a section that only fits the page it was drawn on is a section only that page can use.",
  "`background` picks the ground: the drawn olive-to-white wash, plain beige, or white.",
  "Two to four items share the row. The grid is fixed rather than a mosaic — every card is the same width and the same height, unlike the testimonial wall where one card takes two columns.",
  "There is no action on a card. The file draws none on any of the twelve it paints; the page closes on a CTA band instead.",
]

export const LAYOUT = [
  "The section pads 96px above and below, and the header sits 48px over the grid. That is the whole of the drawn header's rhythm: the section holds a heading and nothing else.",
  "At the desktop the three cards are 389px wide with 16px between them, which is the 1200px column. Below the content width they run the full column one under the other — the file draws no two-column stage, so there is none here.",
  "The illustration panel is a fixed 290px tall at every width. What grows is the copy under it, which is what puts the drawn cards at 454px and 482px in the same row with their pictures level.",
  "The card is white on a shadow and wears no thread, unlike every other card in this system. That is the drawing's own distinction: these float over a coloured wash rather than sitting on a page.",
]

/** The Home pages' benefits, which the file draws four times over and keeps
 *  switched off in all of them. */
export const PRESET = {
  heading: "Unlock the caregiving support you’re missing",
  items: [
    {
      title: "Chat with Brevy",
      description:
        "Ask your questions — we make finding help easy, in plain language.",
    },
    {
      title: "See what you qualify for in real time",
      description:
        "Discover benefits and programs tailored to you, as you answer.",
    },
    {
      title: "We pay you!",
      description:
        "Brevy hires you directly — Medicaid pays for your caregiving hours.",
    },
  ],
}

/** What a page that is not the home page would put in the same shape. */
export const OPTIONS = {
  chip: "Why Brevy",
  description:
    "Three things the product does, and what each one saves you doing yourself.",
}

export function cardGridDoc() {
  return join([
    preamble("CardGrid", "block"),
    "",
    "# CardGrid",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { CardGrid } from "@brevy/ui"',
    "",
    "<CardGrid",
    "  heading={heading}",
    "  items={[{ title, description, illustration }]}",
    "/>",
    "```",
    "",
    "### background: one of three",
    "",
    '- `"gradient"`: the drawn olive-to-white wash (default)',
    '- `"beige"`: the flat beige every other section stands on',
    '- `"white"`: nothing at all',
    "",
    "### chip and description: optional",
    "",
    "Neither is drawn. Both sit over the grid, centred, in the header's own rhythm.",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
