import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import { StepsFrame } from "@/components/steps-frame"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, LAYOUT, stepsDoc, USE } from "@/steps"

export default function StepsPage() {
  return (
    <ContentPage markdown={stepsDoc()}>
      <h1 className="text-4xl font-bold tracking-tight">Steps</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>Cards</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          Three cards across at the desktop tab and one under the other below
          it. This is the page that carries a numbered disc in every card and
          has every one of them switched off, so the preset shows none.
        </p>
        <StepsFrame />

        <h2 className={HEADING}>A panel beside the list</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "Four steps down one half and, beside them, the picture belonging to whichever step the list has reached. It advances a step every 3.5 seconds and starts over; clicking a step takes the list there and stops the advancing. Watch the panel as the tabs narrow: the slider stops — the file draws only the first frame at those widths — and the panel becomes the **second** thing in the column rather than the last, which is what interrupts the numbering after the first step."
            }
          </MarkdownText>
        </p>
        <StepsFrame layout="panel" />

        <h2 className={HEADING}>The discs</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "`showMarkers` on a row of cards puts the disc where the file draws the hidden one, in the corner of the illustration. This is the page that carries one in every card and switches every one of them off."
            }
          </MarkdownText>
        </p>
        <StepsFrame markers="on" />

        <h2 className={HEADING}>With a tail, on white</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "`tail` hangs a button and a line under the steps, which is what the partner page does with the same arrangement. `ground` is the section's own — the olive gradient three pages paint, or the white the app page does."
            }
          </MarkdownText>
        </p>
        <StepsFrame layout="panel" tail="on" ground="white" />
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
