import { join, preamble, table } from "./doc"

/** The chat's copy, shared by the specimen the frame loads and the page that
 *  frames it. The states board's line rather than the hero's: the hero writes
 *  a longer greeting and the shipped site a third version again, which
 *  DESIGN-FEEDBACK entry 49 asks the design to settle. */
export const PLACEHOLDER = "What can I help you with today?"

export const SEND_LABEL = "Send message"

/** The message the board draws in the state where the send is lit. */
export const READY = "What dental benefits am I eligible for?"

export const INTRO =
  "The hero's chat card: a box to type a question in and a round button to send it. It is one card, not a field with a button beside it."

export const USE = [
  "`Chat` takes the `placeholder` and the `sendLabel`, which is the name a screen reader gives the send button. Both are copy, so both belong to the page.",
  "It goes in a hero, where the first thing someone can do is ask. It is the home page's opening move rather than a general control, and there is one to a page.",
  "It is not a variant of `Input`, and reaching for one where the other belongs is the easy mistake. `Input` is a field with a frame of its own that goes inside a form. This is a card that wears the whole skin, holds a growing text box with no frame at all, and carries its own send. They look alike and are built the other way round.",
  "The box grows as someone types, line by line, and stops at 200px and scrolls from there. Nothing sets its height.",
  "The send button reads the field. Empty, it rests on the soft olive; with something to send it turns green. Nothing switches it.",
  "`defaultValue` puts text in from the start, which is what the catalog uses to show the lit state.",
]

const PROPS: readonly (readonly string[])[] = [
  ["`placeholder`", "`string`", "none", "The greyed line inside the box"],
  ["`sendLabel`", "`string`", "none", "The send button's accessible name"],
  ["`defaultValue`", "`string`", "empty", "Text in the box from the start"],
  ["`className`", "`string`", "none", "Extra classes, for placement"],
]

export function chatDoc() {
  return join([
    preamble("Chat", "component"),
    "",
    "# Chat",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { Chat } from "@brevy/ui"',
    "",
    "<Chat",
    '  placeholder="What can I help you with today?"',
    '  sendLabel="Send message"',
    "/>",
    "```",
    "",
    "## Props",
    "",
    table(["Prop", "Values", "Default", "What it does"], PROPS),
  ])
}
