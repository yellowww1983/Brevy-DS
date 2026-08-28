import type { ReactNode } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar.js"
import { Container } from "../components/container.js"
import type { SocialProofPerson } from "../components/social-proof.js"
import { cn } from "../lib/utils.js"

/** The ground the section stands on.
 *
 *  The file draws one: a photograph, dissolved at both sides, with the copy in
 *  white over it. `beige` is the same section without the picture, which the
 *  file has no case for and a page nobody has written yet will — a client with
 *  no photograph of their own would otherwise get white type on beige. */
type TestimonialsBackground = "photo" | "beige"

/** The person who said it. The same three fields the faces in a hero take,
 *  and the same type rather than a second copy of it: a face with a name is
 *  one idea in this system, and two declarations of it would drift. */
type TestimonialsAuthor = SocialProofPerson

/** The three cards the mosaic is built from.
 *
 *  Three shapes rather than one card with switches, because they share only
 *  their radius, their thread and their shadow — different grounds, different
 *  copy colours, different insides. The file draws five cards and they fall
 *  into these three, and it is the sequence that makes the mosaic rather than
 *  a layout prop: a `featured` takes two columns and the others take one, so
 *  the drawn arrangement is what this order produces and any other order
 *  produces its own.
 *
 *  `stat` is a card of this block for now, and it is on loan. Counted across
 *  the file, its vocabulary — the 60/60 figure, the 24/24 unit, the display
 *  quotation mark behind them — appears 26 times, and half of those are the
 *  stats section that has not been built. When it is, this lifts out into
 *  whatever the two of them share. Building that component today would be
 *  guessing at the half of it nobody has measured. */
type TestimonialsItem =
  | {
      kind: "stat"
      /** The number alone. `89`, not `89%`. */
      figure: string
      /** What follows it, half the size and set to the top of it. */
      unit?: string
      sentence: string
    }
  | {
      kind: "featured"
      quote: string
      /** The square picture beside the quote, and under it where the column
       *  narrows. A slot rather than a src: a client brings a file, and the
       *  card only asks that it be square. */
      portrait: ReactNode
    }
  | { kind: "quote"; quote: string; author: TestimonialsAuthor }

/** The ramp the file masks the photograph with.
 *
 *  It runs across rather than down. Figma hands the axis over as a matrix and
 *  `Fade` carries a=-0.962, b=0.011 (`20919:10978`) — the ramp reads off x and
 *  reads it backwards, so what the stops describe as 0, 30, 63 and 95 lands on
 *  the page at 0, 32, 67 and 98. Only a third of the width is opaque; the rest
 *  is the picture dissolving into the beige on both sides.
 *
 *  Nothing on the other axis. The picture is a band anchored to the top and
 *  the softness along its foot is painted into the artwork, the way the
 *  centred hero's is — but unlike that hero this band runs edge to edge from
 *  the section's own top, so there is no cut to hide up there and a second
 *  ramp would only put a beige stripe over the header.
 *
 *  Written out rather than composed, because Tailwind scans source text and
 *  never sees a class name built by interpolation. */
const PHOTO_MASK =
  "[mask-image:linear-gradient(to_right,transparent_0%,black_32%,black_67%,transparent_98%)]"

/** The card every kind of card is: 16 of radius, a one-pixel thread of its own
 *  fill gone one step darker, and the smallest shadow the system draws. */
const CARD =
  "hairline relative isolate grow overflow-hidden rounded-2xl shadow-xs"

/** A number and its unit, and the line that says what the number counts.
 *
 *  The unit sits at the top of the figure rather than on its baseline — 60
 *  tall against 21, both at y=0 (`22624:8276`) — which is what makes `89%`
 *  read as one object instead of two words.
 *
 *  The whole group sits at the foot of the card and the air is above it, which
 *  is what the file does at every width (`alignP MAX`). It only shows where
 *  the copy is short: at the desktop the figure, its 48 and four lines of
 *  sentence come to more than the 270 leaves, so the group fills the card and
 *  the figure lands at the top; at the tablet two lines leave 58 spare and the
 *  file puts them above. One rule, three drawn results. */
