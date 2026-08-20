"use client"

import { useEffect, useRef, useState } from "react"

import type { Shadow } from "@/shadows"

import { useCopy } from "./use-copy"

/** Tailwind composes box-shadow from five slots, and the four it reserves for
 *  rings and inset shadows are emitted as fully transparent layers whatever the
 *  step is. The first layer that actually paints is the one carrying the lift,
 *  so the label reports its offset and blur. */
function describe(boxShadow: string) {
  const painted = boxShadow
    .split(/,(?![^(]*\))/)
    .find((layer) => !/,\s*0\)/.test(layer))

  const lengths = (painted ?? "")
    .replace(/rgba?\([^)]*\)/, "")
    .match(/-?\d+(\.\d+)?px/g)

  if (!lengths || lengths.length < 3) {
    return ""
  }

  return `${lengths[1] ?? ""} down, ${lengths[2] ?? ""} blur`
}

export function ShadowSwatch({ shadow }: { shadow: Shadow }) {
  const tile = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState("")
  const { copied, copy } = useCopy()

  useEffect(() => {
    const element = tile.current

    if (!element) {
      return
    }

    setSize(describe(getComputedStyle(element).boxShadow))
  }, [])

  return (
    <li
      data-measures
      data-measured={size ? "" : undefined}
      data-shadow={shadow.className}
      className="grid grid-cols-[7rem_9rem_1fr] items-center gap-6 border-b border-border py-4"
    >
      {/* A shadow is black at low opacity, so what it changes is the surface
          times that opacity. On a near-black stage the smallest step moves the
          background by under two levels of 255 and every step looks the same.
          The stage is therefore pinned to the light theme in both modes, which
          is the only surface the scale can be compared on. */}
      <span
        data-stage
        className="light flex items-center justify-center rounded-md bg-catalog-active py-5"
      >
        <span
          ref={tile}
          data-tile
          className={`size-10 rounded-md bg-card ${shadow.className}`}
        />
      </span>

      <span className="min-w-0">
        <button
          type="button"
          aria-label={`Copy ${shadow.className}`}
          onClick={() => {
            copy(shadow.className)
          }}
          className="rounded-sm font-mono text-sm hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {copied ? "Copied" : shadow.className}
        </button>
        <span
          data-size
          className="block font-mono text-xs text-muted-foreground"
        >
          {size}
        </span>
      </span>

      <span className="text-sm leading-relaxed">{shadow.role}</span>
    </li>
  )
}
