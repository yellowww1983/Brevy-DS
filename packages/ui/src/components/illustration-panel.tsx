import type { ComponentProps, ReactNode } from "react"

import { cn } from "../lib/utils.js"

/** The soft green frame the product's artwork sits in.
 *
 *  One object, 44 nodes, two blocks: the step cards on the Caregiving page and
 *  the benefit cards on all four Home pages. Every one of them is the same
 *  construction to the value — 290 tall, a 16 radius, an olive-300 to white
 *  ground under a 1px olive-200 to neutral-100 edge — at the three widths the
 *  column gives it (341 across, 714 at the tablet, 310 at the mobile). It was
 *  written inside Steps first; the second block asking for it is what makes it
 *  a component.
 *
 *  Height is fixed rather than grown. The file never varies it: a card that
 *  needs more room takes it in the copy underneath, which is what puts the
 *  drawn cards at 454 and 482 in the same row.
 *
 *  The edge is a padding ring over a gradient rather than a border, because a
 *  border cannot hold a gradient — the same construction the step marker and
 *  the icon list's disc use.
 *
 *  What goes inside is a preset layer, the way the testimonial photographs and
 *  the CTA band's figures are: the file hand-places a mock of the product in
 *  every one of the 44, and those are Brevy's own compositions rather than a
 *  shape the system can name. */
function IllustrationPanel({
  className,
  marker,
  children,
  ...props
}: ComponentProps<"div"> & {
  /** A badge in the corner, inset 8. Only the step cards draw one; the
   *  benefit cards paint theirs into the artwork instead. */
  marker?: ReactNode
}) {
  return (
    <div
      data-slot="illustration-panel"
      className={cn(
        "h-(--illustration-panel) rounded-2xl bg-linear-to-b from-olive-200 to-neutral-100 p-px",
        className,
      )}
      {...props}
    >
      {/* Centred both ways. Artwork drawn to the panel's own size fills it
          and centring changes nothing; artwork that is a composition rather
          than a picture sits in the middle instead of against the corner. */}
      <div className="relative flex size-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-b from-olive-300 to-white">
        {marker ? (
          <div className="absolute top-2 left-2 z-10">{marker}</div>
        ) : null}

        {children}
      </div>
    </div>
  )
}

export { IllustrationPanel }
