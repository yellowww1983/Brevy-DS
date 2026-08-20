import Link from "next/link"

import {
  ContentPage,
  HEADING,
  ImageSlot,
  LINK,
} from "@/components/content-page"
import type { Section } from "@/components/table-of-contents"

const SECTIONS: readonly Section[] = [
  { id: "who-this-is-for", title: "Who this is for" },
  { id: "how-it-works", title: "How it works" },
  { id: "what-you-wont-find-here", title: "What you won\u2019t find here" },
  { id: "two-things-worth-knowing", title: "Two things worth knowing" },
]

export default function IntroductionPage() {
  return (
    <ContentPage sections={SECTIONS}>
      <h1 className="text-4xl font-bold tracking-tight">Introduction</h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Welcome to the Brevy Design System, a set of ready-made building blocks
        for creating Brevy landing pages and websites, without a designer and
        without writing code from scratch.
      </p>

      <ImageSlot>
        Hero: catalog overview showing components and blocks side by side
      </ImageSlot>

      <h2 id="who-this-is-for" className={HEADING}>
        Who this is for
      </h2>

      <p className="mt-4 leading-relaxed">
        You don&rsquo;t need to be a designer or a developer. If your job is to
        put together a landing page, a campaign page, or a new section, this
        system does the hard part for you. Every block is already styled,
        spaced, and colored the Brevy way. You choose what goes where; the
        system keeps it consistent.
      </p>

      <h2 id="how-it-works" className={HEADING}>
        How it works
      </h2>

      <p className="mt-4 leading-relaxed">
        Building a page comes down to three steps:
      </p>

      <p className="mt-6 leading-relaxed">
        <strong className="font-semibold">1. Browse.</strong> Look through the
        Components and Blocks in this catalog. Components are the small pieces:
        buttons, inputs, badges. Blocks are whole sections: a hero, a pricing
        table, a FAQ. Both exist for the same reason: consistency across the
        whole journey. Someone who lands on a campaign page, clicks through to
        pricing and ends up on a FAQ should feel one brand the entire way, and
        they do, because every page is built from the same pieces, even when the
        person putting them together isn&rsquo;t a designer.
      </p>

      <ImageSlot>Browsing the blocks gallery</ImageSlot>

      <p className="mt-6 leading-relaxed">
        <strong className="font-semibold">2. Pick.</strong> Decide which blocks
        your page needs and in what order: hero at the top, then features, then
        pricing, then a call to action.
      </p>

      <p className="mt-6 leading-relaxed">
        <strong className="font-semibold">3. Assemble.</strong> Tell Claude what
        you picked, in plain language: &ldquo;New page for the spring campaign:
        hero, three features, pricing, FAQ, call to action.&rdquo; Claude puts
        the page together using only these blocks, fills in your content, and
        shows you the result.
      </p>

      <ImageSlot>Claude Code composing a page from a prompt</ImageSlot>

      <p className="mt-6 leading-relaxed">
        You don&rsquo;t touch colors, fonts, or spacing. You choose blocks and
        write the words.
      </p>

      <h2 id="what-you-wont-find-here" className={HEADING}>
        What you won&rsquo;t find here
      </h2>

      <p className="mt-4 leading-relaxed">
        The system is intentionally focused. You&rsquo;ll see two button styles,
        not twenty, the ones Brevy actually uses. That&rsquo;s on purpose: fewer
        choices mean it&rsquo;s much harder to build something that looks off.
      </p>

      <p className="mt-6 leading-relaxed">
        If your page needs something that isn&rsquo;t in the catalog, such as a
        section type that doesn&rsquo;t exist yet or a component we
        haven&rsquo;t built, don&rsquo;t try to force it. Reach out to the Brevy
        team and we&rsquo;ll add it properly. That keeps every page consistent,
        including yours.
      </p>

      <h2 id="two-things-worth-knowing" className={HEADING}>
        Two things worth knowing
      </h2>

      <p className="mt-4 leading-relaxed">
        <strong className="font-semibold">
          Colors, fonts, and spacing are fixed.
        </strong>{" "}
        They&rsquo;re not meant to be changed by hand. This is what makes every
        Brevy page feel like the same brand.
      </p>

      <p className="mt-6 leading-relaxed">
        <strong className="font-semibold">
          If something looks wrong, it&rsquo;s usually the wrong block, not a
          broken one.
        </strong>{" "}
        Before assuming a piece is faulty, check whether a different block fits
        better.
      </p>

      <ImageSlot>Before and after: a page assembled from blocks</ImageSlot>

      <hr className="mt-14 border-border" />

      <p className="mt-8 leading-relaxed">
        Ready to build? Head to{" "}
        <Link href="/components" className={LINK}>
          Components
        </Link>{" "}
        to see the pieces, or Blocks to see full sections.
      </p>
    </ContentPage>
  )
}
