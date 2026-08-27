import type { ReactNode } from "react"

import { Button } from "../components/button.js"
import { Chip } from "../components/chip.js"
import { Container } from "../components/container.js"
import { cn } from "../lib/utils.js"

/** Which of the two grounds the band stands on.
 *
 *  This is not the theme. The file draws both on the same light page — the
 *  caregiving and organizations bands pale, the partner and app bands deep
 *  green — so a dark band in a light document is a drawn state, not a dark
 *  mode. The prop names the ground; the theme is answered separately below. */
type CtaBandTone = "light" | "dark"

type CtaBandButton = { label: string; href: string }

/** The closing band: a mark, a line, a sentence and one way onward.
 *
 *  Four pages end on this and they end on it identically (`22615:8408`,
 *  `23205:1817`, `25297:4519`, `25109:1684`): a white section with a rounded
 *  1200 card in it, the Brevy mark at 128 above the copy, a serif line, a
 *  sentence, a button. Eight bands across the breakpoints the file draws, and
 *  the skeleton does not move in any of them.
 *
 *  The heading is `h2`, not `h1`. The band closes a page rather than opening
 *  one, and the file sets it 36/48 falling to 30/40 — which is this system's
 *  h2 to the pixel, where h1 would have been 42.
 *
 *  The white underlay breathes 96 above and below the card, which is not what
 *  the band's own frame says. Measured on all eight: the card fills its
 *  section top to bottom, 0 and 0, and the air a reader sees above it belongs
 *  to whatever came before — 96 of it, on eight bands out of eight, because
 *  every other section in the file ends with that much. Our FAQ already
 *  carries it as `py-24`. So the band carries its own rather than leaning on
 *  a neighbour it cannot see: a block that is only spaced correctly when
 *  something else is above it is a block that cannot be placed first, or
 *  alone, which is exactly how the catalog shows it.
 *
 *  Below, the file is split: the two pages whose footer starts flush give it
 *  nothing, the two whose footer has its own 96 give it 96. Symmetric here,
 *  for the same reason.
 *
 *  Height is a floor rather than the drawn fixed number. The file sets each
 *  band's height by hand and centres the copy inside, so the 96 above and
 *  below is what the subtraction left over rather than a rhythm anyone chose.
 *  Written as padding it reproduces the drawn 560 and 640 and lets a longer
 *  heading grow the band instead of overflowing it — which the drawing has no
 *  case for and a page nobody has written yet certainly will. The floor is 80
 *  where the column narrows and 96 above it, which is what the leftovers
 *  measure: 96 and 100 on the wide bands, 82 on the narrow ones.
 *
 *  Dark mode is answered by tone rather than across it. The dark band is a
 *  brand surface, emerald with olive on it, and holds in both themes the way
 *  the olive button and the violet promise card do. The light band is a light
 *  object and cannot: it drops its gradient and takes the app's card the way
 *  the FAQ drops its beige. So the two tones converge in the dark, which is
 *  the honest answer for a file that draws no dark page at all. */
function CtaBand({
  tone = "light",
  chip,
  heading,
  description,
  button,
  note,
  figures,
  className,
}: {
  tone?: CtaBandTone
  /** The pill over the heading. Drawn on one band of the four. */
  chip?: string
  heading: string
  description: string
  button: CtaBandButton
  /** The line under the button, at 12/16. Drawn on the two dark bands. */
  note?: string
  /** The photographs the file scatters behind the copy on the pale bands.
   *  A slot rather than a shape: the six it draws are placed by hand and are
   *  Brevy's own composition, the way the centred hero's figures are, so what
   *  belongs to the block is the layer and not what is in it. */
  figures?: ReactNode
  className?: string
}) {
  const dark = tone === "dark"

  return (
    <section
      data-slot="cta-band"
      data-tone={tone}
      className={cn("bg-white py-24 dark:bg-background", className)}
    >
      <Container>
        <div
          data-slot="cta-band-card"
          className={cn(
            "relative isolate flex min-h-(--cta-height) flex-col items-center justify-center overflow-hidden rounded-2xl px-6 py-20 text-center tablet:py-24",
            dark
              ? "bg-emerald-500"
              : "bg-linear-to-b from-olive-500 to-white dark:bg-card dark:bg-none",
          )}
        >
          {/* Behind the copy and gone below the tablet, which is where the
              file stops drawing them: the narrow bands carry none. */}
          {figures ? (
            <div
              data-slot="cta-band-figures"
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 hidden tablet:block"
            >
              {figures}
            </div>
          ) : null}

          <div className="flex w-full flex-col items-center gap-8">
            {/* Painted rather than cut: the file fills the mark with a
                gradient here, brand-500 down to olive-500, which is the one
                place it does. The mask reveals an ordinary background, so the
                gradient needs no id and two bands on a page cannot collide.

                It belongs to the pale ground and goes with it. Six of the
                eight drawn bands carry it and they are the six pale ones; both
                deep-green bands hide it and close the gap, on two pages that
                made the decision independently (`25297:4519`, `25109:1684`).
                It is not a second prop for the same reason the stacked proof's
                alignment is not one: the ground already decided. The gradient
                runs brand-500 to olive-500, and brand-500 on emerald-500 is
                the top half of a mark nobody would see. */}
            {dark ? null : (
              <div
                data-slot="cta-band-mark"
                className="size-24 shrink-0 bg-linear-to-b from-brand-500 to-olive-500 mask-brevy-lockup-mark tablet:size-32"
              />
            )}

            <div className="flex w-full flex-col items-center gap-12">
              <div className="flex w-full flex-col items-center gap-2">
                {/* Hugging and on one line where there is room, filling the
                    column and wrapping where there is not — which is what the
                    file draws at mobile (`23402:2822`, 310 by 48, padding 16
                    against the wide band's 8). */}
                {chip ? (
                  <Chip className="h-auto w-full px-4 whitespace-normal tablet:h-6 tablet:w-fit tablet:px-2">
                    {chip}
                  </Chip>
                ) : null}

                <h2
                  data-slot="cta-band-heading"
                  className={cn(
                    "max-w-(--cta-copy) font-serif text-h2 text-balance",
                    dark
                      ? "text-olive-500"
                      : "text-emerald-500 dark:text-primary",
                  )}
                >
                  {heading}
                </h2>

                <p
                  data-slot="cta-band-description"
                  className={cn(
                    "max-w-(--cta-copy) text-body-lg text-balance",
                    dark
                      ? "text-white"
                      : "text-zinc-700 dark:text-muted-foreground",
                  )}
                >
                  {description}
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                {/* The two grounds take the two buttons the system already
                    ships, and they are the drawn ones: emerald with olive on
                    it is `primary`, olive with emerald on it is `secondary`,
                    both 48 tall on the leaf. */}
                <Button asChild variant={dark ? "secondary" : "primary"}>
                  <a href={button.href}>{button.label}</a>
                </Button>

                {note ? (
                  <p
                    data-slot="cta-band-note"
                    className={cn(
                      "text-xs/4 text-balance",
                      dark
                        ? "text-white"
                        : "text-zinc-700 dark:text-muted-foreground",
                    )}
                  >
                    {note}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export { CtaBand }
export type { CtaBandButton, CtaBandTone }
