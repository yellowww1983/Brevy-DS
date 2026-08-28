import type { ReactNode } from "react"

import { Button } from "../components/button.js"
import { Chip } from "../components/chip.js"
import { Container } from "../components/container.js"
import { cn } from "../lib/utils.js"

/** The two arrangements the file draws under one name.
 *
 *  `cards` is Caregiving (`22614:7570`): a row of cards, each an illustration
 *  over a title and a line. `panel` is For Organizations (`23259:576`): a
 *  numbered list down one half and a single illustration filling the other.
 *
 *  They are one block because everything above the steps is identical in all
 *  eight frames the file draws — the same column, the same 96, the same chip,
 *  the same serif heading, the same 48 down to the steps. They part at the
 *  arrangement and nowhere else. */
type StepsLayout = "cards" | "panel"

/** The ground the section stands on: three of the four pages paint the olive
 *  gradient, the app page paints white. */
type StepsGround = "gradient" | "white"

type Step = {
  title: string
  description: string
  /** The artwork inside the step's frame. A slot rather than a shape: the file
   *  draws a different mock interface for every step on every page, by hand,
   *  which is composition and not structure — the same standing the CTA band's
   *  photographs have. */
  illustration?: ReactNode
}

/** The call to action the partner page hangs off the foot of its steps. */
type StepsTail = { label: string; href: string; note?: string }

/** The numbered disc, at the 36 the two pages that show one draw it
 *  (`23259:576`, `25276:3615`): olive-100 to olive-300 inside a thread that
 *  runs olive-300 to olive-600, with the numeral in brand-500.
 *
 *  An element rather than a component, for now. The shape recurs — the app
 *  page's `Free care coordination` wears eight of them as icon holders — but
 *  the number does not, and a disc that carries either a numeral or an icon is
 *  a second decision nobody has had to make yet. When that section is built,
 *  this is what it lifts from.
 *
 *  The thread is a gradient, so it is a box behind a box rather than a border:
 *  a border takes one colour, and `hairline` paints the neutral thread this one
 *  is not. */
function Marker({ index }: { index: number }) {
  return (
    <span
      data-slot="steps-marker"
      className="inline-block size-9 shrink-0 rounded-full bg-linear-to-b from-olive-300 to-olive-600 p-px shadow-xs"
    >
      <span className="flex size-full items-center justify-center rounded-full bg-linear-to-b from-olive-100 to-olive-300 text-body-lg font-semibold text-brand-500">
        {index + 1}
      </span>
    </span>
  )
}

/** The frame a card's illustration sits in: 290 tall at every width, on an
 *  olive-to-white gradient inside a thread of its own. The height belongs to
 *  the thread rather than what it wraps, so the frame measures the drawn 290
 *  and not 292. */
function Figure({
  children,
  marker,
}: {
  children?: ReactNode
  marker?: ReactNode
}) {
  return (
    <div
      data-slot="steps-figure"
      className="h-(--steps-figure) rounded-2xl bg-linear-to-b from-olive-200 to-neutral-100 p-px"
    >
      <div className="relative size-full overflow-hidden rounded-2xl bg-linear-to-b from-olive-300 to-white">
        {marker ? (
          <div className="absolute top-2 left-2 z-10">{marker}</div>
        ) : null}
        {children}
      </div>
    </div>
  )
}

/** How a page says what it is about to explain, and then explains it.
 *
 *  Four pages carry this and the frame around the steps does not move in any of
 *  the eight drawn breakpoints: the column pads itself by 96 — unlike the CTA
 *  band, which leans on its neighbour for that — then a chip carrying the step
 *  count, 12 down to a serif heading, 8 to an optional line under it, and 48 to
 *  the steps themselves.
 *
 *  The count in the chip is the number of steps rather than a prop. The file
 *  writes `3 Easy Steps` over three and `4 Easy Steps` over four, and a caption
 *  that can disagree with what it counts eventually will.
 *
 *  The app page draws a fifth version of this and it is not here. It keeps the
 *  frame and changes six things inside the card at once — the illustration goes
 *  under the text rather than over it and runs to the card's edges, the number
 *  becomes a `STEP 1` eyebrow, the line drops to 16/24, the card takes a thread
 *  instead of a shadow. That is a dialect, not a variant, and it is parked
 *  until a page needs it. */
