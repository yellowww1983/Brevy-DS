import { join, preamble, table } from "./doc"

/** The brand's own drawings, which had no page until now.
 *
 *  The word watercolour appears four times in this repository and every one of
 *  them is an aside about a file. Nothing said what the drawings are, what they
 *  have in common, or when to reach for one. The blocks are the house style of
 *  layout and the Lottie library is the house style of movement; this is the
 *  third of those, and it was the one missing.
 *
 *  What is here is the brand's own scenes rather than the catalog's pictures of
 *  itself. The Introduction and How to use are illustrated too, in the same
 *  hand, but they draw this tool rather than the world Brevy works in, so they
 *  stay on their own pages.
 *
 *  Nothing here has a moving version. Two scenes in the design file do, a
 *  footbridge and a park path, and both are already in `Animations: Video`. */

/** One drawing, and the size it was drawn at. */
type Drawing = { readonly src: string; readonly width: number }

export type Illustration = {
  readonly id: string
  readonly name: string
  readonly alt: string
  readonly height: number
  readonly light: Drawing
  /** Where it ships today, or what it is drawn for where nothing ships it. */
  readonly where: string
}

/** The four seasons, in the order a year runs rather than the order the file
 *  lists them. They are one composition, so the page shows them together and
 *  the order has to be the one a reader expects.
 *
 *  Exported at the size they are drawn, 1440 by 426, and not cropped to the way
 *  the hero frames one of them. The hero's own asset is `hero/band.jpg` and is
 *  tighter: the autumn scene zoomed in with its figures larger. That is a
 *  second use of one drawing rather than a second drawing, so this page shows
 *  what was drawn and the hero keeps its crop.
 *
 *  The export arrives on the design tool's own grey, which is about half of
 *  every one of them, because the sky and the ground are clear in the file. That
 *  grey is replaced with white by flooding in from the edges rather than by
 *  matching a colour wherever it appears, so nothing inside a painting is
 *  punched through, and they ship opaque.
 *
 *  Opaque rather than clear, which was tried first. A clear sky looks right on
 *  a pale page and shows the cut on a dark one: the flood fill ends at a hard
 *  edge where the painting has a soft one, and against black that reads as a
 *  ragged silhouette. The hero's own asset is opaque for the same reason, and
 *  it costs nothing: 118KB for the four against 125KB with the alpha kept. */
export const SEASONS: readonly Illustration[] = [
  {
    id: "spring",
    name: "Spring",
    alt: "A watercolour valley in spring, two figures walking a path between blossom and fresh green",
    height: 426,
    light: { src: "/illustrations/season-spring.webp", width: 1440 },
    where: "The home page in spring",
  },
  {
    id: "summer",
    name: "Summer",
    alt: "The same valley in summer, the two figures walking between full green trees",
    height: 426,
    light: { src: "/illustrations/season-summer.webp", width: 1440 },
    where: "The home page in summer",
  },
  {
    id: "fall",
    name: "Autumn",
    alt: "The same valley in autumn, the two figures walking between yellow and orange trees towards water",
    height: 426,
    light: { src: "/illustrations/season-fall.webp", width: 1440 },
    where: "The home page in autumn, and the band under the centred hero",
  },
  {
    id: "winter",
    name: "Winter",
    alt: "The same valley under snow, the two figures walking a path between white trees",
    height: 426,
    light: { src: "/illustrations/season-winter.webp", width: 1440 },
    where: "The home page in winter",
  },
]

/** The other register, and the reason it is not in the row above. */
export const WASH: Illustration = {
  id: "wash",
  name: "Mountain wash",
  alt: "A pale watercolour wash of distant mountains, almost white",
  height: 685,
  light: { src: "/hero/wash.jpg", width: 1440 },
  where: "Across the whole of a hero, and behind the login screen",
}

export const INTRO =
  "The brand's own drawings. Watercolour, in the system's greens, and the set is smaller than it looks: one scene painted four times, and one wash."

export const STYLE = [
  "The blocks are the house style of layout and the Lottie library is the house style of movement. These are the house style of drawing.",
  "The whole of it is one drawing repainted four times. Two figures walk away down a path, a valley opens either side of them, birds cross the top right corner, and the composition never moves. What changes is the season: blossom, then full green, then yellow and orange, then snow. That is a fact about the system rather than a gallery. A page is not given a picture to choose from, it is given the year it is being read in.",
  "Every one is watercolour and looks like it: wet edges that run into each other, paper left showing through the pale parts, nothing outlined. The palette is the system's own. The greens are the brand ramp and the olive beside it, and what warmth there is comes from the yellows of autumn rather than from a second accent.",
  "People are small, seen from behind, and walking. Nobody looks out of the drawing and nobody is posed. Two of them, always, which is the subject: somebody being cared for and somebody doing the caring.",
  "The sky is the paper. Nothing is painted into the top half of a scene, so the drawing meets the page rather than sitting in a box, and the pale ground it ships on is the same one the hero puts behind it.",
]

export const USE = [
  "They go behind reading or beside it, never inside a control. An illustration is a ground, a band, or the subject of a written page. It is not an icon, not a spot beside a heading and not something to put in a button. The system has a marker, a mask and an icon set for the small jobs.",
  "Reach for the wash when type has to sit on top of it. It is pale enough to read a heading over and carries no subject to compete with one. Reach for a season when the picture is the point, which on a page means the band under a hero.",
  "Pick the season the page will be read in, not the one that looks best. The four exist so a home page can turn with the year, and a spring scene under a winter campaign is the one way to get this wrong.",
]

export const CROP =
  "These are the drawings at the size they were drawn, 1440 by 426. The hero's own asset is a tighter crop of the autumn one, with the figures larger, and it stays that way: a block framing a drawing for itself is a second use of it rather than a second drawing."

export const MOTION =
  "Two scenes in this family move and are not on this page. `Animations: Video` carries four watercolours drawn as video, and two of them are scenes the design file also draws still: a footbridge and a path through a park. The login screen's panel is a frame of the second. Showing them here would be the same drawing under two headings."

export const GALLERY_NOTE =
  "The four are shown together and at one size, because reading them as a set is the point. The wash sits apart from them: it is the other register, a ground rather than a scene. They load as the page reaches them, and nothing here plays, so there is no button and nothing to wait for."

export function illustrationsDoc() {
  return join([
    preamble("Illustrations"),
    "",
    "# Illustrations",
    "",
    INTRO,
    "",
    "## The style",
    "",
    ...STYLE.flatMap((paragraph) => [paragraph, ""]),
    "## When to use one",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "## The four seasons",
    "",
    GALLERY_NOTE,
    "",
    CROP,
    "",
    table(
      ["Season", "Drawn", "Where it ships"],
      SEASONS.map((season) => [
        season.name,
        `${String(season.light.width)}×${String(season.height)}`,
        season.where,
      ]),
    ),
    "",
    "## The wash",
    "",
    `${WASH.name}, ${String(WASH.light.width)}×${String(WASH.height)}. ${WASH.where}.`,
    "",
    "## The ones that move",
    "",
    MOTION,
  ])
}
