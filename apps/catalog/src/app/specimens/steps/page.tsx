import { Steps } from "@brevy/ui"
import Image from "next/image"

import { CARDS_PRESET, PANEL_PRESET, TAIL } from "@/steps"

/** The mock interface the file draws inside each card, exported per step.
 *
 *  At 2x, WebP, and straight off disk. The softness was never the resolution:
 *  it was three lossy passes stacked — 88 out of Figma, then the optimizer's
 *  default 75. Exported at 3x and resampled down to 2x at 94, so what ships is
 *  already exactly what a retina card shows.
 *
 *  `unoptimized`, therefore. The optimizer has nothing left to do to a file
 *  that is already the right format at the right size, and it was doing it
 *  fourteen times on the first hit of the block page — four frames, three or
 *  four images each — which took the page past a thirty-second navigation and
 *  failed every spec that opens it on a cold build.
 *
 *  `cover` rather than `contain`. The export is the whole drawn frame — its
 *  gradient, its thread and the mock — so at the width the file draws it the
 *  two match to the pixel and nothing is cropped. Contained, it floated inside
 *  the frame instead, and the band of gradient left over above and below read
 *  as a header nobody drew.
 *
 *  Two exports rather than one, swapped at the tablet. The card is 341 wide at
 *  the desktop and 310 at the mobile, which are close enough that one picture
 *  covers both; at the tablet it is 714 against the same 290, and the file
 *  does not scale the mock to fill that — it keeps every piece at its own size
 *  and re-centres it. Stretching the narrow export across the wide box was
 *  what came out enlarged and cropped.
 *
 *  The wide one is `aria-hidden` with an empty alt: it is the same picture of
 *  the same step, and a reader who meets both hears it twice. */
function Art({
  art,
  wide,
  alt,
  priority,
}: {
  art: { src: string; width: number; height: number }
  wide: { src: string; width: number; height: number }
  alt: string
  /** Every card is above the fold in a frame this wide, and Next asks to be
   *  told which images those are rather than discovering it. */
  priority?: boolean
}) {
  return (
    <>
      <Image
        src={art.src}
        alt={alt}
        width={art.width}
        height={art.height}
        priority={priority}
        unoptimized
        className="size-full object-cover object-top tablet:hidden content:block"
      />
      <Image
        src={wide.src}
        alt=""
        aria-hidden
        width={wide.width}
        height={wide.height}
        unoptimized
        className="hidden size-full object-cover object-top tablet:block content:hidden"
      />
    </>
  )
}

/** Rendered inside a frame on the Steps page. It lives outside the catalog
 *  shell because the block turns at the content breakpoint — the cards go from
 *  a row to a column, the panel from a second column to the second thing in
 *  one — and a breakpoint only means something in a document of its own. */
export default async function StepsSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{
    layout?: string
    markers?: string
    tail?: string
    ground?: string
  }>
}) {
  const query = await searchParams
  const panel = query.layout === "panel"

  if (panel) {
    return (
      <Steps
        layout="panel"
        ground={query.ground === "white" ? "white" : PANEL_PRESET.ground}
        eyebrow={PANEL_PRESET.eyebrow}
        heading={PANEL_PRESET.heading}
        description={PANEL_PRESET.description}
        showMarkers={query.markers !== "off"}
        tail={query.tail === "on" ? TAIL : undefined}
        steps={PANEL_PRESET.steps.map((step, index) => ({
          title: step.title,
          description: step.description,
          illustration: (
            <Image
              src={step.art.src}
              alt={`What step ${String(index + 1)} looks like in the product`}
              width={step.art.width}
              height={step.art.height}
              priority={index === 0}
              unoptimized
              className="size-full object-cover object-top"
            />
          ),
        }))}
      />
    )
  }

  return (
    <Steps
      layout="cards"
      ground={query.ground === "white" ? "white" : CARDS_PRESET.ground}
      eyebrow={CARDS_PRESET.eyebrow}
      heading={CARDS_PRESET.heading}
      showMarkers={query.markers === "on"}
      tail={query.tail === "on" ? TAIL : undefined}
      steps={CARDS_PRESET.steps.map((step, index) => ({
        title: step.title,
        description: step.description,
        illustration: (
          <Art
            art={step.art}
            wide={step.wide}
            alt={`Step ${String(index + 1)}: ${step.title}`}
            priority
          />
        ),
      }))}
    />
  )
}
