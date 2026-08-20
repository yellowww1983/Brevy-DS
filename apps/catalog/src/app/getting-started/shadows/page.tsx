import { ContentPage, HEADING } from "@/components/content-page"
import { ShadowSwatch } from "@/components/shadow-swatch"
import type { Section } from "@/components/table-of-contents"
import { SHADOWS } from "@/shadows"

const SECTIONS: readonly Section[] = [{ id: "the-scale", title: "The scale" }]

export default function ShadowsPage() {
  return (
    <ContentPage sections={SECTIONS}>
      <h1 className="text-4xl font-bold tracking-tight">Shadows</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Shadows lift an element off the surface and show how far. Use the scale
        to keep elevation consistent across cards, buttons, and overlays.
      </p>

      <h2 id="the-scale" className={HEADING}>
        The scale
      </h2>
      <p className="mt-4 leading-relaxed">
        Each tile uses the class next to it. Offsets are measured from the
        rendered tile. Click a name to copy it.
      </p>

      <ul className="mt-6">
        {SHADOWS.map((shadow) => (
          <ShadowSwatch key={shadow.className} shadow={shadow} />
        ))}
      </ul>
    </ContentPage>
  )
}
