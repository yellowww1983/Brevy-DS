"use client"

import { useEffect, useRef, useState } from "react"

import { FrameWindow } from "./frame-window"
import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The section at the chosen width, in a document of its own.
 *
 *  It turns at the content breakpoint in two different ways depending on the
 *  layout — the cards go from a row to a column, the panel from its own column
 *  to the second thing in one — and neither would show if the queries were
 *  answering the reader's window instead of the width on the tab.
 *
 *  Never scaled, the way every block frame is never scaled, and never shrunk
 *  to the catalog's column either: see `FrameWindow`. The height follows the
 *  content, because a step list grows with its copy. */
export function StepsFrame({
  layout,
  markers,
  tail,
  ground,
}: {
  layout?: "panel" | "app"
  markers?: "on" | "off"
  tail?: "on"
  ground?: "white"
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
    ["layout", layout],
    ["markers", markers],
    ["tail", tail],
    ["ground", ground],
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
      if (!document_.querySelector("[data-slot='steps-list']")) {
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
          src={search ? `/specimens/steps?${search}` : "/specimens/steps"}
          title={`Steps at ${String(width)}px`}
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
