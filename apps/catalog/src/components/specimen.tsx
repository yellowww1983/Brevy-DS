"use client"

import { Badge } from "@brevy/ui"
import { useEffect, useRef, useState } from "react"

import type { TypeRole } from "@/typography"

type Measured = {
  size: string
  leading: string
  weight: string
}

function Fact({ name, value }: { name: string; value: string }) {
  return (
    <Badge variant="secondary">
      {name}: <span className="text-foreground">{value}</span>
    </Badge>
  )
}

/** The numbers are read off the rendered sample rather than written beside it.
 *  A size is only true for the width it was measured at, and this document is
 *  framed at the width the reader picked, so measuring is the only way the
 *  badge can keep up with a size that follows the viewport. */
export function Specimen({ role }: { role: TypeRole }) {
  const sample = useRef<HTMLParagraphElement>(null)
  const [measured, setMeasured] = useState<Measured | null>(null)

  useEffect(() => {
    const element = sample.current

    if (!element) {
      return
    }

    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(element)
      const size = parseFloat(style.fontSize)

      setMeasured({
        size: `${String(Math.round(size))}px`,
        leading: String(
          Math.round((parseFloat(style.lineHeight) / size) * 1000) / 1000,
        ),
        weight: style.fontWeight,
      })
    })

    observer.observe(document.documentElement)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <li className="border-t border-border py-10 first:border-t-0 first:pt-0 last:pb-0">
      <p
        ref={sample}
        data-specimen={role.name}
        className={`text-foreground ${role.style}`}
      >
        {role.sample}
      </p>

      <div className="mt-6 flex flex-wrap gap-2 font-sans">
        <Fact name="Role" value={role.name} />
        <Fact name="Typeface" value={role.face} />
        <Fact name="Font Size" value={measured?.size ?? "—"} />
        <Fact name="Line Height" value={measured?.leading ?? "—"} />
        <Fact name="Weight" value={measured?.weight ?? "—"} />
      </div>
    </li>
  )
}
