/** The numbers are Tailwind's own, because Tailwind's ladder already is the
 *  4px grid the design is drawn on — every value below maps onto it without a
 *  remainder. Nothing here is a size: a size would be a second copy of a number
 *  the browser already knows, and the page measures what it renders instead.
 *  What is written down is which rungs of that ladder the design reaches for,
 *  and what each one is for. */

export type Step = {
  /** As it appears in a class: `p-6`, `gap-6`, `mt-6`. */
  step: number
  role: string
  /** Where it was counted in the design, so the role is evidence, not a guess. */
  seen: string
}

export const STEPS: readonly Step[] = [
  {
    step: 1,
    role: "Between an icon and the label beside it.",
    seen: "chips, badges, inputs — 140 times",
  },
  {
    step: 2,
    role: "Inside a control. The workhorse of the whole design, used more than every other step put together.",
    seen: "buttons, cards, blocks of text — 1,433 times",
  },
  {
    step: 3,
    role: "A control's own vertical padding — a button is 12 down, 24 across.",
    seen: "buttons, chips, inputs — 349 times",
  },
  {
    step: 4,
    role: "Between elements inside a card.",
    seen: "buttons, cards — 347 times",
  },
  {
    step: 6,
    role: "A card's padding, and the gap between one group of text and the next.",
    seen: "cards, text blocks, the newsletter — 488 times",
  },
  {
    step: 8,
    role: "A wider gap between groups of text, where 24 reads as too tight.",
    seen: "text blocks — 26 times",
  },
  {
    step: 12,
    role: "Between the blocks that make up a section.",
    seen: "text blocks, the navbar — 60 times",
  },
  {
    step: 16,
    role: "Between the columns of a two-column layout. Almost always horizontal.",
    seen: "page columns, footer, hero — 56 times",
  },
  {
    step: 24,
    role: "Between one section and the next. The vertical rhythm of a page.",
    seen: "section wrappers — 65 times",
  },
]
