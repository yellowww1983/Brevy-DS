import type { StepsGround, StepsLayout } from "@brevy/ui"

import { join, preamble } from "./doc"

export const INTRO =
  "The section that says what a page is about to explain and then explains it. Four pages carry one; the frame around the steps is the same in all eight breakpoints the file draws, and they part only at how the steps themselves are arranged."

export const USE = [
  "`Steps` takes an `eyebrow`, a `heading` and the `steps` themselves. The number in the chip is `steps.length` rather than a prop — the file writes `3 Easy Steps` over three and `4 Easy Steps` over four, and a caption that can disagree with what it counts eventually will.",
  "`layout` picks the arrangement. `cards` is a row of cards, each an illustration over a title and a line; `panel` is a numbered list down one half with, beside it, the picture belonging to whichever step the list has reached.",
  "`panel` moves. The file draws it four times over and what changes is cumulative — one step reached, then two, then three, then all four, with the plate carrying that step's own picture. It advances every 3.5 seconds and starts over; a click takes the list to a step and stops the advancing; a reader who asked for stillness gets the first frame and the click. None of the timing is drawn, so the hold and the fade are ours.",
  "It moves at the desktop only. The narrow frames carry the first state and nothing else, so below the width where the list and the plate stand side by side there is no slider to run.",
  "`showMarkers` turns the numbered discs on. Both states are drawn: the two pages that lay their steps beside a panel show theirs, and the one that puts them in cards carries a disc in every card with every one switched off.",
  "`ground` is the section's own: the olive gradient three pages paint, or white. `tail` hangs a button and a line under the steps. `description` is the line under the heading, which one of the four pages leaves out.",
  "The illustrations are a slot. The file draws a different mock interface for every step on every page, by hand, which is composition rather than structure — the same standing the CTA band's photographs have.",
]

export const LAYOUT = [
  "The section pads itself by 96px top and bottom on the content column — 1200px, 762px, 358px — which is what the file draws on all eight, unlike the CTA band whose air comes from the section above it.",
  "The header is a chip, 12px down to a serif h2, 8px to the optional line under it, and 48px to the steps.",
  "`cards` runs a row at the content width and a column below it, 16px apart either way. Each card is white at a 16px radius with 24px of padding, an illustration 290px tall over a title and a line 8px apart.",
  "`panel` is one column narrow and two wide. The panel is the second thing in the narrow column rather than the last, which is what the file draws — the numbering is interrupted after the first step. The plate inside it holds at 520px and centres rather than stretching, which is what leaves 121px either side of it at the tablet.",
]

/** The Caregiving page's three cards (`22614:7570`): the pale ground, no line
 *  under the heading, and every numbered disc switched off. */
export const CARDS_PRESET: {
  layout: StepsLayout
  ground: StepsGround
  eyebrow: string
  heading: string
  steps: readonly {
    title: string
    description: string
    /** The mock the file draws in the card, exported at 2x — twice, because
     *  the file draws it twice.
     *
     *  `art` is the 341 frame the desktop and the mobile card both hold;
     *  `wide` is the 714 one the tablet holds. They are not the same picture
     *  scaled: the file keeps every piece of the mock at its own size and
     *  re-centres it in the wider frame, so one export stretched across the
     *  other's box comes out enlarged and cropped.
     *
     *  Not SVG, which was tried: Figma exports a nested frame with its
     *  ancestors as clipped context, so the file came back carrying a grey
     *  backing rect, the page's own 1440 by 4709 white, and the whole
     *  `Sections` tree cropped to a 342 by 290 window. What rendered was a
     *  slice of the page. */
    art: { src: string; width: number; height: number }
    wide: { src: string; width: number; height: number }
  }[]
} = {
  layout: "cards",
  ground: "gradient",
  eyebrow: "Easy Steps",
  heading: "How it works",
  steps: [
    {
      title: "See if you qualify",
      description:
        "Fill out our quick form to see if you qualify for family caregiver payments.",
      art: { src: "/steps/card-1.webp", width: 683, height: 580 },
      wide: { src: "/steps/card-1-wide.webp", width: 1428, height: 580 },
    },
    {
      title: "Obtain approval",
      description:
        "If you qualify, we'll work with you to get approval from your loved one's Medicaid.",
      art: { src: "/steps/card-2.webp", width: 683, height: 580 },
      wide: { src: "/steps/card-2-wide.webp", width: 1428, height: 580 },
    },
    {
      title: "We pay you!",
      description:
        "We get paid by Medicaid to hire you to care for your loved one. You will be hired directly by Brevy.",
      art: { src: "/steps/card-3.webp", width: 683, height: 580 },
      wide: { src: "/steps/card-3-wide.webp", width: 1428, height: 580 },
    },
  ],
}

