import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** The content column. A block paints its background across the full width and
 *  puts everything readable inside one of these, which is what keeps the left
 *  edge of the text in the same place from one block to the next.
 *
 *  It carries no padding, so what it measures is the column itself. Anything a
 *  card needs inside is the card's own business. */
function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("container-content", className)}
      {...props}
      data-slot="container"
    />
  )
}

export { Container }
