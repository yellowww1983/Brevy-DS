import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  Badge,
  Button,
  Chip,
  Facebook,
  Input,
  Instagram,
  Label,
  LinkedIn,
  TikTok,
  type BadgeProps,
  type ButtonProps,
} from "@brevy/ui"
import {
  ArrowUp,
  Check,
  Clock,
  Download,
  MessageCircleHeart,
  Plus,
} from "lucide-react"
import type { ReactNode } from "react"

import { MISSING_PHOTO, PEOPLE } from "./avatar"
import { SocialProofFrame } from "./components/social-proof-frame"
import { ChatFrame } from "./components/chat-frame"
import { EmailField } from "./components/email-field"

export type Axis = {
  label: string
  values: readonly string[]
  /** How each value reads inside a sentence. Axis values are written for a
   *  grid heading; only an axis that carries prose can be copied as intent. */
  phrasing?: Readonly<Record<string, string>>
}

export type Omission = {
  key: string
  note: "missing in Figma" | "identical to Default" | "not drawn"
}

export type ComponentEntry = {
  slug: string
  name: string
  axes: readonly Axis[]
  omitted: readonly Omission[]
  /** One preview per row instead of the grid, for a component whose drawn
   *  width is wider than a grid cell. */
  wide?: true
  /** Shown at the three drawn widths behind the same tabs the blocks use,
   *  for a component the design draws once and places at every width. The
   *  previews then frame themselves, so each one is its own document. */
  viewport?: true
  render: (combination: Record<string, string>) => ReactNode
}

type Force = "hover" | "focus-visible" | "active" | undefined

const forceOf = (state: string | undefined): Force => {
  if (state === "Hover") return "hover"
  if (state === "Focus") return "focus-visible"
  if (state === "Active") return "active"
  return undefined
}

/** Variant and form are not perpendicular on the board: primary is never drawn
 *  icon-only, ghost is never drawn with an icon beside a label. */
type ButtonForm = {
  variant: NonNullable<ButtonProps["variant"]>
  children: ReactNode
  label?: string
  size?: NonNullable<ButtonProps["size"]>
}

const buttonForms: Record<string, ButtonForm> = {
  "Primary · label": { variant: "primary", children: "Button" },
  "Primary · icon + label": {
    variant: "primary",
    children: (
      <>
        <Plus />
        New chat
      </>
    ),
  },
  "Primary compact · icon + label": {
    variant: "primary",
    size: "compact",
    children: (
      <>
        <MessageCircleHeart />
        New chat
      </>
    ),
  },
  "Outline · label": { variant: "outline", children: "Button" },
  "Outline · icon + label": {
    variant: "outline",
    children: (
      <>
        <Download />
        Download app
      </>
    ),
  },
  "Outline · icon only": {
    variant: "outline",
    children: <Download />,
    label: "Download app",
  },
  "Secondary · label": { variant: "secondary", children: "Get started" },
  "Ghost · label": { variant: "ghost", children: "Button" },
  "Ghost · icon only": {
    variant: "ghost",
    children: <Plus />,
    label: "New chat",
  },
  "Send · icon only": {
    variant: "send",
    children: <ArrowUp />,
    label: "Send message",
  },
}

/** The footer draws the four marks in a row, 8 apart, so the preview shows
 *  the row rather than one button standing on its own. */
const SOCIALS = [
  { label: "Facebook", icon: <Facebook /> },
  { label: "Instagram", icon: <Instagram /> },
  { label: "TikTok", icon: <TikTok /> },
  { label: "LinkedIn", icon: <LinkedIn /> },
] as const

const badgeVariants: Record<string, NonNullable<BadgeProps["variant"]>> = {
  Outline: "outline",
  Olive: "olive",
  Beige: "beige",
}

