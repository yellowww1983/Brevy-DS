"use client"

import { Avatar as AvatarPrimitive } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** A person, at the one size the design uses: 32 across, fully round. The file
 *  draws 363 of these and 252 of them are this size; the handful at 28, 40, 48
 *  and larger are the same circle asked to be bigger, which is a class at the
 *  call site rather than an axis nobody would reach for.
 *
 *  It wears no ring. The website file draws a white one on every avatar, but
 *  the app file draws it only where avatars overlap, which is what it is for:
 *  a separator, not a rim. `AvatarGroup` adds it back for the stack. */
function Avatar({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
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
 *  arrangement the file draws: 35 groups and every one of them at -8.
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
