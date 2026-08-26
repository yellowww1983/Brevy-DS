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
 *  14.89 in the light. The pill is a light object and now says so throughout;
 *  what a pill looks like on a dark page is a drawing nobody has made. */
const chipVariants = cva(
  "inline-flex w-fit shrink-0 items-center rounded-full bg-linear-to-b from-white to-neutral-100 whitespace-nowrap hairline",
  {
    variants: {
      variant: {
        eyebrow: "h-6 gap-1 px-2 text-sm font-normal text-emerald-500",
        /** The one shape drawn twice: pointed at, the gradient's foot steps
         *  from neutral-100 to neutral-200 and nothing else moves. Worn only
         *  here, because it is the only chip the design draws a hover for. */
        suggestion:
          "h-8 gap-2 px-3 text-sm font-normal text-zinc-800 hover:to-neutral-200",
        filter: "h-8 gap-2 px-3 text-base font-medium text-zinc-700",
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
      data-slot="chip"
      className={cn(chipVariants({ variant }), className)}
      {...props}
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
