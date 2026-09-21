import Image from "next/image"

import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import type { Section } from "@/components/table-of-contents"
import {
  CROP,
  GALLERY_NOTE,
  INTRO,
  MOTION,
  SEASONS,
  STYLE,
  USE,
  WASH,
  type Illustration,
} from "@/illustrations"
import { docFor } from "@/registry"

const SECTIONS: readonly Section[] = [
  { id: "the-style", title: "The style" },
  { id: "when-to-use-one", title: "When to use one" },
  { id: "the-four-seasons", title: "The four seasons" },
  { id: "the-wash", title: "The wash" },
  { id: "the-ones-that-move", title: "The ones that move" },
]

/** The frame the written pages already use for a picture, and nothing else.
 *
 *  These ship with their own pale ground rather than a clear one, which is what
 *  the hero's asset does too, so the tile has no ground to supply. It holds in
 *  both themes for the same reason the drawings do: measured on the shipped
 *  hero, the band and the wash are not painted at all on a dark page. They are
 *  a light-mode device, so a dark tile under them would be showing them
 *  somewhere they never appear. */
const FRAME = "w-full rounded-xl border border-border"

/** One drawing at its own proportion.
 *
 *  No tile and no button, which is the difference between this gallery and the
 *  two in `Animations`. Those exist to keep a file off the wire until somebody
 *  asks for it, because a browser handed a video will fetch a frame whether or
 *  not anyone watches. A picture has no such problem: `loading="lazy"` is the
 *  whole of what this needs.
 *
 *  Height comes from the drawing rather than from a grid. The seasons are bands
 *  at 1440 by 426 and the wash is 1440 by 685, so one aspect for all of them
 *  would crop something. */
function Drawing({
  illustration,
  eager,
}: {
  illustration: Illustration
  /** The first one is above the fold on a short page, and Next asks to be told
   *  which those are rather than discovering it. */
  eager?: boolean
}) {
  return (
    <figure
      data-slot="illustration"
      data-id={illustration.id}
      className="mt-8 first:mt-6"
    >
      <figcaption className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-sm font-medium">{illustration.name}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {illustration.light.width}&times;{illustration.height}
        </span>
        <span className="text-xs text-muted-foreground">
          {illustration.where}
        </span>
      </figcaption>

      <div className="mt-3">
        <Image
          src={illustration.light.src}
          alt={illustration.alt}
          width={illustration.light.width}
          height={illustration.height}
          loading={eager ? "eager" : "lazy"}
          priority={eager}
          sizes="(min-width: 48rem) 48rem, 100vw"
          className={FRAME}
        />
      </div>
    </figure>
  )
}

export default async function IllustrationsPage() {
  return (
    <ContentPage sections={SECTIONS} markdown={await docFor("illustrations")}>
      <h1 className="text-4xl font-bold tracking-tight">Illustrations</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <h2 id="the-style" className={HEADING}>
        The style
      </h2>
      {STYLE.map((paragraph) => (
        <p key={paragraph} className="mt-4 leading-relaxed">
          {paragraph}
        </p>
      ))}

      <h2 id="when-to-use-one" className={HEADING}>
        When to use one
      </h2>
      {USE.map((paragraph) => (
        <p key={paragraph} className="mt-4 leading-relaxed">
          {paragraph}
        </p>
      ))}

      <h2 id="the-four-seasons" className={HEADING}>
        The four seasons
      </h2>
      <p className="mt-4 leading-relaxed">{GALLERY_NOTE}</p>

      {/* One after another at one width, rather than a grid. They are the same
          composition four times, and the thing to see is what changes between
          them, which a reader can only do if the drawings line up. Two columns
          would halve them and put a gap where the comparison is. */}
      <div data-slot="seasons" className="mt-2">
        {SEASONS.map((season, index) => (
          <Drawing key={season.id} illustration={season} eager={index === 0} />
        ))}
      </div>

      <p className="mt-8 leading-relaxed">{CROP}</p>

      <h2 id="the-wash" className={HEADING}>
        The wash
      </h2>
      <p className="mt-4 leading-relaxed">
        The other register. It carries no subject, so it goes under type rather
        than beside it.
      </p>
      <Drawing illustration={WASH} />

      <h2 id="the-ones-that-move" className={HEADING}>
        The ones that move
      </h2>
      <p className="mt-4 leading-relaxed">
        <MarkdownText>{MOTION}</MarkdownText>
      </p>
    </ContentPage>
  )
}
