"use client"

import { useEffect, useRef, useState } from "react"

import type { Radius } from "@/radius"

import { useCopy } from "./use-copy"

/** A radius large enough to round a corner completely reports a number nobody
 *  needs to read, because Tailwind draws it as an effectively infinite length. Past
 *  the point where the corner can get no rounder, the honest label is the word. */
function describe(radius: string) {
  const first = parseFloat(radius)

  if (Number.isNaN(first)) {
    return ""
  }

  return first > 1000 ? "fully round" : `${String(Math.round(first))}px`
}

export function RadiusSwatch({ radius }: { radius: Radius }) {
  const box = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState("")
  const { copied, copy } = useCopy()

  useEffect(() => {
    const element = box.current

    if (!element) {
      return
    }

    setSize(describe(getComputedStyle(element).borderTopLeftRadius))
  }, [])

  return (
    <li
      data-measures
      data-measured={size ? "" : undefined}
      data-radius={radius.className}
      className="grid grid-cols-[7rem_9rem_1fr] items-center gap-6 border-b border-border py-4"
    >
      <span className="flex">
        <span
          ref={box}
          data-box
          className={`size-14 border border-border bg-catalog-active ${radius.className}`}
        />
      </span>

      <span className="min-w-0">
        <button
          type="button"
          aria-label={`Copy ${radius.className}`}
          onClick={() => {
            copy(radius.className)
          }}
          className="rounded-sm font-mono text-sm hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {copied ? "Copied" : radius.className}
        </button>
        <span
          data-size
          className="block font-mono text-xs text-muted-foreground"
        >
          {size}
        </span>
      </span>

      <span className="text-sm leading-relaxed">{radius.role}</span>
    </li>
  )
}
