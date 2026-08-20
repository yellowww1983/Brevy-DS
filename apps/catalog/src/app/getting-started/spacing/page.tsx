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
        Nine steps, and every one of them is a number you already know. The
        design is drawn on a four-pixel grid — 96 percent of the three thousand
        gaps and paddings measured in it land on that grid — and
        Tailwind&rsquo;s own ladder is that same grid. So there is nothing to
        invent here, only something to write down: which rungs the design
        reaches for, and what each one is for.
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
        The rest of Tailwind&rsquo;s ladder still works —{" "}
        <code className="font-mono text-xs">p-5</code> will do exactly what you
        expect. It is simply not a step the design reaches for.
      </p>

      <h2 id="naming" className={HEADING}>
        Naming
      </h2>
      <p className="mt-4 leading-relaxed">
        There is no <code className="font-mono text-sm">--space-*</code> token,
        on purpose. Tailwind&rsquo;s number <em>is</em> the value:{" "}
        <code className="font-mono text-sm">p-6</code> is 24px because 6 × 4 is
        24, and that arithmetic is the grid the design was drawn on. Renaming it
        to <code className="font-mono text-sm">p-space-5</code> would put a new
        word in front of a number everyone already reads fluently, and give us a
        second thing to keep in step with the first.
      </p>
      <p className="mt-4 leading-relaxed">
        So use the classes you would use anyway —{" "}
        <code className="font-mono text-sm">p-6</code>,{" "}
        <code className="font-mono text-sm">gap-2</code>,{" "}
        <code className="font-mono text-sm">mt-24</code>. What this page adds is
        which of them are ours.
      </p>
    </ContentPage>
  )
}
