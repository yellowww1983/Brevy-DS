import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** The website's pill family: fully round on a white to neutral gradient, in
 *  the three shapes the design draws. An eyebrow sits over a section heading,
 *  a suggestion is a tappable line of chat, a filter names a category.
 *
 *  The gradient is written in ramp colours rather than tokens because the
 *  design draws it the same on every page and never in dark mode. */
const chipVariants = cva(
  "inline-flex w-fit shrink-0 items-center rounded-full bg-linear-to-b from-white to-neutral-100 whitespace-nowrap shadow-chip",
  {
    variants: {
      variant: {
        eyebrow: "h-6 gap-1 px-2 text-sm font-normal text-primary",
        suggestion: "h-8 gap-2 px-3 text-sm font-normal text-foreground",
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
          className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-surface-olive px-1 text-sm leading-none text-primary"
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
