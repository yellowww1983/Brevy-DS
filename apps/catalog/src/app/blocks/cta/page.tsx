import { docFor } from "@/registry"
import { ContentPage, HEADING } from "@/components/content-page"
import { CtaBandFrame } from "@/components/cta-band-frame"
import { MarkdownText } from "@/components/markdown-text"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, LAYOUT, USE } from "@/cta-band"

const LONG =
  "Get paid for the care you already give, and let somebody else handle the paperwork it comes with"

export default async function CtaBandPage() {
  return (
    <ContentPage markdown={await docFor("cta")}>
      <h1 className="text-4xl font-bold tracking-tight">CtaBand</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>The pale ground</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          Two of the four pages close on this one. Watch the mark step down and
          the photographs go as the tabs narrow — the file draws none of them
          below the tablet.
        </p>
        <CtaBandFrame />

        <h2 className={HEADING}>The deep ground</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The other two pages close on this. The button trades `primary` for `secondary` to keep its footing, and the note under it is drawn only here."
            }
          </MarkdownText>
        </p>
        <CtaBandFrame tone="dark" />

        <h2 className={HEADING}>With the chip</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "One band of the four opens with a pill over its heading. It hugs its line where there is room and fills the column and wraps where there is not."
            }
          </MarkdownText>
        </p>
        <CtaBandFrame chip="on" figures="off" />

        <h2 className={HEADING}>When the copy runs long</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          The drawn height is a floor rather than a fixed number. The file sets
          each band by hand and centres the copy inside; here the heading grows
          the band instead of overflowing it.
        </p>
        <CtaBandFrame heading={LONG} figures="off" />
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
