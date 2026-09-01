import { ContentPage, HEADING } from "@/components/content-page"
import { LogoCloudFrame } from "@/components/logo-cloud-frame"
import { MarkdownText } from "@/components/markdown-text"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, LAYOUT, logoCloudDoc, USE } from "@/logo-cloud"

export default function LogoCloudPage() {
  return (
    <ContentPage markdown={logoCloudDoc()}>
      <h1 className="text-4xl font-bold tracking-tight">Logo cloud</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>The band</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "Four marks doubled, sliding one copy's width and starting over — hover it and the animation holds. The marks here are logoipsum's: real-looking wordmarks that belong to nobody. The four the file names are other organisations' trademarks, and the block takes its marks as nodes precisely so it never ships one."
            }
          </MarkdownText>
        </p>
        <LogoCloudFrame />
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
