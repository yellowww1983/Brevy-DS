import { Button } from "../components/button.js"
import { Chat } from "../components/chat.js"
import { Chip } from "../components/chip.js"
import { Container } from "../components/container.js"
import {
  SocialProof,
  type SocialProofPerson,
} from "../components/social-proof.js"
import { cn } from "../lib/utils.js"

/** What sits above the heading. One slot, three states, never two at once:
 *  the file draws an eyebrow or a stack of faces in this position and never
 *  both, across seven samples including one page that swaps them between
 *  breakpoints (`23205:3306` eyebrow on the wide page, `23402:998` faces on
 *  the narrow one). Two independent switches would let a page be built that
 *  the drawing does not know. */
type HeroCenteredIntro =
  | { kind: "eyebrow"; text: string }
  | {
      kind: "socialProof"
      people: readonly SocialProofPerson[]
      label: string
    }
  | { kind: "none" }

/** What sits under the heading. The two drawn heroes put different things in
 *  the same place in the same skeleton, which is the whole reason this is one
 *  block: the chat card with its suggestions (`20919:10405`), or a call to
 *  action with an optional line of reassurance under it (`25274:3609`). */
type HeroCenteredAction =
  | {
      kind: "chat"
      placeholder: string
      /** The accessible name of the round send button. */
      sendLabel: string
      /** Each becomes a `prompt` chip, which is a real button: focusable,
       *  pressable, announced as a control, because that is what the design
       *  draws under the chat.
       *
       *  It carries no handler and this block cannot give it one. A handler is
       *  a function, a server component may not pass one, and wiring a press
       *  to the chat's own value would mean making `Chat` controlled — a
       *  change to that component rather than to this block. A page that wants
       *  the press to do something drives it from its own client boundary. */
      suggestions: readonly string[]
    }
  | { kind: "button"; label: string; href: string; note?: string }

/** Two layers, not one. The file paints a full-height wash behind everything
 *  (`20919:10373`, 1408 by 670) and a separate band along the foot
 *  (`20919:10374`, 426 tall), and the band is masked rather than faded by an
 *  overlay: `Fade` carries `isMask: true`.
 *
 *  The band is one picture. The file lays the season, the two figures and the
 *  birds as three rectangles it placed by hand, which is composition rather
 *  than structure: a client brings one file with whatever is in it. */
type HeroCenteredImage = {
  wash: string
  band: string
  /** The band is the picture a reader sees; the wash is atmosphere and is
   *  hidden from the accessibility tree. */
  alt: string
}

/** The ramp the file masks the band with: nothing at the edge, opaque from
 *  14% to 78%, nothing again at 99%.
 *
 *  It runs left to right in the file, not top to bottom. Figma hands the axis
 *  over as a matrix rather than an angle, and `Fade` carries a=1.018, b=0
 *  (`23365:2570`) — the ramp reads off x, so it is the sides that dissolve.
 *  The softness along the top of the drawn hero is painted into the artwork
 *  itself, and the foot is a hard crop, because the band ends where the page
 *  does and nobody sees the cut.
 *
 *  Both of those only hold for artwork drawn to fit this hero. A picture a
 *  client brings has a square top and a square bottom, so the same ramp runs
 *  on the other axis too and the two masks intersect. The horizontal pair is
 *  the file's; the vertical pair is the file's numbers put to work where the
 *  file relied on the paint.
 *
 *  Written out rather than composed, because Tailwind scans source text and
 *  never sees a class name built by interpolation. */
const BAND_MASK =
  "[mask-image:linear-gradient(to_right,transparent_0%,black_14%,black_78%,transparent_99%),linear-gradient(to_bottom,transparent_0%,black_14%,black_78%,transparent_99%)] [mask-composite:intersect]"

/** The centred hero. An eyebrow or a stack of faces, a serif heading, a line
 *  under it, then either a chat card or a button — over a picture that fades
 *  into the page at the top and the bottom.
 *
 *  Two of the website's five heroes are this, and they are the same object:
 *  the same chain of frames, the same 40 above the copy, the same 24 down to
 *  the action, the same 8 twice inside the column, the same beige-to-white
 *  ground. What differs is what goes in the two slots, which is what the
 *  props are.
 *
 *  Heights are the drawn ones as a floor rather than a ceiling: the file fixes
 *  670 (757 at mobile) and leaves the slack under the copy for the band to
 *  fill, so the copy sits at the top and the band at the foot. A longer
 *  heading grows the section instead of overflowing it, which the drawing has
 *  no case for and a real page will.
 *
 *  The picture is optional. Every hero the file draws has one, so a hero
 *  without it is a step past the drawing — but a block that cannot stand on
 *  its own ground is a block that only this site can use, and the ground is
 *  already a gradient the section paints itself.
 *
 *  In the dark the band drops the beige and paints `--background`, the way the
 *  FAQ's does, and the heading moves to `--primary`, which the token file
 *  binds to brand-vivid there: the drawn brand-500 reads at 3.08 to 1 on a
 *  dark page against brand-vivid's 4.49. */
