"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** The website's badge: 24 tall on a radius of 8, its label at 14 SemiBold,
 *  with room for a 16px icon before it. Three skins are drawn and they are
 *  all there is; the app file's destructive and verified variants appear
 *  nowhere on the website and are gone. */
const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent px-2 text-sm font-semibold whitespace-nowrap outline-none focus-visible:border-ring/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        outline: "border-border bg-background text-foreground",
        olive: "bg-surface-olive text-brand-500",
        beige: "bg-secondary text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
)

type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
  }

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }
