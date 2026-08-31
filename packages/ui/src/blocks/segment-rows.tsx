import type { ReactNode } from "react"

import { Container } from "../components/container.js"
import { cn } from "../lib/utils.js"

/** The palette a segment is dressed in.
 *
 *  A tone is three token roles, not one ramp. The file suggests a rule —
 *  `{ramp}-200` behind, `{ramp}-900` on the ink, `{ramp}-700` on the beam —
 *  and then keeps it exactly once, on the violet. The amber takes its ground
 *  from yellow and its ink and beam from orange; the olive takes a 300 rather
 *  than a 200 and swaps its ink for the brand's own emerald. Two of three are
 *  the rule with something overridden, so a tone is written out rather than
 *  derived. DESIGN-FEEDBACK 80.
 *
 *  The ground always runs to the page's own — beige-500 in the light, the
 *  background in the dark — which is the one thing all three agree on.
 *
 *  A tonal ground is a tint rather than an accent, and a tint darkens. So the
 *  whole palette turns end for end in the dark: the ground drops from the
 *  200 to the 950, the ink climbs from the 900 to the 100, and each tone
 *  keeps whichever ramps it owns. Every pair below was measured rather than
 *  picked, and every one clears AA:
 *
 *    violet   #352f55 with #f4eeff   10.96
 *    amber    #40290e with #fde9db   11.58
 *    olive    #3b4335 with #79cfab    5.55
 *
 *  The olive keeps its brand override and cannot keep `--primary` with it:
 *  brand-vivid is chosen against the page's near-black and reads 2.33 on
 *  olive-950, so the ink steps out to brand-300.
 *
 *  The beam is the one place the drawing is corrected rather than mirrored.
 *  As drawn it reads 2.39 on the violet and 1.99 on the olive, both under the
 *  3 to 1 a non-text mark needs; the lightest step that clears it is the 800
 *  on violet and the 900 on olive — the olive's own 800 lands on 2.9999.
 *  Amber's drawn 700 already passes at 3.68 and is left alone.
 *  DESIGN-FEEDBACK 83. */
type SegmentTone = "violet" | "amber" | "olive"

const TONES: Record<
  SegmentTone,
  { ground: string; ink: string; beam: string }
> = {
  violet: {
    ground: "from-violet-200 dark:from-violet-950",
    ink: "text-violet-900 dark:text-violet-100",
    beam: "bg-violet-800 dark:bg-violet-600",
  },
  amber: {
    ground: "from-yellow-200 dark:from-yellow-950",
    ink: "text-orange-900 dark:text-orange-100",
    beam: "bg-orange-700 dark:bg-orange-600",
  },
  olive: {
    ground: "from-olive-300 dark:from-olive-950",
    ink: "text-emerald-500 dark:text-brand-300",
    beam: "bg-olive-900 dark:bg-olive-600",
  },
}

type SegmentRowsItem = {
  /** The name, which the card sets in its own ink and the index repeats in
   *  the page's. */
  title: string
  description: string
  tone: SegmentTone
  /** A preset layer. The file hand-places a mock of the product inside a
   *  white card — chat bubbles, an icon list of programs — and that artwork
   *  is Brevy's own rather than a shape this block can name. */
  illustration?: ReactNode
}

/** The list of names beside the stack.
 *
 *  Drawn once, on one page, at one width — the only layout of its kind in the
 *  file. It is not a paragraph: it names each segment and darkens the one the
 *  reader is on, which the live page confirms by moving the mark as the cards
 *  arrive. Rendered here without that movement: `active` says which is lit,
 *  and nothing yet decides it.
 *
 *  It is not a link either. The live page draws it in `<p>` with no anchor
 *  and no handler, so it reports where you are rather than taking you
 *  somewhere. */
function Index({
  items,
  active,
}: {
  items: readonly SegmentRowsItem[]
  active: number
}) {
  return (
    <ol
      data-slot="segment-rows-index"
      className="hidden shrink-0 flex-col gap-6 pt-9 content:flex content:w-66.25"
    >
      {items.map((item, position) => (
        <li
          key={item.title}
          data-slot="segment-rows-index-item"
          data-active={position === active ? "" : undefined}
          className={cn(
            "text-base/4 transition-colors duration-200",
            position === active
              ? "font-semibold text-zinc-800 dark:text-foreground"
              : "text-zinc-500 dark:text-muted-foreground",
          )}
        >
          {item.title}
        </li>
      ))}
    </ol>
  )
}

