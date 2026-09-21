"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { useState, type ComponentProps, type ReactNode } from "react"

import { Chip } from "../components/chip.js"
import { Container } from "../components/container.js"
import { cn } from "../lib/utils.js"

/** The tint a slide is dressed in.
 *
 *  One colour per slide and nothing else about the slide changes with it: the
 *  ink, the ground under the copy and the frame are the same on all five. The
 *  tint is the top stop of the gradient behind the artwork, running down to
 *  the page's own beige, which is what the file draws and what makes a slide
 *  recognisable before the words are read.
 *
 *  Written out rather than derived from the ramp name, because the steps do
 *  not agree: three of the five are the 200, the olive is a 300 and the
 *  emerald a 100. The file picked what looked right at that weight rather
 *  than what was even, and deriving would quietly correct it.
 *
 *  `blue` is the one that is not the file's. The fourth slide is drawn in
 *  `indigo/200`, a ramp this system does not ship. Measured across the whole
 *  palette, `blue-200` is the closest thing to it that exists — 0.0246 in
 *  OKLab against the next candidate's 0.0301 — and the only one that keeps the
 *  five apart: the violets that come next sit 0.023 from the purple already
 *  on slide five, which is tighter than any two of the drawn colours. */
type FeatureSliderTint = "yellow" | "olive" | "emerald" | "blue" | "purple"

const TINTS: Record<FeatureSliderTint, string> = {
  yellow: "from-yellow-200",
  olive: "from-olive-300",
  emerald: "from-emerald-100",
  blue: "from-blue-200",
  purple: "from-purple-200",
}

type FeatureSliderItem = {
  title: string
  description: string
  tint: FeatureSliderTint
  /** The artwork for this slide, which on the live page is a phone. The block
   *  frames it and fades it; what is in it is the page's own. */
  media?: ReactNode
}

/** Five features, one at a time, each with a colour of its own.
 *
 *  A slider rather than a list because the live page is one: the copy sits
 *  left with two arrows under it, the artwork sits right on a tinted ground,
 *  and only one of the five is showing.
 *
 *  Nothing moves sideways. Measured on the live page, every layer is stacked
 *  at `absolute inset-0` and what changes is opacity — 300ms on the browser's
 *  own ease-in-out — so the block cross-fades rather than slides. The name is
 *  the one the design file uses; the behaviour is what was measured.
 *
 *  It loops in both directions and the arrows are never disabled, which is
 *  also measured rather than assumed: `prev` on the first slide goes to the
 *  last. There is no autoplay — fourteen seconds on the live page moved
 *  nothing — and no dots, no counter, nothing but the two arrows.
 *
 *  The tint cross-fades with everything else rather than snapping. That one
 *  is composed rather than copied: the file draws a colour per slide and the
 *  live page does not change colour at all, so nothing draws the moment
 *  between two tints. Snapping it while the words beneath fade for 300ms is
 *  the one thing both sources rule out, so the tint is stacked and faded on
 *  the same timing as the rest. */
function FeatureSlider({
  eyebrow,
  heading,
  items,
  className,
  ...props
}: {
  eyebrow?: string
  /** One entry per drawn line. The file breaks the title by hand rather than
   *  letting it wrap, and where it breaks is a decision about the sentence
   *  rather than about the width. */
  heading: readonly string[]
  items: readonly FeatureSliderItem[]
} & Omit<ComponentProps<"section">, "children">) {
  const [active, setActive] = useState(0)

  if (items.length === 0) {
    return null
  }

  const go = (step: number) => {
    setActive((current) => (current + step + items.length) % items.length)
  }

  return (
    <section
      className={cn("bg-white py-24 dark:bg-background", className)}
      {...props}
      data-slot="feature-slider"
    >
      <Container>
        <div className="flex flex-col items-center gap-2">
          {eyebrow ? <Chip variant="eyebrow">{eyebrow}</Chip> : null}

          <h2 className="text-center font-serif text-h2 text-balance text-zinc-800 dark:text-foreground">
            {heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div
          data-slot="feature-slider-frame"
          className="mt-12 grid overflow-hidden rounded-2xl border border-neutral-200 lg:grid-cols-2 dark:border-border"
        >
          <div className="flex flex-col justify-between gap-8 bg-linear-to-b from-beige-500 to-white p-8 lg:p-12 dark:bg-background dark:bg-none">
            {/* Announced rather than silent. Nothing here moves the focus and
                nothing is a link, so a reader who cannot see the fade has only
                this to tell them the panel changed under the same two
                buttons.

                Centred in whatever height is left rather than sitting at the
                top of it. The panel outside pushes the arrows to its floor and
                this takes the rest, so the words hold the middle while the
                controls stay put — which is what the file draws, and what
                keeps the block from looking top-heavy when a feature is two
                lines rather than five. */}
            <div
              data-slot="feature-slider-copy"
              aria-live="polite"
              className="relative flex min-h-60 flex-1 flex-col justify-center"
            >
              {items.map((item, index) => (
                <div
                  key={item.title}
                  data-feature={item.title}
                  data-current={index === active ? "" : undefined}
                  className={cn(
                    "flex flex-col items-start gap-2 transition-opacity duration-300",
                    index === active
                      ? "opacity-100"
                      : "pointer-events-none absolute inset-0 opacity-0",
                  )}
                >
                  <h3 className="text-h3 text-zinc-800 dark:text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-body-lg text-zinc-700 dark:text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {[
                { label: "Previous feature", step: -1, Icon: ArrowLeft },
                { label: "Next feature", step: 1, Icon: ArrowRight },
              ].map(({ label, step, Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => {
                    go(step)
                  }}
                  className="flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-zinc-700 shadow-xs transition-colors duration-150 hover:bg-beige-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:border-border dark:bg-card dark:text-foreground dark:hover:bg-popover"
                >
                  <Icon className="size-6" aria-hidden />
                </button>
              ))}
            </div>
          </div>

          <div
            data-slot="feature-slider-media"
            className="relative flex min-h-105 items-center justify-center overflow-hidden p-8"
          >
            {items.map((item, index) => (
              <div
                key={item.title}
                data-tint={item.tint}
                data-current={index === active ? "" : undefined}
                className={cn(
                  "absolute inset-0 bg-linear-to-b to-beige-500 transition-opacity duration-300",
                  TINTS[item.tint],
                  index === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}

            {items.map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  "absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-300",
                  index === active
                    ? "opacity-100"
                    : "pointer-events-none opacity-0",
                )}
              >
                {item.media}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export { FeatureSlider }
export type { FeatureSliderItem, FeatureSliderTint }
