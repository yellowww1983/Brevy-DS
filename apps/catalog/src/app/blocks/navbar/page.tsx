import { ContentPage, HEADING } from "@/components/content-page"
import { MarkdownText } from "@/components/markdown-text"
import { NavbarFrame } from "@/components/navbar-frame"
import { ViewportProvider } from "@/components/viewport-frame"
import { INTRO, MENU, navbarDoc, SCROLL, USE, WIDTH } from "@/navbar"

export default function NavbarPage() {
  return (
    <ContentPage markdown={navbarDoc()}>
      <h1 className="text-4xl font-bold tracking-tight">Navbar</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      {/* The same tabs the typography page uses, so the catalog has one way of
          asking to be shown something at another width. */}
      <ViewportProvider>
        <NavbarFrame />
      </ViewportProvider>

      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
        The frame is live. Switch it to Mobile and open the menu.
      </p>

      <h2 className={HEADING}>Using it</h2>
      {USE.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}

      <h2 className={HEADING}>Width</h2>
      {WIDTH.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}

      <h2 className={HEADING}>Once the page scrolls</h2>
      {SCROLL.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}

      <h2 className={HEADING}>The menu</h2>
      {MENU.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}
    </ContentPage>
  )
}
