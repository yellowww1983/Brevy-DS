"use client"

import { Label as LabelPrimitive } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** The word over a field: Rethink Sans Medium at 14, set solid, in the page's
 *  text colour. That is what the app's auth screens draw (`20786:176842`,
 *  `Password` at 14/100% in zinc-800) and it is what shadcn shipped, letter
 *  for letter — the one corner of the library the file localised by agreeing
 *  with it. `leading-none` is the drawn 100%; the colour is inherited, which
 *  is `--foreground` and lands on the drawn zinc-800 in the light.
 *
 *  The disabled fades follow a `group` or a `peer` rather than a prop,
 *  because a label is never disabled alone — the field beside it is, and the
 *  label follows it. */
function Label({
  className,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
