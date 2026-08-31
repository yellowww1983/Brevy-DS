import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps, ReactNode } from "react"

import { cn } from "../lib/utils.js"

/** Every glyph is 16 inside its marker, at both disc sizes: the file draws a
 *  16 box in the 24 disc and a 16 box in the 36 one, and only the ring around
 *  it grows.
 *
 *  The stroke is the system's 1.5 rather than lucide's own 2, and rather than
 *  the 1 the file draws on its bare marks. The file does not agree with itself
 *  there — the ✕ inside its red disc is already 1.5 — so the system's own
 *  weight settles it, the way the Button already imposes it on every icon it
 *  carries. DESIGN-FEEDBACK 73. */
const GLYPH = "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:icon-stroke"

/** The list, and every class its rows wear.
 *
 *  The rows are dressed from here rather than carrying their own props, the
 *  way `AvatarGroup` rings the avatars inside it: one place decides, and a row
 *  cannot be dressed as one kind inside a list of another. It also keeps this
 *  a server component — a context would have made a static list client-only.
 *
 *  Gap goes with the marker rather than being a density of its own. The file
 *  binds them — 8 beside a 16 glyph, 8 beside the 24 disc, 16 beside the 36,
 *  and 8 / 16 / 0 between the rows themselves — and every list it draws obeys
 *  its own kind. */
const iconListVariants = cva("flex flex-col", {
  variants: {
    marker: {
      /** A bare glyph in the text's own colour. 37 rows across the file, the
       *  most-drawn shape it has, and it wears no disc at all. */
      check: "gap-2 [&_[data-slot=icon-list-row]]:gap-2",
      arrow: "gap-2 [&_[data-slot=icon-list-row]]:gap-2",
      /** A glyph inside a ring. It is the `Marker` component's shape to the
       *  value — the same two gradients, the same padding ring, the same
       *  shadow, at the same two sizes — and it is painted here rather than
       *  rendered from there because of how a row gets dressed, not because
       *  the discs differ.
       *
       *  A row wears what the list decides: one place chooses the marker, and
       *  a row cannot be dressed as one kind inside a list of another. A
       *  component carrying its own props would need the list to reach it,
       *  which means a context, which would make a static list client-only.
       *  And the bare check and arrow share this row: rendering a `Marker`
       *  for them would mean stripping its ring, its padding and its shadow
       *  back off again from the parent.
       *
       *  So the two must be kept in step by hand. If one of the gradients
       *  moves, it moves in both. */
      disc: cn(
        "[&_[data-slot=icon-list-disc]]:rounded-full [&_[data-slot=icon-list-disc]]:p-px [&_[data-slot=icon-list-disc]]:shadow-xs",
        "[&_[data-slot=icon-list-face]]:size-full",
      ),
    },
    /** Only the disc reads these. A bare glyph takes the text's colour and the
     *  file draws it at one size, so neither means anything there. */
    tone: { olive: "", red: "" },
    size: { sm: "", lg: "" },
    divided: {
      true: "divide-y divide-neutral-200 dark:divide-white/10",
      false: "",
    },
  },
  compoundVariants: [
    {
      marker: "disc",
      size: "sm",
      class: cn(
        "gap-4 [&_[data-slot=icon-list-row]]:gap-2",
        "[&_[data-slot=icon-list-marker]]:h-5",
        "[&_[data-slot=icon-list-disc]]:size-6",
      ),
    },
    {
      marker: "disc",
      size: "lg",
      class: cn(
        "gap-0 [&_[data-slot=icon-list-row]]:gap-4",
        "[&_[data-slot=icon-list-marker]]:h-6",
        "[&_[data-slot=icon-list-disc]]:size-9",
        "[&_[data-slot=icon-list-label]]:text-body [&_[data-slot=icon-list-label]]:text-zinc-700",
        "dark:[&_[data-slot=icon-list-label]]:text-muted-foreground",
        /** The large row carries its own padding whether or not a rule
         *  separates it: the file draws this list one way only, as an 80-tall
         *  row padded 16 and 24 (`24966:1156`), and the rules are what
         *  `divided` adds on top. Without it a plain list of wrapped lines
         *  runs together, which is a shape the file never draws. */
        "[&_[data-slot=icon-list-row]]:px-6 [&_[data-slot=icon-list-row]]:py-4",
      ),
    },
    /** The two discs the file paints, each on its own ramp: olive runs 100 to
     *  300 under 300 to 600, red runs 50 to 200 under 200 to 300. They are
     *  brand surfaces and hold in both themes, the way the step marker and the
     *  CTA band's dark tone do. */
    {
      marker: "disc",
      tone: "olive",
      class: cn(
        "[&_[data-slot=icon-list-disc]]:bg-linear-to-b [&_[data-slot=icon-list-disc]]:from-olive-300 [&_[data-slot=icon-list-disc]]:to-olive-600",
        "[&_[data-slot=icon-list-face]]:bg-linear-to-b [&_[data-slot=icon-list-face]]:from-olive-100 [&_[data-slot=icon-list-face]]:to-olive-300",
        "[&_[data-slot=icon-list-face]]:text-brand-500",
      ),
    },
    {
      marker: "disc",
      tone: "red",
      class: cn(
        "[&_[data-slot=icon-list-disc]]:bg-linear-to-b [&_[data-slot=icon-list-disc]]:from-red-200 [&_[data-slot=icon-list-disc]]:to-red-300",
        "[&_[data-slot=icon-list-face]]:bg-linear-to-b [&_[data-slot=icon-list-face]]:from-red-50 [&_[data-slot=icon-list-face]]:to-red-200",
        "[&_[data-slot=icon-list-face]]:text-red-500",
      ),
    },
    /** A rule between the rows takes the place of the gap that separated
     *  them, so the list closes its gap and pads itself instead — 16 above the
     *  line and 16 below, which is the gap it had. Last in the list because a
     *  compound has to outrank the gap the marker's own size set. */
    {
      divided: true,
      class: "gap-0 [&_[data-slot=icon-list-row]]:py-4",
    },
  ],
  defaultVariants: {
    marker: "check",
    tone: "olive",
    size: "sm",
    divided: false,
  },
})

