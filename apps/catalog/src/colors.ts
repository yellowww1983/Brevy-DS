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
    note: "The brand itself. Emerald carries most of the weight — it is what a button, a link and a heading accent are made of — while brand green marks the current item in navigation.",
    ramps: [full("brand"), full("emerald"), full("green"), full("olive")],
  },
  {
    id: "warm-neutrals",
    title: "Warm neutrals",
    note: "The paper the product is printed on. Beige is the quiet surface behind cards and rows; taupe and stone are drawn but barely used, and are here because the ramp exists to be reached for.",
    ramps: [full("beige"), full("taupe"), full("stone")],
  },
  {
    id: "accents",
    title: "Accents",
    note: "Used sparingly and on purpose — a highlight, an illustration, a badge. None of them carries meaning on its own the way the greens do.",
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
    note: "What sits behind content. Light is warm — beige over white — and dark is a plain grey stack, because a tinted dark surface muddies every colour placed on it.",
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
    note: "Every foreground is paired with the surface it belongs on, so reaching for the pair rather than the colour is what keeps contrast right in both themes.",
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
    note: "The only tokens that mean something rather than describe something. Primary is the one colour that changes family between themes: emerald reads on white, and a brighter green is needed to hold up against near-black.",
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
    note: "The only place a semantic token is not a palette colour: dark draws its lines as translucent white, so they sit on whatever surface is underneath instead of fighting it.",
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
    note: "Navigation keeps its own set so it can sit a shade apart from the page without every surface token moving with it.",
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
    why: "Every dark-mode surface and most lines in both themes. Nineteen of the thirty-three semantic tokens resolve here in dark.",
  },
  {
    family: "zinc",
    shades: ["300", "400", "500", "600", "700", "800"],
    why: "All body text in light mode. The design reaches for it more often than any other family, brand greens included.",
  },
  {
    family: "red",
    shades: ["50", "400", "500", "600"],
    why: "Nothing but destructive and its foreground, plus a single shade drawn in the design.",
  },
]

export const OMITTED = ["amber", "blue", "cyan", "purple", "rose", "teal"]
