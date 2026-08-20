import { ContentPage, HEADING } from "@/components/content-page"
import { SpacingStep } from "@/components/spacing-step"
import type { Section } from "@/components/table-of-contents"
import { STEPS } from "@/spacing"

const SECTIONS: readonly Section[] = [
  { id: "the-scale", title: "The scale" },
  { id: "naming", title: "Naming" },
]

export default function SpacingPage() {
  return (
    <ContentPage sections={SECTIONS}>
      <h1 className="text-4xl font-bold tracking-tight">Spacing</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        The spacing scale keeps rhythm consistent across every page. Use these
        steps for padding, gaps, and margins so elements line up the same way
        wherever they appear.
      </p>

      <h2 id="the-scale" className={HEADING}>
        The scale
      </h2>
      <p className="mt-4 leading-relaxed">
        Each bar is drawn at its real size. Click a name to copy it.
      </p>

      <ul className="mt-6">
        {STEPS.map((step) => (
          <SpacingStep key={step.step} step={step} />
        ))}
      </ul>

      <p className="mt-4 text-sm text-muted-foreground">
        Other Tailwind spacing classes still work.{" "}
        <code className="font-mono text-xs">p-5</code> is simply not a step the
        design uses.
      </p>

      <h2 id="naming" className={HEADING}>
        Naming
      </h2>
      <p className="mt-4 leading-relaxed">
        There are no <code className="font-mono text-sm">--space-*</code>{" "}
        tokens. Tailwind&rsquo;s number is the value:{" "}
        <code className="font-mono text-sm">p-6</code> is 24px because 6 × 4 =
        24, which matches the 4px grid the design uses. A custom name would add
        a second layer to keep in sync.
      </p>
      <p className="mt-4 leading-relaxed">
        Use the standard classes: <code className="font-mono text-sm">p-6</code>
        , <code className="font-mono text-sm">gap-2</code>,{" "}
        <code className="font-mono text-sm">mt-24</code>. This page documents
        which ones the design uses.
      </p>
    </ContentPage>
  )
}
