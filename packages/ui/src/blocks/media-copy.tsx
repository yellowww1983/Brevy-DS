import type { ReactNode } from "react"

import { Container } from "../components/container.js"
import { LineMarker } from "../components/line-marker.js"
import { ShapedImage } from "../components/shaped-image.js"
import { cn } from "../lib/utils.js"

/** What colour the pebble in a rung's disc is painted.
 *
 *  The file gives each of its three rungs its own, and the three come from
 *  three unrelated ramps rather than a series: green-500, taupe-300 and
 *  violet-500. Two are the ramp to the value; the taupe is four units off it.
 *  A closed set of three because that is what the file draws, and because a
 *  colour with no series behind it cannot be derived. DESIGN-FEEDBACK 86. */
type MediaCopyTone = "green" | "taupe" | "violet"

const TONES: Record<MediaCopyTone, string> = {
  green: "bg-green-500",
  taupe: "bg-taupe-300",
  violet: "bg-violet-500",
}

/** One rung of the ladder beside the picture. */
type MediaCopyStep = {
  title: string
  description: string
  /** The pebble's colour. The file paints one per rung and never repeats. */
  tone?: MediaCopyTone
}

/** The stepper: three discs down a thread, each beside a line of copy.
 *
 *  An element rather than a component. It is drawn in one section, and its
 *  disc is not the system's `Marker` — 64 across against 36, holding a
 *  coloured pebble where that holds a numeral or a glyph, on a
 *  white-to-neutral ground where that runs olive. Two objects that happen to
 *  be round.
 *
 *  The discs line up with the copy rather than being nudged into place. The
 *  file dials each rung in by hand — 28, then 48, then 40 of padding above
 *  three titles of different lengths — which holds for the copy it was drawn
 *  with and for no other. Here the disc is centred on the first line of its
 *  own title, so the ladder stays true whatever the copy says.
 *  DESIGN-FEEDBACK 85.
 *
 *  The thread runs between discs rather than behind them: a 1px column that
 *  grows with whatever the two rungs it spans happen to be. */
function Stepper({ steps }: { steps: readonly MediaCopyStep[] }) {
  return (
    <ol data-slot="media-copy-stepper" className="flex flex-col">
      {steps.map((step, index) => (
        <li
          key={step.title}
          data-slot="media-copy-step"
          className="flex gap-6 content:gap-9"
        >
          {/* The rail: a disc the height of one line of title, then a thread
              that takes whatever room is left beside the copy. */}
          <div
            data-slot="media-copy-rail"
            aria-hidden
            className="flex shrink-0 flex-col items-center"
          >
            <span className="flex h-(--stepper-disc) items-center">
              <span
                data-slot="media-copy-disc"
                className="hairline flex size-(--stepper-disc) items-center justify-center rounded-full bg-linear-to-b from-white to-neutral-100 shadow-xs dark:from-card dark:to-popover"
              >
                {/* A pebble rather than a circle, and rather than an icon:
                    the file draws an irregular blob at 15 by 16, in the same
                    hand as the highlighter. */}
                <span
                  data-slot="media-copy-dot"
                  className={cn(
                    "h-4 w-3.75 mask-brevy-dot",
                    TONES[step.tone ?? "green"],
                  )}
                />
              </span>
            </span>

            {index < steps.length - 1 ? (
              <span
                data-slot="media-copy-thread"
                className="w-px flex-1 bg-linear-to-b from-neutral-100 to-neutral-300 dark:from-white/5 dark:to-white/10"
              />
            ) : null}
          </div>

          {/* Lifted so the title's first line lands on the middle of the disc
              beside it — one number, half the difference between the disc and
              the leading, rather than a padding dialled in per rung. */}
          <div
            className={cn(
              "flex flex-col gap-2 pt-(--stepper-lift)",
              index < steps.length - 1 && "pb-6",
            )}
          >
            <h3
              data-slot="media-copy-step-title"
              className="text-h3 text-zinc-800 dark:text-foreground"
            >
              {step.title}
            </h3>

            <p
              data-slot="media-copy-step-description"
              className="text-body-lg text-zinc-700 dark:text-muted-foreground"
            >
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** A picture cut to the mark, and a ladder of steps beside it.
 *
 *  The home pages' `Your superhuman social worker` (`20919:10786`), drawn the
 *  same in all four seasons. It is the second consumer of the shaped image,
 *  and the reason that shape stopped being the split hero's private business.
 *
 *  The heading is centred over the whole section rather than sitting in the
 *  copy column, which is what separates this from the split hero: the hero
 *  leads with a heading beside a picture, this leads with a heading above
 *  both. Underneath, the row is 592 and 592 with 16 between.
 *
 *  It takes the system's zinc-800 rather than the drawn emerald-500, which
 *  this section and the benefits grid use and nothing else does — the FAQ,
 *  Steps, the testimonial wall and the segment stack all set their `h2` in
 *  the text colour. DESIGN-FEEDBACK 84.
 *
 *  The picture is a preset layer. The file hand-places it behind the cut —
 *  926 by 617 pushed to (-127, -15) inside a 592 window — so the crop belongs
 *  to whoever brings the photograph, the way the testimonial photographs do.
 *
 *  Dark keeps the arrangement and turns the surfaces: the olive wash is a
 *  tint and darkens to the page's ground, the stepper's discs step to `--card`
 *  and the thread to a flat white at a tenth. The photograph stays — it is a
 *  photograph, not a pale mock — and so does the highlighter, which is a
 *  saturated accent rather than a tint. */
function MediaCopy({
  heading,
  marked,
  description,
  steps,
  picture,
  className,
}: {
  heading: string
  /** The words the highlighter runs under, which follow the heading. The file
   *  marks a phrase rather than the whole line. */
  marked?: string
  description: string
  steps: readonly MediaCopyStep[]
  picture?: ReactNode
  className?: string
}) {
  return (
    <section
      data-slot="media-copy"
      className={cn(
        "bg-linear-to-b from-olive-500 to-white py-24 dark:bg-background dark:bg-none",
        className,
      )}
    >
      <Container>
        <div className="flex flex-col gap-12">
          <div
            data-slot="media-copy-header"
            className="flex flex-col items-center gap-2"
          >
            <h2
              data-slot="media-copy-heading"
              className="text-center font-serif text-h2 text-balance text-zinc-800 dark:text-foreground"
            >
              {heading}
              {marked ? (
                <>
                  {" "}
                  <LineMarker>{marked}</LineMarker>
                </>
              ) : null}
            </h2>

            <p
              data-slot="media-copy-description"
              className="max-w-(--media-copy-lede) text-center text-body-lg text-balance text-zinc-700 dark:text-muted-foreground"
            >
              {description}
            </p>
          </div>

          {/* Two halves at the content width, one column below it — and there
              the picture goes under the ladder rather than away. */}
          <div className="flex flex-col gap-8 content:flex-row content:items-center content:gap-4">
            <div className="content:flex-1">
              <Stepper steps={steps} />
            </div>

            {picture ? (
              <ShapedImage className="w-full content:flex-1">
                {picture}
              </ShapedImage>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}

export { MediaCopy }
export type { MediaCopyStep, MediaCopyTone }
