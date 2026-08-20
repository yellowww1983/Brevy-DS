import { join, preamble, table } from "./doc"

/** Five steps of Tailwind's own shadow scale, which the design reproduces
 *  exactly. The classes are written out rather than built from a name, because
 *  Tailwind reads source text and never sees a class assembled at runtime. */

export type Shadow = {
  className: string
  role: string
}

export const SHADOWS: readonly Shadow[] = [
  {
    className: "shadow-xs",
    role: "The default lift. Use it on cards and buttons that sit just above the surface.",
  },
  {
    className: "shadow-md",
    role: "A clearer lift for elements that float above the page, like menus and popovers.",
  },
  {
    className: "shadow-lg",
    role: "For raised panels that need more separation from the background.",
  },
  {
    className: "shadow-xl",
    role: "A strong lift for large floating surfaces.",
  },
  {
    className: "shadow-2xl",
    role: "The deepest lift. Use it on hero images and large feature cards.",
  },
]

export const INTRO =
  "Shadows lift an element off the surface and show how far. Use the scale to keep elevation consistent across cards, buttons, and overlays."

export const SCALE_NOTE =
  "Each tile uses the class next to it. Offsets are measured from the rendered tile. Click a name to copy it."

export function shadowsDoc() {
  return join([
    preamble("Shadows"),
    "",
    "# Shadows",
    "",
    INTRO,
    "",
    "## The scale",
    "",
    "These are Tailwind's own shadow values, which the design reproduces exactly, so the class is all you need.",
    "",
    table(
      ["Class", "Use"],
      SHADOWS.map((shadow) => [`\`${shadow.className}\``, shadow.role]),
    ),
  ])
}
