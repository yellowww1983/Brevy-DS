import { docFor } from "@/registry"
import { AnimationTile } from "@/components/animation-tile"
import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import type { Section } from "@/components/table-of-contents"
import { GROUPS, lengthOf, posterOf, weightOf } from "@/animations"
import {
  DIRECTION,
  GALLERY_NOTE,
  INTRO,
  REDUCED_NOTE,
} from "@/animations-lottie"
import { library } from "@/media-files"

const SECTIONS: readonly Section[] = [
  { id: "mockups", title: "Mockups" },
  { id: "mechanics", title: "Mechanics" },
  { id: "caregiving", title: "Caregiving" },
  { id: "reduced-motion", title: "Reduced motion" },
  { id: "where-new-motion-comes-from", title: "Where new motion comes from" },
]

/** What each set is for, in one line, above its own grid. */
const ABOUT: Record<string, string> = {
  Mockups: "Whole screens. The longest of them and the most to watch.",
  Mechanics: "One move each. These are the ones worth borrowing from.",
  Caregiving: "The three the caregiving pages carry, and the lightest here.",
}

export default async function AnimationsLottiePage() {
  const all = library()

  return (
    <ContentPage
      sections={SECTIONS}
      markdown={await docFor("animations-lottie")}
    >
      <h1 className="text-4xl font-bold tracking-tight">Lottie</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <p className="mt-4 max-w-3xl leading-relaxed">{GALLERY_NOTE}</p>

      {GROUPS.map((group) => (
        <section key={group}>
          <h2 id={group.toLowerCase()} className={HEADING}>
            {group}
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            {ABOUT[group]}
          </p>

          {/* Two across, not three. The written column is 768 and does not
              grow with the window, so the count is the size: three left a tile
              at 240, well under half the canvas these were drawn at, and a
              figure or a checklist inside one could not be read. */}
          <ul
            data-gallery="lottie"
            className="mt-6 grid gap-6 tablet:grid-cols-2"
          >
            {all
              .filter((animation) => animation.group === group)
              .map((animation) => (
                <AnimationTile
                  key={animation.file}
                  name={animation.name}
                  shows={animation.shows}
                  src={`/lottie/${animation.file}`}
                  poster={posterOf(animation.file)}
                  length={lengthOf(animation.seconds)}
                  weight={weightOf(animation.bytes)}
                />
              ))}
          </ul>
        </section>
      ))}

      <h2 id="reduced-motion" className={HEADING}>
        Reduced motion
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">{REDUCED_NOTE}</p>

      <h2 id="where-new-motion-comes-from" className={HEADING}>
        Where new motion comes from
      </h2>
      {DIRECTION.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}
    </ContentPage>
  )
}
