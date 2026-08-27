import { Star } from "../icons/star.js"
import { cn } from "../lib/utils.js"
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "./avatar.js"

/** The row four of the website's five heroes carry in the same form: a stack
 *  of faces, five stars, and a line of reassurance — 32 avatars overlapping by
 *  8, five 16 by 15 stars 6 apart, 12 between the parts, all centred on one
 *  another (`20919:10393`).
 *
 *  It does not stay a row. The file keeps all three inline down to the tablet
 *  (`22624:7399`, still 555 by 32 with the sentence beside the stars) and
 *  breaks it at mobile (`22626:8745`): the faces and the stars stay together on
 *  one line, the sentence drops beneath them 12 away, and it drops a size with
 *  it, from 18/28 to 14/24. Everything centres there, where the wide row is
 *  packed to the start. Both other mobile heroes that carry the row break it
 *  the same way (`22657:480`, `23402:998`), so it is the breakpoint's doing
 *  rather than one page's.
 *
 *  The break is written as one column that becomes a row at the tablet, so the
 *  12 is the same gap doing both jobs rather than two numbers that could drift.
 *
 *  Nothing about the claim is baked in. The faces and the sentence arrive as
 *  props, because "Join 2,000+ caregivers already using Brevy" is this site's
 *  copy, not the component's.
 *
 *  Five stars is the shape rather than a rating: the file draws five filled
 *  stars in every instance and no number anywhere near them, so there is no
 *  value to render and nothing to announce. They are marked decorative and the
 *  sentence beside them carries the meaning, which is the only claim the
 *  drawing actually makes.
 *
 *  Dark follows the app file rather than a guess. The amber is left alone —
 *  the app paints `#f4ba57` on a dark page unchanged (`22060:33296`), the way
 *  every brand surface in this system stays itself — and only the sentence
 *  moves, from the warm grey the website draws to `--muted-foreground`, which
 *  is where the app puts secondary text in the dark. */
type SocialProofPerson = {
  name: string
  initials: string
  /** Absent means the fallback shows, which is a real state rather than a
   *  placeholder: a stack of faces is rarely complete. */
  photo?: string
}

const STARS = [0, 1, 2, 3, 4]

/** How the sentence sits against the faces.
 *
 *  `inline` is the row four heroes carry: beside the stars where there is
 *  room, beneath them below the tablet, and a size smaller once it drops.
 *
 *  `stacked` is that lower form held at every width, which is what the split
 *  hero draws (`22653:4862`) — the picture beside it leaves no room for a
 *  555 row at any breakpoint.
 *
 *  Stacked takes no alignment of its own. It lays out as a block with the
 *  faces inline, so `text-align` carries both the sentence and the row, and
 *  whoever places it decides: the split hero writes to the left where the
 *  picture stands beside the copy and centres below that, which is one
 *  decision about the picture rather than a second prop about the faces.
 *
 *  The file stacks with 4 here and 12 on the home pages' mobile. Four is the
 *  one taken: twelve has the count, but this is the page that draws the
 *  arrangement at the size it is meant to be read at, and at 12 the sentence
 *  reads as a second thing rather than a caption on the row above it.
 *  DESIGN-FEEDBACK 55 asks whether the home pages' 12 is an oversight. */
type SocialProofLayout = "inline" | "stacked"

/** The white edge each star wears, exactly as the file strokes it: 2 on the
 *  outside (`20919:10396`, `strokeAlign: OUTSIDE`). It is a real edge that
 *  belongs to the star — what the shape looks like on the hero's amber
 *  illustration — so it stays white wherever the star is put, including on a
 *  dark page.
 *
 *  One other reading was tried and is recorded here so nobody reaches for it
 *  again: painting the rim in `--background`, the way the avatar group paints
 *  its ring. It does not transfer. The group's ring is visible because avatars
 *  overlap by 8, so the ring falls on the avatar behind it and reads as the
 *  gap between them. Stars sit 6 apart and never touch, so a rim the colour of
 *  the ground lands on the ground and cannot be seen in either theme — it
 *  renders, and does nothing.
 *
 *  SVG centres a stroke, so the drawn 2 outside is a 4 painted under the fill:
 *  the fill covers the inner half and exactly 2 shows beyond the shape. The
 *  box stays 16 by 15 and only the ink spills, so the row still measures the
 *  104 the file draws. */
const RATING =
  "flex items-center gap-1.5 text-yellow-500 [&_svg]:overflow-visible [&_svg]:stroke-white [&_svg]:[stroke-width:4] [&_svg]:[paint-order:stroke] [&_svg]:[stroke-linejoin:round]"

function SocialProof({
  people,
  label,
  layout = "inline",
  className,
}: {
  people: readonly SocialProofPerson[]
  label: string
  layout?: SocialProofLayout
  className?: string
}) {
  const stacked = layout === "stacked"

  return (
    <div
      data-slot="social-proof"
      data-layout={layout}
      className={cn(
        stacked ? "block" : "flex flex-col items-center gap-3 tablet:flex-row",
        className,
      )}
    >
      {/* The faces and the stars never part at any width, so they are one
          thing the sentence sits beside or beneath. */}
      <div
        data-slot="social-proof-faces"
        className={cn(
          "items-center gap-3",
          /* Inline so the parent's `text-align` carries the row as well as the
             sentence, which is how the stacked layout stays neutral about
             which way it points. Bottom-aligned because an inline box sits on
             the baseline by default and the line box keeps a descender's worth
             of room under it — 7px that is not a margin and cannot be tuned
             away, and that would make the drawn 4 measure 11. */
          stacked ? "inline-flex align-bottom" : "flex",
        )}
      >
        <AvatarGroup>
          {people.map((person) => (
            <Avatar key={person.name}>
              {person.photo ? (
                <AvatarImage src={person.photo} alt={person.name} />
              ) : null}
              <AvatarFallback>{person.initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>

        <div data-slot="social-proof-rating" className={RATING} aria-hidden>
          {STARS.map((index) => (
            <Star key={index} />
          ))}
        </div>
      </div>

      <p
        data-slot="social-proof-label"
        className={cn(
          "text-sm/6 text-beige-900 dark:text-muted-foreground",
          stacked ? "mt-1" : "text-center tablet:text-lg",
        )}
      >
        {label}
      </p>
    </div>
  )
}

export { SocialProof }
export type { SocialProofLayout, SocialProofPerson }
