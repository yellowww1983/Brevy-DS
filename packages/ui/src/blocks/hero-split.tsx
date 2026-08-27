import { Button } from "../components/button.js"
import { Chat } from "../components/chat.js"
import { Chip } from "../components/chip.js"
import { Container } from "../components/container.js"
import {
  SocialProof,
  type SocialProofPerson,
} from "../components/social-proof.js"
import { cn } from "../lib/utils.js"

/** The same two slots the centred hero carries, named the same, because they
 *  are the same slots: the file draws one skeleton down to `Content` and only
 *  parts company at the row inside it. Anything shared here is shared in
 *  name too, so a reader moving between the two blocks is not learning a
 *  second vocabulary for one idea. */
type HeroSplitIntro =
  | { kind: "eyebrow"; text: string }
  | {
      kind: "socialProof"
      people: readonly SocialProofPerson[]
      label: string
    }
  | { kind: "none" }

type HeroSplitAction =
  | {
      kind: "chat"
      placeholder: string
      /** The accessible name of the round send button. */
      sendLabel: string
      suggestions: readonly string[]
    }
  | { kind: "button"; label: string; href: string; note?: string }

/** The picture beside the copy, and the wash behind everything. The wash is
 *  the same full-height atmosphere the centred hero paints (`22653:4855`);
 *  the picture is the one the mark is cut out of. */
type HeroSplitImage = {
  wash: string
  picture: string
  alt: string
}

/** The card that hangs off the picture. Optional, because a block that
 *  demands a claim is a block that cannot be used by anyone without one —
 *  the file draws it on its single page and has no case for the absence. */
type HeroSplitCard = {
  /** The line the file sets in violet and a heavier weight. Drawn once, as a
   *  figure; the shape only asks for something worth leading with. */
  highlight: string
  sentence: string
}

/** The photograph, cut to the Brevy mark.
 *
 *  The file masks it with a boolean union of two mirrored vectors
 *  (`22653:4876`). That shape is the brand mark, but it is not the lockup's
 *  path: the file draws the two separately and parts this one's quadrants by
 *  half as much, which is the difference between a mark and a window cut in a
 *  photograph. The token carries the drawn geometry; see `--mask-brevy-mark`.
 *  Hard-edged: no fade, no gradient, unlike the centred hero's band —
 *  `blendMode: PASS_THROUGH`, opacity 1.
 *
 *  The mask is not a prop and is not meant to become one. A client swaps the
 *  photograph inside it; the shape is the identity, and a hero wearing
 *  somebody else's silhouette is not this hero.
 *
 *  Kept as its own piece here rather than inlined, because it is not this
 *  hero's alone. Counted across the file: fifteen nodes, which collapse to two
 *  drawings — the home pages' `Your superhuman social worker` (four seasons by
 *  three breakpoints) and this hero — plus the Open Graph image. Two places,
 *  not twenty, and the second of them is a content section rather than a hero.
 *  So the day that section is built, this lifts out whole. */
function ShapedPicture({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      data-slot="hero-split-picture"
      className="hidden h-(--hero-split-picture-height) w-(--hero-split-picture) shrink-0 mask-brevy-mark content:block"
    >
      <img src={src} alt={alt} className="size-full object-cover" />
    </div>
  )
}

/** The split hero. A column of copy with a picture beside it, and a card of
 *  reassurance hanging across the two.
 *
 *  It is the centred hero's sibling rather than its cousin: the same chain of
 *  frames, the same 1408 wrapper, the same beige-to-white ground, the same
 *  full-height wash, the same 670, the same serif heading at 42/36/30, the
 *  same 20/28 under it, the same two slots. They part at one node — where one
 *  stacks its content, this one sets it in a row of 576 and 592 with 32
 *  between (`22653:4854`).
 *
 *  It is a split only where the row fits. The file draws no picture at all
 *  below the desktop: it does not shrink and it does not drop under the copy,
 *  it is simply absent from the tablet and mobile frames, and the copy centres
 *  itself in the space. So two thirds of this block's life is a centred
 *  column, and the row is the exception rather than the rule.
 *
 *  The row arrives at the content breakpoint rather than the drawn desktop,
 *  for the reason the FAQ's two columns do: 576 plus 32 plus 592 is 1200 and
 *  fits nothing narrower, so 1200 is where it can first exist. The file draws
 *  1440 and 810 and nothing between, so the width it turns at is a choice
 *  either way; this one is the smallest width at which the drawing is true.
 *
 *  The card changes nature with it. Where there is a picture it floats across
 *  the seam between the picture and the ground; where there is not, it lies
 *  along the foot of the section as a band with only its top corners rounded
 *  and no shadow at all, and its height is what makes the section reach 670.
 *
 *  Dark follows the centred hero, which follows the app: the ground drops the
 *  beige for `--background`, the heading moves to `--primary`, and the
 *  photograph goes, because a lit photograph under a dark card is a light
 *  hero wearing dark parts. */
