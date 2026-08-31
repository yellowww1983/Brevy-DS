"use client"

import { useEffect, useRef, useState } from "react"

import { FrameWindow } from "./frame-window"
import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The section at the chosen width, in a document of its own.
 *
 *  It turns at the content breakpoint — three columns become one — and that
 *  would not show if the query were answering the reader's window instead of
 *  the width on the tab.
 *
 *  Never scaled and never shrunk to the catalog's column: see `FrameWindow`.
 *  The height follows the content, because the copy under a fixed illustration
 *  is what grows the cards. */
export function CardGridFrame({
  background,
  options,
  cards,
}: {
  background?: "beige" | "white"
  options?: "on"
  cards?: number
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
    ["background", background],
    ["options", options],
    ["cards", cards === undefined ? undefined : String(cards)],
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
      if (!document_.querySelector("[data-slot='card-grid-list']")) {
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
            search ? `/specimens/card-grid?${search}` : "/specimens/card-grid"
          }
          title={`The card grid at ${String(width)}px`}
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