/** The organizations page's four steps (`23259:576`), and the three frames
 *  that follow it (`23375:692`, `23375:829`, `23375:956`).
 *
 *  Each step carries the plate the panel shows while the list has reached it —
 *  four different pictures, all on the same 520 by 608 white plate, exported
 *  at 2x. */
export const PANEL_PRESET: {
  layout: StepsLayout
  ground: StepsGround
  eyebrow: string
  heading: string
  description: string
  steps: readonly {
    title: string
    description: string
    art: { src: string; width: number; height: number }
  }[]
} = {
  layout: "panel",
  ground: "gradient",
  eyebrow: "Easy Steps",
  heading: "How it works",
  description:
    "Get started in under a minute. No integration, no training needed, no new software to learn.",
  steps: [
    {
      title: "Send patients to brevy.com",
      description:
        "Share the link, put up a QR code in your waiting room, or have staff mention it during visits. No integration needed.",
      art: { src: "/steps/panel-1.webp", width: 1040, height: 1216 },
    },
    {
      title: "Brevy screens their needs",
      description:
        "Our AI checks eligibility across every major Medicaid and Medicare benefit program nationally, in real time.",
      art: { src: "/steps/panel-2.webp", width: 1032, height: 1208 },
    },
    {
      title: "Patients get connected to enrollment",
      description:
        "Qualified patients are handed off to enrollment specialists who guide them through the process from start to finish.",
      art: { src: "/steps/panel-3.webp", width: 1032, height: 1208 },
    },
    {
      title: "Your patients get the help they need",
      description:
        "Caregiver compensation, transportation, prescriptions, financial assistance, housing, meals — whatever they qualify for.",
      art: { src: "/steps/panel-4.webp", width: 1032, height: 1208 },
    },
  ],
}

/** The call to action the partner page hangs off the foot of its steps. */
export const TAIL = {
  label: "Start my care navigation",
  href: "/get-started",
  note: "Free consultation · No commitment",
}

export function stepsDoc() {
  return join([
    preamble("Steps", "block"),
    "",
    "# Steps",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Steps } from "@brevy/ui"',
    "",
    "<Steps",
    '  eyebrow="Easy Steps"',
    '  heading="How it works"',
    "  steps={steps}",
    '  layout="cards"',
    "/>",
    "```",
    "",
    "### layout: one of two",
    "",
    "- `cards`: a row of cards, an illustration over a title and a line",
    "- `panel`: a numbered list beside one illustration",
    "",
    "### the optional five",
    "",
    "- `description`: a line under the heading",
    "- `showMarkers`: the numbered discs",
    "- `ground`: `gradient` or `white`",
    "- `tail`: a button and a line under the steps",
    "",
    "### a step",
    "",
    "`{ title, description, illustration? }`. In `cards` the illustration is the mock inside the card; in `panel` it is the plate the panel shows while that step is the one the list has reached.",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
    "",
    "## Not here",
    "",
    "The app page draws a fifth version of this section and it is parked. It keeps the frame and changes six things inside the card at once: the illustration goes under the text rather than over it and runs to the card's edges, the number becomes a `STEP 1` eyebrow, the line drops to 16/24, and the card takes a thread instead of a shadow. That is a dialect rather than a variant.",
  ])
}
