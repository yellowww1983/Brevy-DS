import type { HeroCenteredAction, HeroCenteredIntro } from "@brevy/ui"

import { PEOPLE } from "./avatar"
import { join, preamble } from "./doc"
import { LABEL } from "./social-proof"

export const INTRO =
  "The centred hero. An eyebrow or a stack of faces, a serif heading, a line under it, then either a chat card or a button, over a picture that fades into the page at the top and the bottom. Two of the website's five heroes are this same object with different things in its two slots."

export const USE = [
  "`HeroCentered` takes the heading and the description, plus two slots. `action` is either the chat card with its suggestions or a call to action with an optional line of reassurance under it. `intro` is what sits above the heading: an eyebrow, a stack of faces, or nothing.",
  "`intro` is one prop with three states rather than two switches, because the file never draws an eyebrow and the faces together: seven samples, including one page that swaps one for the other between breakpoints.",
  "Everything inside is a component the system already ships: the `Chat` and its `Chip` suggestions, the primary `Button`, and `SocialProof`. The block adds no parts of its own.",
  "`image` is optional and carries two layers, because the file paints two: a wash across the full height and a band along the foot. Left out, the hero stands on its own gradient.",
]

export const LAYOUT = [
  "The copy is a centred column that stops at 794px, with 40px above it and 24px down to the action. Inside the column the rhythm is 8px twice: intro to heading, heading to description.",
  "The heading is the system's `h1`, which is drawn 42/36/30 across the three widths and is fluid between them. The description holds at 20/28 everywhere.",
  "The suggestions go two by two where there is room and one under the other below the tablet width, 12px apart either way.",
  "The band is 426px tall and sits against the foot, masked so it fades out at both ends. The section is at least 670px tall, or 757px below the tablet width, and grows if the copy needs it.",
]

/** The home pages' hero, which is the one the file draws four times over with
 *  nothing changing but the season's artwork. */
export const CHAT_PRESET: {
  heading: string
  description: string
  intro: HeroCenteredIntro
  action: HeroCenteredAction
} = {
  heading: "Eldercare made simple",
  description:
    "The free tool for discovering and enrolling in the Medicaid or Medicare benefits you need.",
  intro: {
    kind: "socialProof",
    people: PEOPLE.map((person) => ({
      name: person.name,
      initials: person.initials,
      photo: person.photo,
    })),
    label: LABEL,
  },
  action: {
    kind: "chat",
    placeholder:
      "Hi! I can help you check your eligibility in under 3 minutes. What state do you live in?",
    sendLabel: "Send message",
    suggestions: [
      "Hi can I get help for taking care of my loved ones?",
      "What dental benefits am I eligible for?",
      "How do I reduce my prescription costs?",
      "Can I get help with transportation to appointments?",
    ],
  },
}

/** The partner page's hero: the same skeleton with a call to action where the
 *  chat card goes, and an eyebrow where the faces go. The line naming the
 *  partnership is this site's own copy and is not carried here. */
export const BUTTON_PRESET: {
  heading: string
  description: string
  intro: HeroCenteredIntro
  action: HeroCenteredAction
} = {
  heading: "Unlock paid family caregiving with the right Medicaid plan",
  description:
    "Want to become a paid family caregiver but on the wrong Medicaid plan? Brevy handles the insurance transition for you — at $0 out-of-pocket for most.",
  intro: { kind: "eyebrow", text: "A partnership built for caregivers" },
  action: {
    kind: "button",
    label: "Get started now",
    href: "/get-started",
    note: "Takes 2 minutes · No cost · No commitment",
  },
}

/** The website's own artwork, exported from the file and stored beside the
 *  catalog. A client brings their own two layers. */
export const IMAGE = {
  wash: "/hero/wash.jpg",
  band: "/hero/band.jpg",
  alt: "An autumn valley with two people looking out over it",
}

export function heroCenteredDoc() {
  return join([
    preamble("HeroCentered", "block"),
    "",
    "# HeroCentered",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { HeroCentered } from "@brevy/ui"',
    "",
    "<HeroCentered",
    "  heading={heading}",
    "  description={description}",
    '  intro={{ kind: "socialProof", people, label }}',
    '  action={{ kind: "chat", placeholder, sendLabel, suggestions }}',
    "  image={{ wash, band, alt }}",
    "/>",
    "```",
    "",
    "### intro: one of three",
    "",
    '- `{ kind: "eyebrow", text }`: a line above the heading',
    '- `{ kind: "socialProof", people, label }`: the faces, the stars and a claim',
    '- `{ kind: "none" }`: the heading opens the page',
    "",
    "### action: one of two",
    "",
    '- `{ kind: "chat", placeholder, sendLabel, suggestions }`: the chat card, with as many suggestions as you pass',
    '- `{ kind: "button", label, href, note? }`: a primary button, with an optional line under it',
    "",
    "### image: optional",
    "",
    "`{ wash, band, alt }`. Two layers: `wash` covers the whole hero, `band` sits 426px tall against the foot and is masked so it fades at both ends. Leave `image` out and the hero stands on its gradient alone.",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
