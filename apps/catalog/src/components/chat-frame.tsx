"use client"

import { useEffect, useRef, useState } from "react"

import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The card at the chosen width, in a document of its own. The card carries no
 *  breakpoints, so a frame is not what makes it lay out; it is what makes the
 *  width honest. Inside the frame the container resolves the gutters the
 *  document is owed and the card takes the hero's 794 or the column, whichever
 *  is smaller, so the drawn 794, 762 and 358 are measured here rather than
 *  written down.
 *
 *  Never scaled, the way the block frames are never scaled: where the nominal
 *  width does not fit the column the frame takes the column's width, which
 *  leaves everything inside at its own size.
 *
 *  The height follows the content, because typing into it grows the field. */
export function ChatFrame({ state }: { state?: "ready" }) {
  const nominal = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const column = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  const [height, setHeight] = useState(160)
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
      if (!document_.querySelector("[data-slot='chat']")) {
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
            src={state ? `/specimens/chat?state=${state}` : "/specimens/chat"}
            title={`Chat at ${String(nominal)}px`}
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
