import { docFor } from "@/registry"
import { ContentPage, HEADING } from "@/components/content-page"
import { HeroSplitFrame } from "@/components/hero-split-frame"
import { MarkdownText } from "@/components/markdown-text"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, LAYOUT, USE } from "@/hero-split"

export default async function HeroSplitPage() {
  return (
    <ContentPage markdown={await docFor("hero-split")}>
      <h1 className="text-4xl font-bold tracking-tight">HeroSplit</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>As the file draws it</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          The picture stands beside the copy at the desktop tab and is gone at
          the other two, where the copy centres itself. Watch the card as you
          switch: it floats at the desktop and lies along the foot below it.
        </p>
        <HeroSplitFrame />

        <h2 className={HEADING}>Without the card</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "Leave `card` out and the hero ends at the copy. The file draws no hero this way — it has one page and the card is on it — but a block that demands a claim is one nobody without a claim can use."
            }
          </MarkdownText>
        </p>
        <HeroSplitFrame card="off" />

        <h2 className={HEADING}>Without the picture</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "Leave `image` out and every width looks like the two the file already draws without one."
            }
          </MarkdownText>
        </p>
        <HeroSplitFrame image="off" />
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