type IconListProps = Omit<ComponentProps<"ul">, "children"> &
  VariantProps<typeof iconListVariants> & {
    /** The line over the list. Every check list the file draws carries one —
     *  14 in the label's weight, in the text's colour — and no disc list
     *  does. It is `caption` in semibold rather than a step of its own. */
    heading?: string
    children: ReactNode
  }

/** A list of short lines, each with a mark beside it.
 *
 *  The most-repeated shape in the website file that had no component: 71 rows
 *  across 24 lists, in four kinds — a bare check (37), a bare arrow (6), a
 *  glyph in a small olive disc (21) and one in a large red disc (7). Lists run
 *  two to four rows and turn up both inside cards and loose in a column, which
 *  is why this is its own component rather than part of one.
 *
 *  Two things go past the drawing, both deliberate. The glyphs take the
 *  system's own 1.5 stroke where the file draws the bare ones at 1 — the file
 *  disagrees with itself there, drawing the disc's own ✕ at 1.5, so
 *  consistency settles it (DESIGN-FEEDBACK 73). And the olive disc gains the
 *  large size the file only draws in red, so tone and size are square to one
 *  another (DESIGN-FEEDBACK 74).
 *
 *  The label wraps when it is given a width to wrap in and hugs when it is
 *  not — the file draws both, and neither is a prop, because it is what text
 *  in a flex row already does. A wrapped second line returns under the first
 *  rather than indenting: the marker is a column of its own and the label is
 *  the rest of the row. */
function IconList({
  className,
  marker,
  tone,
  size,
  divided,
  heading,
  children,
  ...props
}: IconListProps) {
  const list = (
    <ul
      data-slot="icon-list"
      data-marker={marker ?? "check"}
      className={cn(
        iconListVariants({ marker, tone, size, divided }),
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  )

  if (!heading) {
    return list
  }

  return (
    <div data-slot="icon-list-group" className="flex flex-col gap-2">
      <p
        data-slot="icon-list-heading"
        className="text-caption font-semibold text-zinc-800 dark:text-foreground"
      >
        {heading}
      </p>

      {list}
    </div>
  )
}

/** One line.
 *
 *  The glyph arrives as a node rather than being drawn here, because the file
 *  spends four different ones on the same shape and lucide carries all four —
 *  and as a prop rather than a child, because the disc has to wrap it and a
 *  flat child cannot be wrapped. It is decorative: the line beside it says the
 *  same thing, and a check read aloud before every item is noise.
 *
 *  The marker sits in a box the height of the text's own leading, so it
 *  centres on the FIRST line rather than on the paragraph. The file centres on
 *  the paragraph — measured on a two-line row (`25276:3983`), the 24 disc sits
 *  at y=8 in a 40-tall block, which is the middle of both lines rather than
 *  beside the first. On one line the two readings agree; on two the marker
 *  floats into the gap, which is auto-layout doing the obvious thing rather
 *  than anyone deciding it. DESIGN-FEEDBACK 75.
 *
 *  A marker taller than its line — the discs are 24 and 36 against leadings of
 *  20 and 24 — overhangs symmetrically rather than growing the line, which is
 *  what the drawn single-line rows already do: a 20 text in a 24 row. */
function IconListItem({
  className,
  icon,
  children,
  ...props
}: ComponentProps<"li"> & { icon: ReactNode }) {
  return (
    <li
      data-slot="icon-list-row"
      className={cn("flex items-start", className)}
      {...props}
    >
      <span
        data-slot="icon-list-marker"
        aria-hidden
        className="flex h-5 shrink-0 items-center justify-center"
      >
        <span
          data-slot="icon-list-disc"
          className={cn("flex items-center justify-center", GLYPH)}
        >
          <span
            data-slot="icon-list-face"
            className="flex items-center justify-center rounded-full"
          >
            {icon}
          </span>
        </span>
      </span>

      <span
        data-slot="icon-list-label"
        className="text-caption text-zinc-800 dark:text-foreground"
      >
        {children}
      </span>
    </li>
  )
}

export { IconList, IconListItem, iconListVariants }
export type { IconListProps }
