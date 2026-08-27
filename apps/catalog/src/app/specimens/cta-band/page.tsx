import { CtaBand } from "@brevy/ui"
import Image from "next/image"
import type { CSSProperties } from "react"

import { CHIP, DARK_PRESET, FIGURES, LIGHT_PRESET } from "@/cta-band"

/** The five numbers a figure is placed by. Written as custom properties so one
 *  pair of literal Tailwind classes can read them at both widths — a class
 *  name built by interpolation is one Tailwind never sees. */
type FigureVars = CSSProperties & {
  "--figure-size": string
  "--figure-inset": string
  "--figure-inset-wide": string
  "--figure-top": string
  "--figure-top-wide": string
}

const px = (value: number) => `${String(value)}px`

/** The leaf the file cuts every one of these to, and one shadow for all six.
 *
 *  The file gives them three different shadows and leaves one with none —
 *  `2xl` on three, `md` on one, `lg` on one. They are Tailwind's own scale
 *  dropped in by hand and drifted apart; the majority one is taken for all
 *  six and DESIGN-FEEDBACK 58 asks which was meant. */
const FIGURE =
  "absolute overflow-hidden rounded-leaf shadow-2xl size-(--figure-size) top-(--figure-top) content:top-(--figure-top-wide)"

function Figures() {
  return (
    <>
      {FIGURES.map((figure) => {
        const style: FigureVars = {
          "--figure-size": px(figure.size),
          "--figure-inset": px(figure.inset),
          "--figure-inset-wide": px(figure.wide),
          "--figure-top": px(figure.top),
          "--figure-top-wide": px(figure.topWide),
        }

        return (
          <div
            key={figure.src}
            style={style}
            className={[
              FIGURE,
              figure.side === "left"
                ? "left-(--figure-inset) content:left-(--figure-inset-wide)"
                : "right-(--figure-inset) content:right-(--figure-inset-wide)",
              /* The middle pair is switched off at the tablet on both pale
                 bands, so the row count goes six, four, none. */
              "wideOnly" in figure ? "hidden content:block" : "",
            ].join(" ")}
          >
            <Image
              src={figure.src}
              alt=""
              width={figure.size}
              height={figure.size}
              className="size-full object-cover"
            />
          </div>
        )
      })}
    </>
  )
}

/** The two leaves the deep band tucks into opposite corners (`25297:4633` at
 *  the foot on the left, `25297:4635` at the head on the right), 168 square
 *  and flush, their 16 corner nesting in the card's own.
 *
 *  A preset rather than a property of the tone: one of the two deep bands
 *  draws them and the other does not, which is the same standing the pale
 *  bands' photographs have. So they arrive through the same slot.
 *
 *  The second is the first turned 180°, so one mask carries both. The
 *  gradients are the mark's own — brand-500 to olive-500 — running down the
 *  foot leaf and back up the head one, which the file draws as a 227° axis and
 *  is two degrees off the corner Tailwind names. */
function Leaves() {
  return (
    <>
      <div className="absolute bottom-0 left-0 size-42 bg-linear-to-b from-brand-500 to-olive-500 mask-brevy-leaf" />
      <div className="absolute top-0 right-0 size-42 rotate-180 bg-linear-to-tr from-olive-500 to-brand-500 mask-brevy-leaf" />
    </>
  )
}

/** Rendered inside a frame on the CTA band page. It lives outside the catalog
 *  shell because the band turns at two widths — the mark steps down, the
 *  figures go — and a breakpoint only means something in a document of its
 *  own. */
export default async function CtaBandSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{
    tone?: string
    chip?: string
    note?: string
    figures?: string
    heading?: string
  }>
}) {
  const query = await searchParams
  const dark = query.tone === "dark"
  const preset = dark ? DARK_PRESET : LIGHT_PRESET
  const note = dark ? DARK_PRESET.note : undefined

  return (
    <CtaBand
      tone={preset.tone}
      heading={query.heading ?? preset.heading}
      description={preset.description}
      button={preset.button}
      chip={query.chip === "on" ? CHIP : undefined}
      note={query.note === "off" ? undefined : note}
      figures={
        query.figures === "off" ? undefined : dark ? <Leaves /> : <Figures />
      }
    />
  )
}
