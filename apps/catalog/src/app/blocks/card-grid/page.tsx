import { CardGridFrame } from "@/components/card-grid-frame"
import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import { ViewportProvider } from "@/components/viewport-frame"
import { cardGridDoc, INTRO, LAYOUT, USE } from "@/card-grid"

export default function CardGridPage() {
  return (
    <ContentPage markdown={cardGridDoc()}>
      <h1 className="text-4xl font-bold tracking-tight">Card grid</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>The benefits grid</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The Home pages' own three, on the drawn olive-to-white wash. Watch the tabs narrow: the three columns become one and there is no two-column stage between them, because the file draws none. The illustration holds at 290px while the copy under it grows, which keeps the pictures level across a row."
            }
          </MarkdownText>
        </p>
        <CardGridFrame />

        <h2 className={HEADING}>With a chip and a line</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "`chip` and `description` are drawn on neither occurrence of this section — its header is a heading alone, which no other section in the file does. They are here for the page that is not the home page."
            }
          </MarkdownText>
        </p>
        <CardGridFrame options="on" />

        <h2 className={HEADING}>Two cards, on beige</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The count is the number of columns: two through four share the row the way three do. `background` picks the ground — this is the flat beige every other section stands on."
            }
          </MarkdownText>
        </p>
        <CardGridFrame background="beige" cards={2} />

        <h2 className={HEADING}>On white</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "Nothing behind the cards at all, which is what a page already carrying a wash above and below this section wants."
            }
          </MarkdownText>
        </p>
        <CardGridFrame background="white" />
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
