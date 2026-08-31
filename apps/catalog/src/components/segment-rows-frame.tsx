"use client"

import { useEffect, useRef, useState } from "react"

import { FrameWindow } from "./frame-window"
import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The section at the chosen width, in a document of its own.
 *
 *  It turns at two widths — the index leaves at the content breakpoint and the
 *  card folds its two columns into one at the tablet — and neither would show
 *  if the queries were answering the reader's window instead of the width on
 *  the tab.
 *
 *  Never scaled and never shrunk to the catalog's column: see `FrameWindow`.
 *  The height follows the content, because the copy beside a fixed white card
 *  is what grows a segment. */
export function SegmentRowsFrame({
  fourth,
  active,
}: {
  fourth?: "on"
  active?: number
}) {
  const width = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(800)
  /** The width the frame was last read at, which is what the suite's
   *  measured() helper waits on across tab switches. */
  const [readAt, setReadAt] = useState<number | null>(null)
  const [loads, setLoads] = useState(0)

  const query = new URLSearchParams()

  for (const [key, value] of [
    ["fourth", fourth],
    ["active", active === undefined ? undefined : String(active)],
  ] as const) {
    if (value) {
      query.set(key, value)
    }
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
      if (!document_.querySelector("[data-slot='segment-rows-list']")) {
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
              ? `/specimens/segment-rows?${search}`
              : "/specimens/segment-rows"
          }
          title={`The segment rows at ${String(width)}px`}
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
