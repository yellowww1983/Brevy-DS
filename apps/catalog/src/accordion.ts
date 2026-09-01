import { join, preamble, table } from "./doc"

export const INTRO =
  "A list of questions that open one at a time. Each one is its own card, so the list reads as a column of cards rather than a boxed table."

export const USE = [
  "An accordion is four parts. `Accordion` is the list, `AccordionItem` is one card, `AccordionTrigger` is the question row, and `AccordionContent` is the answer. Every item needs a `value` that is unique in the list, which is how the list knows which one is open.",
  "`type` is `single` by default, which is the FAQ's behaviour: one answer open at a time, and pressing the open question again closes it. `multiple` lets several stand open at once, for a list someone reads across rather than through.",
  "`collapsible` is on already when the type is `single`, so there is nothing to pass for the drawn behaviour. Set it `false` only if one answer must always stay open.",
  "Use it for questions and answers, and for a section someone can put away. Do not use it to hide something they need: a reader who has to open three panels to compare three things is being asked to remember instead of look.",
  "The chevron, the card, the spacing and the way the question tightens against its answer when it opens are all the component's. Nothing needs passing for them.",
  "`defaultValue` opens one from the start. The FAQ block opens its first question that way.",
]

const LIST_PROPS: readonly (readonly string[])[] = [
  [
    "`type`",
    "`single` `multiple`",
    "`single`",
    "One open at a time, or several",
  ],
  [
    "`collapsible`",
    "`boolean`",
    "`true` when single",
    "Whether the open one can be closed",
  ],
  ["`defaultValue`", "`string`", "none", "Which item starts open"],
  [
    "`value`",
    "`string`",
    "none",
    "Which item is open, when you are holding it yourself",
  ],
  [
    "`onValueChange`",
    "`(value) => void`",
    "none",
    "Called when the open item changes",
  ],
]

const ITEM_PROPS: readonly (readonly string[])[] = [
  ["`value`", "`string`", "none", "This item's name, unique in the list"],
  ["`disabled`", "`boolean`", "`false`", "Stops this one opening"],
  ["`children`", "`ReactNode`", "none", "The trigger and the content"],
]

export function accordionDoc() {
  return join([
    preamble("Accordion", "component"),
    "",
    "# Accordion",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    "import {",
    "  Accordion,",
    "  AccordionContent,",
    "  AccordionItem,",
    "  AccordionTrigger,",
    '} from "@brevy/ui"',
    "",
    '<Accordion defaultValue="eligibility">',
    '  <AccordionItem value="eligibility">',
    "    <AccordionTrigger>Who is eligible?</AccordionTrigger>",
    "    <AccordionContent>",
    "      Most family caregivers in Texas, including relatives and friends.",
    "    </AccordionContent>",
    "  </AccordionItem>",
    "",
    '  <AccordionItem value="pay">',
    "    <AccordionTrigger>How much does it pay?</AccordionTrigger>",
    "    <AccordionContent>",
    "      Up to $28,000 a year, depending on the programme and the hours.",
    "    </AccordionContent>",
    "  </AccordionItem>",
    "",
    '  <AccordionItem value="cost">',
    "    <AccordionTrigger>What does Brevy cost?</AccordionTrigger>",
    "    <AccordionContent>Nothing. We are paid by the programme.</AccordionContent>",
    "  </AccordionItem>",
    "</Accordion>",
    "```",
    "",
    "## The parts",
    "",
    "- `Accordion`: the list, and which of it is open.",
    "- `AccordionItem`: one card, named by its `value`.",
    "- `AccordionTrigger`: the question, and the chevron that turns.",
    "- `AccordionContent`: the answer.",
    "",
    "## Props",
    "",
    "### Accordion",
    "",
    table(["Prop", "Values", "Default", "What it does"], LIST_PROPS),
    "",
    "### AccordionItem",
    "",
    table(["Prop", "Values", "Default", "What it does"], ITEM_PROPS),
    "",
    "`AccordionTrigger` and `AccordionContent` take their children and a",
    "`className`. Everything else comes from the item around them.",
  ])
}
