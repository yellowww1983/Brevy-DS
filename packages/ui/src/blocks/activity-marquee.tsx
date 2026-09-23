import type { ComponentProps } from "react"

import { Chip } from "../components/chip.js"
import { cn } from "../lib/utils.js"

/** One entry in a row: a word, or a pill standing among the words. */
type ActivityMarqueeItem = {
  label: string
  /** Drawn as a pill rather than a word. Only `mix` reads it: in `chips`
   *  everything is a pill already. */
  accent?: boolean
}

type ActivityMarqueeRow = readonly ActivityMarqueeItem[]

/** Three rows, because the section is three rows. A fourth has no duration
 *  to run at and a second has no middle row to run the other way. */
type ActivityMarqueeRows = readonly [
  ActivityMarqueeRow,
  ActivityMarqueeRow,
  ActivityMarqueeRow,
]

type ActivityMarqueeVariant = "mix" | "chips"

/** Written out rather than built, so Tailwind sees each class whole. */
const LAPS = [
  "animate-activity-marquee-1",
  "animate-activity-marquee-2",
  "animate-activity-marquee-3",
] as const

/** The four sets a row is made of. A lap slides two, so the third lands where
 *  the first began and the loop has no seam; two per half rather than one
 *  because ten words are 1144 wide, which is short of the 1408 a row runs to. */
const SETS = [0, 1, 2, 3] as const

/** A word is set exactly as the pill's own label is, so a word and a pill in
 *  one row read as one run of type and only the ground changes. */
const WORD = "shrink-0 text-base font-medium text-zinc-700 dark:text-foreground"

/** Rows of activities sliding past, three of them, with no heading of their own.
 *
 *  Measured at brevy.com (Caregiving): three rows at 80, 100 and 90 seconds a
 *  lap, the middle one running the other way, linear, from the moment the page
 *  loads, with nothing that holds them. The words stand 48 apart and a few of
 *  them are drawn as a pill. The rows run edge to edge until 1408 and are cut
 *  there rather than faded.
 *
 *  `mix` is that page. `chips` makes every entry a pill, which the page does
 *  not draw, and closes the gap: a pill carries its own padding, and the
 *  words' 48 would put 72 between two labels.
 *
 *  Each row is four sets of what it is given. The first is the row a reader
 *  hears; the other three exist only so the loop never shows an end, and are
 *  hidden from anyone listening. All three rows are read, since each is a row
 *  the caller wrote.
 *
 *  Motion stops for anyone who asked it to. The rows still read, standing at
 *  the start of their first set. */
function ActivityMarquee({
  rows,
  label,
  variant = "mix",
  className,
  ...props
}: Omit<ComponentProps<"section">, "children"> & {
  rows: ActivityMarqueeRows
  /** What the rows are, for anyone who cannot see them. There is no heading
   *  here to say it, so without this the section is three lists of words with
   *  no reason given. */
  label: string
  variant?: ActivityMarqueeVariant
}) {
  const chips = variant === "chips"

  return (
    <section
      aria-label={label}
      className={cn("bg-background py-24", className)}
      {...props}
      data-slot="activity-marquee"
      data-variant={variant}
    >
      <div className="mx-auto flex max-w-(--activity-marquee) flex-col gap-6">
        {rows.map((row, index) => (
          <div
            key={index}
            data-slot="activity-marquee-clip"
            className="flex overflow-hidden py-1"
          >
            {/* It has to refuse to shrink. A flex item shrinks to its
                container by default, which would leave the track as wide as
                the row and turn the half it slides into something that is not
                two sets. */}
            <div
              data-slot="activity-marquee-track"
              className={cn(
                "flex w-max shrink-0 motion-reduce:animate-none",
                LAPS[index],
              )}
            >
              {SETS.map((set) => (
                <ul
                  key={set}
                  data-slot="activity-marquee-set"
                  aria-hidden={set === 0 ? undefined : true}
                  /** Every set carries one gap after its last entry, so the
                   *  seam between two sets measures what every other space in
                   *  the row does. */
                  className={cn(
                    "flex min-w-(--activity-marquee-set) shrink-0 items-center",
                    chips
                      ? "gap-(--activity-marquee-chips-gap) pr-(--activity-marquee-chips-gap)"
                      : "gap-(--activity-marquee-gap) pr-(--activity-marquee-gap)",
                  )}
                >
                  {row.map((item, position) => (
                    <li key={position} className="flex shrink-0">
                      {chips || item.accent ? (
                        <Chip variant="filter">{item.label}</Chip>
                      ) : (
                        <span
                          data-slot="activity-marquee-word"
                          className={WORD}
                        >
                          {item.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export { ActivityMarquee }
export type {
  ActivityMarqueeItem,
  ActivityMarqueeRow,
  ActivityMarqueeRows,
  ActivityMarqueeVariant,
}
