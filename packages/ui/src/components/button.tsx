"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

const LEAF = "rounded-tl-sm rounded-tr-2xl rounded-br-sm rounded-bl-2xl"

/** Ghost carrying nothing but an icon is drawn as a square with a resting
 *  outline; with a label it hugs the text and has no outline in any state, so
 *  the border cannot live in the base class without widening it by 2px. */
const GHOST_ICON_ONLY =
  "has-[>svg:only-child]:w-9 has-[>svg:only-child]:border has-[>svg:only-child]:border-surface-hover has-[>svg:only-child]:px-0 has-[>svg:only-child]:hover:border-transparent has-[>svg:only-child]:active:border-transparent"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 text-base font-normal whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:icon-stroke [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        primary: `${LEAF} h-12 border border-primary bg-primary px-6 text-primary-foreground hover:bg-background hover:text-primary active:bg-background active:text-primary`,
        outline: `${LEAF} h-12 border border-primary bg-background px-6 text-primary hover:bg-primary hover:text-primary-foreground`,
        secondary: `${LEAF} h-12 bg-surface-olive px-6 text-surface-olive-foreground hover:bg-background`,
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
