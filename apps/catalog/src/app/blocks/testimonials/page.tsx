import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import { TestimonialsFrame } from "@/components/testimonials-frame"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, LAYOUT, testimonialsDoc, USE } from "@/testimonials"

export default function TestimonialsPage() {
  return (
    <ContentPage markdown={testimonialsDoc()}>
      <h1 className="text-4xl font-bold tracking-tight">Testimonials</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>On a photograph</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The one the file draws: a headline figure, a wide quote with a picture beside it, and three plain quotes, over a photograph that dissolves at both sides. Watch the mosaic as the tabs narrow — three columns become one at 1200, and the wide card puts its picture over its quote below the tablet."
            }
          </MarkdownText>
        </p>
        <TestimonialsFrame />

        <h2 className={HEADING}>On beige</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The same section for a page with no photograph of its own. The ground and the copy move together, because white copy on beige is not a state anything should be able to reach."
            }
          </MarkdownText>
        </p>
        <TestimonialsFrame background="beige" />
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