function Stat({
  figure,
  unit,
  sentence,
}: {
  figure: string
  unit?: string
  sentence: string
}) {
  return (
    <div
      data-slot="testimonials-stat"
      className={cn(
        CARD,
        "flex min-h-(--testimonials-card) flex-col justify-end bg-olive-500 p-6 hairline-olive",
      )}
    >
      <div className="flex flex-col gap-12">
        <p className="flex items-start text-stat text-emerald-500">
          {figure}
          {unit ? <span className="text-stat-unit">{unit}</span> : null}
        </p>

        <p className="text-body-lg text-emerald-500">{sentence}</p>
      </div>
    </div>
  )
}

/** The wide card: a square picture and a long quote in white on taupe, with
 *  nobody's name under it.
 *
 *  The picture keeps 4 all round and the copy keeps 24 from whatever edge it
 *  meets, which is the rule that reproduces all three drawn widths — 482 at
 *  the desktop, 448 at the tablet, and a column at mobile where the picture
 *  goes above the words and the card grows to 715.
 *
 *  No attribution, which is the file's doing and not an omission here: the one
 *  card carrying the longest and most specific quote in the section is the one
 *  card that names nobody. Raised with the designer rather than invented. */
function Featured({ quote, portrait }: { quote: string; portrait: ReactNode }) {
  return (
    <div
      data-slot="testimonials-featured"
      className={cn(
        CARD,
        "flex flex-col gap-6 bg-taupe-500 p-1 hairline-taupe tablet:flex-row tablet:items-center",
      )}
    >
      <div className="aspect-square w-full shrink-0 overflow-hidden rounded-2xl tablet:size-(--testimonials-portrait)">
        {portrait}
      </div>

      <p className="p-5 text-body-lg text-white tablet:p-0 tablet:pe-5">
        {quote}
      </p>
    </div>
  )
}

/** The white card: a quote, a face, a name, and a quotation mark the size of
 *  the card behind all three.
 *
 *  The mark is bled off the left edge and 70 down from the top, and the card
 *  clips it — so what shows is a corner of a 321 by 265 drawing rather than
 *  the drawing. It is painted rather than typeset: the shape is a vector in
 *  the file, not the typeface's own quote at some size, and no size in the
 *  ramp would reach 265 tall anyway.
 *
 *  The quote and the author are pushed apart rather than gapped, so the name
 *  sits on the floor of the card whatever the quote does above it.
 *
 *  The floor arrives at the tablet and not below it. The file fixes the card
 *  at 270 where the mosaic is a row or a wide column, and lets it hug at
 *  mobile, where it draws 292, 208 and 320 — a short quote is allowed to be a
 *  short card there rather than half a card of white. */
