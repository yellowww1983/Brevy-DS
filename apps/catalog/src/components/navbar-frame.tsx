"use client"

import { useEffect, useRef, useState } from "react"

import { heightFor, labelFor } from "@/navbar"

import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

type Reading = {
  /** The width this was read at. The tabs switch faster than the frame
   *  relaid out, and a caption carrying the previous width's numbers is a
   *  caption that has stopped describing the picture beside it. */
  width: number
  bar: number
  pill: number
  links: number
}

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
  const [reading, setReading] = useState<Reading | null>(null)
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

      setReading({
        width,
        bar: Math.round(bar.getBoundingClientRect().height),
        pill: Math.round(pill.getBoundingClientRect().width),
        /** Counted by what the frame draws rather than by what is in its
         *  markup: below the tablet width the links are still there and take up
         *  no room, and a caption saying two of them is a caption that has
         *  stopped describing the picture beside it. */
        links: [
          ...document_.querySelectorAll("nav[aria-label='Main'] a"),
        ].filter((link) => link.getBoundingClientRect().width > 0).length,
      })
    }

    read()

    const observer = new ResizeObserver(read)

    observer.observe(root)

    return () => {
      observer.disconnect()
    }
  }, [loads, width])

  const current = reading && reading.width === width ? reading : null
  const shown = current
    ? current.links === 0
      ? "an icon"
      : `${String(current.links)} links`
    : ""

  return (
    <figure
      data-measures
      data-measured={current ? "" : undefined}
      data-viewport={String(nominal)}
      className="mt-6"
    >
      <figcaption className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-sm font-medium">{labelFor(nominal)}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {width}px
        </span>
        {current ? (
          <span
            data-reading
            className="font-mono text-xs text-muted-foreground"
          >
            {`band ${String(current.bar)}px · pill ${String(current.pill)}px · ${shown}`}
          </span>
        ) : null}
      </figcaption>

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
