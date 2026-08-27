"use client"

import { useEffect, useRef, useState } from "react"

import { useFrameTheme } from "./frame-theme"
import { useViewport } from "./viewport-frame"

/** The hero at the chosen width, in a document of its own.
 *
 *  The block turns at a width in three places at once: the row becomes a
 *  column, the picture goes, and the card stops floating and becomes a band.
 *  A narrowed element on this page would leave every query answering the
 *  reader's window and none of those would show.
 *
 *  Never scaled, the way the other block frames are never scaled. Where the
 *  nominal width does not fit the catalog's column this one keeps it anyway
 *  and lets the column scroll, for the reason written above `width`. The
 *  height follows the content. */
export function HeroSplitFrame({
  image,
  card,
}: {
  image?: "off"
  card?: "off"
}) {
  const nominal = useViewport()
  const frame = useRef<HTMLIFrameElement>(null)
  const column = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(670)
  /** The width the frame was last read at, which is what the suite's
   *  measured() helper waits on across tab switches. */
  const [readAt, setReadAt] = useState<number | null>(null)
  const [loads, setLoads] = useState(0)

  /** The other block frames shrink to the column when the tab is wider than
   *  it. This one cannot: the catalog's column is 1056 and the row needs
   *  1200, so shrinking would show the stacked form under every tab and the
   *  split — the whole block — would never appear. It keeps the tab's width
   *  and the column scrolls, which is the same refusal to scale the others
   *  make, answered the other way. */
  const width = nominal

  const query = new URLSearchParams()

  if (image) {
    query.set("image", image)
  }

  if (card) {
    query.set("card", card)
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
      if (!document_.querySelector("[data-slot='hero-split']")) {
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
      className="mt-8 w-full"
    >
      <div ref={column} className="overflow-x-auto">
        <div
          style={{ width, height }}
          className="overflow-hidden rounded-xl border border-border"
        >
          <iframe
            ref={frame}
            src={
              search
                ? `/specimens/hero-split?${search}`
                : "/specimens/hero-split"
            }
            title={`HeroSplit at ${String(nominal)}px`}
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
