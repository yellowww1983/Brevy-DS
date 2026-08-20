"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import { useCopy } from "./use-copy"

type Measured = {
  size: string
  stroke: string
}

/** The icon arrives already rendered rather than as a component, because a
 *  component is a function and a function cannot cross into a client boundary.
 *
 *  Both numbers come off the rendered svg. Stroke is the one worth watching:
 *  lucide ships 2, the system overrides it to 1.5, and a vector scaled down
 *  carries its stroke down with it, so the same icon reads thinner when small. */
function useIcon() {
  const ref = useRef<HTMLSpanElement>(null)
  const [measured, setMeasured] = useState<Measured | null>(null)

  useEffect(() => {
    const svg = ref.current?.querySelector("svg")

    if (!svg) {
      return
    }

    /** With the stroke taken out of the glyph's scaling, the declared width is
     *  the width on screen, whatever size the icon is drawn at. */
    const declared = parseFloat(getComputedStyle(svg).strokeWidth)

    setMeasured({
      size: `${String(Math.round(svg.getBoundingClientRect().width))}px`,
      stroke: String(Math.round(declared * 100) / 100),
    })
  }, [])

  return { ref, measured }
}

export function IconSize({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const { ref, measured } = useIcon()

  return (
    <li
      data-measures
      data-measured={measured ? "" : undefined}
      data-icon-size={label}
      className="grid grid-cols-[7rem_1fr] items-center gap-6 border-b border-border py-4"
    >
      <span className="flex">
        <span
          ref={ref}
          className="flex size-14 items-center justify-center rounded-md bg-catalog-active"
        >
          {children}
        </span>
      </span>

      <span className="min-w-0">
        <span className="block font-mono text-sm">{label}</span>
        <span
          data-size
          className="block font-mono text-xs text-muted-foreground"
        >
          {measured ? `${measured.size} · ${measured.stroke} stroke` : ""}
        </span>
      </span>
    </li>
  )
}

/** One of the icons the design uses, shown to illustrate the convention rather
 *  than to mark it as approved. Clicking copies the name, which is what goes
 *  into an import or into a sentence for Claude. */
export function IconSample({
  name,
  children,
}: {
  name: string
  children: ReactNode
}) {
  const { copied, copy } = useCopy()

  return (
    <li className="grid grid-cols-[7rem_1fr] items-center gap-6 border-b border-border py-4">
      <span className="flex">
        <span className="flex size-14 items-center justify-center rounded-md bg-catalog-active">
          {children}
        </span>
      </span>

      <button
        type="button"
        aria-label={`Copy ${name}`}
        onClick={() => {
          copy(name)
        }}
        className="justify-self-start rounded-sm font-mono text-sm hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        {copied ? "Copied" : name}
      </button>
    </li>
  )
}
