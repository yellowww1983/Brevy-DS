"use client"

import { useEffect, useRef, useState } from "react"

import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The block at the chosen width, in a document of its own: it paints a full
 *  width band and its gutters follow the document, so a width can only be
 *  shown by giving it one. Never scaled, the way the other block frames are
 *  never scaled; where the nominal width does not fit the column it takes the
 *  column's width, which leaves everything inside at its own size.
 *
 *  The height follows the content, because the columns stack as it narrows. */
export function FooterFrame() {
  const nominal = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const column = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  const [height, setHeight] = useState(600)
  /** The width the frame was last read at, which is what the suite's
   *  measured() helper waits on across tab switches. */
  const [readAt, setReadAt] = useState<number | null>(null)
  const [loads, setLoads] = useState(0)

  const width = room > 0 ? Math.min(nominal, room) : nominal

  useFrameTheme(frame, loads)

  useEffect(() => {
    const element = column.current

    if (!element) {
      return
    }

    const fit = () => {
      setRoom(element.clientWidth)
    }

    fit()

    const observer = new ResizeObserver(fit)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const document_ = frame.current?.contentDocument
    const root = document_?.documentElement

    if (!document_ || !root) {
      return
    }

    const read = () => {
      const intro = document_.querySelector("[data-slot='footer-about']")
      const list = document_.querySelector("[data-slot='footer-newsletter']")
      const card = document_.querySelector("[data-slot='footer-legal']")

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
      data-viewport={String(nominal)}
      className="mt-6"
    >
      <div ref={column} className="mt-3">
        <div
          style={{ width, height }}
          className="overflow-hidden rounded-xl border border-border"
        >
          <iframe
            ref={frame}
            src="/specimens/footer"
            title={`Footer at ${String(nominal)}px`}
            style={{ width, height }}
            onLoad={() => {
              setLoads((count) => count + 1)
            }}
            className="block border-0 bg-background"
          />
        </div>
      </div>
    </figure>
  )
}