function Quote({
  quote,
  author,
}: {
  quote: string
  author: TestimonialsAuthor
}) {
  return (
    <div
      data-slot="testimonials-quote"
      className={cn(
        CARD,
        "flex flex-col justify-between gap-6 bg-white p-6 tablet:min-h-(--testimonials-card) dark:bg-card",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-(--testimonials-mark-top) -left-5 -z-10 h-(--testimonials-mark-tall) w-(--testimonials-mark) bg-beige-300 mask-brevy-quote dark:bg-muted"
      />

      <p className="text-body-lg text-zinc-700 dark:text-card-foreground">
        {quote}
      </p>

      <div className="flex items-center gap-3">
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

/** The testimonial mosaic: a heading over a photograph, and five cards of
 *  three different shapes under it.
 *
 *  One section in the whole file and one drawing of it, on the home page,
 *  repeated across four seasons and three widths (`20919:10971`). Nothing else
 *  on the site carries testimonials at all.
 *
 *  The mosaic is a grid of three columns where a `featured` item takes two of
 *  them, which is exactly the drawn arrangement — 389.67 a column at 1201 with
 *  16 between, against the drawn 389, 796 and 389.7 — and is a rule rather
 *  than a transcription: five is what the file draws, not what the block
 *  takes. It falls to one column below 1200, where three across cannot fit.
 *
 *  Two things here go against the drawing.
 *
 *  The section pads 96 above and 96 below. The file pads 96 above and nothing
 *  below, at all three widths, which works on the page it is drawn on because
 *  the next section brings its own — and fails the moment this block is placed
 *  last, where it would run straight into the footer. The CTA band was fixed
 *  the same way for the same reason.
 *
 *  The cards flow rather than sit. The file positions the header and the card
 *  group absolutely and pins the cards to y=363 at every width regardless of
 *  how tall the header above them is, so a heading one line longer than the
 *  drawn one goes under them. Written as a column, the header pushes the cards
 *  down, which is what a block whose copy is a prop has to do.
 *
 *  Dark converges the two grounds, the way the CTA band's two tones do. The
 *  photograph goes — a lit picture behind a dark page is a light section
 *  wearing dark parts, which is what the centred hero already settled — and
 *  with it the reason the copy was white, so both grounds land on
 *  `--background` with the page's own text on them. The olive and taupe cards
 *  stay exactly as drawn, being brand surfaces rather than light objects; only
 *  the white card steps to `--card`. */
function Testimonials({
  heading,
  description,
  items,
  background = "photo",
  photograph,
  className,
}: {
  heading: string
  description: string
  items: readonly TestimonialsItem[]
  background?: TestimonialsBackground
  /** The picture behind the header, full width and dissolved at both sides.
   *  A slot rather than a src, so a page can bring whatever it renders images
   *  with. Absent, the section falls back to its beige ground however
   *  `background` is set, rather than leaving white copy on beige. */
  photograph?: ReactNode
  className?: string
}) {
  const photo = background === "photo" && photograph !== undefined

  return (
    <section
      data-slot="testimonials"
      data-background={photo ? "photo" : "beige"}
      className={cn(
        "relative isolate overflow-hidden bg-beige-500 py-24 dark:bg-background",
        className,
      )}
    >
      {photo ? (
        <div
          data-slot="testimonials-picture"
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 dark:hidden"
        >
          <div
            data-slot="testimonials-photo"
            className={cn("h-(--testimonials-photo)", PHOTO_MASK)}
          >
            {photograph}
          </div>

          {/* The wash that makes white copy readable on a photograph nobody
              has chosen yet. Black at half strength across the top 140 and
              gone by 509 (`20919:10981`), full width, over the picture and
              under everything else. */}
          <div
            data-slot="testimonials-shade"
            className="absolute inset-x-0 top-0 h-(--testimonials-shade) bg-linear-to-b from-black/50 from-28% via-black/15 via-70% to-transparent"
          />
        </div>
      ) : null}

      <Container className="flex flex-col items-center">
        {/* 8 between the two lines, and the line under the heading is the
            wider of the two — 618 against 468, which is the reverse of every
            hero in the file and is what puts the drawn description on two
            rows and the heading on one.

            The slot is 267 tall and the header sits at the top of it, which is
            the one constant the drawing has here: the file pins the cards to
            y=363 at all three widths while the header above them measures 112,
            104 and 132, so what it is actually holding is the distance from
            the padding to the cards. As a floor it reproduces all three and
            lets a longer heading push the cards down instead of going under
            them.

            It is the room the picture needs, so it goes with the picture. On
            the beige ground the same 267 is an empty stripe nobody drew, and
            the header falls back to the 56 every other block in this system
            leaves under its heading. */}
        <div
          className={cn(
            "flex w-full flex-col items-center gap-2 text-center",
            photo ? "min-h-(--testimonials-header)" : "mb-14",
          )}
        >
          <h2
            data-slot="testimonials-heading"
            className={cn(
              "max-w-(--testimonials-heading) font-serif text-h2 text-balance dark:text-foreground",
              photo ? "text-white" : "text-zinc-800",
            )}
          >
            {heading}
          </h2>

          <p
            data-slot="testimonials-description"
            className={cn(
              "max-w-(--testimonials-lede) text-body-lg text-balance dark:text-muted-foreground",
              photo ? "text-white" : "text-zinc-700",
            )}
          >
            {description}
          </p>
        </div>

        <ul
          data-slot="testimonials-mosaic"
          className="grid w-full grid-cols-1 gap-4 content:grid-cols-3"
        >
          {items.map((item, index) => (
            <li
              /** Position, because the same person can be quoted twice and
               *  two stats can count the same thing. */
              key={index}
              className={cn(
                "flex flex-col",
                item.kind === "featured" ? "content:col-span-2" : undefined,
              )}
            >
              {item.kind === "stat" ? (
                <Stat
                  figure={item.figure}
                  unit={item.unit}
                  sentence={item.sentence}
                />
              ) : null}

              {item.kind === "featured" ? (
                <Featured quote={item.quote} portrait={item.portrait} />
              ) : null}

              {item.kind === "quote" ? (
                <Quote quote={item.quote} author={item.author} />
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export { Testimonials }
export type { TestimonialsAuthor, TestimonialsBackground, TestimonialsItem }
