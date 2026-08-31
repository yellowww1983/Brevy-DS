import type { ReactNode } from "react"

import { Chip } from "../components/chip.js"
import { Container } from "../components/container.js"
import { IllustrationPanel } from "../components/illustration-panel.js"
import { cn } from "../lib/utils.js"

/** Which ground the section stands on. The file draws one — an olive-to-white
 *  wash on all four Home pages — and the other two are the grounds every other
 *  block in this system already offers, because a grid of benefits is not a
 *  thing only the home page can have. */
type CardGridBackground = "gradient" | "beige" | "white"

/** One card: a picture of the product, a name for what it does, a line about
 *  it. No action — the file draws none on any of the twelve it paints, and the
 *  section closes on a CTA band instead. */
type CardGridItem = {
  title: string
  description: string
  /** A preset layer, the way the testimonial photographs are. The file
   *  hand-places a mock of the product inside every panel — chat bubbles,
   *  avatars, a list of programs — and those are Brevy's own compositions
   *  rather than a shape this block can name. Notably the icon list turns up
   *  inside one of them, which is artwork rather than API. */
  illustration?: ReactNode
  /** The badge in the panel's corner. The file numbers every benefit card
   *  this way, and it is the same disc the step list uses — so it comes in
   *  through the panel's own slot rather than being painted into the
   *  artwork. */
  marker?: ReactNode
}

/** How many columns the drawn card count wants. Written out because Tailwind
 *  reads source text and never sees a class name built by interpolation. */
const COLUMNS: Record<number, string> = {
  1: "content:grid-cols-1",
  2: "content:grid-cols-2",
  3: "content:grid-cols-3",
  4: "content:grid-cols-4",
}

const GROUND: Record<CardGridBackground, string> = {
  gradient: "bg-linear-to-b from-olive-500 to-white dark:bg-background",
  beige: "bg-beige-500 dark:bg-background",
  white: "bg-white dark:bg-background",
}

/** A row of cards, each showing a piece of the product and saying what it is
 *  for.
 *
 *  Drawn once and repeated four times over — the Home pages' `Unlock the
 *  caregiving support you're missing` (`20919:10703`), identical in all four
 *  seasons — and a third time on the Mobile App page with the same shape.
 *
 *  It is a fixed grid rather than a mosaic. Every card is the same width and
 *  the same height, unlike the testimonial wall where one card takes two
 *  columns; what varies between the drawn cards is only how far the copy runs,
 *  and the row equalises them. So the count is the number of columns, and two
 *  through four share the row the way three do.
 *
 *  It turns 3 to 1, not 3 to 2 to 1. The file draws no two-column stage: at
 *  the tablet the three cards run the full 762 one under the other, which is
 *  a choice it makes with room to spare, and reproducing the drawing beats
 *  inventing a stage nobody drew.
 *
 *  The card is white on a shadow and wears no thread, which is a different
 *  register from every other card this system ships — the FAQ, the panel step,
 *  the testimonial and the chat all sit on `hairline` and `shadow-xs`. That is
 *  the drawing's own distinction and it is kept (DESIGN-FEEDBACK 77): these
 *  cards float over a coloured wash rather than sitting on a page.
 *
 *  The heading is the system's zinc-800 rather than the drawn emerald-500,
 *  which the Home pages use here and nowhere else — the FAQ, Steps and the
 *  testimonial wall all set their `h2` in the text colour (DESIGN-FEEDBACK
 *  76). The chip and the description are drawn on neither occurrence, and are
 *  offered anyway for the same reason the CTA band offers its chip: a block
 *  that only fits the page it was drawn on is a block only that page can use.
 *
 *  Dark drops the wash for `--background` and the cards step to `--card`. The
 *  illustration panel does not turn: it is a brand surface, like the step
 *  marker and the icon list's disc. */
function CardGrid({
  background = "gradient",
  chip,
  heading,
  description,
  items,
  className,
}: {
  background?: CardGridBackground
  /** The pill over the heading. Drawn on neither occurrence. */
  chip?: string
  heading: string
  /** The line under the heading. Drawn on neither occurrence: this section is
   *  the only one in the file whose header is a heading alone. */
  description?: string
  items: readonly CardGridItem[]
  className?: string
}) {
  return (
    <section
      data-slot="card-grid"
      data-background={background}
      className={cn("py-24 dark:bg-none", GROUND[background], className)}
    >
      <Container>
        {/* 48 from the header to the grid, which is the one measurement the
            drawn header carries: the section pads 96 and holds nothing else. */}
        <div className="flex flex-col gap-12">
          <div
            data-slot="card-grid-header"
            className="flex flex-col items-center gap-2"
          >
            {chip ? <Chip>{chip}</Chip> : null}

            <h2
              data-slot="card-grid-heading"
              className="text-center font-serif text-h2 text-balance text-zinc-800 dark:text-foreground"
            >
              {heading}
            </h2>

            {description ? (
              <p
                data-slot="card-grid-description"
                className="max-w-(--steps-lede) text-center text-body-lg text-balance text-zinc-700 dark:text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>

          <ul
            data-slot="card-grid-list"
            className={cn("grid gap-4", COLUMNS[items.length] ?? COLUMNS[3])}
          >
            {items.map((item) => (
              <li
                key={item.title}
                data-slot="card-grid-card"
                className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md dark:bg-card"
              >
                <IllustrationPanel marker={item.marker}>
                  {item.illustration}
                </IllustrationPanel>

                {/* The panel is a fixed 290 and the copy is what grows, which
                    is what the file draws: 454 beside 482 in the same row,
                    with the pictures level. */}
                <div className="flex flex-col gap-2">
                  <h3
                    data-slot="card-grid-title"
                    className="text-h3 text-zinc-800 dark:text-foreground"
                  >
                    {item.title}
                  </h3>

                  <p
                    data-slot="card-grid-card-description"
                    className="text-body-lg text-zinc-700 dark:text-muted-foreground"
                  >
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

export { CardGrid }
export type { CardGridBackground, CardGridItem }
