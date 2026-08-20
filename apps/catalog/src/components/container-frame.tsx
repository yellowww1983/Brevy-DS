"use client"

import { useEffect, useRef, useState } from "react"

import { useFrameTheme } from "./frame-theme"

type Reading = {
  content: number
  gutter: number
  maxWidth: string
  padding: number
  /** The column's own height inside the frame. Drawn out here rather than in
   *  there, so it has to be carried out with the rest of the reading. */
  height: number
}

/** How tall a frame stands on the page, in the catalog's own pixels. The frame
 *  is given this divided by however much it had to shrink, so all three end up
 *  the same height however differently they are scaled. Nothing about the
 *  container's height is being shown here, only its width, so one figure serves
 *  all three. */
const BOX = 140

/** The gutter changes with the width of the document, so a container shown at
 *  one width says nothing about the other two. Each width gets a frame of its
 *  own, which is a document of its own, and the numbers are read back out of it
 *  rather than written down beside it.
 *
 *  The frame is scaled to fit the column it sits in. A transform does not change
 *  layout, so the geometry measured inside is still the geometry at that width.
 *  Only the picture is smaller. */
export function ContainerFrame({
  label,
  width,
}: {
  label: string
  width: number
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const column = useRef<HTMLDivElement>(null)
  const [reading, setReading] = useState<Reading | null>(null)
  const [scale, setScale] = useState(1)
  const [loads, setLoads] = useState(0)

  useFrameTheme(frame, loads)

  useEffect(() => {
    const document_ = frame.current?.contentDocument
    const view = frame.current?.contentWindow
    /** Reached for rather than assumed: a frame partway through a navigation
     *  has a document with no root in it yet, and observing that throws here in
     *  the body of an effect, which takes the whole page down. */
    const root = document_?.documentElement

    if (!document_ || !view || !root) {
      return
    }

    const read = () => {
      const element = document_.querySelector("[data-container]")
      const band = document_.querySelector("[data-bleed]")

      if (!element || !band) {
        return
      }

      const box = element.getBoundingClientRect()
      const style = view.getComputedStyle(element)

      setReading({
        content: Math.round(box.width),
        gutter: Math.round(box.left - band.getBoundingClientRect().left),
        maxWidth: style.maxWidth,
        padding: parseFloat(style.paddingLeft),
        height: box.height,
      })
    }

    read()

    const observer = new ResizeObserver(read)

    observer.observe(root)

    return () => {
      observer.disconnect()
    }
  }, [loads])

  useEffect(() => {
    const element = column.current

    if (!element) {
      return
    }

    const fit = () => {
      const room = element.clientWidth

      /** A column with no width yet would scale everything to nothing and take
       *  the frame's height to infinity along with it. */
      if (room > 0) {
        setScale(Math.min(1, room / width))
      }
    }

    fit()

    const observer = new ResizeObserver(fit)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [width])

  return (
    <figure
      data-measures
      data-measured={reading ? "" : undefined}
      data-viewport={String(width)}
      className="mt-8"
    >
      <figcaption className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {width}px
        </span>
        {reading ? (
          <span
            data-reading
            className="font-mono text-xs text-muted-foreground"
          >
            {`content ${String(reading.content)}px · gutter ${String(reading.gutter)}px · max-width ${reading.maxWidth} · padding ${String(reading.padding)}px`}
          </span>
        ) : null}
      </figcaption>

      {/* The room to fit into is measured on a full width element, and the box
          around the frame is then drawn to the frame's own scaled width. Left
          full width it would stand a 390px frame in a 766px box and read as a
          broken layout rather than a narrow screen. */}
      <div ref={column} className="mt-3">
        <div
          style={{ width: width * scale, height: BOX }}
          className="relative overflow-hidden rounded-xl border border-border"
        >
          <iframe
            ref={frame}
            src="/specimens/container"
            title={`Container at ${String(width)}px`}
            style={{
              width,
              height: BOX / scale,
              transform: `scale(${String(scale)})`,
              transformOrigin: "top left",
            }}
            onLoad={() => {
              setLoads((count) => count + 1)
            }}
            className="block border-0 bg-card"
          />

          {/* The column is outlined out here, where nothing is scaled, so its
              hairline, its dashes and its corners are the catalog's own and
              come out the same on all three frames. Its size is the size that
              was measured inside, so this draws what is there rather than what
              it ought to be. Centred without arithmetic: the column is centred
              in the band and the band fills the frame. */}
          {reading ? (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div
                style={{
                  width: reading.content * scale,
                  height: reading.height * scale,
                }}
                className="grid place-items-center rounded-lg border border-dashed border-brand-500/40 bg-background"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  Container
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </figure>
  )
}
