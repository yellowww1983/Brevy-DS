import { Star } from "../icons/star.js"
import { cn } from "../lib/utils.js"
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "./avatar.js"

/** The row four of the website's five heroes carry in the same form: a stack
 *  of faces, five stars, and a line of reassurance. It is a component rather
 *  than a piece of each hero because it is drawn identically in all four —
 *  same 32 avatars overlapping by 8, same five 16 by 15 stars 6 apart, same 12
 *  between the three parts, all centred on one another (`20919:10393`).
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
  className,
}: {
  people: readonly SocialProofPerson[]
  label: string
  className?: string
}) {
  return (
    <div
      data-slot="social-proof"
      className={cn("flex items-center gap-3", className)}
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

      <p
        data-slot="social-proof-label"
        className="text-lg text-beige-900 dark:text-muted-foreground"
      >
        {label}
      </p>
    </div>
  )
}

export { SocialProof }
export type { SocialProofPerson }
