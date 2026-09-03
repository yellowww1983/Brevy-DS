import { docFor } from "@/registry"
import { BannerFrame } from "@/components/banner-frame"
import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import { ViewportProvider } from "@/components/viewport-frame"
import { DARK, INTRO, LAYOUT, USE } from "@/banner"

export default async function BannerPage() {
  return (
    <ContentPage markdown={await docFor("banner")}>
      <h1 className="text-4xl font-bold tracking-tight">Banner</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>With a banner</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The strip stands first and the page starts 48px lower: the navbar is told there is one above it and begins under it rather than at the top. Narrow the tabs past 640 and the sentence drops its prefix rather than running to a second line."
            }
          </MarkdownText>
        </p>
        <BannerFrame />

        <h2 className={HEADING}>Without one</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The same page with the banner left out. Nothing else changes: the navbar sits where it always has, which is what every page that has no banner needs to keep getting."
            }
          </MarkdownText>
        </p>
        <BannerFrame banner={false} />
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

      <h2 className={HEADING}>In the dark</h2>
      {DARK.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}
    </ContentPage>
  )
}
