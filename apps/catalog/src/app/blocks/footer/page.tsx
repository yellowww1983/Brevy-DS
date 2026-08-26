import { ContentPage, HEADING } from "@/components/content-page"
import { FooterFrame } from "@/components/footer-frame"
import { MarkdownText } from "@/components/markdown-text"
import { ViewportProvider } from "@/components/viewport-frame"
import { footerDoc, INTRO, LAYOUT, USE } from "@/footer"

export default function FooterPage() {
  return (
    <ContentPage markdown={footerDoc()}>
      <h1 className="text-4xl font-bold tracking-tight">Footer</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <FooterFrame />
      </ViewportProvider>

      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
        The frame is live. Type into the newsletter field in it.
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