export const components: readonly ComponentEntry[] = [
  {
    slug: "button",
    name: "Button",
    // Drawn from Brevy Website · frame 22912:1932
    axes: [
      {
        label: "Form",
        values: [...Object.keys(buttonForms), "Social · icon only"],
        phrasing: {
          "Primary · label": "primary, with a text label",
          "Primary · icon + label": "primary, with an icon before the label",
          "Primary compact · icon + label":
            "primary at the compact height, with an icon before the label",
          "Outline · label": "outlined, with a text label",
          "Outline · icon + label": "outlined, with an icon before the label",
          "Outline · icon only": "outlined, with an icon and no label",
          "Secondary · label": "soft green, with a text label",
          "Ghost · label": "ghost, with a text label",
          "Ghost · icon only": "ghost, with an icon and no label",
          "Send · icon only": "the chat's round send, an arrow and no label",
          "Social · icon only": "the footer's brand links, four in a row",
        },
      },
      {
        label: "State",
        values: ["Default", "Hover", "Focus", "Active", "Disabled"],
      },
    ],
    omitted: [
      { key: "Primary · label/Active", note: "missing in Figma" },
      { key: "Outline · label/Active", note: "missing in Figma" },
      { key: "Outline · icon + label/Active", note: "missing in Figma" },
      { key: "Outline · icon only/Active", note: "missing in Figma" },
      { key: "Secondary · label/Active", note: "missing in Figma" },
      { key: "Send · icon only/Hover", note: "not drawn" },
      { key: "Social · icon only/Active", note: "not drawn" },
    ],
    render: (combination) => {
      const state = combination.State

      if (combination.Form === "Social · icon only") {
        return (
          <div className="flex gap-2">
            {SOCIALS.map((social) => (
              <Button
                key={social.label}
                variant="social"
                size="compact"
                aria-label={social.label}
                disabled={state === "Disabled"}
                data-force={forceOf(state)}
              >
                {social.icon}
              </Button>
            ))}
          </div>
        )
      }

      const form = buttonForms[combination.Form ?? ""]

      if (!form) {
        return null
      }

      /** The send's Active is not the pressed pseudo-class the other forms
       *  force: it is the ready-to-send skin, worn through the attribute the
       *  chat toggles. */
      const sendActive = form.variant === "send" && state === "Active"

      return (
        <Button
          variant={form.variant}
          size={form.size}
          aria-label={form.label}
          disabled={state === "Disabled"}
          data-force={sendActive ? undefined : forceOf(state)}
          data-active={sendActive ? "" : undefined}
        >
          {form.children}
        </Button>
      )
    },
  },
  {
    slug: "input",
    name: "Input",
    // Drawn from Brevy app · component set 65:533; the tall size from the
    // website file, where every form field is 48. The file type exists on the
    // component natively but is shown nowhere: the website never draws one.
    axes: [
      {
        label: "Size",
        values: ["Default", "Tall"],
        phrasing: {
          Default: "at the default height",
          Tall: "at the tall height the website uses",
        },
      },
      {
        label: "State",
        values: [
          "Default",
          "Focus",
          "Filled",
          "Disabled",
          "Error",
          "Error (Focus)",
        ],
      },
    ],
    omitted: [],
    render: (combination) => {
      const state = combination.State
      const invalid = state === "Error" || state === "Error (Focus)"
      const focused = state === "Focus" || state === "Error (Focus)"

      return (
        <Input
          type="text"
          size={combination.Size === "Tall" ? "tall" : "default"}
          aria-label="Email"
          placeholder="hello@brevy.com"
          defaultValue={state === "Filled" ? "hello@brevy.com" : undefined}
          disabled={state === "Disabled"}
          aria-invalid={invalid}
          data-force={focused ? "focus-visible" : undefined}
        />
      )
    },
  },
  {
    slug: "badge",
    name: "Badge",
    // Drawn from Brevy Website · the Mobile App section's status badges
    axes: [
      {
        label: "Variant",
        values: ["Outline", "Olive", "Beige"],
        phrasing: {
          Outline: "outlined on white",
          Olive: "on the soft olive",
          Beige: "on the quiet beige",
        },
      },
      {
        label: "Content",
        values: ["Label", "Icon + label"],
        phrasing: {
          Label: "with a text label",
          "Icon + label": "with an icon before the label",
        },
      },
    ],
    omitted: [{ key: "Outline/Icon + label", note: "not drawn" }],
    render: (combination) => {
      const variant = badgeVariants[combination.Variant ?? ""] ?? "outline"
      const withIcon = combination.Content === "Icon + label"
      const label =
        variant === "olive" ? "Active" : variant === "beige" ? "Pending" : "PAS"

      return (
        <Badge variant={variant}>
          {withIcon && (variant === "beige" ? <Clock /> : <Check />)}
          {label}
        </Badge>
      )
    },
  },
  {
    slug: "chip",
    name: "Chip",
    // Drawn from Brevy Website · the pill family every page decorates with
    axes: [
      {
        label: "Variant",
        values: ["Eyebrow", "Suggestion", "Filter"],
        phrasing: {
          Eyebrow: "an eyebrow over a section heading",
          Suggestion: "a suggested line of chat",
          Filter: "a category filter",
        },
      },
      {
        label: "Content",
        values: ["Label", "Counter + label"],
        phrasing: {
          Label: "with a text label",
          "Counter + label": "with a step counter before the label",
        },
      },
    ],
    omitted: [
      { key: "Suggestion/Counter + label", note: "not drawn" },
      { key: "Filter/Counter + label", note: "not drawn" },
    ],
    render: (combination) => {
      const variant = combination.Variant ?? "Eyebrow"
      const counted = combination.Content === "Counter + label"

      if (variant === "Suggestion") {
        return <Chip variant="suggestion">How do I get paid?</Chip>
      }

      if (variant === "Filter") {
        return <Chip variant="filter">Daily Routines</Chip>
      }

      return (
        <Chip variant="eyebrow" count={counted ? 3 : undefined}>
          Easy Steps
        </Chip>
      )
    },
  },
  {
    slug: "accordion",
    name: "Accordion",
    wide: true,
    // Drawn from Brevy Website · the FAQ list on the home pages, one card per
    // question, the first drawn open. The copy is the shipped site's own.
    axes: [
      {
        label: "Type",
        values: ["Single", "Multiple"],
        phrasing: {
          Single: "one question open at a time",
          Multiple: "several questions open at once",
        },
      },
    ],
    omitted: [],
    render: (combination) => {
      const multiple = combination.Type === "Multiple"
      const items = (
        <>
          <AccordionItem value="paid">
            <AccordionTrigger>
              Can Brevy help me get paid as a caregiver?
            </AccordionTrigger>
            <AccordionContent>
              Yes! Brevy can help you discover caregiver support programs in
              your state that provide compensation for taking care of family
              members at home.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="free">
            <AccordionTrigger>Is Brevy really free?</AccordionTrigger>
            <AccordionContent>
              Absolutely. Brevy is completely free to use. We help you find and
              enroll in benefits at no cost to you.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="eligibility">
            <AccordionTrigger>
              How does the eligibility check work?
            </AccordionTrigger>
            <AccordionContent>
              Our intelligent assistant asks you a few simple questions about
              your situation and instantly checks your eligibility across
              hundreds of benefit programs.
            </AccordionContent>
          </AccordionItem>
        </>
      )

      /** The drawn width: the desktop FAQ column is 592. Shown at that size
       *  rather than squeezed into a grid cell, the way the navbar is shown
       *  at its own width. */
      return (
        <div className="w-full" style={{ maxWidth: 592 }}>
          {multiple ? (
            <Accordion type="multiple" defaultValue={["paid", "free"]}>
              {items}
            </Accordion>
          ) : (
            <Accordion defaultValue="paid">{items}</Accordion>
          )}
        </div>
      )
    },
  },
  {
    slug: "avatar",
    name: "Avatar",
    // Drawn from Brevy Website · the avatar group at `22680:1103`, with the
    // fallback's colours taken from the app file, which localised them where
    // the website file left shadcn's own Geist and neutral-100 in place.
    //
    // The file draws the group only at 32, but the overlap is a fixed 8 rather
    // than a fraction of the circle, so the larger stack is shown here rather
    // than omitted: it is the demonstration that the two axes are square.
    axes: [
      {
        label: "Form",
        values: ["Photo", "Initials", "Group"],
        phrasing: {
          Photo: "a person's picture",
          Initials: "the fallback, for when the picture does not arrive",
          Group: "several people, overlapping",
        },
      },
      {
        label: "Size",
        values: ["32", "40"],
        phrasing: {
          "32": "at 32, which is 252 of the 363 the file draws",
          "40": "at 40, which is every testimonial author and nothing else",
        },
      },
    ],
    omitted: [],
    render: (combination) => {
      const person = PEOPLE[0]

      if (!person) {
        return null
      }

      const size = combination.Size === "40" ? "md" : "sm"

      if (combination.Form === "Group") {
        return (
          <AvatarGroup>
            {PEOPLE.map((member) => (
              <Avatar key={member.name} size={size}>
                <AvatarImage src={member.photo} alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        )
      }

      /** The fallback is shown by pointing the image at nothing, so what the
       *  preview demonstrates is Radix falling back rather than a second
       *  component pretending to. */
      const source =
        combination.Form === "Initials" ? MISSING_PHOTO : person.photo

      return (
        <Avatar size={size}>
          <AvatarImage src={source} alt={person.name} />
          <AvatarFallback>{person.initials}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    slug: "social-proof",
    name: "Social proof",
    // The row is 555 wide where it is drawn and its sentence is one line; a
    // grid cell folds it into a column, which is a different object.
    wide: true,
    // It carries a breakpoint, so the three widths are the tabs rather than
    // variants of their own: one row in three documents. A media query inside
    // this page would answer the reader's window and the mobile break would
    // never show.
    viewport: true,
    // Drawn from Brevy Website · the row at `20919:10393`, carried in the same
    // form by four of the file's five heroes. The file draws only the
    // photographs form; initials are the same fallback the Avatar already has,
    // shown here because a stack of faces is rarely complete.
    //
    // The star wears the white edge the file strokes it with, so it reads on a
    // dark page and disappears into a pale one. That is the light theme being
    // what it is, not something for the preview to work around.
    //
    // The file breaks the row at mobile: the sentence drops under the faces
    // and goes down to 14/24 (`22626:8745`).
    axes: [
      {
        label: "Faces",
        values: ["Photographs", "Initials"],
        phrasing: {
          Photographs: "with the pictures we have",
          Initials: "with initials, for people whose picture never arrived",
        },
      },
      {
        label: "Layout",
        values: ["Inline", "Stacked"],
        phrasing: {
          Inline:
            "the sentence beside the faces, dropping under them where the row runs out of room",
          Stacked:
            "the sentence under the faces at every width, for a hero that has a picture beside its copy",
        },
      },
    ],
    omitted: [],
    render: (combination) => {
      const withPhotos = combination.Faces === "Photographs"
      const stacked = combination.Layout === "Stacked"

      return (
        <SocialProofFrame
          faces={withPhotos ? undefined : "initials"}
          layout={stacked ? "stacked" : undefined}
        />
      )
    },
  },
  {
    slug: "chat",
    name: "Chat",
    wide: true,
    viewport: true,
    // Drawn from Brevy Website · frame 22912:2612, the hero's chat card. The
    // three drawn widths are the width tabs rather than variants of their
    // own: one card in three documents. The copy is the states board's.
    axes: [
      {
        label: "State",
        values: ["Empty", "Ready to send"],
        phrasing: {
          Empty: "empty, waiting for a question",
          "Ready to send": "holding a message, the send button lit",
        },
      },
    ],
    omitted: [],
    render: (combination) => (
      <ChatFrame
        state={combination.State === "Ready to send" ? "ready" : undefined}
      />
    ),
  },
  {
    slug: "form",
    name: "Form",
    // Drawn from Brevy App · the auth screens at `20786:176842`: fields 16
    // apart, an 8-gap column of label, control and helper inside each. The
    // invalid state is react-hook-form actually failing, so the ring the
    // preview shows is the Input's own aria-invalid and not a class
    // pretending to.
    axes: [
      {
        label: "State",
        values: ["Resting", "Invalid"],
        phrasing: {
          Resting: "holding nothing yet, its helper under it",
          Invalid: "refusing its value, the message under it",
        },
      },
      {
        label: "Label row",
        values: ["Label only", "With a link"],
        phrasing: {
          "Label only": "the label alone over the field",
          "With a link": "a quiet link sharing the label's row",
        },
      },
    ],
    omitted: [],
    render: (combination) => (
      <EmailField
        invalid={combination.State === "Invalid"}
        withLink={combination["Label row"] === "With a link"}
      />
    ),
  },
  {
    slug: "label",
    name: "Label",
    // Drawn from Brevy App · `Password` over the auth field (`20786:176978`):
    // Medium 14 set solid in the page's text colour — the one corner of
    // shadcn the file localised by agreeing with it.
    axes: [
      {
        label: "Arrangement",
        values: ["Alone", "Over a field"],
        phrasing: {
          Alone: "the word by itself",
          "Over a field": "naming the field under it",
        },
      },
    ],
    omitted: [],
    render: (combination) =>
      combination.Arrangement === "Alone" ? (
        <Label htmlFor="catalog-label-alone">Email</Label>
      ) : (
        <div className="grid w-full gap-2">
          <Label htmlFor="catalog-label-demo">Email</Label>
          <Input id="catalog-label-demo" placeholder="hello@brevy.com" />
        </div>
      ),
  },
]

const termsOf = (query: string) =>
  query.trim().toLowerCase().split(/\s+/).filter(Boolean)

const hits = (haystack: string, term: string) =>
  haystack.toLowerCase().includes(term)

const axisValues = (entry: ComponentEntry) =>
  entry.axes.flatMap((axis) => axis.values)

/** A term satisfied by the component name selects the component whole; the rest
 *  narrow its grid. Axis labels are deliberately not searchable. */
export function componentMatches(entry: ComponentEntry, query: string) {
  return termsOf(query).every(
    (term) =>
      hits(entry.name, term) ||
      axisValues(entry).some((value) => hits(value, term)),
  )
}

function narrowingTerms(entry: ComponentEntry, query: string) {
  return termsOf(query).filter((term) => !hits(entry.name, term))
}

export function combinationMatches(
  entry: ComponentEntry,
  combination: Record<string, string>,
  query: string,
) {
  const pending = narrowingTerms(entry, query)
  if (pending.length === 0) {
    return true
  }

  const values = entry.axes.map((axis) => combination[axis.label] ?? "")

  return pending.every((term) => values.some((value) => hits(value, term)))
}

export function isOmitted(
  entry: ComponentEntry,
  combination: Record<string, string>,
) {
  return entry.omitted.some((o) => o.key === combinationKey(entry, combination))
}

export function matchingCombinations(entry: ComponentEntry, query: string) {
  return combinations(entry.axes)
    .filter((row) => !isOmitted(entry, row))
    .filter((row) => combinationMatches(entry, row, query))
}

/** Ranks the other components for a query the current one cannot satisfy:
 *  a name hit outranks a value hit, a tighter name hit outranks a looser one,
 *  and among value-only hits the component with more matching variants wins. */
function nameRank(entry: ComponentEntry, query: string) {
  const name = entry.name.toLowerCase()
  const terms = termsOf(query)

  if (terms.some((term) => term === name)) return 0
  if (terms.some((term) => name.startsWith(term))) return 1
  if (terms.some((term) => name.includes(term))) return 2

  return 3
}

export function bestMatch(query: string, excludeSlug: string) {
  if (termsOf(query).length === 0) {
    return undefined
  }

  return components
    .filter(
      (entry) => entry.slug !== excludeSlug && componentMatches(entry, query),
    )
    .sort((a, b) => {
      const byName = nameRank(a, query) - nameRank(b, query)
      if (byName !== 0) return byName

      const byCount =
        matchingCombinations(b, query).length -
        matchingCombinations(a, query).length
      if (byCount !== 0) return byCount

      return components.indexOf(a) - components.indexOf(b)
    })[0]
}

export function filterComponents(query: string) {
  return components.filter((entry) => componentMatches(entry, query))
}

export function getComponent(slug: string) {
  return components.find((entry) => entry.slug === slug)
}

export function combinations(axes: readonly Axis[]) {
  return axes.reduce<Record<string, string>[]>(
    (acc, axis) =>
      acc.flatMap((row) =>
        axis.values.map((value) => ({ ...row, [axis.label]: value })),
      ),
    [{}],
  )
}

export function combinationKey(
  entry: ComponentEntry,
  combination: Record<string, string>,
) {
  return entry.axes.map((axis) => combination[axis.label] ?? "").join("/")
}

export function variantCount(entry: ComponentEntry) {
  return combinations(entry.axes).length - entry.omitted.length
}

/** The catalog's own name for the component, which anchors a copied prompt to
 *  this system rather than to buttons in general. */
export function subjectOf(entry: ComponentEntry) {
  return `Brevy ${entry.name}`
}

/** Only the first axis is a choice someone makes while assembling a page. The
 *  State axis describes how a component looks, not which one to reach for, so
 *  it is never offered for copying. */
export function copyChoices(entry: ComponentEntry) {
  const [first] = entry.axes
  const phrasing = first?.phrasing

  if (!phrasing) {
    return []
  }

  return first.values.flatMap((value) => {
    const phrase = phrasing[value]
    return phrase ? [{ value, phrase }] : []
  })
}

/** One source for the card and the page header. They used to disagree, the
 *  card saying "No variants" where the header said "1 variant". */
export function variantLabel(entry: ComponentEntry, query: string) {
  const total = variantCount(entry)
  const matching = matchingCombinations(entry, query).length
  const count =
    matching === total
      ? String(total)
      : `${String(matching)} of ${String(total)}`

  return `${count} ${total === 1 ? "variant" : "variants"}`
}
