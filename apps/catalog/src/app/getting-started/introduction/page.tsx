import Link from "next/link"

const LINK =
  "rounded-sm font-medium text-primary underline underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

/** Real artwork lands later — until then the frame states what belongs in it,
 *  so an empty page never reads as a finished one. */
function ImageSlot({ children }: { children: string }) {
  return (
    <figure className="my-10 flex min-h-56 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12">
      <figcaption className="max-w-md text-center">
        <span className="mb-2 block text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Image placeholder
        </span>
        <span className="block text-sm text-muted-foreground">{children}</span>
      </figcaption>
    </figure>
  )
}

export default function IntroductionPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <article className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Introduction</h1>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Welcome to the Brevy Design System — a set of ready-made building
          blocks for creating Brevy landing pages and websites, without a
          designer and without writing code from scratch.
        </p>

        <ImageSlot>
          Hero — catalog overview showing components and blocks side by side
        </ImageSlot>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight">
          Who this is for
        </h2>

        <p className="mt-4 leading-relaxed">
          You don&rsquo;t need to be a designer or a developer. If your job is
          to put together a landing page, a campaign page, or a new section —
          this system does the hard part for you. Every block is already styled,
          spaced, and colored the Brevy way. You choose what goes where; the
          system keeps it consistent.
        </p>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight">
          How it works
        </h2>

        <p className="mt-4 leading-relaxed">
          Building a page comes down to three steps:
        </p>

        <p className="mt-6 leading-relaxed">
          <strong className="font-semibold">1. Browse.</strong> Look through the
          Components and Blocks in this catalog. Components are the small pieces
          — buttons, inputs, badges. Blocks are whole sections — a hero, a
          pricing table, a FAQ.
        </p>

        <ImageSlot>Browsing the blocks gallery</ImageSlot>

        <p className="mt-6 leading-relaxed">
          <strong className="font-semibold">2. Pick.</strong> Decide which
          blocks your page needs and in what order — hero at the top, then
          features, then pricing, then a call to action.
        </p>

        <p className="mt-6 leading-relaxed">
          <strong className="font-semibold">3. Assemble.</strong> Tell Claude
          what you picked, in plain language: &ldquo;New page for the spring
          campaign — hero, three features, pricing, FAQ, call to action.&rdquo;
          Claude puts the page together using only these blocks, fills in your
          content, and shows you the result.
        </p>

        <ImageSlot>Claude Code composing a page from a prompt</ImageSlot>

        <p className="mt-6 leading-relaxed">
          You don&rsquo;t touch colors, fonts, or spacing. You choose blocks and
          write the words.
        </p>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight">
          What you won&rsquo;t find here
        </h2>

        <p className="mt-4 leading-relaxed">
          The system is intentionally focused. You&rsquo;ll see two button
          styles, not twenty — the ones Brevy actually uses. That&rsquo;s on
          purpose: fewer choices mean it&rsquo;s much harder to build something
          that looks off.
        </p>

        <p className="mt-6 leading-relaxed">
          If your page needs something that isn&rsquo;t in the catalog — a
          section type that doesn&rsquo;t exist yet, a component we
          haven&rsquo;t built — don&rsquo;t try to force it. Reach out to the
          Brevy team and we&rsquo;ll add it properly. That keeps every page
          consistent, including yours.
        </p>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight">
          Two things worth knowing
        </h2>

        <p className="mt-4 leading-relaxed">
          <strong className="font-semibold">
            Colors, fonts, and spacing are fixed.
          </strong>{" "}
          They&rsquo;re not meant to be changed by hand. This is what makes
          every Brevy page feel like the same brand.
        </p>

        <p className="mt-6 leading-relaxed">
          <strong className="font-semibold">
            If something looks wrong, it&rsquo;s usually the wrong block — not a
            broken one.
          </strong>{" "}
          Before assuming a piece is faulty, check whether a different block
          fits better.
        </p>

        <ImageSlot>Before and after — a page assembled from blocks</ImageSlot>

        <hr className="mt-14 border-border" />

        <p className="mt-8 leading-relaxed">
          Ready to build? Head to{" "}
          <Link href="/components" className={LINK}>
            Components
          </Link>{" "}
          to see the pieces, or Blocks to see full sections.
        </p>
      </article>
    </div>
  )
}
