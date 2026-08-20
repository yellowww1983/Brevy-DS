import { ContentPage, HEADING } from "@/components/content-page"
import type { Section } from "@/components/table-of-contents"
import { ViewportFrame, ViewportProvider } from "@/components/viewport-frame"
import { INTRO, typographyDoc, TYPE_GROUPS } from "@/typography"

const SECTIONS: readonly Section[] = TYPE_GROUPS.map((group) => ({
  id: group.id,
  title: group.title,
}))

export default function TypographyPage() {
  return (
    <ContentPage sections={SECTIONS} markdown={typographyDoc()}>
      <h1 className="text-4xl font-bold tracking-tight">Typography</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        {TYPE_GROUPS.map((group) => (
          <section key={group.id}>
            <h2 id={group.id} className={HEADING}>
              {group.title}
            </h2>
            <p className="mt-4 leading-relaxed">{group.note}</p>
            <ViewportFrame group={group.id} title={group.title} />
          </section>
        ))}
      </ViewportProvider>
    </ContentPage>
  )
}
