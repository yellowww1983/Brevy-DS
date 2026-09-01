import { join, preamble, table } from "./doc"

/** The catalog's faces, taken from the drawing rather than invented: the three
 *  photographs the website's avatar group carries (node 22680:1103), cropped
 *  the way Figma crops them — `scaleMode: FILL` into a square frame is a
 *  centred cover — and stored at 96, three times the 32 they are drawn at.
 *
 *  They are served from the catalog rather than fetched, so a preview never
 *  depends on a network and a spec never waits on one.
 *
 *  The names are the catalog's own. Nothing in the file names these people, and
 *  what these previews demonstrate is the circle, the overlap and the fallback,
 *  for which any three names with distinct initials do. */
export type Person = {
  name: string
  initials: string
  photo: string
}

export const PEOPLE: readonly Person[] = [
  { name: "Maria Wells", initials: "MW", photo: "/people/mw.jpg" },
  { name: "Sam Doyle", initials: "SD", photo: "/people/sd.jpg" },
  { name: "Ana Ruiz", initials: "AR", photo: "/people/ar.jpg" },
]

/** A source that cannot resolve, so Radix falls back for the reason it exists
 *  rather than because a prop asked it to. */
export const MISSING_PHOTO = "/people/nobody.jpg"

export const INTRO =
  "A person, round. One on its own, or a stack of them under a line of copy."

export const USE = [
  "An avatar is three parts, composed rather than configured. `Avatar` is the circle, `AvatarImage` is the photograph, and `AvatarFallback` is what shows when the photograph is missing or does not load. Write all three every time: the fallback is not a prop, and an avatar without one is a hole when a picture fails.",
  "The fallback holds initials. Nothing switches it on. Radix shows it when the image has not arrived, which covers both a missing `src` and one that fails, so the two cases need no thinking about.",
  "`size` is `sm` at 32px, which is the site's usual and the default, or `md` at 40px, which the design draws for the author of a testimonial and nowhere else.",
  "`AvatarGroup` is the stack: avatars overlapping by 8px, each with a ring the colour of the page's ground so one reads as separate from the next.",
  "The ring belongs to the group. A single avatar wears none, because a ring with nothing to separate it from is a rim rather than a gap. Do not add one at the call site.",
  "Give `AvatarImage` an `alt`. It is a person's name, and it is what someone hears in place of the face.",
]

const AVATAR_PROPS: readonly (readonly string[])[] = [
  ["`size`", "`sm` `md`", "`sm`", "32px or 40px across"],
  ["`children`", "`ReactNode`", "none", "The image and the fallback"],
  ["`className`", "`string`", "none", "Extra classes, for placement"],
]

const IMAGE_PROPS: readonly (readonly string[])[] = [
  ["`src`", "`string`", "none", "The photograph"],
  ["`alt`", "`string`", "none", "The person's name"],
  ["`className`", "`string`", "none", "Extra classes, rarely needed"],
]

const FALLBACK_PROPS: readonly (readonly string[])[] = [
  ["`children`", "`ReactNode`", "none", "Usually the person's initials"],
  [
    "`delayMs`",
    "`number`",
    "none",
    "Wait before showing, to avoid a flash on a fast image",
  ],
]

export function avatarDoc() {
  return join([
    preamble("Avatar", "component"),
    "",
    "# Avatar",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@brevy/ui"',
    "",
    '<Avatar size="md">',
    '  <AvatarImage src={photo} alt="Dana Ruiz" />',
    "  <AvatarFallback>DR</AvatarFallback>",
    "</Avatar>",
    "",
    "<AvatarGroup>",
    "  {people.map((person) => (",
    "    <Avatar key={person.name}>",
    "      <AvatarImage src={person.photo} alt={person.name} />",
    "      <AvatarFallback>{person.initials}</AvatarFallback>",
    "    </Avatar>",
    "  ))}",
    "</AvatarGroup>",
    "```",
    "",
    "## The parts",
    "",
    "- `Avatar`: the circle, at one of two sizes.",
    "- `AvatarImage`: the photograph inside it.",
    "- `AvatarFallback`: the initials, shown when the photograph is not there.",
    "- `AvatarGroup`: the overlapping stack, and the ring that separates them.",
    "",
    "## Props",
    "",
    "### Avatar",
    "",
    table(["Prop", "Values", "Default", "What it does"], AVATAR_PROPS),
    "",
    "### AvatarImage",
    "",
    table(["Prop", "Values", "Default", "What it does"], IMAGE_PROPS),
    "",
    "### AvatarFallback",
    "",
    table(["Prop", "Values", "Default", "What it does"], FALLBACK_PROPS),
    "",
    "`AvatarGroup` takes the avatars and a `className`. The overlap and the",
    "ring are its own.",
  ])
}
