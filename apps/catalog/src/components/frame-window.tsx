"use client"

import { cn } from "@brevy/ui"
import { useEffect, useRef, useState, type ReactNode } from "react"

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
 *  the next frame should inherit the decision instead of rediscovering it. And
 *  because being one component is what let the snapping below be written once
 *  for eighteen frames rather than eighteen times. */
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
  const outer = useRef<HTMLDivElement>(null)
  /** How far up the inner box is nudged to land on a whole pixel. */
  const [lift, setLift] = useState(0)

  /** The frames were arriving on a half pixel, and everything drawn inside
   *  them arrived there with them.
   *
   *  Nothing here causes it: the prose above a frame is a few lines whose
   *  heights do not add up to a round number — measured, 249.75 — so the
   *  figure starts at 361.75 and the document inside starts at 362.75. A 16px
   *  social icon in the footer then landed on 614.75, which on a 2x screen is
   *  half a device pixel, and a sharp vector drawn across two rows of pixels
   *  is a blurred one. It reads worst on the footer because four 16px icons
   *  sit in a row there, but it was every frame on every block page.
   *
   *  Measured on the outer box and applied to the inner one, which is what
   *  keeps this from chasing itself: the element being read is never the
   *  element being moved, so a correction cannot change its own input.
   *
   *  A transform rather than a margin because a margin is layout — it would
   *  pull everything below the frame up by the same fraction and move the
   *  problem rather than solve it. The transform is vertical only, so the
   *  horizontal scroll this window exists to provide is untouched.
   *
   *  Re-read when the body reflows as well as when the frame resizes: the
   *  fraction comes from the prose above, which this element's own size knows
   *  nothing about. */
  useEffect(() => {
    const element = outer.current

    if (!element) {
      return
    }

    const snap = () => {
      const top = element.getBoundingClientRect().top + window.scrollY

      setLift(top - Math.floor(top))
    }

    snap()

    const observer = new ResizeObserver(snap)

    observer.observe(element)
    observer.observe(document.body)

    return () => {
      observer.disconnect()
    }
  }, [width, height])

  return (
    <div ref={outer} className={cn("overflow-x-auto", className)}>
      <div
        style={{
          width,
          height,
          transform: lift ? `translateY(${String(-lift)}px)` : undefined,
        }}
        className="overflow-hidden rounded-xl border border-border"
      >
        {children}
      </div>
    </div>
  )
}
