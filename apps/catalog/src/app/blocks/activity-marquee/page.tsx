import { docFor } from "@/registry"
import { ActivityMarqueeFrame } from "@/components/activity-marquee-frame"
import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, LAYOUT, USE } from "@/activity-marquee"

export default async function ActivityMarqueePage() {
  return (
    <ContentPage markdown={await docFor("activity-marquee")}>
      <h1 className="text-4xl font-bold tracking-tight">Activity marquee</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>Words and a few pills</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The live page: ten activities in every row, most of them words and one or two drawn as the filter chip. Each row picks its own."
            }
          </MarkdownText>
        </p>
        <ActivityMarqueeFrame />

        <h2 className={HEADING}>Every entry a pill</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              '`variant="chips"`: the same rows with every entry a chip, drawn closer together because each pill carries its own padding.'
            }
          </MarkdownText>
        </p>
        <ActivityMarqueeFrame variant="chips" />
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
