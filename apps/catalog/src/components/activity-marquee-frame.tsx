"use client"

import { useEffect, useRef, useState } from "react"

import { FrameWindow } from "./frame-window"
import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The rows at the chosen width, in a document of its own.
 *
 *  The rows stop widening at 1408 and run edge to edge below it, and that
 *  would not show if the page answered the reader's window rather than the
 *  width on the tab.
 *
 *  Never scaled and never shrunk to the catalog's column: see `FrameWindow`.
 *  The height follows the content. */
export function ActivityMarqueeFrame({ variant }: { variant?: "chips" }) {
  const width = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(400)
  /** The width the frame was last read at, which is what the suite's
   *  measured() helper waits on across tab switches. */
  const [readAt, setReadAt] = useState<number | null>(null)
  const [loads, setLoads] = useState(0)

  const query = new URLSearchParams()

  if (variant) {
    query.set("variant", variant)
  }

  const search = query.toString()

  useFrameTheme(frame, loads)

  useEffect(() => {
    const document_ = frame.current?.contentDocument
    const root = document_?.documentElement

    if (!document_ || !root) {
      return
    }

    const read = () => {
      if (!document_.querySelector("[data-slot='activity-marquee-track']")) {
        return
      }

      setReadAt(width)
      setHeight(Math.ceil(document_.body.getBoundingClientRect().height))
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
      className="mt-8 w-full"
    >
      <FrameWindow width={width} height={height}>
        <iframe
          ref={frame}
          src={
            search
              ? `/specimens/activity-marquee?${search}`
              : "/specimens/activity-marquee"
          }
          title={`The activity marquee at ${String(width)}px`}
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
