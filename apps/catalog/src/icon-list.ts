import { join, preamble, table } from "./doc"

/** The lines the file actually puts in these lists, kept as the catalog's
 *  fixtures so a preview shows a real list rather than lorem.
 *
 *  The check list is the For Organizations page's eligibility roll
 *  (`23321:2569`) with its own heading; the small olive discs are the partner
 *  page's qualifying conditions (`25276:3983`); the large red discs are the
 *  Mobile App page's list of what goes wrong without the product
 *  (`24966:1156`). */
export const PROGRAMS = [
  "Medicare Savings Program",
  "Medicaid Expansion",
  "SNAP",
  "LIHEAP",
]

export const PROGRAMS_HEADING = "Your eligible programs:"

export const DETAILS = ["Age: 67", "State: Texas"]

export const QUALIFY = [
  "Your loved one has Medicare (or Medicare and Medicaid)",
  "You want to transition them to a plan that pays family caregivers",
  "You are a family member or friend already providing care",
]

export const WITHOUT = [
  "You track how many authorized hours are left by hand",
  "What's due and what's overdue lives in three different places",
  "Payroll questions arrive by phone, one caregiver at a time",
]

export const INTRO =
  "A list of short lines, each with a mark beside it. The most repeated shape on the site: what you get, what you qualify for, what goes wrong without help."

export const USE = [
  "`IconList` is the list and `IconListItem` is one line. The icon arrives as a prop rather than a child, because a disc has to wrap it and a child cannot be wrapped.",
  "`marker` decides what the mark is. `check` is a bare tick in the text's colour and is the one the site draws most. `arrow` is the same shape pointing on. `disc` puts the glyph inside a soft ring, which is what a list uses when it is standing on its own rather than inside a paragraph.",
  "The list dresses its rows, not the other way round. A row cannot be a disc inside a list of checks, which is deliberate: one place decides and a list stays of one kind.",
  "`tone` and `size` are read by the disc only. `olive` is the ordinary one and `red` is for what goes wrong. `sm` is a 24px disc and `lg` is 36px with a larger line beside it, which is the shape a list takes when it is the whole of a card.",
  "`heading` is the line over the list. Every check list on the site carries one and no disc list does, so it goes with the checks.",
  "`divided` puts a rule between the rows and closes the gap that separated them. Use it for a long list someone scans rather than a short one they read.",
  "The icon is decorative. The line beside it says the same thing, so it is hidden from screen readers and a tick is not read aloud before every item.",
  "A line that wraps returns under the first line rather than indenting. The mark is a column of its own and the label is the rest of the row.",
]

const MARKERS: readonly (readonly string[])[] = [
  ["`check`", "A bare tick", "What you get, what is included"],
  ["`arrow`", "A bare arrow", "What comes next, where it leads"],
  ["`disc`", "A glyph in a soft ring", "A list standing on its own"],
]

const LIST_PROPS: readonly (readonly string[])[] = [
  ["`marker`", "`check` `arrow` `disc`", "`check`", "What the mark is"],
  [
    "`tone`",
    "`olive` `red`",
    "`olive`",
    "The disc's colour, ignored by the bare marks",
  ],
  [
    "`size`",
    "`sm` `lg`",
    "`sm`",
    "A 24px or 36px disc, ignored by the bare marks",
  ],
  ["`heading`", "`string`", "none", "The line over the list"],
  ["`divided`", "`boolean`", "`false`", "A rule between the rows"],
  ["`children`", "`ReactNode`", "none", "The rows"],
]

const ITEM_PROPS: readonly (readonly string[])[] = [
  ["`icon`", "`ReactNode`", "none", "The glyph, wrapped by the marker"],
  ["`children`", "`ReactNode`", "none", "The line"],
]

export function iconListDoc() {
  return join([
    preamble("IconList", "component"),
    "",
    "# IconList",
    "",
    INTRO,
    "",
    "## Using it",
    "",
    ...USE.flatMap((paragraph) => [paragraph, ""]),
    "```tsx",
    'import { IconList, IconListItem } from "@brevy/ui"',
    'import { Check, X } from "lucide-react"',
    "",
    '<IconList heading="What you get:">',
    "  <IconListItem icon={<Check />}>A plan built around your state</IconListItem>",
    "  <IconListItem icon={<Check />}>Help with every form</IconListItem>",
    "  <IconListItem icon={<Check />}>Someone to call</IconListItem>",
    "</IconList>",
    "",
    '<IconList marker="disc" tone="red" size="lg" divided>',
    "  <IconListItem icon={<X />}>Programmes you never hear about</IconListItem>",
    "  <IconListItem icon={<X />}>Forms that come back rejected</IconListItem>",
    "</IconList>",
    "```",
    "",
    "## Markers",
    "",
    table(["Marker", "How it looks", "What it is for"], MARKERS),
    "",
    "## Props",
    "",
    "### IconList",
    "",
    table(["Prop", "Values", "Default", "What it does"], LIST_PROPS),
    "",
    "### IconListItem",
    "",
    table(["Prop", "Values", "Default", "What it does"], ITEM_PROPS),
  ])
}
