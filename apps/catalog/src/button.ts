import { join, preamble, table } from "./doc"

/** The first component to carry its own documentation rather than a phrase.
 *
 *  A block hands Claude a page of markdown; a component handed it one
 *  sentence, and the sentence named the variant and nothing else. What was
 *  missing is what someone assembling a page actually needs: the import, the
 *  props, and a line saying which variant is for what. */

export const INTRO =
  "The system's button. Six variants, two heights, and a square form when it holds nothing but an icon."

export const USE = [
  "`Button` takes a `variant` and a `size`, and everything else a normal button takes: `onClick`, `disabled`, `type`, `children`. Left alone it is `primary` at the default height.",
  "Pick the variant by what the button is for, not by how it should look. `primary` is the one action a section wants; `outline` is the alternative beside it; `secondary` is a quieter action on a soft green ground; `ghost` is for actions that sit inside something else, like a menu row or a card corner. `send` and `social` are drawn for one place each, the chat's send and the footer's brand links, and are not general purpose.",
  "There is one `primary` to a section. Two of them beside each other read as one choice split in half, and the design never draws it.",
  "`size` is `default` at 48px or `compact` at 36px. The compact height is the navbar's call to action. `ghost` ignores it and stands at 36 either way, which is the only height it is drawn at.",
  "A button with an icon and no label needs an `aria-label`. The label is what a screen reader announces, and it is also what tells the button to go square: `ghost` and `outline` read the label together with the single icon and drop their horizontal padding.",
  "`asChild` renders the child in the button's place. Use it when the thing is a link: pass an anchor and it keeps the button's look with a link's behaviour.",
]

export const CONTENT = [
  "An icon goes before the label, as a child rather than a prop. The button sets the icon's size and stroke, so pass the icon and nothing else.",
  "Labels are short and say what happens: `Get started`, `See plans`, `New chat`. A button that says `Submit` or `Click here` tells the reader nothing they did not already know.",
]

/** The six the component ships, with what the design draws each one as. The
 *  catalog page shows eleven arrangements of them, which are these six paired
 *  with the shapes their content takes rather than six more variants. */
const VARIANTS: readonly (readonly string[])[] = [
  ["`primary`", "Deep green, filled", "The one action a section is asking for"],
  [
    "`outline`",
    "Deep green outline, hollow",
    "The alternative beside a primary",
  ],
  [
    "`secondary`",
    "Soft green, no outline",
    "A quieter action on its own ground",
  ],
  ["`ghost`", "No ground until pointed at", "Actions inside another surface"],
  [
    "`send`",
    "Round, soft green, 48 square",
    "The chat's send, and nothing else",
  ],
  [
    "`social`",
    "White card, thin thread, 36 square",
    "The footer's brand links",
  ],
]

const PROPS: readonly (readonly string[])[] = [
  [
    "`variant`",
    "`primary` `outline` `secondary` `ghost` `send` `social`",
    "`primary`",
    "What the button is for",
  ],
  ["`size`", "`default` `compact`", "`default`", "48px or 36px tall"],
  [
    "`asChild`",
    "`boolean`",
    "`false`",
    "Render the child instead, keeping the button's look",
  ],
  ["`disabled`", "`boolean`", "`false`", "Greys the button and stops pointers"],
  [
    "`aria-label`",
    "`string`",
    "none",
    "Required when the button holds only an icon",
  ],
  ["`onClick`", "`(event) => void`", "none", "What the button does"],
  ["`children`", "`ReactNode`", "none", "The label, and an icon before it"],
]

export function buttonDoc() {
  return join([
    preamble("Button", "component"),
    "",
    "# Button",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Button } from "@brevy/ui"',
    'import { ArrowRight, X } from "lucide-react"',
    "",
    "<Button onClick={onStart}>Get started</Button>",
    "",
    '<Button variant="outline" size="compact" onClick={onGuide}>',
    "  <ArrowRight />",
    "  See the guide",
    "</Button>",
    "",
    '<Button variant="ghost" aria-label="Close" onClick={onClose}>',
    "  <X />",
    "</Button>",
    "",
    "<Button asChild>",
    '  <a href="/chat">Start a chat</a>',
    "</Button>",
    "```",
    "",
    "## Variants",
    "",
    table(["Variant", "How it looks", "What it is for"], VARIANTS),
    "",
    "## Props",
    "",
    table(["Prop", "Values", "Default", "What it does"], PROPS),
    "",
    "## Content",
    "",
    ...CONTENT.flatMap((paragraph) => [paragraph, ""]),
  ])
}
