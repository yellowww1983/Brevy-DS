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
