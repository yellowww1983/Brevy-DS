import { Avatar, AvatarFallback, AvatarImage } from "@brevy/ui"

import { PEOPLE } from "@/avatar"

/** A stand-in for the artwork the file puts inside a benefit card's panel.
 *
 *  The drawn artwork could not be exported: every one of the twelve benefit
 *  sections is `visible: false` in the file, so Figma renders them empty. What
 *  the drawing shows is measurable all the same — three chat bubbles at 190x48
 *  on a 16 radius with a 1px neutral-300 edge and the card's own double
 *  shadow, each holding a 32 avatar and two rounded bars at 134x8 and 56x8,
 *  staggered inside the 341x290 panel — so this composes those parts rather
 *  than inventing a picture.
 *
 *  The cluster is a natural-size column and the panel centres it, rather than
 *  being pinned to the panel's corners the way the drawing hand-places it: the
 *  panel is 341 wide at the desktop and 714 at the tablet, and a composition
 *  nailed to one of those drifts at the other.
 *
 *  The numbered badge is not here. It goes through the panel's own marker
 *  slot, which is where the step cards put theirs — one disc, one place.
 *
 *  Catalog furniture, not part of the block: the illustration is a preset slot
 *  and a client brings whatever belongs in it. */
function Bubble({
  indent,
  brand,
  person,
}: {
  indent?: "in"
  brand?: true
  person: number
}) {
  const face = PEOPLE[person % PEOPLE.length]
  const bar = brand ? "bg-olive-500" : "bg-neutral-200"

  return (
    <div
      className={`flex h-12 w-47.5 items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-2 shadow-md ${indent === "in" ? "ml-12" : ""}`}
    >
      {brand ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white">
          {/* The mark alone, not the lockup: the file puts Brevy's own square
              in the bubble where a person's face would go. */}
          <span className="size-4 bg-brand-500 mask-brevy-lockup-mark" />
        </span>
      ) : (
        <Avatar>
          {face ? <AvatarImage src={face.photo} alt="" /> : null}
          <AvatarFallback>{face?.initials ?? "BC"}</AvatarFallback>
        </Avatar>
      )}

      <span className="flex flex-col gap-2">
        <span className={`block h-2 w-33.5 rounded-full ${bar}`} />
        <span className={`block h-2 w-14 rounded-full ${bar}`} />
      </span>
    </div>
  )
}

export function CardMock({ index }: { index: number }) {
  return (
    <div className="flex flex-col gap-4">
      <Bubble person={index} />
      <Bubble person={index + 1} indent="in" brand />
      <Bubble person={index + 2} />
    </div>
  )
}
