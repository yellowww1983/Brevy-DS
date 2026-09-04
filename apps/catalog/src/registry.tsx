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
  IconList,
  LineMarker,
  IconListItem,
  Input,
  Instagram,
  Label,
  LinkedIn,
  TikTok,
  type BadgeProps,
  type ButtonProps,
} from "@brevy/ui"
import {
  ArrowRight,
  ArrowUp,
  Check,
  Clock,
  Download,
  MessageCircleHeart,
  Plus,
  X,
} from "lucide-react"
import type { ReactNode } from "react"

import { MISSING_PHOTO, PEOPLE } from "./avatar"
import {
  DETAILS,
  PROGRAMS,
  PROGRAMS_HEADING,
  QUALIFY,
  WITHOUT,
} from "./icon-list"
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

/** What kind of thing an entry is. It decides which page shows it and what
 *  extra an entry carries: a component brings its previews, a block brings a
 *  specimen to frame, a foundation and a screen bring neither. */
export type Kind = "component" | "block" | "foundation" | "screen"

/** One documented thing.
 *
 *  Everything the catalog explains is in one list: twelve components, thirteen
 *  blocks, seven foundations and a screen. They used to be three inventories —
 *  the components here, the blocks in a hand-written array inside the sidebar,
 *  and the docs in a third map beside the component page — which is three
 *  places to forget when something new lands.
 *
 *  Every entry has a doc. That is the rule that decides what belongs here: the
 *  registry is what the system can say about itself, so the two written pages
 *  that document nothing but the catalog itself stay in the sidebar's own
 *  navigation rather than joining this.
 *
 *  The doc is fetched rather than held. A doc is markdown and the pages that
 *  read it are server components, but the sidebar and the preview grid are not
 *  — and anything a client component imports is sent to the browser. Written
 *  as an import the bundler splits them out, so the 79KB of documentation this
 *  list points at stays where it is read.
 *
 *  The icon is a name rather than a component for the same reason in reverse:
 *  lucide is the sidebar's business, and the sidebar is the one place that
 *  turns a name into a drawing. */
export type Entry = {
  slug: string
  name: string
  kind: Kind
  href: string
  /** A lucide export name. The sidebar owns the map from here to the icon,
   *  and asks for one only where it draws a nav row: components are listed by
   *  name under a heading of their own and wear none. */
  icon?: string
  /** One line, for a list of entries rather than for the page itself. The
   *  doc's own opening paragraph introduces the thing at length; this says
   *  which one it is among thirty-three. */
  summary: string
  doc: () => Promise<string>
  /** The family an entry belongs to, where one subject is drawn in more than
   *  one shape: the hero's two arrangements, the two libraries of motion. The
   *  sidebar puts them under one heading and each keeps its own page and its
   *  own doc. */
  family?: string
}

