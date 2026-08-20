/** Names only. Every colour on the page is read back from what the browser
 *  actually paints, so nothing here can claim a value the system does not
 *  ship. The one thing that has to be written down is where a semantic token
 *  points, because the browser flattens that chain before anyone can read it. */

export type Ramp = {
  family: string
  shades: readonly string[]
}

export type RampGroup = {
  id: string
  title: string
  note: string
  ramps: readonly Ramp[]
}

const FULL = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const

const full = (family: string): Ramp => ({ family, shades: FULL })

export const BRAND_GROUPS: readonly RampGroup[] = [
  {
    id: "greens",
    title: "Greens",
    note: "Use emerald for buttons, links, and heading accents. Brand green marks the current item in navigation.",
    ramps: [full("brand"), full("emerald"), full("green"), full("olive")],
  },
  {
    id: "warm-neutrals",
    title: "Warm neutrals",
    note: "Use beige for the surfaces behind cards and rows. Taupe and stone are available for the same purpose.",
    ramps: [full("beige"), full("taupe"), full("stone")],
  },
  {
    id: "accents",
    title: "Accents",
    note: "Use these for highlights, illustrations, and badges. None of them carries meaning on its own.",
    ramps: [full("orange"), full("yellow"), full("violet")],
  },
]

export type SemanticToken = {
  /** The name as it is used: `bg-primary`, `border-border`. */
  token: string
  light: string
  dark: string
}

export type SemanticGroup = {
  id: string
  title: string
  note: string
  tokens: readonly SemanticToken[]
}

export const SEMANTIC_GROUPS: readonly SemanticGroup[] = [
  {
    id: "surfaces",
    title: "Surfaces",
    note: "Backgrounds for content. Use these rather than a ramp so a surface follows the theme.",
    tokens: [
      { token: "background", light: "white", dark: "neutral-950" },
      { token: "card", light: "white", dark: "neutral-900" },
      { token: "popover", light: "white", dark: "neutral-800" },
      { token: "secondary", light: "beige-500", dark: "neutral-800" },
      { token: "muted", light: "beige-500", dark: "neutral-800" },
      { token: "accent", light: "beige-200", dark: "neutral-700" },
      { token: "surface-hover", light: "beige-600", dark: "accent" },
      { token: "surface-active", light: "beige-700", dark: "accent" },
    ],
  },
  {
    id: "text",
    title: "Text",
    note: "Foreground colors, each paired with the surface it belongs on. Use the pair to keep contrast right in both themes.",
    tokens: [
      { token: "foreground", light: "zinc-800", dark: "neutral-50" },
      { token: "card-foreground", light: "zinc-800", dark: "neutral-50" },
      { token: "popover-foreground", light: "neutral-950", dark: "neutral-50" },
      { token: "secondary-foreground", light: "zinc-800", dark: "neutral-50" },
      { token: "muted-foreground", light: "zinc-500", dark: "neutral-400" },
      { token: "accent-foreground", light: "neutral-900", dark: "beige-300" },
      { token: "primary-foreground", light: "olive-500", dark: "white" },
      { token: "destructive-foreground", light: "red-50", dark: "red-50" },
    ],
  },
  {
    id: "brand-and-state",
    title: "Brand and state",
    note: "Use primary for the main action and destructive for anything that removes data. Primary is the one token that changes family between themes.",
    tokens: [
      { token: "primary", light: "emerald-500", dark: "brand-vivid" },
      { token: "destructive", light: "red-600", dark: "red-400" },
      { token: "surface-olive", light: "olive-500", dark: "olive-500" },
      {
        token: "surface-olive-foreground",
        light: "emerald-500",
        dark: "emerald-500",
      },
      {
        token: "surface-olive-outline",
        light: "emerald-500",
        dark: "olive-500",
      },
    ],
  },
  {
    id: "lines-and-focus",
    title: "Lines and focus",
    note: "Borders, inputs, and focus rings. In dark these are translucent white, so they sit on whatever surface is underneath.",
    tokens: [
      { token: "border", light: "neutral-300", dark: "white 10%" },
      { token: "input", light: "neutral-300", dark: "white 15%" },
      { token: "ring", light: "neutral-400", dark: "neutral-500" },
      { token: "ring-offset", light: "white", dark: "neutral-950" },
    ],
  },
  {
    id: "sidebar",
    title: "Sidebar",
    note: "Navigation has its own set so it can sit a shade apart from the page.",
    tokens: [
      { token: "sidebar", light: "beige-200", dark: "neutral-900" },
      { token: "sidebar-foreground", light: "zinc-800", dark: "neutral-50" },
      { token: "sidebar-primary", light: "brand-500", dark: "brand-300" },
      {
        token: "sidebar-primary-foreground",
        light: "neutral-50",
        dark: "neutral-50",
      },
      { token: "sidebar-accent", light: "beige-500", dark: "neutral-800" },
      {
        token: "sidebar-accent-foreground",
        light: "zinc-800",
        dark: "neutral-50",
      },
      { token: "sidebar-border", light: "neutral-200", dark: "white 10%" },
      { token: "sidebar-ring", light: "neutral-400", dark: "neutral-600" },
    ],
  },
]

export type BorrowedRamp = Ramp & {
  why: string
}

/** Only the shades something actually reaches for: what the design draws, plus
 *  what a semantic token resolves to in either theme. The rest of each ramp is
 *  still available in code and deliberately absent here. */
export const BORROWED: readonly BorrowedRamp[] = [
  {
    family: "neutral",
    shades: [
      "50",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ],
    why: "Every dark-mode surface, and most lines in both themes.",
  },
  {
    family: "zinc",
    shades: ["300", "400", "500", "600", "700", "800"],
    why: "All body text in light mode.",
  },
  {
    family: "red",
    shades: ["50", "400", "500", "600"],
    why: "Used by destructive and its foreground.",
  },
]
