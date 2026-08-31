"use client"

import { useEffect, useRef, useState } from "react"

import { FrameWindow } from "./frame-window"
import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The screen at the chosen width, in a document of its own.
 *
 *  It turns at the content breakpoint — the photograph arrives and the copy
 *  moves to its half — and that would not show if the query were answering
 *  the reader's window instead of the width on the tab.
 *
 *  Never scaled, the way every block frame is never scaled, and never shrunk
 *  to the catalog's column either: see `FrameWindow`. The height follows the
 *  content, because the screen's drawn heights are floors and a longer form
 *  grows it. */
export function AuthFrame({ photograph }: { photograph?: "off" }) {
  const width = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(960)
  /** The width the frame was last read at, which is what the suite's
   *  measured() helper waits on across tab switches. */
  const [readAt, setReadAt] = useState<number | null>(null)
  const [loads, setLoads] = useState(0)

  const search = photograph ? `?photograph=${photograph}` : ""

  useFrameTheme(frame, loads)

  useEffect(() => {
    const document_ = frame.current?.contentDocument
    const root = document_?.documentElement

    if (!document_ || !root) {
      return
    }

    const read = () => {
      if (!document_.querySelector("[data-slot='auth-split']")) {
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
          src={`/specimens/auth${search}`}
          title={`The auth screen at ${String(width)}px`}
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
