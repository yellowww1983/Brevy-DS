import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** The website's pill family: fully round on a white to neutral gradient, in
 *  the three shapes the design draws. An eyebrow sits over a section heading,
 *  a suggestion is a tappable line of chat, a filter names a category.
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
      },
    },
    defaultVariants: {
      variant: "eyebrow",
    },
  },
)

type ChipProps = ComponentProps<"span"> &
  VariantProps<typeof chipVariants> & {
    /** The little olive disc before an eyebrow's label, carrying a step count.
     *  Only the eyebrow is drawn with one. */
    count?: number
  }

function Chip({ className, variant, count, children, ...props }: ChipProps) {
  return (
    <span
      className={cn(chipVariants({ variant }), className)}
      {...props}
      data-slot="chip"
    >
      {count !== undefined && (
        <span
          data-slot="chip-count"
          className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-surface-olive px-1 text-sm leading-none text-emerald-500"
        >
          {count}
        </span>
      )}
      {children}
    </span>
  )
}

export { Chip, chipVariants }
export type { ChipProps }
