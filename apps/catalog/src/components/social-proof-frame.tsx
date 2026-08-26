"use client"

import { useEffect, useRef, useState } from "react"

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
 *  Never scaled, the way the block frames are never scaled; where the nominal
 *  width does not fit the column the frame takes the column's width, which
 *  leaves everything inside at its own size. The height follows the content,
 *  because the row is one line wide and two lines narrow. */
export function SocialProofFrame({ faces }: { faces?: "initials" }) {
  const nominal = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const column = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  const [height, setHeight] = useState(80)
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
      data-viewport={String(nominal)}
      className="w-full"
    >
      <div ref={column}>
        <div
          style={{ width, height }}
          className="overflow-hidden rounded-xl border border-border"
        >
          <iframe
            ref={frame}
            src={
              faces
                ? `/specimens/social-proof?faces=${faces}`
                : "/specimens/social-proof"
            }
            title={`Social proof at ${String(nominal)}px`}
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
