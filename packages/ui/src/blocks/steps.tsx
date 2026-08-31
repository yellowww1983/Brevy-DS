"use client"

import { Check, LoaderCircle } from "lucide-react"
import { Fragment, useEffect, useState, type ReactNode } from "react"

import { Button } from "../components/button.js"
import { Chip } from "../components/chip.js"
import { Container } from "../components/container.js"
import { IllustrationPanel } from "../components/illustration-panel.js"
import { Marker as SharedMarker } from "../components/marker.js"
import { cn } from "../lib/utils.js"

/** The two arrangements the file draws under one name.
 *
 *  `cards` is Caregiving (`22614:7570`): a row of cards, each an illustration
 *  over a title and a line. `panel` is For Organizations (`23259:576`): a
 *  numbered list down one half and, beside it, one illustration that belongs to
 *  whichever step the list has reached.
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
  /** This step's artwork. In `cards` it is the mock inside the card; in
   *  `panel` it is the plate the panel shows while this step is the one the
   *  list has reached. A slot rather than a shape: the file draws a different
   *  picture for every step on every page, by hand, which is composition and
   *  not structure. */
  illustration?: ReactNode
}

/** The call to action the partner page hangs off the foot of its steps. */
type StepsTail = { label: string; href: string; note?: string }

/** How long a step holds before the list moves on, and how long the ground and
 *  the plate take to get there. The file draws four still frames and no timing,
 *  so both are ours. */
const HOLD = 3500
const FADE = "duration-300"

/** The step's number, in the disc the system now owns.
 *
 *  It was written here first, with a note saying it stayed an element because
 *  the shape recurred and the number did not. The benefit cards number
 *  themselves the same way, which settles it — a disc carrying either a
 *  numeral or a glyph is the component `Marker` is.
 *
 *  It does not change as the list advances. The file draws it the same in
 *  every step of every frame; what moves is the card's ground and the tick. */
function Marker({ index }: { index: number }) {
  return <SharedMarker>{index + 1}</SharedMarker>
}

/** The tick at the far end of a step, which is the one part that says how far
 *  the list has got.
 *
 *  Two icons, not one in two colours. A step the list has reached carries a
 *  check; one it has not carries a spinner — and it is a spinner rather than a
 *  ring, which the path settles: it opens at (12, 6) and closes at
 *  (7.85, 0.29) rather than back where it started, so it sweeps 288 degrees
 *  and leaves 72 open. That is a thing that turns, and a step waiting its turn
 *  is what it says.
 *
 *  Every unreached step carries it, not only the next one. The file draws the
 *  same path in every step it has not reached, at rotation 0, in all four
 *  frames — it never singles one out.
 *
 *  A second a turn, linearly, which is what `animate-spin` already is. The
 *  file carries no timing: four stills and no clock.
 *
 *  The disc changes with the icon, from the olive pair to the neutral one.
 *  Both strokes are 1 at the size they are drawn, which is what `strokeWidth`
 *  here works out to.
 *
 *  The file puts a white 16 frame between the disc and the icon. It is not in
 *  the render — sampled at `23259:576`, the pixel behind the check is the
 *  disc's own olive — so the icon sits straight on the gradient here. */
function Tick({ reached }: { reached: boolean }) {
  return (
    <span
      data-slot="steps-tick"
      data-reached={reached ? "" : undefined}
      className={cn(
        "inline-block size-6 shrink-0 self-start rounded-full p-px transition-colors",
        FADE,
        reached
          ? "bg-linear-to-b from-olive-300 to-olive-600"
          : "bg-linear-to-b from-neutral-100 to-neutral-300",
      )}
    >
      <span
        className={cn(
          "flex size-full items-center justify-center rounded-full transition-colors",
          FADE,
          reached
            ? "bg-linear-to-b from-olive-100 to-olive-300 text-brand-500"
            : "bg-linear-to-b from-white to-neutral-100 text-zinc-400",
        )}
      >
        {reached ? (
          <Check className="size-4" strokeWidth={1.5} aria-hidden />
        ) : (
          /* Stillness stops it, the same rule the advancing follows. A CSS
             variant rather than the hook, because this one needs no state and
             a reader who changes the preference should not have to reload. */
          <LoaderCircle
            className="size-4 animate-spin motion-reduce:animate-none"
            strokeWidth={1.5}
            aria-hidden
          />
        )}
      </span>
    </span>
  )
}

