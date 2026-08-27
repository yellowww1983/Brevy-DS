"use client"

import { useEffect, useRef, useState } from "react"

import { FrameWindow } from "./frame-window"
import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The row at the chosen width, in a document of its own.
 *
 *  Unlike the chat's frame, this one is not about honest width for its own
 *  sake: the row carries a breakpoint, and a breakpoint asks the document how
 *  wide it is. Narrowing an ordinary element on this page would leave the query
 *  answering the reader's window, so the row would keep its wide form at every
 *  tab and the mobile break would never show.
 *
 *  Never scaled, the way every block frame is never scaled, and never
 *  shrunk to the catalog's column either: see `FrameWindow`. The height follows the content,
 *  because the row is one line wide and two lines narrow. */
/** The two axes as a query string, empty where both are the default. */
function query(faces?: string, layout?: string) {
  const parts = [
    ...(faces ? [`faces=${faces}`] : []),
    ...(layout ? [`layout=${layout}`] : []),
  ]

  return parts.length > 0 ? `?${parts.join("&")}` : ""
}

export function SocialProofFrame({
  faces,
  layout,
}: {
  faces?: "initials"
  layout?: "stacked"
}) {
  const width = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(80)
  /** The width the frame was last read at, which is what the suite's
   *  measured() helper waits on across tab switches. */
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
      if (!document_.querySelector("[data-slot='social-proof']")) {
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
      className="w-full"
    >
      <FrameWindow width={width} height={height}>
        <iframe
          ref={frame}
          src={`/specimens/social-proof${query(faces, layout)}`}
          title={`Social proof at ${String(width)}px`}
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
