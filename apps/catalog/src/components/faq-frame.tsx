"use client"

import { useEffect, useRef, useState } from "react"

import { FrameWindow } from "./frame-window"
import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The block at the chosen width, in a document of its own: it paints a full
 *  width band and its gutters follow the document, so a width can only be
 *  shown by giving it one. Never scaled, the way the navbar's frame is never
 *  Never scaled, the way every block frame is never scaled, and never
 *  shrunk to the catalog's column either: see `FrameWindow`.
 *
 *  The height follows the content, because opening a question grows it. */
export function FaqFrame() {
  const width = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(600)
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
      const intro = document_.querySelector("[data-slot='faq-intro']")
      const list = document_.querySelector("[data-slot='faq-list']")
      const card = document_.querySelector("[data-slot='faq-contact']")

      if (!intro || !list || !card) {
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
      className="mt-6"
    >
      <FrameWindow width={width} height={height} className="mt-3">
        <iframe
          ref={frame}
          src="/specimens/faq"
          title={`FAQ at ${String(width)}px`}
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
