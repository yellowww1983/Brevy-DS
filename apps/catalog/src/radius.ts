/** Five corners and one shape. The classes are written out rather than built
 *  from a name, because Tailwind reads source text and never sees a class
 *  assembled at runtime. Sizes are measured on the page, not recorded here. */

export type Radius = {
  className: string
  role: string
}

export const RADIUS: readonly Radius[] = [
  {
    className: "rounded-sm",
    role: "For small details that need a soft corner.",
  },
  {
    className: "rounded-md",
    role: "Used on the 36px icon button.",
  },
  {
    className: "rounded-lg",
    role: "Used on ghost buttons and square avatars.",
  },
  {
    className: "rounded-2xl",
    role: "The default radius. Use it for cards, photos, and text blocks.",
  },
  {
    className: "rounded-full",
    role: "Use it for circles and pills: avatars, chips, dots, and rules.",
  },
]