/** The frame a card's illustration sits in: 290 tall at every width, on an
 *  olive-to-white gradient inside a thread of its own. The height belongs to
 *  the thread rather than what it wraps, so the frame measures the drawn 290
 *  and not 292. */

/** What a step in the panel layout says, whether or not it can be clicked. */
function StepBody({
  step,
  index,
  reached,
  showMarker,
}: {
  step: Step
  index: number
  reached: boolean
  showMarker: boolean
}) {
  return (
    <>
      {showMarker ? <Marker index={index} /> : null}

      <span className="flex flex-1 flex-col gap-2 pt-1 text-left">
        {/* A span rather than a heading, because where the list can be driven
            the whole step is a button and a button may not contain one. The
            steps are still a list, and the one being shown carries
            `aria-current`. */}
        <span
          data-slot="steps-step-title"
          className="text-body-lg font-semibold text-brand-500 dark:text-primary"
        >
          {step.title}
        </span>
        <span className="text-body-lg text-zinc-700 dark:text-muted-foreground">
          {step.description}
        </span>
      </span>

      <Tick reached={reached} />
    </>
  )
}

/** Two questions, not one.
 *
 *  `interactive` is whether the list can be driven at all, which is a matter of
 *  width: below the point where the list and the plate stand side by side there
 *  is nothing to drive, and the narrow drawings carry only the first frame.
 *
 *  `advancing` is whether it drives itself, which is also a matter of what the
 *  reader asked for. Stillness turns the clock off and leaves the clicking —
 *  taking that away too would leave a reader who cannot see the animation with
 *  no way to see the other three states at all.
 *
 *  The width is read off `--breakpoint-content` rather than written again here,
 *  so the query and the layout that depends on it cannot drift apart. */
