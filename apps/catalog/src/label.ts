import { join, preamble, table } from "./doc"

export const INTRO =
  "The word over a field. It ties itself to the field so that clicking it moves the cursor there."

export const USE = [
  "`Label` takes `htmlFor`, which is the id of the field it names, and the words themselves. That pairing is the whole point of it: without it a label is text near a box rather than the box's name.",
  "Inside a form, reach for `FormLabel` instead. It is this label with the id already wired, and it can carry a link at the end of its row. There is no case for using this one inside a `FormItem`.",
  "It follows a disabled field rather than taking a state of its own. A label is never disabled by itself, so mark the field and the label fades with it.",
]

const PROPS: readonly (readonly string[])[] = [
  ["`htmlFor`", "`string`", "none", "The id of the field this names"],
  ["`children`", "`ReactNode`", "none", "The words"],
  [
    "`className`",
    "`string`",
    "none",
    "Extra classes, for spacing rather than type",
  ],
]

export function labelDoc() {
  return join([
    preamble("Label", "component"),
    "",
    "# Label",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Input, Label } from "@brevy/ui"',
    "",
    '<div className="grid gap-2">',
    '  <Label htmlFor="city">City</Label>',
    '  <Input id="city" placeholder="Austin" />',
    "</div>",
    "```",
    "",
    "## Props",
    "",
    table(["Prop", "Values", "Default", "What it does"], PROPS),
  ])
}
