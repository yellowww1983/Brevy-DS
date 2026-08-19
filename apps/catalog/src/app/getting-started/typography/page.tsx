import { ContentPage, HEADING } from "@/components/content-page"
import type { Section } from "@/components/table-of-contents"
import { ViewportFrame, ViewportProvider } from "@/components/viewport-frame"
import { TYPE_GROUPS } from "@/typography"

const SECTIONS: readonly Section[] = TYPE_GROUPS.map((group) => ({
  id: group.id,
  title: group.title,
}))

export default function TypographyPage() {
  return (
    <ContentPage sections={SECTIONS}>
      <h1 className="text-4xl font-bold tracking-tight">Typography</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Eight roles, named by the job they do rather than how big they are. You
        pick a role; the size, spacing and weight come with it. Every sample
        below is the real thing, and every number beside it is read off that
        sample rather than written down next to it.
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
