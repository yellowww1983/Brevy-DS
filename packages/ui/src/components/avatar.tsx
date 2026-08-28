"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Avatar as AvatarPrimitive } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** A person, round, at one of two sizes.
 *
 *  Counted across the website file: 363 avatars, of which 252 are 32 across
 *  and 39 are 40. The 40s are not scattered — every one of them is the author
 *  of a testimonial, which makes the second size a place rather than an
 *  accident, and a place is what an axis is for. The remainder (28, 44, 48,
 *  60, 90) stay a class at the call site until one of them turns out to have
 *  a home of its own too.
 *
 *  The fallback's type does not move with the circle. The file draws no 40
 *  with initials in it — every one carries a photograph — so a second type
 *  step here would be invented rather than measured. */
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "size-8",
        md: "size-10",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
)

/** It wears no ring. The website file draws a white one on every avatar, but
 *  the app file draws it only where avatars overlap, which is what it is for:
 *  a separator, not a rim. `AvatarGroup` adds it back for the stack. */
function Avatar({
  className,
  size,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  )
}

/** Shown when the image does not arrive, which is Radix's own doing rather
 *  than a state anything here switches on.
 *
 *  The colours come from the app file, which localised this corner of shadcn
 *  where the website file left the library's own Geist and neutral-100 in
 *  place: a beige face with the page's text colour on it, which is `--muted`
 *  and `--foreground` to the value in both themes — beige-500 on zinc-800 in
 *  the light, neutral-800 on neutral-50 in the dark. */
function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-foreground",
        className,
      )}
      {...props}
    />
  )
}

/** Overlapping avatars, 8 of each covered by the next, which is the one
 *  arrangement the file draws: 35 groups and every one of them at -8. Drawn
 *  only at 32, and the overlap is a fixed 8 rather than a quarter of the
 *  circle, so it holds at either size.
 *
 *  The ring belongs here rather than to the avatar, and it is the colour of
 *  the ground rather than white. The app file draws it white on a white page
 *  and `#0a0a0a` on a dark one (`17378:86756`), which is `--background` in
 *  both: a separator works by being the gap, not by being pale. It is a ring
 *  rather than a border so it takes no space, matching the drawn stroke that
 *  sits outside the edge. */
function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex items-center -space-x-2 [&_[data-slot=avatar]]:ring-2 [&_[data-slot=avatar]]:ring-background",
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarGroup, AvatarImage }
