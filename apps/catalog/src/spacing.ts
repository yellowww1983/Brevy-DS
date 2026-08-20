/** The numbers are Tailwind's own, because Tailwind's ladder already is the
 *  4px grid the design is drawn on, and every value below maps onto it without a
 *  remainder. Nothing here is a size: a size would be a second copy of a number
 *  the browser already knows, and the page measures what it renders instead.
 *  What is written down is which rungs of that ladder the design reaches for,
 *  and what each one is for. */

export type Step = {
  /** As it appears in a class: `p-6`, `gap-6`, `mt-6`. */
  step: number
  role: string
  /** Where the step is used, so the role points somewhere concrete. */
  seen: string
}

export const STEPS: readonly Step[] = [
  {
    step: 1,
    role: "Between an icon and its label.",
    seen: "chips, badges, and inputs",
  },
  {
    step: 2,
    role: "Inside controls.",
    seen: "buttons, cards, and blocks of text",
  },
  {
    step: 3,
    role: "Vertical padding inside controls. A button is 12 vertical, 24 horizontal.",
    seen: "buttons, chips, and inputs",
  },
  {
    step: 4,
    role: "Between elements inside a card.",
    seen: "buttons and cards",
  },
  {
    step: 6,
    role: "Card padding, and the gap between text groups.",
    seen: "cards, text blocks, and the newsletter",
  },
  {
    step: 8,
    role: "A wider gap between text groups.",
    seen: "text blocks",
  },
  {
    step: 12,
    role: "Between the blocks that make up a section.",
    seen: "text blocks and the navbar",
  },
  {
    step: 16,
    role: "Between layout columns. Almost always horizontal.",
    seen: "page columns, the footer, and the hero",
  },
  {
    step: 24,
    role: "Between page sections.",
    seen: "section wrappers",
  },
]
