import { join, preamble } from "./doc"

export const INTRO =
  "The auth screen. The lockup, a serif welcome, a line under it and a form, beside a photograph where there is room for one. An application screen rather than a landing section: it comes from the app file, but it is drawn in the website's own language — the hero's ground, the h1, the leaf button, the 48 field — so it is built from this system rather than beside it."

export const USE = [
  "`AuthSplit` takes a `heading`, a `description`, and the form as `children` — every line of the form is a page's own: which fields, what they validate, where the button leads. The screen owns the shell, the ground and the header.",
  "`photograph` decides the arrangement. With it, the copy takes the left half and the picture the right, which is the file's split variant; without it, the column centres alone on the wash, which is the file's centred variant rather than a fallback. Both are preset layers a client swaps.",
  "`wash` is the same painting the centred hero hangs across its ground, and the same asset in the file.",
  "The form is the system's own parts: `Form` wiring each field's ids and error, `Input` at its `tall` size with a `trailing` eye that reveals the password, `FormLabel` with `Forgot your password?` in its `action` slot, and the primary `Button` on the leaf.",
  "Error is one state, not two: the field paints it through `aria-invalid` — measured off the app's states board — and `FormMessage` reads the same error, so the box and the line under it cannot disagree.",
]

export const LAYOUT = [
  "The frame pads 24px — 16px below the tablet width — and splits into two halves 24px apart. The copy column is 360px, centred in its half both ways; the photograph fills the other half and rounds 16px.",
  "Inside the column: 48px under the lockup, 12px under the heading, then 16px between the description, each field and the actions. Inside a field the rhythm is 8px: label, control, helper.",
  "The photograph stands only from the content breakpoint up. Below it the screen is the centred column on the wash — which is exactly the tablet the file draws for its centred variant, so the composition and the drawing arrive at the same place.",
  "The screen is at least 960px tall, 782px below the content width, and grows with the form.",
  "Two numbers are the system's rather than the drawing's: the photograph's 16 against a drawn 14, and the heading's 1.333 against a typed 42/60. The field's drawn 8 is the system's own `rounded-md`. DESIGN-FEEDBACK 71.",
]

/** The drawn screen's own copy: a caregiver setting a password during
 *  onboarding. The helper still reading `This is an input description.` is
 *  the file's leftover and is not carried; the drawn helper sits under the
 *  confirm field and does here too. Both drawn `Forgot your password?` lines
 *  are switched off in the file — the first is carried anyway, as decided,
 *  because it is what the label's action slot exists to show, and the
 *  hidden state is DESIGN-FEEDBACK 72's question. */
export const PRESET = {
  heading: "\u{1F44B} Welcome, Caregiver",
  description:
    "Create a password to secure your account. You'll only need this once.",
  password: {
    label: "Password",
    placeholder: "Create password",
    helper: "Min. 8 characters. You won't need this for daily logins.",
    forgot: "Forgot your password?",
  },
  confirm: {
    label: "Confirm password",
    placeholder: "Repeat password",
  },
  button: "Continue",
  footer: {
    lead: "Not a Brevy caregiver?",
    link: "Contact Brevy to get started",
  },
}

export const WASH = { src: "/hero/wash.jpg" }

export const PHOTOGRAPH = {
  src: "/auth/photo.webp",
  width: 1208,
  height: 1824,
  alt: "A watercolour park scene: a caregiver walking arm in arm with an older man",
}

export function authDoc() {
  return join([
    preamble("AuthSplit", "screen"),
    "",
    "# AuthSplit",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { AuthSplit } from "@brevy/ui"',
    "",
    "<AuthSplit",
    "  heading={heading}",
    "  description={description}",
    "  wash={<img src={wash} alt=\"\" className='size-full object-cover' />}",
    "  photograph={<img src={photo} alt={alt} className='size-full object-cover' />}",
    ">",
    "  {form}",
    "</AuthSplit>",
    "```",
    "",
    "## Layout",
    "",
    ...LAYOUT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
