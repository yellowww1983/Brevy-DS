"use client"

import { useEffect, useRef, useState } from "react"

import { useFrameTheme } from "./frame-theme"

type Reading = {
  /** Every track, measured one at a time rather than one measured and multiplied
   *  by twelve. If the browser ever divided them unevenly, this would show it. */
  tracks: readonly number[]
  gutter: number
  margin: number
  height: number
  /** Whether the twelve behind the `content:` variant resolved to a grid at
   *  this width, which is what every block in the system carries. Read off the
   *  browser rather than compared against a number written here. */
  live: boolean
}

/** The same height the container frames stand at, for the same reason: nothing
 *  about the grid's height is being shown, only where its tracks fall. */
const BOX = 140

const columnsOf = (value: string) =>
  value
    .split(" ")
    .map((track) => parseFloat(track))
    .filter((track) => !Number.isNaN(track))

/** Twelve columns at one width, drawn over the container they divide.
 *
 *  A sibling of `ContainerFrame` and deliberately built the same way: a frame at
 *  the real width, scaled by a transform so the geometry inside is still the
 *  geometry at that width, and the drawing done outside the frame where a
 *  hairline is the catalog's own pixel rather than a shrunken one.
 *
 *  What separates the three frames is not how they are drawn but what is true at
 *  their width. Above 1200 the system's blocks place themselves on these
 *  columns and the bands are filled. Below it they do not — the grid is a
 *  guide the file draws and production never switches on — so the bands are
 *  dashed and empty. The frame does not decide which; it asks the specimen. */
export function GridFrame({ label, width }: { label: string; width: number }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const column = useRef<HTMLDivElement>(null)
  const [reading, setReading] = useState<Reading | null>(null)
  const [scale, setScale] = useState(1)
  const [loads, setLoads] = useState(0)

  useFrameTheme(frame, loads)

  useEffect(() => {
    const document_ = frame.current?.contentDocument
    const view = frame.current?.contentWindow
    const root = document_?.documentElement

    if (!document_ || !view || !root) {
      return
    }

    const read = () => {
      const container = document_.querySelector("[data-container]")
      const band = document_.querySelector("[data-bleed]")
      const guide = document_.querySelector("[data-guide]")
      const production = document_.querySelector("[data-production]")

      if (!container || !band || !guide || !production) {
        return
      }

      const box = container.getBoundingClientRect()
      const style = view.getComputedStyle(guide)
      const shipped = view.getComputedStyle(production)

      setReading({
        tracks: columnsOf(style.gridTemplateColumns),
        gutter: parseFloat(style.columnGap),
        margin: Math.round(box.left - band.getBoundingClientRect().left),
        height: box.height,
        live:
          shipped.display === "grid" &&
          columnsOf(shipped.gridTemplateColumns).length === 12,
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

  const round = (value: number) => Math.round(value * 100) / 100

  return (
    <figure
      data-measures
      data-measured={reading ? "" : undefined}
      data-viewport={String(width)}
      data-live={reading?.live ? "" : undefined}
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
            {`${String(reading.tracks.length)} columns · column ${String(round(reading.tracks[0] ?? 0))}px · gutter ${String(round(reading.gutter))}px · margin ${String(reading.margin)}px`}
          </span>
        ) : null}
      </figcaption>

      {reading && !reading.live ? (
        <p
          data-guide-only
          className="mt-1 text-xs text-muted-foreground italic"
        >
          Guide only: no block places on columns at this width.
        </p>
      ) : null}

      <div ref={column} className="mt-3">
        <div
          style={{ width: width * scale, height: BOX }}
          className="relative overflow-hidden rounded-xl border border-border"
        >
          <iframe
            ref={frame}
            src="/specimens/grid"
            title={`The grid at ${String(width)}px`}
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

          {/* Painted out here, where nothing is scaled. Each band is the width
              of the track it stands on and the space between two of them is
              the measured gutter, so this draws the division that is there
              rather than twelve equal guesses. Centred without arithmetic: the
              row is as wide as the container and the container is centred. */}
          {reading ? (
            <div
              className="pointer-events-none absolute inset-0 grid place-items-center"
              aria-hidden
            >
              <div
                data-columns
                style={{
                  height: reading.height * scale,
                  gap: reading.gutter * scale,
                }}
                className="flex"
              >
                {reading.tracks.map((track, index) => (
                  <span
                    key={index}
                    style={{ width: track * scale }}
                    className={
                      reading.live
                        ? "rounded-xs bg-brand-500/15 ring-1 ring-brand-500/30 ring-inset"
                        : "rounded-xs border border-dashed border-brand-500/45"
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </figure>
  )
}
