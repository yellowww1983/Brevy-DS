import type { ReactNode } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "../components/avatar.js"
import { Container } from "../components/container.js"
import { QuoteCard } from "../components/quote-card.js"
import { ShapedImage } from "../components/shaped-image.js"
import { StatFigure } from "../components/stat-figure.js"
import { cn } from "../lib/utils.js"

/** What every tile wears: the radius, the thread and the shadow the file gives
 *  all five. */
const TILE = "hairline overflow-hidden rounded-2xl shadow-xs"

type TilePerson = { name: string; initials: string; photo?: string }

/** The five shapes the mosaic holds. It is a mixed wall rather than a wall of
 *  numbers — three of the five carry none — which is why the block is named
 *  for the tile and not for the statistic. */
type TilesItem =
  | {
      /** The dark tile: a picture cut to the mark, a figure, and a line. The
       *  only tile in the file that inverts the palette. */
      kind: "figure"
      value: string
      unit?: string
      sentence: string
      picture?: ReactNode
    }
  | {
      /** The quotation tile. The wall's own card, reached for rather than
       *  redrawn: `QuoteCard` is a component precisely because this is its
       *  second consumer. */
      kind: "quote"
      quote: string
      author: TilePerson
    }
  | {
      /** A claim over a bar chart. */
      kind: "chart"
      title: string
      label: string
    }
  | {
      /** A figure in a pill, a line under it, and the faces it counts. */
      kind: "pill"
      value: string
      sentence: string
      people: readonly TilePerson[]
    }
  | {
      /** A photograph with a frosted bar across its foot. */
      kind: "photo"
      caption: string
      picture?: ReactNode
    }

function Face({ person }: { person: TilePerson }) {
  return (
    <Avatar>
      {person.photo ? (
        <AvatarImage src={person.photo} alt={person.name} />
      ) : null}
      <AvatarFallback>{person.initials}</AvatarFallback>
    </Avatar>
  )
}

/** The chart: eight dashed rules 49 apart with a bar laid across them.
 *
 *  The rules are drawn 1 wide and dashed 2 on 2 in neutral-300, which is
 *  `--border` to the value in both themes.
 *
 *  An element of this block. One tile in the file draws it, and what it plots
 *  is a single number — so it is a picture of a statistic rather than a chart
 *  anything could be poured into. */
function Chart({ label }: { label: string }) {
  return (
    <div data-slot="tiles-chart" className="flex flex-col items-end gap-2">
      <div aria-hidden className="flex w-full justify-between">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} className="h-(--tiles-chart) w-px dashed-rule" />
        ))}
      </div>

      <div className="-mt-(--tiles-chart) flex w-full flex-col gap-2">
        <p
          data-slot="tiles-chart-label"
          className="text-caption/6 font-bold text-zinc-700 dark:text-muted-foreground"
        >
          {label}
        </p>
        <span
          aria-hidden
          className="h-10 w-full rounded-sm bg-linear-to-r from-emerald-500 to-green-500 dark:from-brand-400 dark:to-green-400"
        />
      </div>
    </div>
  )
}

/** A mixed wall of tiles.
 *
 *  The home pages' `Most caregivers miss benefits they already qualify for`
 *  (`20919:10826`), drawn the same in all four seasons. The research called it
 *  the statistics section; the file draws five tiles and only two of them hold
 *  a number, so it is named for what it is.
 *
 *  It is the testimonial wall's sibling and not the same block. Both put five
 *  cards on a grid at a 16 gutter — but that wall is five of one thing and
 *  this is five of five, and a block whose items are all different shapes is a
 *  different block from one whose items are all the same. The grids differ
 *  too: that one is three columns with a tile spanning two, this one is six
 *  with tiles spanning three and two.
 *
 *  The quotation tile is the exception, and it is not built here at all: it
 *  is `QuoteCard`, the same object the wall draws. It was a second copy of
 *  that markup for one afternoon, and in that time the two had already parted
 *  company over where the mark hangs — which is the argument for the
 *  component rather than for the copy.
 *
 *  Dark turns the ground and the pale tiles and leaves the rest. The beige
 *  wash is a tint and darkens; the white tiles step to `--card`; the dark
 *  tile does not move, being a brand surface the way the CTA band's deep tone
 *  is, and neither does the pill, which is the same surface in miniature; the
 *  photograph and its frosted bar stay, because a photograph is not a tint.
 *
 *  Two things in the chart cannot come along unchanged, both for the same
 *  reason: the brand's green is chosen against a light card and is nearly
 *  black. The title reads 4.06 on the dark card where a 20/600 line needs
 *  4.5, so it steps out to brand-300 the way the segment stack's ink does;
 *  the bar reads 1.41 where a mark needs 3, so its sweep lifts a ramp to
 *  brand-400 into green-400. Both were measured on the painted pixels rather
 *  than picked. */
