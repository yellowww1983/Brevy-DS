import { ContentPage, HEADING as H } from "@/components/content-page"
import { FeatureSliderFrame } from "@/components/feature-slider-frame"
import { MarkdownText } from "@/components/markdown-text"
import { ViewportProvider } from "@/components/viewport-frame"
import { FEATURES, INTRO, LAYOUT, MOTION, TINTS, USE } from "@/feature-slider"
import { docFor } from "@/registry"

export default async function FeatureSliderPage() {
  return (
    <ContentPage markdown={await docFor("feature-slider")}>
      <h1 className="text-4xl font-bold tracking-tight">Feature slider</h1>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {INTRO}
      </p>

      <ViewportProvider>
        <h2 className={H}>The five features</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          <MarkdownText>
            {
              "The arrows work. Press one and watch the words, the artwork and the ground behind it cross-fade together over 300ms, then keep pressing: the fifth comes back to the first. Narrow it to tablet and the two halves stack, copy above artwork."
            }
          </MarkdownText>
        </p>
        <FeatureSliderFrame />
      </ViewportProvider>

      <h2 className={H}>Using it</h2>
      {USE.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}

      <h2 className={H}>Movement</h2>
      {MOTION.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}

      <h2 className={H}>Tints</h2>
      {TINTS.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}

      <ul className="mt-6 max-w-3xl space-y-2">
        {FEATURES.map((feature) => (
          <li key={feature.title} className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {feature.tint}
            </span>
            <span className="leading-relaxed">{feature.title}</span>
          </li>
        ))}
      </ul>

      <h2 className={H}>Layout</h2>
      {LAYOUT.map((paragraph) => (
        <p key={paragraph} className="mt-4 max-w-3xl leading-relaxed">
          <MarkdownText>{paragraph}</MarkdownText>
        </p>
      ))}
    </ContentPage>
  )
}
