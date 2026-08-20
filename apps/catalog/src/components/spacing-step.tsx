"use client"

import { useEffect, useRef, useState } from "react"

import type { Step } from "@/spacing"

import { useCopy } from "./use-copy"

/** The bar is sized the way Tailwind sizes anything: its own `--spacing`
 *  multiplied by the step, rather than by a number written here. If that base
 *  ever moved, the bar would move with it and the page would still be telling
 *  the truth. The label is then read back off the bar, so what it claims and
 *  what it draws cannot come apart. */
export function SpacingStep({ step }: { step: Step }) {
  const bar = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState("")
  const { copied, copy } = useCopy()

  useEffect(() => {
    const element = bar.current

    if (!element) {
      return
    }

    const measure = () => {
      const width = element.getBoundingClientRect().width
      setSize(
        `${String(Math.round(width))}px · ${String(Math.round((width / 16) * 1000) / 1000)}rem`,
      )
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <li
      data-measures
      data-measured={size ? "" : undefined}
      data-step={String(step.step)}
      className="grid grid-cols-[7rem_9rem_1fr] items-center gap-6 border-b border-border py-4"
    >
      <span className="flex">
        <span
          ref={bar}
          data-bar
          style={{ width: `calc(var(--spacing) * ${String(step.step)})` }}
          className="h-7 rounded-sm border border-border bg-catalog-active"
        />
      </span>

      <span className="min-w-0">
        <button
          type="button"
          aria-label={`Copy p-${String(step.step)}`}
          onClick={() => {
            copy(`p-${String(step.step)}`)
          }}
          className="rounded-sm font-mono text-sm hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {copied ? "Copied" : `p-${String(step.step)}`}
        </button>
        <span
          data-size
          className="block font-mono text-xs text-muted-foreground"
        >
          {size}
        </span>
      </span>

      <span className="text-sm leading-relaxed">
        {step.role}{" "}
        <span className="text-muted-foreground">Used on {step.seen}.</span>
      </span>
    </li>
  )
}
