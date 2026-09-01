import { docFor } from "@/registry"
import { ContentPage, HEADING } from "@/components/content-page"
import { RadiusSwatch } from "@/components/radius-swatch"
import type { Section } from "@/components/table-of-contents"
import { MarkdownText } from "@/components/markdown-text"
import { INTRO, LEAF, RADIUS, SCALE_NOTE } from "@/radius"

const SECTIONS: readonly Section[] = [
  { id: "the-scale", title: "The scale" },
  { id: "the-leaf", title: "The leaf" },
]

export default async function RadiusPage() {
  return (
    <ContentPage sections={SECTIONS} markdown={await docFor("radius")}>
      <h1 className="text-4xl font-bold tracking-tight">Radius</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <h2 id="the-scale" className={HEADING}>
        The scale
      </h2>
      <p className="mt-4 leading-relaxed">{SCALE_NOTE}</p>

      <ul className="mt-6">
        {RADIUS.map((radius) => (
          <RadiusSwatch key={radius.className} radius={radius} />
        ))}
      </ul>

      <h2 id="the-leaf" className={HEADING}>
        The leaf
      </h2>
      <p className="mt-4 leading-relaxed">
        <MarkdownText>{LEAF[0] ?? ""}</MarkdownText>
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
        <MarkdownText>{LEAF[1] ?? ""}</MarkdownText>
      </p>
    </ContentPage>
  )
}