export type ComponentEntry = Entry & {
  kind: "component"
  axes: readonly Axis[]
  omitted: readonly Omission[]
  /** One preview per row instead of the grid, for a component whose drawn
   *  width is wider than a grid cell. */
  wide?: true
  /** Previews sit centred in their box, which is right for a sample that is
   *  one object. A component whose samples are different widths reads as
   *  ragged that way — each one starts somewhere else — so it lines them up
   *  on the left instead. */
  align?: "start"
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

const COMPONENTS: readonly ComponentEntry[] = [
  {
    slug: "button",
    name: "Button",
    kind: "component",
    href: "/components/button",
    summary: "The action a section is asking for, in six weights.",
    doc: () => import("./button").then((module) => module.buttonDoc()),
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
    kind: "component",
    href: "/components/input",
    summary:
      "The text field, at two heights, with room for an icon at either end.",
    doc: () => import("./input").then((module) => module.inputDoc()),
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
    kind: "component",
    href: "/components/badge",
    summary: "A small label for a fact: a status, a category, a settled state.",
    doc: () => import("./badge").then((module) => module.badgeDoc()),
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
    kind: "component",
    href: "/components/chip",
    summary: "The round pill: an eyebrow, a suggestion, a filter.",
    doc: () => import("./chip").then((module) => module.chipDoc()),
    // Drawn from Brevy Website · the pill family every page decorates with
    axes: [
      {
        label: "Variant",
        values: ["Eyebrow", "Suggestion", "Filter", "Prompt"],
        phrasing: {
          Eyebrow: "an eyebrow over a section heading",
          Suggestion: "a suggested line of chat",
          Filter: "a category filter",
          Prompt: "a question the reader can send",
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
      { key: "Prompt/Counter + label", note: "not drawn" },
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

      if (variant === "Prompt") {
        return (
          <Chip variant="prompt">
            Can I get help with transportation to appointments?
          </Chip>
        )
      }

      return (
        <Chip variant="eyebrow" count={counted ? 3 : undefined}>
          Easy Steps
        </Chip>
      )
    },
  },
  {
    slug: "line-marker",
    name: "Line marker",
    kind: "component",
    href: "/components/line-marker",
    summary: "The yellow highlighter under a phrase of a heading.",
    doc: () => import("./line-marker").then((module) => module.lineMarkerDoc()),
    wide: true,
    align: "start",
    // Drawn from Brevy Website · 24 strokes across five pages, every one the
    // same 1016-command drawing at a different width. One path stretched to
    // whatever it sits under, rather than a vector per occurrence — which is
    // what lets the width come from the word.
    axes: [
      {
        label: "Marks",
        values: ["A phrase", "One word", "A whole line"],
        phrasing: {
          "A phrase": "under two words of a heading",
          "One word": "under a single word",
          "A whole line": "under the whole heading",
        },
      },
    ],
    omitted: [],
    render: (combination) => {
      const marks = combination.Marks ?? "A phrase"

      if (marks === "One word") {
        return (
          <p className="font-serif text-h2 text-zinc-800 dark:text-foreground">
            Your <LineMarker>superhuman</LineMarker> social worker
          </p>
        )
      }

      if (marks === "A whole line") {
        return (
          <p className="font-serif text-h2 text-zinc-800 dark:text-foreground">
            <LineMarker>Your superhuman social worker</LineMarker>
          </p>
        )
      }

      return (
        <p className="font-serif text-h2 text-zinc-800 dark:text-foreground">
          Your superhuman <LineMarker>social worker</LineMarker>
        </p>
      )
    },
  },
  {
    slug: "icon-list",
    name: "Icon list",
    kind: "component",
    href: "/components/icon-list",
    summary: "Short lines, each with a mark beside it.",
    doc: () => import("./icon-list").then((module) => module.iconListDoc()),
    wide: true,
    // Every list here is a different width — 288 for the bare markers, 472
    // for the discs — so centred they each begin somewhere else and the page
    // reads as drift rather than as a set.
    align: "start",
    // Drawn from Brevy Website · 71 rows across 24 lists, in four kinds: the
    // bare check the For Organizations page rolls its programs with
    // (`23321:2569`), the bare arrow beside it, the small olive disc on the
    // partner page (`25276:3983`) and the large red one on the Mobile App
    // page (`24966:1156`).
    //
    // The olive disc at the large size is not drawn — the file only paints
    // the large one in red — and is shown here because tone and size are
    // square to one another. DESIGN-FEEDBACK 74.
    axes: [
      {
        label: "Marker",
        values: ["Check", "Arrow", "Disc olive", "Disc red"],
        phrasing: {
          Check: "a bare check in the text's colour",
          Arrow: "a bare arrow in the text's colour",
          "Disc olive": "a check in the soft olive disc",
          "Disc red": "a cross in the soft red disc",
        },
      },
      {
        label: "Size",
        values: ["Small", "Large"],
        phrasing: {
          Small: "the 24 disc, its lines at 14",
          Large: "the 36 disc, its lines at 16",
        },
      },
      {
        label: "Rows",
        values: ["Plain", "Divided"],
        phrasing: {
          Plain: "spaced apart",
          Divided: "separated by a rule",
        },
      },
    ],
    // A bare glyph is drawn at one size only: the second size belongs to the
    // disc, which is the only marker that grows.
    omitted: [
      { key: "Check/Large/Plain", note: "not drawn" },
      { key: "Check/Large/Divided", note: "not drawn" },
      { key: "Arrow/Large/Plain", note: "not drawn" },
      { key: "Arrow/Large/Divided", note: "not drawn" },
    ],
    render: (combination) => {
      const marker = combination.Marker ?? "Check"
      const large = combination.Size === "Large"
      const divided = combination.Rows === "Divided"

      if (marker === "Check" || marker === "Arrow") {
        const check = marker === "Check"

        return (
          <IconList
            marker={check ? "check" : "arrow"}
            divided={divided}
            heading={check ? PROGRAMS_HEADING : undefined}
            className="w-full max-w-72"
          >
            {(check ? PROGRAMS : DETAILS).map((line) => (
              <IconListItem
                key={line}
                icon={check ? <Check /> : <ArrowRight />}
              >
                {line}
              </IconListItem>
            ))}
          </IconList>
        )
      }

      const olive = marker === "Disc olive"

      return (
        <IconList
          marker="disc"
          tone={olive ? "olive" : "red"}
          size={large ? "lg" : "sm"}
          divided={divided}
          className="w-full max-w-118"
        >
          {(olive ? QUALIFY : WITHOUT).map((line) => (
            <IconListItem key={line} icon={olive ? <Check /> : <X />}>
              {line}
            </IconListItem>
          ))}
        </IconList>
      )
    },
  },
  {
    slug: "accordion",
    name: "Accordion",
    kind: "component",
    href: "/components/accordion",
    summary: "Questions that open one at a time, each on its own card.",
    doc: () => import("./accordion").then((module) => module.accordionDoc()),
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
    kind: "component",
    href: "/components/avatar",
    summary: "A person, round, alone or in a stack.",
    doc: () => import("./avatar").then((module) => module.avatarDoc()),
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
    kind: "component",
    href: "/components/social-proof",
    summary: "Faces, five stars and a line of reassurance.",
    doc: () =>
      import("./social-proof").then((module) => module.socialProofDoc()),
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
    kind: "component",
    href: "/components/chat",
    summary: "The hero's chat card: a box to ask in and a round send.",
    doc: () => import("./chat").then((module) => module.chatDoc()),
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
    kind: "component",
    href: "/components/form",
    summary: "The wiring that holds a label, a field and its error together.",
    doc: () => import("./form").then((module) => module.formDoc()),
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
    kind: "component",
    href: "/components/label",
    summary: "The word over a field, tied to it.",
    doc: () => import("./label").then((module) => module.labelDoc()),
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
/** The blocks: whole sections a page is assembled from. Their routes are
 *  written by hand, one folder each, and stay that way — this list is where
 *  the catalog looks them up, not where it learns to serve them. */
const BLOCKS: readonly Entry[] = [
  {
    slug: "navbar",
    name: "Navbar",
    kind: "block",
    href: "/blocks/navbar",
    icon: "PanelTop",
    summary:
      "The bar at the top: a pill of links that shrinks as the page scrolls.",
    doc: () => import("./navbar").then((module) => module.navbarDoc()),
  },
  {
    slug: "hero-centered",
    name: "Centered",
    kind: "block",
    href: "/blocks/hero/centered",
    icon: "Megaphone",
    family: "Hero",
    summary: "The home page's opening: a heading over a chat box, on a wash.",
    doc: () =>
      import("./hero-centered").then((module) => module.heroCenteredDoc()),
  },
  {
    slug: "hero-split",
    name: "Split",
    kind: "block",
    href: "/blocks/hero/split",
    icon: "Megaphone",
    family: "Hero",
    summary: "A heading and a button beside a shaped photograph.",
    doc: () => import("./hero-split").then((module) => module.heroSplitDoc()),
  },
  {
    slug: "banner",
    name: "Banner",
    kind: "block",
    href: "/blocks/banner",
    icon: "Megaphone",
    summary:
      "A strip a page opens with, that pushes the page down by its height.",
    doc: () => import("./banner").then((module) => module.bannerDoc()),
  },
  {
    slug: "card-grid",
    name: "Card grid",
    kind: "block",
    href: "/blocks/card-grid",
    icon: "Grid2x2",
    summary: "Three cards across, each an illustration over a line of copy.",
    doc: () => import("./card-grid").then((module) => module.cardGridDoc()),
  },
  {
    slug: "logo-cloud",
    name: "Logo cloud",
    kind: "block",
    href: "/blocks/logo-cloud",
    icon: "Loader",
    summary: "A band of partner marks, moving, fading out at both ends.",
    doc: () => import("./logo-cloud").then((module) => module.logoCloudDoc()),
  },
  {
    slug: "media-copy",
    name: "Media and copy",
    kind: "block",
    href: "/blocks/media-copy",
    icon: "Images",
    summary: "A shaped picture beside a ladder of steps.",
    doc: () => import("./media-copy").then((module) => module.mediaCopyDoc()),
  },
  {
    slug: "segment-rows",
    name: "Segment rows",
    kind: "block",
    href: "/blocks/segment-rows",
    icon: "Rows3",
    summary: "Full-width cards, one per segment, each in its own colour.",
    doc: () =>
      import("./segment-rows").then((module) => module.segmentRowsDoc()),
  },
  {
    slug: "faq",
    name: "FAQ",
    kind: "block",
    href: "/blocks/faq",
    icon: "CircleHelp",
    summary: "Questions on the right, a green contact card on the left.",
    doc: () => import("./faq").then((module) => module.faqDoc()),
  },
  {
    slug: "steps",
    name: "Steps",
    kind: "block",
    href: "/blocks/steps",
    icon: "ListOrdered",
    summary: "A numbered path through what happens, in cards or in a row.",
    doc: () => import("./steps").then((module) => module.stepsDoc()),
  },
  {
    slug: "tiles",
    name: "Tiles",
    kind: "block",
    href: "/blocks/tiles",
    icon: "LayoutGrid",
    summary: "A wall of five tiles that are five different things.",
    doc: () => import("./tiles").then((module) => module.tilesDoc()),
  },
  {
    slug: "testimonials",
    name: "Testimonials",
    kind: "block",
    href: "/blocks/testimonials",
    icon: "Quote",
    summary: "A mosaic of quotes, figures and faces over a photograph.",
    doc: () =>
      import("./testimonials").then((module) => module.testimonialsDoc()),
  },
  {
    slug: "cta",
    name: "CTA Band",
    kind: "block",
    href: "/blocks/cta",
    icon: "Signpost",
    summary: "The last ask before the footer, on a deep green band.",
    doc: () => import("./cta-band").then((module) => module.ctaBandDoc()),
  },
  {
    slug: "footer",
    name: "Footer",
    kind: "block",
    href: "/blocks/footer",
    icon: "PanelBottom",
    summary: "The foot of every page: links, a newsletter and the brand marks.",
    doc: () => import("./footer").then((module) => module.footerDoc()),
  },
]

/** The foundations: the tokens everything else is built out of. */
const FOUNDATIONS: readonly Entry[] = [
  {
    slug: "colors",
    name: "Colors",
    kind: "foundation",
    href: "/getting-started/colors",
    icon: "Palette",
    summary: "The brand ramps, the semantic tokens, and what is borrowed.",
    doc: () => import("./colors").then((module) => module.colorsDoc()),
  },
  {
    slug: "typography",
    name: "Typography",
    kind: "foundation",
    href: "/getting-started/typography",
    icon: "Type",
    summary: "The type scale, which roles are fluid and which hold.",
    doc: () => import("./typography").then((module) => module.typographyDoc()),
  },
  {
    slug: "spacing",
    name: "Spacing",
    kind: "foundation",
    href: "/getting-started/spacing",
    icon: "Move",
    summary: "The spacing steps and what each one is named for.",
    doc: () => import("./spacing").then((module) => module.spacingDoc()),
  },
  {
    slug: "radius",
    name: "Radius",
    kind: "foundation",
    href: "/getting-started/radius",
    icon: "Squircle",
    summary: "The corner scale, and the leaf the brand cuts.",
    doc: () => import("./radius").then((module) => module.radiusDoc()),
  },
  {
    slug: "shadows",
    name: "Shadows",
    kind: "foundation",
    href: "/getting-started/shadows",
    icon: "Layers",
    summary: "The shadow scale, from a hairline lift to a floating card.",
    doc: () => import("./shadows").then((module) => module.shadowsDoc()),
  },
  {
    slug: "icons",
    name: "Icons",
    kind: "foundation",
    href: "/getting-started/icons",
    icon: "Shapes",
    summary: "Where icons come from, what size they take, how they are drawn.",
    doc: () => import("./icons").then((module) => module.iconsDoc()),
  },
  {
    slug: "layout",
    name: "Layout",
    kind: "foundation",
    href: "/getting-started/layout",
    icon: "Columns3",
    summary: "The container, the gutter and the grid at three widths.",
    doc: () => import("./layout").then((module) => module.layoutDoc()),
  },
  {
    slug: "how-to-use",
    name: "How to use",
    kind: "foundation",
    href: "/getting-started/how-to-use",
    icon: "Wrench",
    summary:
      "The two ways in: describing a page to Claude, or importing the blocks.",
    doc: () => import("./how-to-use").then((module) => module.howToUseDoc()),
  },
  {
    slug: "logo",
    name: "Logo",
    kind: "foundation",
    href: "/getting-started/logo",
    icon: "Fingerprint",
    summary: "The lockup, the mark, and the rules its own geometry gives.",
    doc: () => import("./logo").then((module) => module.logoDoc()),
  },
  {
    slug: "animations-lottie",
    name: "Lottie",
    kind: "foundation",
    href: "/getting-started/animations/lottie",
    icon: "Clapperboard",
    family: "Animations",
    summary: "Sixteen animated mockups of the product, and how to write more.",
    doc: () =>
      import("./animations-lottie").then((module) =>
        module.animationsLottieDoc(),
      ),
  },
  {
    slug: "animations-video",
    name: "Video",
    kind: "foundation",
    href: "/getting-started/animations/video",
    icon: "Clapperboard",
    family: "Animations",
    summary: "Four watercolour scenes that stand behind a page.",
    doc: () =>
      import("./animations-video").then((module) =>
        module.animationsVideoDoc(),
      ),
  },
]

/** The screens: what a signed-in product shows, built from these parts.
 *  Their own kind so that someone assembling a landing page does not reach
 *  for one by mistake. */
const SCREENS: readonly Entry[] = [
  {
    slug: "login",
    name: "Login",
    kind: "screen",
    href: "/screens/login",
    icon: "LogIn",
    summary: "The signed-in product's way in: a form beside a photograph.",
    doc: () => import("./auth").then((module) => module.authDoc()),
  },
]

/** Everything the system can say about itself, in the order the catalog
 *  reads it. */
export const registry: readonly Entry[] = [
  ...FOUNDATIONS,
  ...COMPONENTS,
  ...BLOCKS,
  ...SCREENS,
]

export const components = COMPONENTS

export function entriesOf(kind: Kind) {
  return registry.filter((entry) => entry.kind === kind)
}

/** The doc for whatever lives at a slug, for a page that wants to hand
 *  itself over. */
export async function docFor(slug: string) {
  const entry = registry.find((item) => item.slug === slug)

  return entry ? await entry.doc() : undefined
}

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
