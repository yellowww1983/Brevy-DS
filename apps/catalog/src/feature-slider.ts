import type { FeatureSliderItem } from "@brevy/ui"

import { join, preamble, table } from "./doc"

/** The five the caregiver page draws, in its own order.
 *
 *  The copy is the live page's rather than a rewrite of it: this is the one
 *  block whose words are the product's own promises, and shortening them for
 *  a catalog would make the widths lie. The fifth is the longest by some way
 *  and is what decides how tall the copy panel has to be. */
export const FEATURES: readonly FeatureSliderItem[] = [
  {
    title: "Know your pay before payday",
    description:
      "See your estimated take-home, browse and download every pay stub, and manage direct deposit. No need for a separate app to manage your pay.",
    tint: "yellow",
  },
  {
    title: "Your patients, organized",
    description:
      "Everyone you're assigned to in one place, with care plans and authorization details for each.",
    tint: "olive",
  },
  {
    title: "Trainings & resources",
    description:
      "Access trainings and helpful guides without having to hunt for links in your inbox.",
    tint: "emerald",
  },
  {
    title: "Set up the easy way",
    description:
      "Finish enrollment right in the app, and track your progress from your first call to your first authorized visit.",
    tint: "blue",
  },
  {
    title: "Texas EVV, built right in",
    description:
      "Clock-in and clock-out with automatic GPS and time capture, fully compliant with Texas HHSC. It's the one piece that arrives after launch, and it lives in the same app you already use, so there's nothing new to learn.",
    tint: "violet",
  },
]

export const EYEBROW = "Everything in one app"

/** Two lines, broken where the sentence breaks rather than where the box
 *  ends. The file sets them by hand and so does this. */
export const HEADING = ["Less coordinating.", "More caring."]

export const INTRO =
  "Five features, one at a time. The copy sits left with two arrows under it, the artwork sits right on a ground tinted for that feature, and moving between them is a cross-fade rather than a slide."

export const USE = [
  "Reach for it when a page has several things to say about one product and no reason to rank them. A slider gives each its own moment and costs the reader nothing to skip; a list would put the fifth at the bottom of the page where it is read least.",
  "Five is what is drawn, not what the block takes. The tint is per item, so a sixth is a sixth entry rather than a change here — but the five tints are chosen to stay apart from each other, and a page that needs more of them will start repeating before it starts running out.",
  "Do not use it for anything a reader has to compare. Only one panel is on screen, so two features can never be seen side by side, and a specification table is the wrong thing to hide behind an arrow.",
]

export const MOTION = [
  "Nothing moves sideways. Every layer is stacked and what changes is opacity, over 300ms on the browser's own ease-in-out. That is measured off the live page rather than chosen: the panels there are all `absolute inset-0` and the only property in transition is `opacity`.",
  "It loops in both directions and the arrows are never disabled. `Previous` on the first feature goes to the last, `Next` on the last comes back to the first, which is why neither button ever needs a dead state.",
  "There is no autoplay. Fourteen seconds on the live page with nothing touched moved nothing, so the block waits to be asked. There are no dots and no counter either — the two arrows are the whole of the control.",
  "The tint fades with everything else rather than snapping. This one is composed rather than copied: the design file gives each feature a colour and the live page does not change colour at all, so nothing draws the moment between two tints. A colour that jumped while the words beneath it faded is the one reading both sources rule out.",
]

export const TINTS = [
  "The tint is the top stop of the gradient behind the artwork, running down to the page's own beige. The ground under the copy does not move with it: that gradient is beige to white on all five, which is what keeps the reading side steady while the picture side turns.",
  "The steps are not even, and they are written out rather than derived. Three of the five are the 200, the olive is a 300 and the emerald a 100 — the file picked what looked right at that weight, and a rule that derived them from the ramp name would quietly correct the drawing.",
  "The fourth is not the file's colour. It is drawn in `indigo/200`, a ramp this system does not ship, so it takes `blue-200` instead: measured across the whole palette, the closest thing that exists at 0.0246 in OKLab. The two that rank closer behind it are both violets, which the fifth slide now holds, so neither was available for this one. As built, the fourth and fifth sit 0.0560 apart — the third widest gap of the ten.",
  "The fifth is not the file's colour either, and for a different reason. It is drawn in `purple/200`, but `SegmentRows` already paints a violet segment and paints it `violet-200`. The two sat 0.0231 apart, which is close enough to read as a slip rather than a decision, so this takes the one that was there first. One system, one violet.",
]

export const LAYOUT = [
  "One breakpoint, at `lg`. Above it the frame is two equal halves; below it they stack, copy and arrows first and the artwork under them. That is the live page's own arrangement, measured at seven widths.",
  "The copy panel holds a floor of 240px so the frame does not jump as the words change length — the fifth feature is three lines longer than the third. The artwork panel holds 420px for the same reason.",
  "The column is the system's own. The live page caps its frame at 1152 and the file draws it at 1200; this takes `Container`, which is the 1200 every other block in the system lines up against, because a block that agreed with the live page here would disagree with the eight blocks above and below it.",
]

export function featureSliderDoc() {
  return join([
    preamble("FeatureSlider", "block"),
    "",
    "# FeatureSlider",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { FeatureSlider } from "@brevy/ui"',
    "",
    "<FeatureSlider",
    '  eyebrow="Everything in one app"',
    '  heading={["Less coordinating.", "More caring."]}',
    '  items={[{ title, description, tint: "yellow", media }]}',
    "/>",
    "```",
    "",
    "## Movement",
    "",
    ...MOTION.flatMap((paragraph) => [paragraph, ""]),
    "## Tints",
    "",
    ...TINTS.flatMap((paragraph) => [paragraph, ""]),
    table(
      ["Feature", "Tint", "Drawn as"],
      FEATURES.map((feature) => [
        feature.title,
        feature.tint,
        feature.tint === "blue"
          ? "indigo/200, not shipped"
          : feature.tint === "violet"
            ? "purple/200, already a violet here"
            : "as drawn",
      ]),
    ),
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
