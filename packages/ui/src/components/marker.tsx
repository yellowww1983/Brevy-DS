import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** The soft disc the system puts a number or a mark inside.
 *
 *  Three consumers and one construction: the step list's numbered badge, the
 *  numbered badge on a benefit card's illustration, and the mark beside a line
 *  in an icon list. Every one of them is a gradient ground under a 1px
 *  gradient edge with `shadow-xs`, which is a padding ring rather than a
 *  border because a border cannot hold a gradient.
 *
 *  The file does not agree with itself about the fill. The step badge and the
 *  icon list's disc run olive-100 to olive-300 under olive-300 to olive-600
 *  with their contents in brand-500; the benefit card's badge is drawn white
 *  to olive-100 under a neutral edge with a near-black numeral (`20919:10733`).
 *  One disc, two paints, and the second appears once — so the system ships the
 *  first everywhere. DESIGN-FEEDBACK 79.
 *
 *  Two sizes, both drawn: 24 beside a 14/20 line and 36 in a step or a card.
 *  The 40 the benefit card's artwork uses is not a third — it is a number
 *  painted into a mock rather than a size the system offers. */
const markerVariants = cva("inline-flex shrink-0 rounded-full p-px shadow-xs", {
  variants: {
    tone: {
      olive: "bg-linear-to-b from-olive-300 to-olive-600",
      /** Drawn once, on the list of what goes wrong without the product. */
      red: "bg-linear-to-b from-red-200 to-red-300",
    },
    size: {
      sm: "size-6",
      lg: "size-9",
    },
  },
  defaultVariants: { tone: "olive", size: "lg" },
})

const faceVariants = cva(
  "flex size-full items-center justify-center rounded-full [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:icon-stroke",
  {
    variants: {
      tone: {
        olive: "bg-linear-to-b from-olive-100 to-olive-300 text-brand-500",
        red: "bg-linear-to-b from-red-50 to-red-200 text-red-500",
      },
      size: {
        sm: "text-caption font-semibold",
        lg: "text-body-lg font-semibold",
      },
    },
    defaultVariants: { tone: "olive", size: "lg" },
  },
)

type MarkerProps = ComponentProps<"span"> & VariantProps<typeof markerVariants>

/** A number or a mark in a soft disc. What goes in is a child rather than a
 *  prop, because the three drawn contents — a step's number, a benefit's
 *  number, a check — have nothing in common but the room they sit in. */
function Marker({ className, tone, size, children, ...props }: MarkerProps) {
  return (
    <span
      data-slot="marker"
      className={cn(markerVariants({ tone, size }), className)}
      {...props}
    >
      <span data-slot="marker-face" className={faceVariants({ tone, size })}>
        {children}
      </span>
    </span>
  )
}

export { Marker, markerVariants }
export type { MarkerProps }
