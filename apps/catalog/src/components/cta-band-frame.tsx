"use client"

import { useEffect, useRef, useState } from "react"

import { FrameWindow } from "./frame-window"
import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The band at the chosen width, in a document of its own.
 *
 *  It turns at two widths at once: the mark steps from 128 to 96 and the
 *  figures go. A narrowed element on this page would leave both queries
 *  answering the reader's window rather than the width on the tab.
 *
 *  Never scaled, the way every block frame is never scaled, and never shrunk
 *  to the catalog's column either: see `FrameWindow`. The height follows the
 *  content, because the band's own height is a floor and a longer heading
 *  grows it. */
export function CtaBandFrame({
  tone,
  chip,
  figures,
  heading,
}: {
  tone?: "dark"
  chip?: "on"
  figures?: "off"
  heading?: string
}) {
  const width = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(560)
  /** The width the frame was last read at, which is what the suite's
   *  measured() helper waits on across tab switches. */
  const [readAt, setReadAt] = useState<number | null>(null)
  const [loads, setLoads] = useState(0)

  const query = new URLSearchParams()

  if (tone) {
    query.set("tone", tone)
  }

  if (chip) {
    query.set("chip", chip)
  }

  if (figures) {
    query.set("figures", figures)
  }

  if (heading) {
    query.set("heading", heading)
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
      if (!document_.querySelector("[data-slot='cta-band-card']")) {
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
          src={search ? `/specimens/cta-band?${search}` : "/specimens/cta-band"}
          title={`CtaBand at ${String(width)}px`}
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
