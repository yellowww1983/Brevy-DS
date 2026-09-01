import { docFor } from "@/registry"
import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import { MediaCopyFrame } from "@/components/media-copy-frame"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, LAYOUT, USE } from "@/media-copy"

export default async function MediaCopyPage() {
  return (
    <ContentPage markdown={await docFor("media-copy")}>
      <h1 className="text-4xl font-bold tracking-tight">Media and copy</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>The home pages&rsquo; section</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The heading runs across the whole section with the highlighter under its last two words, and the ladder stands beside a photograph cut to the mark. Watch the tabs narrow: the two halves become one column and the picture goes underneath rather than away, and the cut keeps its proportion at each width because it carries it itself."
            }
          </MarkdownText>
        </p>
        <MediaCopyFrame />
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
