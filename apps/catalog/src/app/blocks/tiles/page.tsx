import { docFor } from "@/registry"
import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import { TilesFrame } from "@/components/tiles-frame"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, LAYOUT, USE } from "@/tiles"

export default async function TilesPage() {
  return (
    <ContentPage markdown={await docFor("tiles")}>
      <h1 className="text-4xl font-bold tracking-tight">Tiles</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>The home pages&rsquo; wall</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "Five tiles of five shapes on a six-column grid: the wide ones take three columns and the narrow ones two, which is the only division that gives both drawn widths. Watch the tabs narrow — the grid becomes one column, every tile runs the full width, and the dark tile stands its cut above its words. It keeps its colours in either theme, being a brand surface, while the pale ones turn with the page."
            }
          </MarkdownText>
        </p>
        <TilesFrame />
      </ViewportProvider>

      <h2 className={HEADING}>Using it</h2>
      {USE.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}

      <h2 className={HEADING}>Layout</h2>
      {LAYOUT.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}
    </ContentPage>
  )
}
