"use client"

import { useEffect, useRef, useState } from "react"

import { FrameWindow } from "./frame-window"
import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The strip at the chosen width, in a document of its own.
 *
 *  A document is the only place this block can be shown. What it does is take
 *  48px off the top of a page and move a fixed bar down with it, and neither
 *  of those means anything inside the catalog's own column.
 *
 *  The width matters as much as the document: the sentence loses its prefix
 *  below 640, which is a thing the tabs can show and a screenshot cannot. */
export function BannerFrame({ banner = true }: { banner?: boolean }) {
  const width = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(320)
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
      if (!document_.querySelector("[data-slot='navbar']")) {
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
      data-banner={banner ? "" : undefined}
      className="mt-6"
    >
      <FrameWindow width={width} height={height} className="mt-3">
        <iframe
          ref={frame}
          src={banner ? "/specimens/banner" : "/specimens/banner?banner=off"}
          title={`${banner ? "A page with a banner" : "The same page without one"} at ${String(width)}px`}
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
