"use client"

import { useEffect, useRef, useState } from "react"

import { heightFor } from "@/navbar"

import { FrameWindow } from "./frame-window"
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
  const width = useViewport()
  const height = heightFor(width)
  const frame = useRef<HTMLIFrameElement>(null)
  /** The width the frame was last read at. The tabs switch faster than the
   *  frame relays out, so readiness is tied to the width it was read at,
   *  which is what the suite's measured() helper waits on. */
  const [readAt, setReadAt] = useState<number | null>(null)
  const [loads, setLoads] = useState(0)

  useFrameTheme(frame, loads)

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
      data-viewport={String(width)}
      className="mt-6"
    >
      <FrameWindow width={width} height={height} className="mt-3">
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
      </FrameWindow>
    </figure>
  )
}
