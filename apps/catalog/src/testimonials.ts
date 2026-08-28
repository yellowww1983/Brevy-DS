import type { TestimonialsBackground } from "@brevy/ui"

import { join, preamble } from "./doc"

export const INTRO =
  "The testimonial mosaic. A heading over a photograph, and cards of three different shapes under it: a headline figure, one wide quote with a picture beside it, and plain quotes with a face and a name. One section in the whole file, on the home page."

export const USE = [
  "`Testimonials` takes a `heading`, a `description` and `items`. Each item names its own shape — `stat`, `featured` or `quote` — and the order of them is the mosaic: a `featured` takes two of the three columns and everything else takes one, so the drawn arrangement is what the drawn order produces.",
  "`background` picks the ground. `photo` is the one the file draws: a full-width picture dissolved at both sides, a wash across the top of it, and the copy in white. `beige` is the same section without the picture, for a page that has none.",
  "The picture itself arrives as `photograph`, a slot rather than a source, so a page brings whatever it renders images with. Left out, the section falls back to its beige ground rather than leaving white copy on beige.",
  "The `stat` card is a card of this block for now. Its vocabulary — the 60/60 figure, the unit beside it, the display quotation mark — turns up 26 times across the site, and half of those are the stats section nobody has built yet. It lifts out into a shared element the day that section exists, and not before.",
  "The face under a quote is the system's `Avatar` at its larger size, which is the size the file draws here and nowhere else.",
]

export const LAYOUT = [
  "The mosaic is three columns of 389.67px with 16px between them, which is the 1201px the file measures, and it falls to one column below 1200px where three across cannot fit. Cards in a row match heights; a `featured` card stops being a row of its own and stacks its picture over its quote below the tablet width.",
  "Cards are 270px at their shortest and grow with their copy — the drawn white cards reach 292px on the desktop. Below the tablet width the floor goes and a short quote is a short card, which is what the file draws at mobile: 292px, 208px and 320px.",
  "The header sits at the top of a 267px slot, which is what the file is holding when it pins the cards to the same y at all three widths while the header above them measures 112px, 104px and 132px.",
  "The photograph is a band against the section's top edge — 736px, 640px and 486px across the three widths — masked so that only the middle third of it is opaque. The wash over it is black at half strength across the top 140px and gone by 509px.",
  "The section breathes 96px above and below. The file gives it 96px above and nothing below, which works where something follows it and fails where nothing does.",
]

type Preset = {
  background: TestimonialsBackground
  heading: string
  description: string
}

export const HEADING = "Voices of trust"

export const DESCRIPTION =
  "Real people. Real results. Read how we're making a difference, one story at a time."

export const PHOTO_PRESET: Preset = {
  background: "photo",
  heading: HEADING,
  description: DESCRIPTION,
}

/** The same section with the picture taken away, which the file never draws.
 *  Its heading has to go dark for it, so the two grounds are one switch rather
 *  than a ground and a colour that could be set against each other. */
export const BEIGE_PRESET: Preset = {
  background: "beige",
  heading: HEADING,
  description: DESCRIPTION,
}

export const STAT = {
  figure: "89",
  unit: "%",
  sentence:
    "Caregivers who qualify are enrolled in as little as 18 days — Brevy handles the MCO calls, nurse visits, and paperwork.",
}

/** The file's own two paragraphs, with its `fulll-time` and its double hyphen
 *  put right. Raised with the designer rather than shipped as drawn: a catalog
 *  that reproduces a typo teaches it. */
export const FEATURED = {
  quote:
    "Becoming a full-time caregiver can be overwhelming to do on your own — especially with navigating all the Medicaid calls and paperwork. Brevy guides you through the process at $0 cost to you and can help you get an average monthly payment of $1500+ if you qualify.",
  portrait: {
    src: "/testimonials/portrait.webp",
    width: 700,
    height: 700,
    alt: "Two women outdoors in winter coats, laughing together",
  },
}

/** Three caregivers, none of them named. That is the drawing: the file signs
 *  all three the same way, which is what a testimonial from somebody who did
 *  not agree to be named looks like. The faces are the catalog's own. */
export const QUOTES = [
  {
    quote:
      "Working with Brevy has been a very comfortable experience, the response rate has been phenomenal once small issues occur. Highly recommend working with a company like this.",
    photo: "/people/mw.jpg",
  },
  {
    quote:
      "I just didn't expect y'all to move so fast on getting him hired. That was amazing.",
    photo: "/people/sd.jpg",
  },
  {
    quote:
      "I've been trying to do this now for almost 6 years and no one's really told me how to do it…when my mom's social worker came over he's the one that gave me the number for ya'll and I really appreciate it.",
    photo: "/people/ar.jpg",
  },
]

export const AUTHOR = { name: "Brevy Caregiver", initials: "BC" }

/** The website's own backdrop, exported from the file and cropped to the part
 *  of it the section actually shows. A client brings their own. */
export const PHOTOGRAPH = {
  src: "/testimonials/backdrop.webp",
  width: 1853,
  height: 969,
}

export function testimonialsDoc() {
  return join([
    preamble("Testimonials", "block"),
    "",
    "# Testimonials",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Testimonials } from "@brevy/ui"',
    "",
    "<Testimonials",
    "  heading={heading}",
    "  description={description}",
    '  background="photo"',
    "  photograph={<img src={src} alt=\"\" className='size-full object-cover' />}",
    "  items={items}",
    "/>",
    "```",
    "",
    "### items: one of three shapes",
    "",
    '- `{ kind: "stat", figure, unit?, sentence }`: a headline number in olive',
    '- `{ kind: "featured", quote, portrait }`: a wide card, a square picture and no attribution',
    '- `{ kind: "quote", quote, author }`: a white card with a face and a name',
    "",
    "### background: one of two",
    "",
    '- `"photo"`: the picture, the wash and white copy',
    '- `"beige"`: the beige ground and dark copy',
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
