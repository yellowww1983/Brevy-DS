"use client"

import { BrevyLockup } from "@brevy/ui"
import { useEffect, useRef, useState } from "react"

/** What the identity resolves to, in both themes at once.
 *
 *  Both samples wear the class every placement wears, so this reads the same
 *  answer the navbar and the login screen get rather than a copy of it. The
 *  themes are forced locally: the dark variant is written to fire under a
 *  `.dark` ancestor and to stand down under a `.light` one, so a page can hold
 *  one of each without either of them following the toggle.
 *
 *  Through a canvas, because the tokens resolve to `oklch(...)` and an element
 *  to `rgb(...)`, and neither is the hex a reader is looking for. */
function hex(value: string) {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1

  const context = canvas.getContext("2d")

  if (!context) {
    return ""
  }

  context.fillStyle = value
  context.fillRect(0, 0, 1, 1)

  const pixel = context.getImageData(0, 0, 1, 1).data

  return `#${[pixel[0], pixel[1], pixel[2]]
    .map((channel) => (channel ?? 0).toString(16).padStart(2, "0"))
    .join("")}`
}

export function LogoColour() {
  const light = useRef<HTMLDivElement>(null)
  const dark = useRef<HTMLDivElement>(null)
  const [read, setRead] = useState<{ light: string; dark: string }>()

  useEffect(() => {
    const one = light.current
    const two = dark.current

    if (!one || !two) {
      return
    }

    setRead({
      light: hex(getComputedStyle(one).color),
      dark: hex(getComputedStyle(two).color),
    })
  }, [])

  const sample = (theme: "light" | "dark") => (
    <div className={`${theme} flex-1 rounded-xl border border-border`}>
      <div
        ref={theme === "light" ? light : dark}
        className="flex flex-col items-start gap-4 rounded-xl bg-background p-6 text-brand-500 dark:text-primary"
      >
        <BrevyLockup className="h-10 w-auto" />
        <p
          data-logo-hex={theme}
          className="text-sm text-foreground tabular-nums"
        >
          {read ? read[theme] : " "}
          <span className="ml-2 text-muted-foreground">{theme}</span>
        </p>
      </div>
    </div>
  )

  return (
    <div
      data-measures
      data-measured={read ? "" : undefined}
      className="flex flex-col gap-4 tablet:flex-row"
    >
      {sample("light")}
      {sample("dark")}
    </div>
  )
}