function Steps({
  eyebrow,
  heading,
  description,
  steps,
  layout = "cards",
  ground = "gradient",
  showMarkers = false,
  highlightFirst = false,
  panel,
  tail,
  className,
}: {
  /** The chip's label. The count beside it is `steps.length`. */
  eyebrow: string
  heading: string
  /** The line under the heading. Caregiving draws none; the other three do. */
  description?: string
  steps: readonly Step[]
  layout?: StepsLayout
  ground?: StepsGround
  /** Caregiving carries a numbered disc in every card and has every one of them
   *  switched off; the two pages that lay their steps beside a panel show
   *  theirs. Both states are drawn, so both are a prop. */
  showMarkers?: boolean
  /** For Organizations tints its first step and leaves the rest white. */
  highlightFirst?: boolean
  /** The illustration beside the list. `panel` only. */
  panel?: ReactNode
  tail?: StepsTail
  className?: string
}) {
  return (
    <section
      data-slot="steps"
      data-layout={layout}
      className={cn(
        ground === "gradient"
          ? "bg-linear-to-b from-olive-500 to-white"
          : "bg-white",
        "dark:bg-background dark:bg-none",
        className,
      )}
    >
      <Container className="py-24">
        <div className="flex flex-col gap-12">
          <div
            data-slot="steps-header"
            className="flex flex-col items-center gap-3 text-center"
          >
            <Chip count={steps.length}>{eyebrow}</Chip>

            <div className="flex max-w-(--steps-lede) flex-col gap-2">
              <h2
                data-slot="steps-heading"
                className="font-serif text-h2 text-balance text-zinc-800 dark:text-foreground"
              >
                {heading}
              </h2>

              {description ? (
                <p
                  data-slot="steps-description"
                  className="text-body-lg text-balance text-zinc-700 dark:text-muted-foreground"
                >
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          {layout === "cards" ? (
            /* A row where there is room and a column where there is not, at the
               16 the file sets either way. Three across, which is what it draws
               every time; a fourth step wraps onto a second row rather than
               squeezing the column into quarters, because a row of four at 1200
               is 288 a card and the drawing has no case for it. */
            <ul
              data-slot="steps-list"
              className="grid gap-4 content:grid-cols-3"
            >
              {steps.map((step, index) => (
                <li
                  key={index}
                  data-slot="steps-step"
                  className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md dark:bg-card"
                >
                  <Figure
                    marker={showMarkers ? <Marker index={index} /> : undefined}
                  >
                    {step.illustration}
                  </Figure>

                  <div className="flex flex-col gap-2">
                    <h3
                      data-slot="steps-step-title"
                      className="text-body-lg font-semibold text-zinc-800 dark:text-foreground"
                    >
                      {step.title}
                    </h3>
                    <p className="text-body-lg text-zinc-700 dark:text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            /* One column narrow and two wide, and the panel is the second thing
               in the column rather than the last — which is what the file draws
               (`23402:1590`), the numbering interrupted after the first step.
               So it is written second in the source, and the wide arrangement
               places it by hand in column two: an explicit placement leaves the
               auto flow alone, and the steps fall down column one in order
               however the panel is threaded among them. */
            <ul
              data-slot="steps-list"
              className="grid gap-2 content:grid-cols-2 content:items-start content:gap-x-4 content:gap-y-2"
            >
              {steps.map((step, index) => (
                <li
                  key={index}
                  data-slot="steps-step"
                  className={cn(
                    "hairline flex gap-4 rounded-2xl px-6 pt-4 pb-6 shadow-xs content:col-start-1",
                    highlightFirst && index === 0
                      ? "bg-olive-50 dark:bg-card"
                      : "bg-white dark:bg-card",
                  )}
                >
                  {showMarkers ? <Marker index={index} /> : null}

                  <div className="flex flex-col gap-2 pt-1">
                    <h3
                      data-slot="steps-step-title"
                      className="text-body-lg font-semibold text-brand-500 dark:text-primary"
                    >
                      {step.title}
                    </h3>
                    <p className="text-body-lg text-zinc-700 dark:text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}

              <li
                data-slot="steps-panel"
                className={cn(
                  "overflow-hidden rounded-2xl bg-linear-to-b from-beige-400 to-beige-500 p-4 tablet:px-0 tablet:py-9 content:col-start-2 content:row-start-1 dark:bg-card dark:bg-none",
                  "h-(--steps-panel-narrow) tablet:h-(--steps-panel)",
                  /* How many rows it reaches across, written out because
                     `row-span-full` resolves against the explicit grid and this
                     one has none — it would open a row of its own and leave the
                     steps stranded around it. */
                  steps.length >= 4
                    ? "content:row-span-4"
                    : "content:row-span-3",
                )}
              >
                <div className="mx-auto size-full overflow-hidden rounded-2xl bg-white shadow-md dark:bg-background">
                  {panel}
                </div>
              </li>
            </ul>
          )}

          {tail ? (
            <div
              data-slot="steps-tail"
              className="flex flex-col items-center gap-3"
            >
              <Button asChild>
                <a href={tail.href}>{tail.label}</a>
              </Button>

              {tail.note ? (
                <p className="text-sm/6 text-beige-900 dark:text-muted-foreground">
                  {tail.note}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}

export { Steps }
export type { Step, StepsGround, StepsLayout, StepsTail }
