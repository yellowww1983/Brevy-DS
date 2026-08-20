import { join, preamble, table } from "./doc"

/** Five corners and one shape. The classes are written out rather than built
 *  from a name, because Tailwind reads source text and never sees a class
 *  assembled at runtime. Sizes are measured on the page, not recorded here. */

export type Radius = {
  className: string
  /** Written down only for the copied text; the page measures what it draws,
   *  and a spec compares the two so the number cannot go stale. */
  px: number
  role: string
}

export const RADIUS: readonly Radius[] = [
  {
    className: "rounded-sm",
    px: 6,
    role: "For small details that need a soft corner.",
  },
  {
    className: "rounded-md",
    px: 8,
    role: "Used on the 36px icon button.",
  },
  {
    className: "rounded-lg",
    px: 10,
    role: "Used on ghost buttons and square avatars.",
  },
  {
    className: "rounded-2xl",
    px: 16,
    role: "The default radius. Use it for cards, photos, and text blocks.",
  },
  {
    className: "rounded-full",
    px: 9999,
    role: "Use it for circles and pills: avatars, chips, dots, and rules.",
  },
]

export const INTRO =
  "Corner radius sets how soft or sharp an element reads. Use the scale for consistent rounding across buttons, cards, and images, plus the leaf for brand-specific corners."

export const SCALE_NOTE =
  "Each square uses the class next to it. Sizes are measured from the rendered square. Click a name to copy it."

export const LEAF = [
  "The leaf is the brand signature: `6px 16px 6px 16px`, clockwise from the top left. Use it on buttons, photos, and panels that round only the corners facing the middle of a layout.",
  "Apply it with `rounded-leaf`. It is one class instead of four corner classes, so every use stays in sync.",
]

export function radiusDoc() {
  return join([
    preamble("Radius"),
    "",
    "# Radius",
    "",
    INTRO,
    "",
    "## The scale",
    "",
    "These sizes are the ones the design draws. Several of the names carry different values in stock Tailwind, so take the size from this table rather than from the class name.",
    "",
    table(
      ["Class", "Size", "Use"],
      RADIUS.map((radius) => [
        `\`${radius.className}\``,
        radius.px > 1000 ? "fully round" : `${String(radius.px)}px`,
        radius.role,
      ]),
    ),
    "",
    "## The leaf",
    "",
    ...LEAF.flatMap((paragraph) => [paragraph, ""]),
  ])
}
