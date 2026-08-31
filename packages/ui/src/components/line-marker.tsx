import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** The highlighter swipe under a word in a heading.
 *
 *  24 of them across five pages — home, caregiving, organizations, the partner
 *  page and the app page — and every one is the same drawing: 1016 commands,
 *  identical once normalised, at seven widths between 65 and 365. So it is one
 *  path stretched to whatever it sits under rather than a vector drawn per
 *  occurrence, which is what lets the width come from the word instead of from
 *  a number somebody typed.
 *
 *  It wraps the words it marks rather than being placed beside them. The file
 *  positions each stroke by hand behind its heading; here the stroke is a
 *  layer of the text's own box, so it cannot drift when the copy changes.
 *
 *  10 tall, dropped 3 past the foot of the line, which is where the file puts
 *  it: a 10 stroke at 41 in a 48 line.
 *
 *  yellow-500 in both themes. It is a saturated accent rather than a tint —
 *  the thing a highlighter is — so it holds on a dark page the way the leaf
 *  button and the step marker's olive do. */
function LineMarker({ className, children, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="line-marker"
      className={cn("relative isolate inline-block", className)}
      {...props}
    >
      <span
        data-slot="line-marker-stroke"
        aria-hidden
        className="absolute inset-x-0 -bottom-(--line-marker-drop) -z-10 h-2.5 bg-yellow-500 mask-brevy-highlight"
      />

      {children}
    </span>
  )
}

export { LineMarker }
