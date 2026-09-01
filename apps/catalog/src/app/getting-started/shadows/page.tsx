import { docFor } from "@/registry"
import { ContentPage, HEADING } from "@/components/content-page"
import { ShadowSwatch } from "@/components/shadow-swatch"
import type { Section } from "@/components/table-of-contents"
import { INTRO, SCALE_NOTE, SHADOWS } from "@/shadows"

const SECTIONS: readonly Section[] = [{ id: "the-scale", title: "The scale" }]

export default async function ShadowsPage() {
  return (
    <ContentPage sections={SECTIONS} markdown={await docFor("shadows")}>
      <h1 className="text-4xl font-bold tracking-tight">Shadows</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <h2 id="the-scale" className={HEADING}>
        The scale
      </h2>
      <p className="mt-4 leading-relaxed">{SCALE_NOTE}</p>

      <ul className="mt-6">
        {SHADOWS.map((shadow) => (
          <ShadowSwatch key={shadow.className} shadow={shadow} />
        ))}
      </ul>
    </ContentPage>
  )
}