function HeroSplit({
  heading,
  description,
  intro,
  action,
  image,
  card,
  className,
}: {
  heading: string
  description: string
  intro: HeroSplitIntro
  action: HeroSplitAction
  image?: HeroSplitImage
  card?: HeroSplitCard
  className?: string
}) {
  return (
    <section
      data-slot="hero-split"
      className={cn(
        "relative isolate flex min-h-(--hero-height) flex-col overflow-hidden bg-linear-to-b from-beige-500 to-white dark:bg-background dark:bg-none",
        className,
      )}
    >
      {image ? (
        <img
          data-slot="hero-split-wash"
          src={image.wash}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover dark:hidden"
        />
      ) : null}

      {/* The row takes the height and centres in it, which is where the file
          puts it: no padding above, `alignP CENTER` on both frames that could
          have held one. */}
      <Container className="relative flex flex-1 items-center">
        <div
          data-slot="hero-split-row"
          className="flex w-full flex-col items-center gap-8 content:flex-row"
        >
          <div
            data-slot="hero-split-copy"
            className="w-full text-center content:w-(--hero-split-copy) content:text-left"
          >
            {/* The file does not run its copy to the edge of the column it
                gives it. Inside 576 the text sits in 491 and the line under
                the heading in 391 (`22653:4858`, `22653:4861`) — the same
                thing the centred hero does when it holds its lede narrower
                than its heading, and the reason the heading breaks where the
                drawing breaks it rather than running on for the full column.
                Only where the row exists: below it the copy centres and the
                file gives it the whole width. */}
            <div className="content:w-(--hero-split-text)">
              <h1
                data-slot="hero-split-heading"
                className="font-serif text-h1 text-balance text-brand-500 dark:text-primary"
              >
                {heading}
              </h1>

              <p
                data-slot="hero-split-description"
                className="mt-2 text-body-lg text-balance text-zinc-800 content:max-w-(--hero-split-lede) dark:text-muted-foreground"
              >
                {description}
              </p>

              {/* The slot sits 24 under the copy rather than above the heading,
                which is where the centred hero puts its own. That is the
                drawing: the split hero opens with the heading and carries its
                proof beneath the line (`22653:4858`, 24 between the two
                groups). One position for all three states, so the slot stays
                one slot — the file draws only the faces here, and an eyebrow
                in this place reads as a second line of reassurance rather
                than a kicker, which is the shape this hero has room for.

                The faces stack: the sentence sits beneath them rather than
                beside, because at no width does this hero have room for the
                555 the wide row measures. */}
              {intro.kind === "socialProof" ? (
                <SocialProof
                  people={intro.people}
                  label={intro.label}
                  layout="stacked"
                  className="mt-6"
                />
              ) : null}

              {intro.kind === "eyebrow" ? (
                <p
                  data-slot="hero-split-eyebrow"
                  className="mt-6 text-lg text-beige-900 dark:text-muted-foreground"
                >
                  {intro.text}
                </p>
              ) : null}
            </div>

            {/* 64 down to the action, 48 where the column narrows. The action
                is not inside the 491: the file gives its row the full 576. */}
            <div
              data-slot="hero-split-action"
              className="mt-12 flex flex-col items-stretch gap-3 tablet:mt-16 tablet:items-center content:items-start"
            >
              {action.kind === "chat" ? (
                <>
                  <Chat
                    placeholder={action.placeholder}
                    sendLabel={action.sendLabel}
                    className="w-full"
                  />

                  {action.suggestions.length > 0 ? (
                    <div className="flex w-full flex-col gap-3 tablet:flex-row tablet:flex-wrap tablet:justify-center tablet:gap-x-4 tablet:gap-y-3 content:justify-start">
                      {action.suggestions.map((suggestion) => (
                        <Chip
                          key={suggestion}
                          variant="suggestion"
                          className="w-full tablet:w-fit"
                        >
                          {suggestion}
                        </Chip>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <Button asChild className="tablet:w-72">
                    <a href={action.href}>{action.label}</a>
                  </Button>

                  {action.note ? (
                    <p
                      data-slot="hero-split-note"
                      className="text-sm/6 text-beige-900 dark:text-muted-foreground"
                    >
                      {action.note}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </div>

          {image ? <ShapedPicture src={image.picture} alt={image.alt} /> : null}
        </div>
      </Container>

      {/* Two objects in one, which is what the file draws. Along the foot it
          is a band the width of the page, rounded at the top only, and it
          carries a line rather than a shadow: flat black at 10% on its top
          edge alone (`22657:503`, `22657:508`), which is what holds it off a
          ground it otherwise runs straight into. Its height is what carries
          the section to 670.

          At the desktop it lifts off that foot and hangs across the picture's
          left edge — 184 out and 107 up — where the shadow and the fourth
          corner arrive and the line goes: the drawn card has `strokes: []`
          and two drop shadows, so the two treatments are alternatives rather
          than a pair. */}
      {card ? (
        <div
          data-slot="hero-split-card"
          className="relative rounded-t-2xl border-t border-band-edge bg-violet-50 px-6 py-4 content:absolute content:bottom-(--hero-split-card-bottom) content:left-1/2 content:w-(--hero-split-card) content:-translate-x-(--hero-split-card-x) content:rounded-2xl content:border-t-0 content:shadow-lg"
        >
          {/* No balancing here, unlike the heading and the lede. The file
              fills this box: two lines, the first one run to the edge. A
              balanced pair would even them out and pull both off the width the
              card was drawn to show. */}
          <p className="text-body-lg font-semibold text-violet-900">
            {card.highlight}
          </p>
          <p className="mt-2 text-body-lg text-zinc-700">{card.sentence}</p>
        </div>
      ) : null}
    </section>
  )
}

export { HeroSplit }
export type { HeroSplitAction, HeroSplitCard, HeroSplitImage, HeroSplitIntro }
