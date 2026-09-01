import { docFor } from "@/registry"
import { ContentPage, HEADING } from "@/components/content-page"
import { HeroCenteredFrame } from "@/components/hero-centered-frame"
import { MarkdownText } from "@/components/markdown-text"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, LAYOUT, USE } from "@/hero-centered"

export default async function HeroCenteredPage() {
  return (
    <ContentPage markdown={await docFor("hero-centered")}>
      <h1 className="text-4xl font-bold tracking-tight">HeroCentered</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>With the chat</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          The home pages&rsquo; hero: a stack of faces above the heading, the
          chat card under it, and the suggestions under that. The frame is live
          — type into the field.
        </p>
        <HeroCenteredFrame />

        <h2 className={HEADING}>With a button</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          The same skeleton with a call to action where the chat card goes, an
          eyebrow where the faces go, and a line of reassurance under the
          button.
        </p>
        <HeroCenteredFrame action="button" />

        <h2 className={HEADING}>Without a picture</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "Leave `image` out and the hero stands on the gradient it paints itself. The file draws no hero this way; a block that cannot stand on its own ground is a block only this site can use."
            }
          </MarkdownText>
        </p>
        <HeroCenteredFrame image="off" />
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