function useSlider() {
  const [state, setState] = useState({ interactive: false, advancing: false })

  useEffect(() => {
    const wide = getComputedStyle(document.documentElement)
      .getPropertyValue("--breakpoint-content")
      .trim()

    if (!wide) {
      return
    }

    const columns = window.matchMedia(`(min-width: ${wide})`)
    const still = window.matchMedia("(prefers-reduced-motion: reduce)")

    const read = () => {
      setState({
        interactive: columns.matches,
        advancing: columns.matches && !still.matches,
      })
    }

    read()
    columns.addEventListener("change", read)
    still.addEventListener("change", read)

    return () => {
      columns.removeEventListener("change", read)
      still.removeEventListener("change", read)
    }
  }, [])

  return state
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
 *  `panel` moves. The file draws it four times over (`23259:576`,
 *  `23375:692`, `23375:829`, `23375:956`) and what changes between the frames
 *  is cumulative: one step reached, then two, then three, then all four, with
 *  the plate beside them carrying that step's own picture. So it advances a
 *  step at a time and starts over, a click takes the list to a step and stops
 *  the advancing, and a reader who asked for stillness gets the first frame and
 *  the click. None of the timing is drawn — the file has four stills and no
 *  clock — so the hold and the fade are ours and are named at the top of this
 *  file.
 *
 *  It moves at the desktop only. The narrow frames carry the first state and
 *  nothing else, so below the width where the list and the plate stand side by
 *  side there is no slider to run.
 *
 *  The app page draws a fifth version of this section and it is not here. It
 *  keeps the frame and changes six things inside the card at once — the
 *  illustration goes under the text rather than over it and runs to the card's
 *  edges, the number becomes a `STEP 1` eyebrow, the line drops to 16/24, the
 *  card takes a thread instead of a shadow. That is a dialect, not a variant,
 *  and it is parked until a page needs it. */
function Steps({
  eyebrow,
  heading,
  description,
  steps,
  layout = "cards",
  ground = "gradient",
  showMarkers = false,
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
  /** Caregiving carries a numbered disc in every card and has every one of
   *  them switched off; the two pages that lay their steps beside a panel show
   *  theirs. Both states are drawn, so both are a prop. */
  showMarkers?: boolean
  tail?: StepsTail
  className?: string
}) {
  const { interactive, advancing } = useSlider()
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)

  useEffect(() => {
    if (!advancing || held || steps.length < 2) {
      return
    }

    const timer = window.setInterval(() => {
      setActive((step) => (step + 1) % steps.length)
    }, HOLD)

    return () => {
      window.clearInterval(timer)
    }
  }, [advancing, held, steps.length])

  /** Below the two columns there is no slider, so the list shows the frame the
   *  narrow drawings carry: the first step reached and no other. */
  const reachedTo = interactive ? active : 0

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
                  <IllustrationPanel
                    marker={showMarkers ? <Marker index={index} /> : undefined}
                  >
                    {step.illustration}
                  </IllustrationPanel>

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
              {steps.map((step, index) => {
                const reached = index <= reachedTo
                const card = cn(
                  "hairline flex w-full gap-4 rounded-2xl px-6 pt-4 pb-6 shadow-xs transition-colors content:col-start-1",
                  FADE,
                  reached
                    ? "bg-olive-50 dark:bg-card"
                    : "bg-white dark:bg-card",
                )
                const body = (
                  <StepBody
                    step={step}
                    index={index}
                    reached={reached}
                    showMarker={showMarkers}
                  />
                )

                return (
                  <Fragment key={index}>
                    <li>
                      {interactive ? (
                        <button
                          type="button"
                          data-slot="steps-step"
                          data-reached={reached ? "" : undefined}
                          aria-current={index === active ? "step" : undefined}
                          onClick={() => {
                            setActive(index)
                            setHeld(true)
                          }}
                          className={cn(card, "cursor-pointer text-left")}
                        >
                          {body}
                        </button>
                      ) : (
                        <div
                          data-slot="steps-step"
                          data-reached={reached ? "" : undefined}
                          className={card}
                        >
                          {body}
                        </div>
                      )}
                    </li>

                    {index === 0 ? (
                      <li
                        data-slot="steps-panel"
                        className={cn(
                          "flex items-center justify-center overflow-hidden rounded-2xl bg-linear-to-b from-beige-400 to-beige-500 p-4 tablet:px-0 tablet:py-9 content:col-start-2 content:row-start-1 content:self-stretch dark:bg-card dark:bg-none",
                          /* Its own height only where it stands alone in the
                             column. Beside the list the file gives it
                             `layoutSizingVertical: FILL` against a list that
                             hugs, so it is as tall as the steps are — and our
                             steps run a few pixels taller than the drawn ones,
                             which is exactly why it cannot be a number. */
                          "h-(--steps-panel-narrow) tablet:h-(--steps-panel) content:h-auto",
                          /* How many rows it reaches across, written out
                             because `row-span-full` resolves against the
                             explicit grid and this one has none. */
                          steps.length >= 4
                            ? "content:row-span-4"
                            : "content:row-span-3",
                        )}
                      >
                        {/* The plate does not stretch with the panel: the file
                            keeps it at 520 by 608 and centres it, which at the
                            tablet leaves 121 either side rather than a wider
                            plate, and beside a list taller than the drawn one
                            leaves the extra above and below. */}
                        <div className="relative size-full max-h-(--steps-plate-tall) max-w-(--steps-plate) overflow-hidden rounded-2xl bg-white shadow-md dark:bg-background">
                          {steps.map((other, otherIndex) => (
                            <div
                              key={otherIndex}
                              aria-hidden={
                                otherIndex === active ? undefined : true
                              }
                              className={cn(
                                "absolute inset-0 transition-opacity",
                                FADE,
                                otherIndex === active
                                  ? "opacity-100"
                                  : "opacity-0",
                                /* Only the first is ever shown below the two
                                   columns, and a hidden picture is one the
                                   browser never fetches. */
                                otherIndex === 0 ? "" : "hidden content:block",
                              )}
                            >
                              {other.illustration}
                            </div>
                          ))}
                        </div>
                      </li>
                    ) : null}
                  </Fragment>
                )
              })}
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