/** Segments, one card each, each in its own colour.
 *
 *  The For Organizations page's `Built for the organizations that serve
 *  seniors` (`23272:2304`), and the partner page's copy of it — which is
 *  switched off, the fourth section in this file to be.
 *
 *  It is the sibling of the benefits grid and not a variant of it: they share
 *  a centred serif heading and nothing under it. Where that one puts three
 *  equal cards across a row with the picture over the copy, this one stacks
 *  full-width cards with the copy beside the picture, paints each in its own
 *  palette, and stands a list of names next to the stack. Different card,
 *  different columns, different ground.
 *
 *  The card carries neither a thread nor a shadow. It is the only card in the
 *  system that stands on nothing but its own colour, which is what the tonal
 *  ground is for; the white card inside it is the one that floats.
 *
 *  That white card is not the illustration panel the step and benefit cards
 *  use. Five things differ — 372 against 290, flat white against an
 *  olive-to-white wash, no gradient edge, a double shadow where the panel has
 *  none, and 24 of padding where the panel has none — so it is written here
 *  rather than reached for. It is, however, the same white card the benefit
 *  grid and the step cards already draw, which makes three; if a fourth
 *  arrives, that is the shape to pull out, and the place to do it is a
 *  consolidation of those two blocks rather than here.
 *
 *  The heading is centred and in the page's own zinc-800, which is what the
 *  file draws and what every other section but the benefits grid does.
 *
 *  Dark is not drawn, so it is derived — and it is the same section in another
 *  theme rather than a second arrangement. The tonal ground is a tint and a
 *  tint darkens: every card turns end for end on its own ramp, measured to AA.
 *  Everything else keeps its place, the artwork included; what is inside the
 *  white card is the page's own surfaces, so it turns with the page. The
 *  section's wash becomes the page's ground, and the heading and the index
 *  take the page's ink. */
function SegmentRows({
  heading,
  items,
  active = 0,
  className,
}: {
  heading: string
  items: readonly SegmentRowsItem[]
  /** Which name the index lights. Static for now: the live page moves it as
   *  the cards arrive, and that behaviour is not built yet. */
  active?: number
  className?: string
}) {
  return (
    <section
      data-slot="segment-rows"
      className={cn(
        "bg-linear-to-b from-beige-500 to-white py-24 dark:bg-background dark:bg-none",
        className,
      )}
    >
      <Container>
        <div className="flex flex-col gap-12">
          <h2
            data-slot="segment-rows-heading"
            className="text-center font-serif text-h2 text-balance text-zinc-800 dark:text-foreground"
          >
            {heading}
          </h2>

          {/* The index takes its drawn 265 and the stack its drawn 896, with
              what is left between them. Below the content width the index is
              not drawn at all and the stack has the column to itself. */}
          <div className="flex items-start justify-between">
            <Index items={items} active={active} />

            <ol
              data-slot="segment-rows-list"
              className="flex w-full flex-col gap-4 content:w-224"
            >
              {items.map((item) => {
                const tone = TONES[item.tone]

                return (
                  <li
                    key={item.title}
                    data-slot="segment-rows-card"
                    data-tone={item.tone}
                    className={cn(
                      "flex flex-col gap-6 rounded-2xl bg-linear-to-b to-beige-500 p-6 tablet:flex-row dark:to-background",
                      tone.ground,
                    )}
                  >
                    <div
                      data-slot="segment-rows-copy"
                      /** Both halves take half the row rather than an equal
                       *  share of it. With a zero basis the white card's own
                       *  48 of padding falls outside the space being split,
                       *  and the drawn 412 and 412 come out 388 and 436. */
                      className={cn(
                        "flex min-w-0 flex-1 flex-col justify-between gap-6 tablet:basis-1/2",
                        tone.ink,
                      )}
                    >
                      <h3
                        data-slot="segment-rows-title"
                        className="text-h3 text-balance"
                      >
                        {item.title}
                      </h3>

                      {/* The bar is as tall as the line beside it rather than
                          a fixed height: the file measures 72 where the copy
                          runs two lines and 96 where it runs three, which is
                          the copy's height and not a number anyone chose. */}
                      <div className="flex items-center gap-6">
                        <span
                          data-slot="segment-rows-beam"
                          aria-hidden
                          className={cn(
                            "w-1 shrink-0 self-stretch rounded-full",
                            tone.beam,
                          )}
                        />

                        <p
                          data-slot="segment-rows-description"
                          className="text-body"
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div
                      data-slot="segment-rows-illustration"
                      className="min-h-(--segment-illustration) min-w-0 flex-1 overflow-hidden rounded-2xl bg-white p-6 shadow-md tablet:basis-1/2 dark:bg-card"
                    >
                      {item.illustration}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}

export { SegmentRows }
export type { SegmentRowsItem, SegmentTone }
