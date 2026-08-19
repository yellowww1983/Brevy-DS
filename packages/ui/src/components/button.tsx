"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

const LEAF = "rounded-tl-sm rounded-tr-2xl rounded-br-sm rounded-bl-2xl"

/** An icon-only button is a square. `:only-child` alone cannot detect one — it
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

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 text-base font-normal whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:icon-stroke [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        primary: `${LEAF} h-12 border border-primary bg-primary px-6 text-primary-foreground hover:bg-background hover:text-primary active:bg-background active:text-primary`,
        outline: `${LEAF} h-12 border border-primary bg-background px-6 text-primary hover:bg-primary hover:text-primary-foreground ${OUTLINE_ICON_ONLY}`,
        secondary: `${LEAF} h-12 border border-transparent bg-surface-olive px-6 text-surface-olive-foreground hover:border-surface-olive-outline hover:bg-background hover:text-surface-olive-outline`,
        ghost: `h-9 rounded-lg px-4 text-foreground hover:bg-surface-hover active:bg-surface-active ${GHOST_ICON_ONLY}`,
      },
    },
    defaultVariants: {
      variant: "primary",
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
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
