import { cn } from "@brevy/ui"
import type { ReactNode } from "react"

/** The window a block frame shows its document through, at the width the tab
 *  names and never less.
 *
 *  Every one of these frames refuses to scale: a block is shown at a width by
 *  being given one, because the queries inside it ask the document how wide it
 *  is and a narrowed element on this page would leave them answering the
 *  reader's window instead. That much was always the rule. What each frame did
 *  when the tab was wider than the catalog's column was shrink to the column —
 *  which is the same mistake in slower motion. The catalog's column is 1056
 *  and the tabs name 1440, so the Desktop tab rendered a 1056 document and
 *  called it Desktop, and a block whose layout turns anywhere above 1056 never
 *  showed its wide form there at all. The FAQ's two columns arrive at the
 *  content breakpoint, 1200; they had not been visible in the catalog since
 *  the day the block was built.
 *
 *  So the window keeps the width and the column scrolls under it. A reader who
 *  wants the right edge of a 1440 document drags to it, which is a smaller
 *  lie than being shown 1056 and told it is 1440.
 *
 *  It is one component rather than the same six lines in each frame, because
 *  the next frame should inherit the decision instead of rediscovering it. */
export function FrameWindow({
  width,
  height,
  className,
  children,
}: {
  width: number
  height: number
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div
        style={{ width, height }}
        className="overflow-hidden rounded-xl border border-border"
      >
        {children}
      </div>
    </div>
  )
}
