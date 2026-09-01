import { docFor } from "@/registry"
import { AuthFrame } from "@/components/auth-frame"
import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, LAYOUT, USE } from "@/auth"

export default async function LoginPage() {
  return (
    <ContentPage markdown={await docFor("login")}>
      <h1 className="text-4xl font-bold tracking-tight">Login</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={HEADING}>Beside a photograph</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The split the file draws at the desktop: the copy in one half, a photograph in the other. Watch the tabs narrow — the photograph goes below the content width and the column centres on the wash, which is exactly the tablet the file draws for its centred variant. The eye reveals the password, and the form validates what its own helper claims."
            }
          </MarkdownText>
        </p>
        <AuthFrame />

        <h2 className={HEADING}>Centred, without one</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The file's other variant: the same column alone on the wash at every width. Leaving `photograph` out is all it takes."
            }
          </MarkdownText>
        </p>
        <AuthFrame photograph="off" />
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
