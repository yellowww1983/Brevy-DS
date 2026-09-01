import { join, preamble } from "./doc"

export const INTRO =
  "A photograph cut to the Brevy mark, and a ladder of steps beside it, under a heading that runs across both. The home pages' own section — and the block that finally lifted the shaped cut out of the split hero."

export const USE = [
  "`MediaCopy` takes a `heading`, an optional `marked` phrase for the highlighter to run under, a `description`, the `steps`, and a `picture`.",
  "Each step is a `title`, a `description` and an optional `tone` — the colour of the pebble in its disc. The three the file draws come from three unrelated ramps rather than a series, so the set is closed at `green`, `taupe` and `violet`; a step left without one takes the green.",
  "`picture` is a preset layer. The file hand-places the photograph behind the cut, so the crop belongs to whoever brings it — the same arrangement the testimonial photographs have.",
  "The cut itself is `ShapedImage`, which the split hero draws too. It is not a prop and is not meant to become one: a client swaps the photograph inside it, and the silhouette is the identity.",
  "The highlighter is `LineMarker`, which wraps whatever words it marks and takes its width from them.",
]

export const LAYOUT = [
  "The section pads 96px above and below on the olive-to-white wash, and the header sits 48px over the row.",
  "The heading is centred over the whole section rather than sitting in the copy column — which is what separates this from the split hero, where the heading stands beside the picture.",
  "At the content width the row is two halves of 592px with 16px between. Below it the ladder and the picture stack, 32px apart, with the picture underneath rather than gone.",
  "The picture carries its own proportion — 0.983 across, which every mask in the file measures — so only a width is ever set: 592px, 762px at the tablet, 358px at the mobile.",
  "Each disc is centred on the first line of its own title, so the ladder holds whatever the copy says. The file dials each rung in by hand instead. DESIGN-FEEDBACK 85.",
]

/** The home pages' own three, with the file's copy. */
export const PRESET = {
  heading: "Your superhuman",
  marked: "social worker",
  description:
    "Brevy is the easiest and fastest way to discover, understand and enrol in the benefits you already qualify for.",
  steps: [
    {
      title: "Ask any benefit or coverage related question",
      description:
        "Get instant answers to all your Medicare and Medicaid questions, in plain language.",
    },
    {
      title: "Check your eligibility in real time",
      description:
        "Instantly see which benefits you qualify for as you answer, with no forms to post.",
    },
    {
      title: "Connect with an enrollment specialist for free",
      description:
        "Speak directly with experienced specialists who finish the paperwork with you.",
    },
  ],
}

export const PICTURE = {
  src: "/media/superhuman.webp",
  width: 1184,
  height: 1204,
  alt: "A carer handing a mug to an older man resting on a sofa",
}

export function mediaCopyDoc() {
  return join([
    preamble("MediaCopy", "block"),
    "",
    "# MediaCopy",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { MediaCopy } from "@brevy/ui"',
    "",
    "<MediaCopy",
    "  heading={heading}",
    "  marked={marked}",
    "  description={description}",
    '  steps={[{ title, description, tone: "green" }]}',
    "  picture={picture}",
    "/>",
    "```",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
