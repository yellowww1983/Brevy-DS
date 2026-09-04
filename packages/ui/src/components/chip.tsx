import { cva } from "class-variance-authority"
import type { ComponentProps, ReactNode } from "react"

import { cn } from "../lib/utils.js"

/** The website's pill family: fully round on a white to neutral gradient, in
 *  the four shapes the design draws. An eyebrow sits over a section heading, a
 *  suggestion is a tappable line of chat, a filter names a category, and a
 *  prompt is a question the reader can send. All four stand on the same
 *  ground; what a prompt adds is that it can be pressed.
 *
 *  The gradient is written in ramp colours rather than tokens because the
 *  design draws it the same on every page and never in dark mode, and every
 *  colour on the pill is written the same way for the same reason. A label on
 *  a theme token was the one thing that did turn: on a dark page the text went
 *  to near-white while the pill stayed white, measured at 1.04 to 1 against
 *  14.89 in the light.
 *
 *  On a dark page the pill steps into the neutral ramp the app file draws for
 *  a surface — neutral-900 to neutral-800 — and its thread goes flat white at
 *  10%, which is what that file draws for every dark outline. The label is
 *  pinned in both directions rather than left to a token: dark green is
 *  unreadable on neutral-900, so the eyebrow takes the olive the app gives a
 *  brand accent there (`17083:177441`). The counter keeps its olive disc,
 *  which that same drawing leaves alone. */
const chipVariants = cva(
  "inline-flex w-fit shrink-0 items-center rounded-full bg-linear-to-b from-white to-neutral-100 whitespace-nowrap hairline dark:from-neutral-900 dark:to-neutral-800",
  {
    variants: {
      variant: {
        eyebrow:
          "h-6 gap-1 px-2 text-sm font-normal text-emerald-500 dark:text-olive-500",
        /** The one shape drawn twice: pointed at, the gradient's foot steps
         *  from neutral-100 to neutral-200 and nothing else moves. Worn only
         *  here, because it is the only chip the design draws a hover for. */
        suggestion:
          "h-8 gap-2 px-3 text-sm font-normal text-zinc-800 hover:to-neutral-200 dark:text-foreground dark:hover:to-neutral-700",
        filter:
          "h-8 gap-2 px-3 text-base font-medium text-zinc-700 dark:text-foreground",
        /** A question the reader can send, so it is the one pill that is a
         *  control: the only variant that renders a button.
         *
         *  It keeps the family's ground. The file paints it solid white with
         *  `zinc-800` on it and names no other colour — measured on
         *  `22622:8392`, whose only two variables are `base/white` and
         *  `zinc/800`. There is no green in it, and the surface the eyebrow's
         *  counter stands on has no business here.
         *
         *  What separates it from `suggestion` is that it can be pressed, so
         *  it says so: `shadow-xs`, which is what everything pressable in this
         *  system wears, lifted away again while it is held. The file draws
         *  that lift as an inset highlight over a hairline halo; this is the
         *  same reading in the vocabulary the system already has.
         *
         *  Its hover makes the move `suggestion` makes — the gradient's foot
         *  steps one down the ramp. Neither hover nor press is drawn: the file
         *  has only Default for this pill and publishes no Chips component set
         *  to take a state from. DESIGN-FEEDBACK 97. */
        prompt: cn(
          "h-8 cursor-pointer gap-2 px-3 text-sm font-normal text-zinc-800",
          "shadow-xs hover:to-neutral-200 active:shadow-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          "dark:text-foreground dark:hover:to-neutral-700",
        ),
      },
    },
    defaultVariants: {
      variant: "eyebrow",
    },
  },
)

/** The little olive disc before an eyebrow's label, carrying a step count.
 *  Only the eyebrow is drawn with one. */
type ChipCount = { count?: number; children?: ReactNode; className?: string }

/** The element follows the role rather than a prop. Three of the four shapes
 *  are something a page says, and say nothing back, so they are a `span`; a
 *  prompt is something a reader can send, so it is a `button` and takes the
 *  handler that makes it worth pressing.
 *
 *  Written as a union rather than one loose type because the two halves take
 *  different attributes, and a `disabled` on a span or an `onClick` on an
 *  eyebrow should not typecheck. */
type ChipProps =
  | (ChipCount & { variant: "prompt" } & Omit<
        ComponentProps<"button">,
        "children" | "className"
      >)
  | (ChipCount & {
      variant?: "eyebrow" | "suggestion" | "filter"
    } & Omit<ComponentProps<"span">, "children" | "className">)

function Chip({ className, variant, count, children, ...props }: ChipProps) {
  const label =
    count !== undefined ? (
      <>
        <span
          data-slot="chip-count"
          className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-surface-olive px-1 text-sm leading-none text-emerald-500"
        >
          {count}
        </span>
        {children}
      </>
    ) : (
      children
    )

  if (variant === "prompt") {
    return (
      <button
        type="button"
        {...(props as ComponentProps<"button">)}
        className={cn(chipVariants({ variant }), className)}
        data-slot="chip"
      >
        {label}
      </button>
    )
  }

  return (
    <span
      className={cn(chipVariants({ variant }), className)}
      {...props}
      data-slot="chip"
    >
      {label}
    </span>
  )
}

export { Chip, chipVariants }
export type { ChipProps }
