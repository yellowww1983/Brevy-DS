import Link from "next/link"

import {
  ContentPage,
  HEADING,
  ImageSlot,
  LINK,
} from "@/components/content-page"
import type { Section } from "@/components/table-of-contents"

const SECTIONS: readonly Section[] = [
  {
    id: "start-with-what-youre-making",
    title: "Start with what you’re making",
  },
  {
    id: "point-claude-at-the-pieces",
    title: "Point Claude at the pieces you want",
  },
  { id: "describe-the-content", title: "Describe the content, not the design" },
  { id: "review-then-refine", title: "Review, then refine" },
  {
    id: "when-you-need-something-else",
    title: "When you need something that isn’t here",
  },
]

export default function HowToUsePage() {
  return (
    <ContentPage sections={SECTIONS}>
      <h1 className="text-4xl font-bold tracking-tight">How to use</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        You work with this system through Claude. You describe what you want,
        Claude builds it from the Brevy pieces. No design tools, no code editor.
        Here&rsquo;s how to get the most out of it.
      </p>

      <ImageSlot>
        A person typing a request to Claude, with the page assembling
      </ImageSlot>

      <h2 id="start-with-what-youre-making" className={HEADING}>
        Start with what you&rsquo;re making
      </h2>

      <p className="mt-4 leading-relaxed">
        Tell Claude the goal first, not the parts. &ldquo;A landing page for the
        spring caregiver campaign&rdquo; gives Claude more to work with than
        &ldquo;a hero and three cards.&rdquo; It can suggest which blocks fit.
        That&rsquo;s what the catalog is for.
      </p>

      <h2 id="point-claude-at-the-pieces" className={HEADING}>
        Point Claude at the pieces you want
      </h2>

      <p className="mt-4 leading-relaxed">
        Browse Components and Blocks here. When you find something that fits,
        use the Copy button. It gives you the exact phrase to paste to Claude,
        so you name the real piece instead of describing it and hoping Claude
        guesses right.
      </p>

      <ImageSlot>
        The Copy button on a component, and the phrase pasted into Claude
      </ImageSlot>

      <h2 id="describe-the-content" className={HEADING}>
        Describe the content, not the design
      </h2>

      <p className="mt-4 leading-relaxed">
        You bring the words and the intent; the system brings the look.
        &ldquo;Headline about saving caregivers time, three benefits, a sign-up
        button at the bottom&rdquo; is enough. You never pick colors, fonts, or
        spacing. Those are already decided, and that&rsquo;s what keeps every
        page on-brand.
      </p>

      <h2 id="review-then-refine" className={HEADING}>
        Review, then refine
      </h2>

      <p className="mt-4 leading-relaxed">
        Claude shows you the result. If something&rsquo;s off, say so in plain
        language: &ldquo;make the hero shorter,&rdquo; &ldquo;swap the second
        and third sections.&rdquo; You&rsquo;re editing by conversation, not by
        hand.
      </p>

      <ImageSlot>Before and after a refinement</ImageSlot>

      <h2 id="when-you-need-something-else" className={HEADING}>
        When you need something that isn&rsquo;t here
      </h2>

      <p className="mt-4 leading-relaxed">
        If the catalog doesn&rsquo;t have the piece you need, don&rsquo;t force
        it and don&rsquo;t ask Claude to invent one. That&rsquo;s how pages
        drift off-brand. Reach out to the Brevy team and we&rsquo;ll add it
        properly, so it works everywhere including your page.
      </p>

      <hr className="mt-14 border-border" />

      <p className="mt-8 leading-relaxed">
        Ready? Browse the{" "}
        <Link href="/components" className={LINK}>
          Components
        </Link>{" "}
        to see what you can build with.
      </p>
    </ContentPage>
  )
}
