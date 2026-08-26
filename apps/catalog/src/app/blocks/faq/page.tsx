import { ContentPage, HEADING } from "@/components/content-page"
import { FaqFrame } from "@/components/faq-frame"
import { MarkdownText } from "@/components/markdown-text"
import { ViewportProvider } from "@/components/viewport-frame"
import { faqDoc, INTRO, LAYOUT, USE } from "@/faq"

export default function FaqPage() {
  return (
    <ContentPage markdown={faqDoc()}>
      <h1 className="text-4xl font-bold tracking-tight">FAQ</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <FaqFrame />
      </ViewportProvider>

      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
        The frame is live. Open a question in it.
      </p>

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
