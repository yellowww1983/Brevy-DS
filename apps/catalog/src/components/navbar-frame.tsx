"use client"

import { useEffect, useRef, useState } from "react"

import { heightFor } from "@/navbar"

import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The block is a page header, so it only means anything at the top of a page.
 *  The frame is a document of its own at the chosen width, tall enough to read
 *  as a screen rather than a strip, and the numbers beside it are read back out
 *  of it rather than written down.
 *
 *  It is live. Opening the menu in it is the menu, not a picture of one, which
 *  is why the mobile frame is a phone's height: the menu covers the screen, and
 *  a frame shorter than a screen would cut it off. */
export function NavbarFrame() {
  const nominal = useViewport()
  const height = heightFor(nominal)
  const frame = useRef<HTMLIFrameElement>(null)
  const column = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  /** The width the frame was last read at. The tabs switch faster than the
   *  frame relays out, so readiness is tied to the width it was read at,
   *  which is what the suite's measured() helper waits on. */
  const [readAt, setReadAt] = useState<number | null>(null)
  const [loads, setLoads] = useState(0)

  /** Never wider than the column it sits in, and never scaled. A desktop bar
   *  shown at three quarters is a bar nobody can judge, and one that runs off
   *  the side has to be dragged into view to be read at all. Narrowing the
   *  screen leaves everything in it at its own size, which is what matters:
   *  the pill is 794 whether the screen around it is 1440 or 1040. */
  const width = room > 0 ? Math.min(nominal, room) : nominal

  useFrameTheme(frame, loads)

  useEffect(() => {
    const element = column.current

    if (!element) {
      return
    }

    const fit = () => {
      setRoom(element.clientWidth)
    }

    fit()

    const observer = new ResizeObserver(fit)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const document_ = frame.current?.contentDocument
    const root = document_?.documentElement

    if (!document_ || !root) {
      return
    }

    const read = () => {
      const bar = document_.querySelector("[data-slot='navbar']")
      const pill = document_.querySelector("[data-slot='navbar-pill']")

      if (!bar || !pill) {
        return
      }

      setReadAt(width)
    }

    read()

    const observer = new ResizeObserver(read)

    observer.observe(root)

    return () => {
      observer.disconnect()
    }
  }, [loads, width])

  return (
    <figure
      data-measures
      data-measured={readAt === width ? "" : undefined}
      data-viewport={String(nominal)}
      className="mt-6"
    >
      <div ref={column} className="mt-3">
        <div
          style={{ width, height }}
          className="overflow-hidden rounded-xl border border-border"
        >
          <iframe
            ref={frame}
            src="/specimens/navbar"
            title={`Navbar at ${String(width)}px`}
            style={{ width, height }}
            onLoad={() => {
              setLoads((count) => count + 1)
            }}
            className="block border-0 bg-background"
          />
        </div>
      </div>
    </figure>
  )
}
