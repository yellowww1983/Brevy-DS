import { ContentPage, HEADING } from "@/components/content-page"
import { SpacingStep } from "@/components/spacing-step"
import type { Section } from "@/components/table-of-contents"
import { MarkdownText } from "@/components/markdown-text"
import { INTRO, NAMING, SCALE_NOTE, spacingDoc, STEPS } from "@/spacing"

const SECTIONS: readonly Section[] = [
  { id: "the-scale", title: "The scale" },
  { id: "naming", title: "Naming" },
]

export default function SpacingPage() {
  return (
    <ContentPage sections={SECTIONS} markdown={spacingDoc()}>
      <h1 className="text-4xl font-bold tracking-tight">Spacing</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <h2 id="the-scale" className={HEADING}>
        The scale
      </h2>
      <p className="mt-4 leading-relaxed">{SCALE_NOTE}</p>

      <ul className="mt-6">
        {STEPS.map((step) => (
          <SpacingStep key={step.step} step={step} />
        ))}
      </ul>

      <h2 id="naming" className={HEADING}>
        Naming
      </h2>
      {NAMING.map((paragraph) => (
        <p key={paragraph} className="mt-4 leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}
    </ContentPage>
  )
}