function Tiles({
  heading,
  items,
  leaves,
  className,
}: {
  heading: string
  items: readonly TilesItem[]
  /** The decoration the file drops in the top right of the column. A slot
   *  rather than a shape: it is Brevy's own composition. */
  leaves?: ReactNode
  className?: string
}) {
  return (
    <section
      data-slot="tiles"
      className={cn("bg-beige-500 py-24 dark:bg-background", className)}
    >
      <Container>
        <div className="relative flex flex-col gap-12">
          {leaves ? (
            <div
              data-slot="tiles-leaves"
              aria-hidden
              className="pointer-events-none absolute -top-8 right-0 hidden h-(--tiles-leaves-height) w-(--tiles-leaves) content:block"
            >
              {leaves}
            </div>
          ) : null}

          <h2
            data-slot="tiles-heading"
            className="mx-auto max-w-(--tiles-heading) text-center font-serif text-h2 text-balance text-zinc-800 dark:text-foreground"
          >
            {heading}
          </h2>

          {/* Six columns rather than three, which is what makes both drawn
              widths come out: the 1200 column less five 16 gutters in six is
              186.67, so a tile over three columns is 592 and one over two is
              390. The file draws it as two rows — 592 and 592, then 390, 389
              and 390 — and a three-column grid cannot hold both.

              Below the content width it is one column and every tile runs the
              full width, which is what the tablet and mobile frames draw. */}
          <ul data-slot="tiles-list" className="grid gap-4 content:grid-cols-6">
            {items.map((item) => {
              const span =
                item.kind === "figure" || item.kind === "quote"
                  ? "content:col-span-3"
                  : "content:col-span-2"

              if (item.kind === "figure") {
                return (
                  <li
                    key={item.sentence}
                    data-slot="tiles-tile"
                    data-kind="figure"
                    /* The picture runs to the tile's own edges and the copy
                       carries the inset, which is why the padding is on the
                       column and not on the tile: the file draws a 236 by 240
                       cut inside a 240 tile with 24 above and below the words
                       beside it. Below the tablet the two stack and the cut
                       takes the width. */
                    className={cn(
                      TILE,
                      span,
                      "flex min-h-(--tiles-row) flex-col gap-6 bg-emerald-500 pt-px pb-6 pl-px hairline-emerald tablet:flex-row tablet:items-stretch tablet:pt-0 tablet:pr-6 tablet:pb-0",
                    )}
                  >
                    {item.picture ? (
                      <ShapedImage className="h-(--tiles-figure-tall) w-full shrink-0 tablet:h-auto tablet:w-(--tiles-figure)">
                        {item.picture}
                      </ShapedImage>
                    ) : null}

                    <div className="flex flex-1 flex-col justify-between gap-6 px-6 tablet:gap-5 tablet:px-0 tablet:py-6">
                      <StatFigure
                        value={item.value}
                        unit={item.unit}
                        className="text-olive-500"
                      />
                      <p className="text-body-lg text-white">{item.sentence}</p>
                    </div>
                  </li>
                )
              }

              if (item.kind === "quote") {
                return (
                  <li
                    key={item.quote}
                    data-slot="tiles-tile"
                    data-kind="quote"
                    className={cn(span, "flex flex-col")}
                  >
                    {/* The system's quote card, not a second drawing of it.
                        The mosaic held its own copy of this markup until the
                        mark went missing from it — a negative layer behind a
                        card that is not its own stacking context paints under
                        the white. One object, one construction, two blocks. */}
                    <QuoteCard
                      quote={item.quote}
                      author={item.author}
                      mark="tile"
                      className="grow"
                    />
                  </li>
                )
              }

              if (item.kind === "chart") {
                return (
                  <li
                    key={item.title}
                    data-slot="tiles-tile"
                    data-kind="chart"
                    className={cn(
                      TILE,
                      span,
                      "hairline flex min-h-(--tiles-row) flex-col justify-between gap-4 bg-white p-6 dark:bg-card",
                    )}
                  >
                    <h3 className="text-h3 text-emerald-500 dark:text-brand-300">
                      {item.title}
                    </h3>
                    <Chart label={item.label} />
                  </li>
                )
              }

              if (item.kind === "pill") {
                return (
                  <li
                    key={item.sentence}
                    data-slot="tiles-tile"
                    data-kind="pill"
                    className={cn(
                      TILE,
                      span,
                      "hairline flex min-h-(--tiles-row) flex-col justify-between gap-6 bg-white p-6 dark:bg-card",
                    )}
                  >
                    <div className="flex flex-col gap-3">
                      <span
                        data-slot="tiles-pill"
                        className="flex w-fit items-center rounded-full bg-olive-500 px-3 py-1"
                      >
                        <StatFigure
                          value={item.value}
                          className="text-emerald-500"
                        />
                      </span>
                      <p className="text-body-lg text-zinc-700 dark:text-muted-foreground">
                        {item.sentence}
                      </p>
                    </div>

                    <AvatarGroup>
                      {item.people.map((person) => (
                        <Face key={person.name} person={person} />
                      ))}
                    </AvatarGroup>
                  </li>
                )
              }

              return (
                <li
                  key={item.caption}
                  data-slot="tiles-tile"
                  data-kind="photo"
                  className={cn(
                    TILE,
                    span,
                    "hairline relative flex min-h-(--tiles-row) flex-col justify-end bg-white dark:bg-card",
                  )}
                >
                  {item.picture ? (
                    <div className="absolute inset-0">{item.picture}</div>
                  ) : null}

                  {/* Frosted rather than solid: the file draws black at 22%
                      with a 12 blur behind it. Positioned, so it stacks over
                      the photograph rather than under it — the tile's own
                      ground is only what shows when no picture is given. */}
                  <div
                    data-slot="tiles-caption"
                    className="relative flex min-h-(--tiles-caption) items-center bg-black/22 px-6 py-4 backdrop-blur-md"
                  >
                    <p className="text-body-lg text-white">{item.caption}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}

export { Tiles }
export type { TilePerson, TilesItem }
