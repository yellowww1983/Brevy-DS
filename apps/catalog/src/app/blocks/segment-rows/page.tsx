import { ContentPage, HEADING as H } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import { SegmentRowsFrame } from "@/components/segment-rows-frame"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, LAYOUT, segmentRowsDoc, TONES, USE } from "@/segment-rows"

export default function SegmentRowsPage() {
  return (
    <ContentPage markdown={segmentRowsDoc()}>
      <h1 className="text-4xl font-bold tracking-tight">Segment rows</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={H}>The three drawn segments</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The For Organizations page's own. Watch the tabs narrow: the index of names leaves at the content width, and the card folds its two columns into one at the tablet. The white card inside holds 372px throughout — the copy beside it is what grows."
            }
          </MarkdownText>
        </p>
        <SegmentRowsFrame />

        <h2 className={H}>A fourth segment</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The tone is per item, so three is what the file draws rather than what the block takes. The fourth here repeats the violet, which is what a page with more segments than palettes would do."
            }
          </MarkdownText>
        </p>
        <SegmentRowsFrame fourth="on" />

        <h2 className={H}>The index on the second name</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "`active` says which name is lit. On the live page it moves as each card arrives on the stack; that behaviour is not built here yet, so this shows the state rather than the movement."
            }
          </MarkdownText>
        </p>
        <SegmentRowsFrame active={1} />
      </ViewportProvider>

      <h2 className={H}>Using it</h2>
      {USE.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}

      <h2 className={H}>Tones</h2>
      {TONES.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}

      <h2 className={H}>Layout</h2>
      {LAYOUT.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}
    </ContentPage>
  )
}
