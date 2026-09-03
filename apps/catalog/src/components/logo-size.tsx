"use client"

import { BrevyLockup } from "@brevy/ui"
import { useEffect, useRef, useState } from "react"

import type { Size } from "@/logo"

/** One height the identity is drawn at, drawn at it.
 *
 *  The width beside it is read off the rendered element rather than worked out
 *  from the ratio, so a change to the drawing shows up here as a different
 *  number instead of a caption that is quietly wrong. */
export function LogoSize({ size }: { size: Size }) {
  const box = useRef<HTMLSpanElement>(null)
  const [measured, setMeasured] = useState("")

  useEffect(() => {
    const element = box.current

    if (!element) {
      return
    }

    const rect = element.getBoundingClientRect()

    setMeasured(
      `${String(Math.round(rect.width))} × ${String(Math.round(rect.height))}`,
    )
  }, [])

  return (
    <li
      data-measures
      data-measured={measured ? "" : undefined}
      data-logo-size={String(size.px)}
      className="grid grid-cols-[9rem_7rem_1fr] items-center gap-6 border-b border-border py-5"
    >
      {/* The span hugs whatever it holds, so one ref measures both and the
          number is the drawing's own box rather than a container's. */}
      <span ref={box} className="inline-flex w-fit items-center">
        {size.what === "lockup" ? (
          <BrevyLockup
            style={{ height: size.px }}
            className="w-auto text-brand-500 dark:text-primary"
          />
        ) : (
          <span
            aria-hidden
            style={{ height: size.px, width: size.px }}
            className="block bg-brand-500 mask-brevy-lockup-mark dark:bg-primary"
          />
        )}
      </span>

      <span className="text-sm tabular-nums">
        <span data-logo-measured className="block font-medium">
          {measured}
        </span>
        <span className="block text-xs text-muted-foreground">
          {size.what}
          {size.floor ? " · the floor" : ""}
        </span>
      </span>

      <span className="text-sm text-muted-foreground">{size.where}</span>
    </li>
  )
}