function HeroCentered({
  heading,
  description,
  intro,
  action,
  image,
  className,
}: {
  heading: string
  description: string
  intro: HeroCenteredIntro
  action: HeroCenteredAction
  image?: HeroCenteredImage
  className?: string
}) {
  return (
    <section
      data-slot="hero-centered"
      className={cn(
        "relative isolate min-h-(--hero-height-narrow) overflow-hidden bg-linear-to-b from-beige-500 to-white tablet:min-h-(--hero-height) dark:bg-background dark:bg-none",
        className,
      )}
    >
      {/* The picture is a light one — the file draws watercolour, and every
          hero it draws is a pale page. On a dark page it would stay pale
          under a dark card and a dark chip, which is a light hero wearing
          dark parts rather than a dark hero. The app file draws no hero with
          a picture, so there is nothing to copy; the FAQ is the nearest thing
          this system has already settled, and it drops its beige band in the
          dark and stands on `--background`. This does the same. */}
      {image ? (
        <div
          data-slot="hero-centered-picture"
          className="absolute inset-0 dark:hidden"
        >
          <img
            data-slot="hero-centered-wash"
            src={image.wash}
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover"
          />
          <div
            data-slot="hero-centered-band"
            className={cn(
              "absolute inset-x-0 bottom-0 h-(--hero-band)",
              BAND_MASK,
            )}
          >
            <img
              src={image.band}
              alt={image.alt}
              className="size-full object-cover object-bottom"
            />
          </div>
        </div>
      ) : null}

      <Container className="relative pt-10">
        <div
          data-slot="hero-centered-copy"
          className="mx-auto flex max-w-(--hero-copy) flex-col items-center gap-6"
        >
          <div className="flex w-full flex-col items-center gap-2">
            {intro.kind === "eyebrow" ? (
              <p
                data-slot="hero-centered-eyebrow"
                className="text-center text-lg text-beige-900 dark:text-muted-foreground"
              >
                {intro.text}
              </p>
            ) : null}

            {intro.kind === "socialProof" ? (
              <SocialProof people={intro.people} label={intro.label} />
            ) : null}

            {/* The heading takes the whole column and the line under it does
                not: the file gives the heading 794 and holds the line to a
                narrower box on every page it draws, which is what puts the
                partner page's line on three rows rather than two.

                Both lines balance rather than filling greedily. A centred
                column breaks where the last word happens to fall, and the
                drawn copy is not what a page will carry: the file's own home
                heading leaves "need." alone on a third line here. Balancing
                is the only way to hold that for copy nobody has written yet,
                which is what a block takes as a prop. */}
            <div className="flex w-full flex-col items-center gap-2">
              <h1
                data-slot="hero-centered-heading"
                className="w-full text-center font-serif text-h1 text-balance text-brand-500 dark:text-primary"
              >
                {heading}
              </h1>
              <p
                data-slot="hero-centered-description"
                className="max-w-(--hero-lede) text-center text-body-lg text-balance text-zinc-800 dark:text-muted-foreground"
              >
                {description}
              </p>
            </div>
          </div>

          {action.kind === "chat" ? (
            <div
              data-slot="hero-centered-action"
              className="flex w-full flex-col items-center gap-2"
            >
              <Chat
                placeholder={action.placeholder}
                sendLabel={action.sendLabel}
                className="w-full"
              />

              {/* Two by two where there is room, one under the other where
                  there is not. The file wraps every chip in a Menubar item
                  left over from shadcn, whose 6 above and below is the only
                  part of that wrapper worth keeping: it is the 12 between
                  rows. The wrapper itself is not drawn, only inherited. */}
              {action.suggestions.length > 0 ? (
                <div
                  data-slot="hero-centered-suggestions"
                  className="flex w-full flex-col gap-3 tablet:flex-row tablet:flex-wrap tablet:justify-center tablet:gap-x-4 tablet:gap-y-3"
                >
                  {action.suggestions.map((suggestion) => (
                    <Chip
                      key={suggestion}
                      variant="prompt"
                      className="w-full tablet:w-fit"
                    >
                      {suggestion}
                    </Chip>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div
              data-slot="hero-centered-action"
              className="flex w-full flex-col items-center gap-3"
            >
              <Button asChild>
                <a href={action.href}>{action.label}</a>
              </Button>

              {action.note ? (
                <p
                  data-slot="hero-centered-note"
                  className="text-center text-sm/6 text-beige-900 dark:text-muted-foreground"
                >
                  {action.note}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

export { HeroCentered }
export type { HeroCenteredAction, HeroCenteredImage, HeroCenteredIntro }
