"use client"

import { useEffect, useRef, useState } from "react"

import { useCopy } from "./use-copy"

/** A colour is read back from the swatch rather than written beside it, so the
 *  page cannot print a hex the system does not paint. Going through a canvas
 *  rather than parsing the computed string is what makes that work at all: the
 *  borrowed ramps come from Tailwind and compute to `oklch(...)`, which no
 *  amount of regex turns into the hex a person can use. */
function describe(css: string) {
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1

  const context = canvas.getContext("2d")

  if (!context) {
    return null
  }

  context.clearRect(0, 0, 1, 1)
  context.fillStyle = css
  context.fillRect(0, 0, 1, 1)

  const [red = 0, green = 0, blue = 0, alpha = 255] = Array.from(
    context.getImageData(0, 0, 1, 1).data,
  )

  const hex = `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`

  return alpha === 255
    ? hex
    : `${hex} · ${String(Math.round((alpha / 255) * 100))}% opaque`
}

function useSwatch() {
  const ref = useRef<HTMLSpanElement>(null)
  const [label, setLabel] = useState("")

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    setLabel(describe(getComputedStyle(element).backgroundColor) ?? "")
  }, [])

  return { ref, label }
}

/** One shade of one ramp. Clicking copies the name rather than the hex: the
 *  hex is already on screen to read, and a hex pasted into a class is the one
 *  thing the lint gate rejects. */
export function PaletteSwatch({
  family,
  shade,
}: {
  family: string
  shade: string
}) {
  const name = `${family}-${shade}`
  const { ref, label } = useSwatch()
  const { copied, copy } = useCopy()

  return (
    <button
      type="button"
      aria-label={`Copy ${name}`}
      data-measures
      data-measured={label ? "" : undefined}
      onClick={() => {
        copy(name)
      }}
      className="flex w-full items-center gap-3 rounded-md p-1 text-left hover:bg-catalog-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      <span
        ref={ref}
        style={{ background: `var(--color-${name})` }}
        className="size-8 shrink-0 rounded-md border border-border"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm">{name}</span>
        <span
          data-hex={label}
          className="block font-mono text-xs text-muted-foreground"
        >
          {copied ? "Copied" : label}
        </span>
      </span>
    </button>
  )
}

/** The same token painted under a theme it may not be in. A frame would be the
 *  other way to force one, but a token is only a custom property, and those
 *  inherit, so the theme class on a wrapper is enough to resolve the whole
 *  chain here rather than in the reader's current mode. */
export function TokenSwatch({
  token,
  source,
  theme,
}: {
  token: string
  source: string
  theme: "light" | "dark"
}) {
  const { ref, label } = useSwatch()

  return (
    <span
      data-swatch={theme}
      data-measures
      data-measured={label ? "" : undefined}
    >
      <span className="flex items-center gap-2.5">
        {/* The theme class covers the block and nothing else. Wrapped any wider
            it would take the labels with it, and text pinned to dark on a light
            page is text nobody can read. */}
        <span className={`${theme} shrink-0`}>
          <span
            ref={ref}
            data-block
            style={{ background: `var(--${token})` }}
            className="block size-8 rounded-md border border-border"
          />
        </span>
        <span className="min-w-0">
          <span
            data-hex={label}
            className="block font-mono text-xs text-foreground"
          >
            {label}
          </span>
          <span
            data-source={source}
            className="block truncate text-xs text-muted-foreground"
          >
            {source}
          </span>
        </span>
      </span>
    </span>
  )
}

/** The token name, which is the part worth carrying away. */
export function CopyToken({ token }: { token: string }) {
  const { copied, copy } = useCopy()

  return (
    <button
      type="button"
      aria-label={`Copy ${token}`}
      onClick={() => {
        copy(token)
      }}
      className="rounded-sm text-left font-mono text-sm hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      {copied ? "Copied" : token}
    </button>
  )
}
