import { Testimonials, type TestimonialsItem } from "@brevy/ui"
import Image from "next/image"

import {
  AUTHOR,
  BEIGE_PRESET,
  FEATURED,
  PHOTO_PRESET,
  PHOTOGRAPH,
  QUOTES,
  STAT,
} from "@/testimonials"

/** Both pictures ship at the size they are shown at and go past the optimizer.
 *
 *  It has nothing left to do to a WebP that is already the right format at the
 *  right size, and it was doing it once per frame on the first hit of a block
 *  page — which is what took the Steps page past a thirty-second navigation on
 *  a cold build and failed every spec that opened it. */
const ITEMS: readonly TestimonialsItem[] = [
  {
    kind: "stat",
    figure: STAT.figure,
    unit: STAT.unit,
    sentence: STAT.sentence,
  },
  {
    kind: "featured",
    quote: FEATURED.quote,
    portrait: (
      <Image
        src={FEATURED.portrait.src}
        alt={FEATURED.portrait.alt}
        width={FEATURED.portrait.width}
        height={FEATURED.portrait.height}
        priority
        unoptimized
        className="size-full object-cover"
      />
    ),
  },
  ...QUOTES.map((item): TestimonialsItem => ({
    kind: "quote",
    quote: item.quote,
    author: { ...AUTHOR, photo: item.photo },
  })),
]

/** The backdrop covers a band whose aspect changes with the width — 1408 by
 *  736 at the desktop, 390 by 486 at mobile — so it is cropped by the browser
 *  rather than by the export, which is the one place a picture here is not
 *  already the size it is drawn at. */
const Photograph = (
  <Image
    src={PHOTOGRAPH.src}
    alt=""
    width={PHOTOGRAPH.width}
    height={PHOTOGRAPH.height}
    priority
    unoptimized
    className="size-full object-cover"
  />
)

/** Rendered inside a frame on the Testimonials page. It lives outside the
 *  catalog shell because the mosaic turns at the content breakpoint — three
 *  columns become one — and a breakpoint only means something in a document of
 *  its own. */
export default async function TestimonialsSpecimenPage({
  searchParams,
}: {
  searchParams: Promise<{ background?: string }>
}) {
  const query = await searchParams
  const beige = query.background === "beige"
  const preset = beige ? BEIGE_PRESET : PHOTO_PRESET

  return (
    <Testimonials
      background={preset.background}
      heading={preset.heading}
      description={preset.description}
      photograph={beige ? undefined : Photograph}
      items={ITEMS}
    />
  )
}
