import type { ComponentProps } from "react"

import { cn } from "../lib/utils.js"

/** A big number with its unit beside it.
 *
 *  39 of them across the file, in three containers that agree on nothing but
 *  this: the testimonial wall's olive card sets it in emerald, the tile
 *  mosaic's dark card inverts that to olive on emerald, and the mosaic's pill
 *  drops the unit and turns the weight down. What they share is the type —
 *  60 on 60 beside 24 on 24, both at the body's own -0.9% — which is what
 *  `--text-stat` and `--text-stat-unit` carry.
 *
 *  So the figure is the component and the container is not. A card, a pill or
 *  a bare column wraps it and decides its colour; nothing here paints.
 *
 *  The unit sits on the number's own top rather than its baseline, which is
 *  what the file draws: a 21-tall box against a 60-tall one, both at the top
 *  of the row.
 *
 *  Weight is 700 everywhere. The pill is drawn at 600 and is the only one —
 *  DESIGN-FEEDBACK 87. */
function StatFigure({
  value,
  unit,
  className,
  ...props
}: Omit<ComponentProps<"p">, "children"> & {
  value: string
  /** The `%` or `+` beside the number, a step and a half down. Drawn on two
   *  of the three; the pill carries its own inside the number. */
  unit?: string
}) {
  return (
    <p
      data-slot="stat-figure"
      className={cn("flex items-start text-stat", className)}
      {...props}
    >
      {value}
      {unit ? (
        <span data-slot="stat-figure-unit" className="text-stat-unit">
          {unit}
        </span>
      ) : null}
    </p>
  )
}

export { StatFigure }
