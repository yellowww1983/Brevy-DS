import { docFor } from "@/registry"
import { ContainerFrame } from "@/components/container-frame"
import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import type { Section } from "@/components/table-of-contents"
import { CONTAINER, GRID, GUTTER, INTRO, WIDTHS } from "@/layout"

const SECTIONS: readonly Section[] = [
  { id: "the-container", title: "The container" },
  { id: "the-gutter", title: "The gutter" },
  { id: "the-grid", title: "The grid" },
]

export default async function LayoutPage() {
  return (
    <ContentPage sections={SECTIONS} markdown={await docFor("layout")}>
      <h1 className="text-4xl font-bold tracking-tight">Layout</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <h2 id="the-container" className={HEADING}>
        The container
      </h2>
      {CONTAINER.map((paragraph) => (
        <p key={paragraph} className="mt-4 leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}

      <h2 id="the-gutter" className={HEADING}>
        The gutter
      </h2>
      {GUTTER.map((paragraph) => (
        <p key={paragraph} className="mt-4 leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}

      {WIDTHS.map((entry) => (
        <ContainerFrame
          key={entry.width}
          label={entry.label}
          width={entry.width}
        />
      ))}

      <h2 id="the-grid" className={HEADING}>
        The grid
      </h2>
      {GRID.map((paragraph) => (
        <p key={paragraph} className="mt-4 leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}
    </ContentPage>
  )
}
