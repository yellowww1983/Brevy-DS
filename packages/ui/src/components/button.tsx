"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** An icon-only button is a square. `:only-child` alone cannot detect one, because it
 *  counts elements, and a label beside the icon is a text node, so an icon with
 *  a label would match too. The accessible name settles it: a button with
 *  nothing but an icon has to carry one, a labelled button never does.
 *
 *  Written out in full rather than composed from a shared prefix, because
 *  Tailwind scans source text and never sees a class name built by
 *  interpolation. */
const GHOST_ICON_ONLY =
  "[&[aria-label]:has(>svg:only-child)]:w-9 [&[aria-label]:has(>svg:only-child)]:border [&[aria-label]:has(>svg:only-child)]:border-surface-hover [&[aria-label]:has(>svg:only-child)]:px-0 [&[aria-label]:has(>svg:only-child)]:hover:border-transparent [&[aria-label]:has(>svg:only-child)]:active:border-transparent"

/** Outline with nothing but an icon is a fixed 48px square: the declared
 *  horizontal padding never binds because the width is fixed, leaving 12 on
 *  each side of a 24px icon. */
const OUTLINE_ICON_ONLY =
  "[&[aria-label]:has(>svg:only-child)]:w-12 [&[aria-label]:has(>svg:only-child)]:px-0"

/** The send's active stroke: the drawn 1px inside edge, painted as two
 *  background layers rather than through the `hairline` utility. The flat fill
 *  is clipped to the padding box and the gradient to the border box, so the
 *  stroke lands in the transparent border, which is the true edge of the
 *  circle rather than a pixel inside it.
 *
 *  This is a third way of drawing a thin stroke in this repo, and it is not an
 *  oversight. `hairline` has to be an overlay because the chip paints its own
 *  gradient in `background` and cannot spare the shorthand; the send's fill is
 *  flat, so the shorthand is free here. It also has to be a background rather
 *  than an overlay: an overlay paints above the element's inset shadows and
 *  would bury the drawn inner glow under the stroke, which is measurably not
 *  how the file stacks the two. */
const SEND_ACTIVE_RING =
  "data-active:[background:linear-gradient(var(--color-primary),var(--color-primary))_padding-box,linear-gradient(var(--color-emerald-600),var(--color-emerald-700))_border-box]"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center text-base font-normal whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:icon-stroke",
  {
    variants: {
      variant: {
        primary: `rounded-leaf border border-primary bg-primary text-primary-foreground hover:bg-background hover:text-primary active:bg-background active:text-primary`,
        outline: `rounded-leaf border border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground ${OUTLINE_ICON_ONLY}`,
        secondary: `rounded-leaf border border-transparent bg-surface-olive text-surface-olive-foreground hover:border-surface-olive-outline hover:bg-background hover:text-surface-olive-outline`,
        ghost: `rounded-lg text-foreground hover:bg-surface-hover active:bg-surface-active ${GHOST_ICON_ONLY}`,
        /** The chat's round send. Its geometry is the default size whole: 48
         *  square with a 24 icon, the declared padding never binding against
         *  the fixed width. What is new is only the skin, fully round on the
         *  soft olive with the drawn three-layer light, and `data-active`
         *  turns it the deep green a field with something to send shows. The
         *  active stroke and fill both arrive as background layers, for the
         *  reason written above them. The file draws no hover for it, so none
         *  is worn; disabled is the base's half opacity, which is what the
         *  file draws. */
        send: `rounded-full border border-olive-600 bg-surface-olive text-primary shadow-send data-active:border-transparent data-active:text-primary-foreground data-active:shadow-send-active ${SEND_ACTIVE_RING}`,
      },
      /** The height a button stands at, with the padding, the space beside an
       *  icon and the icon itself that go with it. `compact` is the navbar's
       *  call to action, measured off the shipped site: 36 tall, 12 of padding,
       *  6 beside a 16px icon. */
      size: {
        default: "h-12 gap-2 px-6 [&_svg:not([class*='size-'])]:size-6",
        compact: "h-9 gap-1.5 px-3 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    /** Ghost is drawn at one height only, and it is not the default one. */
    compoundVariants: [
      {
        variant: "ghost",
        size: "default",
        class: "h-9 gap-2 px-4 [&_svg:not([class*='size-'])]:size-6",
      },
      /** The send's square, stated here rather than on the variant because the
       *  size axis writes its padding later in the class list and would win. */
      {
        variant: "send",
        size: "default",
        class: "w-12 px-0",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
)

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
