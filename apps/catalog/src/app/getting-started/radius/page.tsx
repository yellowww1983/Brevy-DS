import { ContentPage, HEADING } from "@/components/content-page"
import { RadiusSwatch } from "@/components/radius-swatch"
import type { Section } from "@/components/table-of-contents"
import { RADIUS } from "@/radius"

const SECTIONS: readonly Section[] = [
  { id: "the-scale", title: "The scale" },
  { id: "the-leaf", title: "The leaf" },
]

export default function RadiusPage() {
  return (
    <ContentPage sections={SECTIONS}>
      <h1 className="text-4xl font-bold tracking-tight">Radius</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Corner radius sets how soft or sharp an element reads. Use the scale for
        consistent rounding across buttons, cards, and images, plus the leaf for
        brand-specific corners.
      </p>

      <h2 id="the-scale" className={HEADING}>
        The scale
      </h2>
      <p className="mt-4 leading-relaxed">
        Each square uses the class next to it. Sizes are measured from the
        rendered square. Click a name to copy it.
      </p>

      <ul className="mt-6">
        {RADIUS.map((radius) => (
          <RadiusSwatch key={radius.className} radius={radius} />
        ))}
      </ul>

      <p className="mt-4 text-sm text-muted-foreground">
        Other Tailwind radius classes still work. These five are the ones the
        design uses.
      </p>

      <h2 id="the-leaf" className={HEADING}>
        The leaf
      </h2>
      <p className="mt-4 leading-relaxed">
        The leaf is the brand signature:{" "}
        <code className="font-mono text-sm">6px 16px 6px 16px</code>, clockwise
        from the top left. Use it on buttons, photos, and panels that round only
        the corners facing the middle of a layout.
      </p>

      {/* 44px is the button's own height. Written out because a flex row
          resolves width before it stretches height, so an aspect ratio here
          collapses to nothing. */}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <span
          data-leaf
          className="size-11 rounded-leaf border border-border bg-catalog-active"
        />
        <span className="rounded-leaf bg-primary px-6 py-3 text-sm text-primary-foreground">
          On a button
        </span>
        <span className="size-11 rounded-leaf bg-surface-olive" />
      </div>

      <p className="mt-6 leading-relaxed">
        Apply it with <code className="font-mono text-sm">rounded-leaf</code>.
        It is one class instead of four corner classes, so every use stays in
        sync.
      </p>
    </ContentPage>
  )
}
