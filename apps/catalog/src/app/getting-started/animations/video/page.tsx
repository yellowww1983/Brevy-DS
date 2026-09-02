import { docFor } from "@/registry"
import { ContentPage, HEADING } from "@/components/content-page"
import { SceneTile } from "@/components/scene-tile"
import type { Section } from "@/components/table-of-contents"
import { lengthOf, scenePosterOf, weightOf } from "@/animations"
import {
  GALLERY_NOTE,
  INTRO,
  NOT_CODE,
  PAIR,
  REDUCED_NOTE,
  USE,
} from "@/animations-video"
import { backgrounds } from "@/media-files"

const SECTIONS: readonly Section[] = [
  { id: "what-they-are-for", title: "What they are for" },
  { id: "the-library", title: "The library" },
  { id: "reduced-motion", title: "Reduced motion" },
]

export default async function AnimationsVideoPage() {
  const scenes = backgrounds()

  return (
    <ContentPage
      sections={SECTIONS}
      markdown={await docFor("animations-video")}
    >
      <h1 className="text-4xl font-bold tracking-tight">Video</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <h2 id="what-they-are-for" className={HEADING}>
        What they are for
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">{USE}</p>
      <p className="mt-4 max-w-3xl leading-relaxed">{NOT_CODE}</p>
      <p className="mt-4 max-w-3xl leading-relaxed">{PAIR}</p>

      <h2 id="the-library" className={HEADING}>
        The library
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">{GALLERY_NOTE}</p>

      {/* One under the other, at the column's full width. These are painted
          rather than assembled and the detail is the point: two across leaves
          a scene at 372 and the wheelchair on the hospital path is four
          pixels of it. The animated mockups take two columns because a mockup
          at 372 is still a mockup. */}
      <ul data-gallery="video" className="mt-6 flex flex-col gap-10">
        {scenes.map((scene) => (
          <SceneTile
            key={scene.file}
            name={scene.name}
            shows={scene.shows}
            src={`/video/${scene.file}`}
            poster={scenePosterOf(scene.file)}
            orientation={`${scene.orientation} ${String(scene.width)}×${String(scene.height)}`}
            ground={scene.ground ?? "clear"}
            length={lengthOf(scene.seconds)}
            weight={weightOf(scene.bytes)}
            width={scene.width}
            height={scene.height}
          />
        ))}
      </ul>

      <h2 id="reduced-motion" className={HEADING}>
        Reduced motion
      </h2>
      <p className="mt-4 max-w-3xl leading-relaxed">{REDUCED_NOTE}</p>
    </ContentPage>
  )
}
