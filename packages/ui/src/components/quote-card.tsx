import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js"
import type { SocialProofPerson } from "./social-proof.js"
import { cn } from "../lib/utils.js"

/** The person who said it. The same three fields a face in a hero takes, and
 *  the same type rather than a second copy of it. */
type QuoteCardAuthor = SocialProofPerson

/** Where the mark hangs.
 *
 *  One drawing, two hand-placed offsets: 70 down in the wall's cards, which is
 *  eleven of the twelve instances in the file, and 40 down in the tile
 *  mosaic's one, which is wider and shorter. Both show exactly 200 of the mark
 *  before the card clips it, and nothing else in the file repeats that, so it
 *  is two numbers rather than a rule. Named rather than derived.
 *  DESIGN-FEEDBACK 90. */
type QuoteCardMark = "card" | "tile"

const MARKS: Record<QuoteCardMark, string> = {
  card: "top-(--quote-mark-top)",
  tile: "top-10",
}

/** The white card: a quote, a face, a name, and a quotation mark the size of
 *  the card behind all three.
 *
 *  Two blocks draw it — the testimonial wall's white card and the tile
 *  mosaic's quotation tile — which is what makes it a component rather than
 *  something the wall keeps to itself. The mosaic had a second copy of this
 *  markup for exactly as long as it took to notice.
 *
 *  The mark is bled off the left edge and the card clips it, so what shows is
 *  a corner of a 321 by 265 drawing rather than the drawing. It is painted
 *  rather than typeset: the shape is a vector in the file, not the typeface's
 *  own quote at some size, and no size in the ramp would reach 265 tall
 *  anyway.
 *
 *  It needs the card's own stacking context to be seen at all. The mark sits a
 *  layer down so the copy stays over it, and a negative layer only paints
 *  above a card's background when that card is the context it is measured in —
 *  otherwise it goes behind the white and disappears, which is what the tile
 *  mosaic's copy of this did.
 *
 *  The quote and the author are pushed apart rather than gapped, so the name
 *  sits on the floor of the card whatever the quote does above it.
 *
 *  One author row, not two. The file draws the wall's at a 40 face beside
 *  18/28 bold and the mosaic's at 32 beside 20/28 semibold — one card, two
 *  rows, and the row drawn everywhere else is the one that ships.
 *  DESIGN-FEEDBACK 91.
 *
 *  Height belongs to whoever places it: the wall fixes its card at 270 from
 *  the tablet up and lets it hug below, the mosaic gives its tile the 240 of
 *  a row. */
function QuoteCard({
  quote,
  author,
  mark = "card",
  className,
}: {
  quote: string
  author: QuoteCardAuthor
  mark?: QuoteCardMark
  className?: string
}) {
  return (
    <div
      data-slot="quote-card"
      className={cn(
        "hairline relative isolate flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-white p-6 shadow-xs dark:bg-card",
        className,
      )}
    >
      <div
        data-slot="quote-card-mark"
        aria-hidden
        className={cn(
          "pointer-events-none absolute -left-5 -z-10 h-(--quote-mark-tall) w-(--quote-mark) bg-beige-300 mask-brevy-quote dark:bg-muted",
          MARKS[mark],
        )}
      />

      <p
        data-slot="quote-card-quote"
        className="text-body-lg text-zinc-700 dark:text-card-foreground"
      >
        {quote}
      </p>

      <div data-slot="quote-card-author" className="flex items-center gap-3">
        <Avatar size="md">
          {author.photo ? (
            <AvatarImage src={author.photo} alt={author.name} />
          ) : null}
          <AvatarFallback>{author.initials}</AvatarFallback>
        </Avatar>

        <p className="text-lg/7 font-bold text-zinc-800 dark:text-foreground">
          {author.name}
        </p>
      </div>
    </div>
  )
}

export { QuoteCard }
export type { QuoteCardAuthor, QuoteCardMark }
