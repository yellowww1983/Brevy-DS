import { join, preamble, table } from "./doc"

export const INTRO =
  "The system's text field. One box at two heights, with room for an icon at either end."

export const USE = [
  "`Input` takes everything an `<input>` takes: `type`, `placeholder`, `value`, `onChange`, `disabled`, `required`. What it adds is a height and two slots.",
  "`size` is the height. `default` is 36px and is the app's field; `tall` is 48px and is the website's, which also steps the text up a size. Nothing else moves between them: the radius, the padding, the thread and the ground are the same box.",
  "`leading` takes an icon that names the field's kind, like an envelope on an email address. It is hidden from screen readers, because the label above already says what the field is.",
  "`trailing` takes whatever goes at the other end. It is usually a control rather than a decoration, like the eye that reveals a password, so pass a real button and it stays clickable.",
  "Error is not a prop. The field paints its error border and ring from `aria-invalid`, and inside a form `FormControl` sets that from the same error the message underneath reads. Set it yourself only outside a form.",
  "The native `size` attribute, which counts characters, is not available. Nothing in this system uses it and the name goes to the height instead.",
  "Dark needs nothing. The field takes its ground, its thread and its placeholder from tokens that turn with the page.",
]

const SIZES: readonly (readonly string[])[] = [
  ["`default`", "36px, 14px text", "App screens and dense forms"],
  ["`tall`", "48px, 16px text", "The website's forms"],
]

const PROPS: readonly (readonly string[])[] = [
  ["`size`", "`default` `tall`", "`default`", "The height of the box"],
  [
    "`leading`",
    "`ReactNode`",
    "none",
    "An icon before the text, hidden from screen readers",
  ],
  [
    "`trailing`",
    "`ReactNode`",
    "none",
    "A control after the text, still clickable",
  ],
  ["`type`", "`string`", "`text`", "The kind of field, as on any input"],
  ["`placeholder`", "`string`", "none", "The greyed hint inside the box"],
  ["`disabled`", "`boolean`", "`false`", "Fades the field and stops pointers"],
  [
    "`aria-invalid`",
    "`boolean`",
    "`false`",
    "Paints the error border and ring",
  ],
  ["`value`", "`string`", "none", "The text, when you are holding it yourself"],
  ["`onChange`", "`(event) => void`", "none", "Called as the text changes"],
]

export function inputDoc() {
  return join([
    preamble("Input", "component"),
    "",
    "# Input",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Input } from "@brevy/ui"',
    'import { Mail } from "lucide-react"',
    "",
    '<Input type="email" placeholder="you@example.com" leading={<Mail />} />',
    "",
    '<Input size="tall" type="password" placeholder="Create a password" />',
    "```",
    "",
    "Inside a form the field goes in a `FormControl`, which hands it its id and",
    "its error. See the Form documentation for the whole field.",
    "",
    "## Sizes",
    "",
    table(["Size", "How it looks", "Where it is used"], SIZES),
    "",
    "## Props",
    "",
    table(["Prop", "Values", "Default", "What it does"], PROPS),
  ])
}
