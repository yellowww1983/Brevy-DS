"use client"

import { useEffect, useRef, useState } from "react"

import { FrameWindow } from "./frame-window"
import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The hero at the chosen width, in a document of its own.
 *
 *  The block paints a full width band and carries breakpoints inside it — the
 *  copy column, the heading and the suggestions all turn at a width — so a
 *  narrowed element on this page would leave every query answering the
 *  reader's window and none of the turns would show.
 *
 *  Never scaled, the way the other block frames are never scaled; where the width the tab names does not fit the
 *  catalog's column, the column scrolls: see `FrameWindow`. The height follows the
 *  content, because the hero is 670 tall and 757 narrow and grows past both if
 *  the copy asks for it. */
export function HeroCenteredFrame({
  action,
  image,
}: {
  action?: "button"
  image?: "off"
}) {
  const width = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(670)
  /** The width the frame was last read at, which is what the suite's
   *  measured() helper waits on across tab switches. */
  const [readAt, setReadAt] = useState<number | null>(null)
  const [loads, setLoads] = useState(0)

  const query = new URLSearchParams()

  if (action) {
    query.set("action", action)
  }

  if (image) {
    query.set("image", image)
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
      if (!document_.querySelector("[data-slot='hero-centered']")) {
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
              ? `/specimens/hero-centered?${search}`
              : "/specimens/hero-centered"
          }
          title={`HeroCentered at ${String(width)}px`}
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
