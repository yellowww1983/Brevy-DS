import type { StepsGround, StepsLayout } from "@brevy/ui"

import { join, preamble } from "./doc"

export const INTRO =
  "The section that says what a page is about to explain and then explains it. Four pages carry one; the frame around the steps is the same in all eight breakpoints the file draws, and they part only at how the steps themselves are arranged."

export const USE = [
  "`Steps` takes an `eyebrow`, a `heading` and the `steps` themselves. The number in the chip is `steps.length` rather than a prop — the file writes `3 Easy Steps` over three and `4 Easy Steps` over four, and a caption that can disagree with what it counts eventually will.",
  "`layout` picks the arrangement. `cards` is a row of cards, each an illustration over a title and a line; `panel` is a numbered list down one half with, beside it, the picture belonging to whichever step the list has reached; `app` is the same row `cards` draws with the card turned over, the copy on top and the artwork under it running to the card's edges.",
  "`cards` and `app` share a grid and nothing else. Measured side by side, both are three columns at a 16px gutter on the content column; they part at the card, and the card differs all the way through, so neither borrows the other's.",
  "`panel` moves. The file draws it four times over and what changes is cumulative — one step reached, then two, then three, then all four, with the plate carrying that step's own picture. It advances every 3.5 seconds and starts over; a click takes the list to a step and stops the advancing; a reader who asked for stillness gets the first frame and the click. None of the timing is drawn, so the hold and the fade are ours.",
  "It moves at the desktop only. The narrow frames carry the first state and nothing else, so below the width where the list and the plate stand side by side there is no slider to run.",
  "`showMarkers` turns the numbering on, and what it turns on depends on the arrangement: `cards` and `panel` get the numbered disc, `app` gets a `STEP 1` eyebrow over the title. One axis, because it is one question — whether the steps are counted out loud — and three answers only because three drawings answer it differently.",
  "Both states are drawn for the disc: the two pages that lay their steps beside a panel show theirs, and the one that puts them in cards carries a disc in every card with every one switched off. The app landing has no switch at all and every card carries its eyebrow, so a page reproducing it passes `showMarkers`.",
  "`ground` is the section's own: the olive gradient three pages paint, or white. `tail` hangs a button and a line under the steps. `description` is the line under the heading, which one of the four pages leaves out.",
  "The illustrations are a slot. The file draws a different mock interface for every step on every page, by hand, which is composition rather than structure — the same standing the CTA band's photographs have.",
]

export const LAYOUT = [
  "The section pads itself by 96px top and bottom on the content column — 1200px, 762px, 358px — which is what the file draws on all eight, unlike the CTA band whose air comes from the section above it.",
  "The header is a chip, 12px down to a serif h2, 8px to the optional line under it, and 48px to the steps.",
  "`cards` runs a row at the content width and a column below it, 16px apart either way. Each card is white at a 16px radius with 24px of padding, an illustration 290px tall over a title and a line 8px apart.",
  "`panel` is one column narrow and two wide. The panel is the second thing in the narrow column rather than the last, which is what the file draws \u2014 the numbering is interrupted after the first step. The plate inside it holds at 520px and centres rather than stretching, which is what leaves 121px either side of it at the tablet.",
  "`app` runs the row `cards` runs. The card carries a thread and the small shadow rather than the larger one, clips at its 16px radius, and stands on a 488px floor so the row levels; a card whose copy runs long grows past it and takes the row with it. Inside, 24px of padding holds the eyebrow, the title and the line, and the tray under them fills whatever is left and runs to the card\u2019s own edges.",
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

/** The Mobile App landing's three cards (`24974:4784`).
 *
 *  The copy and the artwork are both that page's own. The three mocks — a
 *  passkey field, a checklist, a patient record — are live React components
 *  over there, built on that project's own primitives and framer-motion, so
 *  they are exported rather than reproduced: the same standing the CTA band's
 *  figures have, and the same reason. What a preset owes is the picture, not
 *  the machinery behind it.
 *
 *  Exported at 3x with the tray taken out from under them, so the alpha is
 *  real and our own tray paints the ground. 954px covers the widest the tray
 *  ever gets — 714 at the tablet tab — and is 2.8x at the desktop's 341.
 *
 *  `showMarkers` is on. The landing has no switch for it — every card carries
 *  its `STEP 1` and nothing turns them off — because on that page the eyebrow
 *  *is* the numbering. The prop still governs it here, so one axis covers all
 *  three arrangements, and this preset is what that page would pass. */
export const APP_PRESET: {
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
  layout: "app",
  ground: "white",
  eyebrow: "Getting started",
  heading: "From enrollment to your first paycheck",
  description: "Brevy walks you through setup, one step at a time.",
  steps: [
    {
      title: "Get your invite",
      description:
        "Once your background check clears, you get a text link. Tap it, set a password, and sign in easily.",
      art: { src: "/steps/app-1.webp", width: 954, height: 765 },
    },
    {
      title: "Finish setup in the app",
      description:
        "A simple checklist covers your W-4, direct deposit, and I-9. You always see what’s next and how far you’ve come.",
      art: { src: "/steps/app-2.webp", width: 954, height: 813 },
    },
    {
      title: "Start caring",
      description:
        "See your patients, your hours, and your pay in one place. Starting August 3, clock in and out from here, too.",
      art: { src: "/steps/app-3.webp", width: 954, height: 813 },
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
    "### layout: one of three",
    "",
    "- `cards`: a row of cards, an illustration over a title and a line",
    "- `panel`: a numbered list beside one illustration",
    "- `app`: the same row, the card turned over — copy on top, artwork under it to the card's edges",
    "",
    "### the optional five",
    "",
    "- `description`: a line under the heading",
    "- `showMarkers`: the numbering — a disc in `cards` and `panel`, a `STEP 1` eyebrow in `app`",
    "- `ground`: `gradient` or `white`",
    "- `tail`: a button and a line under the steps",
    "",
    "### a step",
    "",
    "`{ title, description, illustration? }`. In `cards` the illustration is the mock inside the card; in `app` it is what the tray under the copy holds; in `panel` it is the plate the panel shows while that step is the one the list has reached.",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
    "",
  ])
}
